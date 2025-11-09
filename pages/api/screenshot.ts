import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';
import { authOptions } from '@/lib/auth';
import { generateScreenshot } from '@/lib/screenshot';
import { createScreenshot, decrementUserCredits, getUserById } from '@/lib/mongodb';
import { createApiResponse, getClientIP, AppError } from '@/lib/utils';
import { authenticateApiKey, checkApiRateLimit, logApiUsage, AuthenticatedRequest } from '@/lib/api-auth';
import { validateScreenshotRequest, validateApiKey, sanitizeInput, createRequestFingerprint } from '@/lib/validation';
import { logger, logSecurityEvent, logPerformanceMetric, trackError } from '@/lib/logging';
import type { ScreenshotRequest, User } from '@/types';

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Request size validation
const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB
const MAX_BODY_SIZE = 100 * 1024; // 100KB for JSON body

import { securityMiddleware, corsMiddleware } from '@/lib/security';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  // Apply security and CORS middleware
  await corsMiddleware(req, res);
  const securityResult = await securityMiddleware(req, res);
  if (!securityResult) return; // Stop if security check fails
  const startTime = Date.now();
  
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  // Check request size
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > MAX_REQUEST_SIZE) {
    return res.status(413).json(
      createApiResponse(false, null, 'Request payload too large')
    );
  }

  const clientIp = getClientIP(req);
  let user: User | null = null;
  let isApiRequest = false;

  try {
    // Parse and validate request with enhanced security
    const requestData = validateScreenshotRequest(req.body);

    // Get session for both API and web requests
    const session = await getServerSession(req, res, authOptions);
    
    // Check for API key authentication first
    if (req.headers.authorization) {
      isApiRequest = true;
      user = await authenticateApiKey(req, res);
      if (!user) return; // Error already sent by authenticateApiKey
    } else {
      // Check for session authentication
      if (session?.user?.id) {
        user = await getUserById(session.user.id);
      }
    }

    // Rate limiting
    let rateLimit = 3; // Anonymous users: 3 per hour
    let rateLimitKey = `screenshot:${clientIp}`;

    if (user) {
      // Check if user has credits
      if (user.credits <= 0) {
        return res.status(402).json(
          createApiResponse(false, null, 'Insufficient credits. Please upgrade your plan.')
        );
      }

      // Use user-based rate limiting for authenticated requests
      rateLimitKey = `screenshot:user:${user.id}`;
      
      if (isApiRequest) {
        // API rate limiting
        const rateLimitResult = checkApiRateLimit(user.id, user.plan, '/api/screenshot');
        
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', rateLimitResult.limit);
        res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
        res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000));
        
        if (!rateLimitResult.allowed) {
          return res.status(429).json(
            createApiResponse(false, null, 'API rate limit exceeded. Please try again later.')
          );
        }
      } else {
        // Web interface rate limiting
        switch (user.plan) {
          case 'pro':
            rateLimit = 100;
            break;
          case 'team':
            rateLimit = 500;
            break;
          default:
            rateLimit = 20; // Free plan
        }
      }
    }

    // Apply rate limiting for non-API requests
    if (!isApiRequest && !checkRateLimit(rateLimitKey, rateLimit, 60 * 60 * 1000)) {
      return res.status(429).json(
        createApiResponse(false, null, 'Rate limit exceeded. Please try again later.')
      );
    }

    // Generate screenshot
    const result = await generateScreenshot(requestData);

    // Convert buffer to base64 data URL for immediate display
    const base64Image = result.buffer.toString('base64');
    const mimeType = requestData.format === 'png' ? 'image/png' : 
                     requestData.format === 'jpeg' ? 'image/jpeg' : 'image/webp';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Also save screenshot to file system for download
    const timestamp = Date.now();
    const filename = `screenshot_${timestamp}_${Math.random().toString(36).substring(2)}.${requestData.format}`;
    // Use /tmp on Vercel (writable), public/screenshots locally
    const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const screenshotsDir = isVercel ? '/tmp/screenshots' : path.join(process.cwd(), 'public', 'screenshots');

    // Do file/database operations asynchronously (don't wait)
    // This allows us to return the response immediately
    Promise.all([
      // Save to file system
      (async () => {
        try {
          await fs.access(screenshotsDir);
        } catch {
          await fs.mkdir(screenshotsDir, { recursive: true });
        }
        const filepath = path.join(screenshotsDir, filename);
        await fs.writeFile(filepath, result.buffer);
      })(),
      
      // Save to database
      (async () => {
        const screenshotData = {
          url: `/screenshots/${filename}`,
          filename,
          original_url: requestData.url,
          metadata: result.metadata,
          settings: {
            format: requestData.format,
            quality: requestData.quality,
            fullPage: requestData.fullPage,
            device: requestData.device,
          },
          status: 'completed' as const,
          ip_address: clientIp,
          user_agent: req.headers['user-agent'],
          user_id: session?.user?.id,
          expires_at: new Date(Date.now() + (session?.user?.id ? 30 : 7) * 24 * 60 * 60 * 1000),
        };
        await createScreenshot(screenshotData);
      })(),
      
      // Deduct credits
      session?.user?.id ? decrementUserCredits(session.user.id) : Promise.resolve(),
      
      // Log API usage
      isApiRequest && user ? logApiUsage(
        user.id,
        '/api/screenshot',
        'POST',
        200,
        Date.now() - startTime,
        clientIp,
        req.headers['user-agent']
      ) : Promise.resolve(),
    ]).catch(err => {
      // Log errors but don't block response
      console.error('Background operation error:', err);
    });

    // Return success response with base64 data URL
    const responseData = {
      id: filename, // Use filename as ID since we're not waiting for DB
      imageUrl: dataUrl, // Use base64 data URL for immediate display
      downloadUrl: `/api/serve-screenshot?filename=${filename}`, // Separate download URL
      metadata: result.metadata,
    };
    
    console.log('Sending screenshot response with data URL (length:', dataUrl.length, ')');
    
    res.status(200).json(
      createApiResponse(true, responseData, undefined, 'Screenshot generated successfully')
    );

  } catch (error) {
    // Log errors asynchronously
    console.error('Screenshot API error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json(
        createApiResponse(false, null, error.message)
      );
    }

    // Handle validation errors from our custom validation
    if (error && typeof error === 'object' && 'message' in error) {
      return res.status(400).json(
        createApiResponse(false, null, String(error.message))
      );
    }

    res.status(500).json(
      createApiResponse(false, null, 'Internal server error')
    );
  }
}

// Increase timeout for Vercel
export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 30,
};