import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByApiKey } from './mongodb';
import { createApiResponse } from './utils';
import { validateApiKey, sanitizeInput, createRequestFingerprint } from './validation';
import { logger, logSecurityEvent } from './logging';
import type { User } from '@/types';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: User;
}



export async function authenticateApiKey(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<User | null> {
  const authHeader = req.headers.authorization;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  if (!authHeader) {
    await logSecurityEvent('missing_auth_header', 'medium', {
      ip: clientIp,
      userAgent,
      endpoint: req.url,
      method: req.method,
    });
    
    res.status(401).json(
      createApiResponse(false, null, 'Authorization header required')
    );
    return null;
  }

  const token = sanitizeInput(authHeader.replace('Bearer ', ''));
  
  try {
    // Validate API key format
    validateApiKey(token);
  } catch (error) {
    await logSecurityEvent('invalid_api_key_format', 'medium', {
      ip: clientIp,
      userAgent,
      endpoint: req.url,
      method: req.method,
      authHeader: authHeader.substring(0, 50) + '...', // Truncate for security
    });
    
    res.status(401).json(
      createApiResponse(false, null, 'Invalid API key format')
    );
    return null;
  }

  try {
    const user = await getUserByApiKey(token);
    
    if (!user) {
      await logSecurityEvent('invalid_api_key', 'high', {
        ip: clientIp,
        userAgent,
        endpoint: req.url,
        method: req.method,
        apiKeyPrefix: token.substring(0, 10) + '...', // Log prefix for debugging
      });
      
      res.status(401).json(
        createApiResponse(false, null, 'Invalid API key')
      );
      return null;
    }

    // Check if user is active (assuming is_active field exists)
    if ('is_active' in user && !user.is_active) {
      await logSecurityEvent('suspended_account_access', 'high', {
        ip: clientIp,
        userAgent,
        endpoint: req.url,
        method: req.method,
        userId: user.id,
        userEmail: user.email,
      });
      
      res.status(403).json(
        createApiResponse(false, null, 'Account is suspended')
      );
      return null;
    }

    // Check if user has API access
    if (user.plan === 'free') {
      await logSecurityEvent('insufficient_plan_access', 'medium', {
        ip: clientIp,
        userAgent,
        endpoint: req.url,
        method: req.method,
        userId: user.id,
        userEmail: user.email,
        plan: user.plan,
      });
      
      res.status(403).json(
        createApiResponse(false, null, 'API access requires Pro or Team plan')
      );
      return null;
    }

    // Log successful authentication
    await logApiUsage(
      user.id,
      req.url || '',
      req.method || '',
      200,
      0,
      req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
      req.headers['user-agent'] as string
    );

    req.user = user;
    return user;
  } catch (error) {
    console.error('API authentication error:', error);
    res.status(500).json(
      createApiResponse(false, null, 'Authentication failed')
    );
    return null;
  }
}

// Rate limiting for API endpoints
const apiRateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkApiRateLimit(
  userId: string,
  plan: string,
  endpoint: string
): { allowed: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  
  // Set limits based on plan
  let limit = 100; // Pro plan default
  if (plan === 'team') {
    limit = 1000;
  } else if (endpoint === '/api/screenshot') {
    // Special limits for screenshot endpoint
    limit = plan === 'pro' ? 500 : 2000;
  }

  const key = `${userId}:${endpoint}`;
  const record = apiRateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    apiRateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    limit,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

// Log API usage
export async function logApiUsage(
  userId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const { getApiUsageCollection } = await import('./mongodb');
    const apiUsage = await getApiUsageCollection();
    
    await apiUsage.insertOne({
      user_id: userId,
      endpoint,
      method,
      status_code: statusCode,
      response_time: responseTime,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date(),
    });
  } catch (error) {
    console.error('Failed to log API usage:', error);
    // Don't throw error as this is not critical
  }
}