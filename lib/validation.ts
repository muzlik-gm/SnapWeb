import { z } from 'zod';
import { AppError } from '@/lib/utils';

// URL validation with security checks
export const urlSchema = z.string()
  .min(1, 'URL is required')
  .max(2048, 'URL too long')
  .transform(url => url.trim())
  .pipe(z.string().url('Invalid URL format'))
  .refine(
    url => {
      try {
        const parsed = new URL(url);
        
        // Block localhost and private IPs
        const hostname = parsed.hostname.toLowerCase();
        if (['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname)) {
          return false;
        }
        
        // Block private IP ranges
        const ipPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.|fc00:|fe80:)/;
        if (ipPattern.test(hostname)) {
          return false;
        }
        
        // Block dangerous protocols
        const allowedProtocols = ['http:', 'https:'];
        if (!allowedProtocols.includes(parsed.protocol)) {
          return false;
        }
        
        return true;
      } catch {
        return false;
      }
    },
    'URL not allowed - localhost, private IPs, and non-HTTP protocols are blocked'
  );

// Device validation
export const deviceSchema = z.enum(['desktop', 'tablet', 'mobile']);

// Format validation
export const formatSchema = z.enum(['png', 'jpeg', 'webp']);

// Quality validation
export const qualitySchema = z.number()
  .int('Quality must be an integer')
  .min(1, 'Quality must be at least 1')
  .max(100, 'Quality cannot exceed 100')
  .optional();

// Full page validation
export const fullPageSchema = z.boolean().optional().default(false);

// Timeout validation (in milliseconds)
export const timeoutSchema = z.number()
  .int('Timeout must be an integer')
  .min(5000, 'Timeout must be at least 5 seconds')
  .max(30000, 'Timeout cannot exceed 30 seconds')
  .optional()
  .default(30000);

// Viewport validation
export const viewportSchema = z.object({
  width: z.number().int().min(320).max(7680), // 4K width max
  height: z.number().int().min(240).max(4320), // 8K height max
  deviceScaleFactor: z.number().min(1).max(3).optional().default(1),
  isMobile: z.boolean().optional().default(false),
  hasTouch: z.boolean().optional().default(false),
  isLandscape: z.boolean().optional().default(false),
}).optional();

// User agent validation
export const userAgentSchema = z.string()
  .max(1000, 'User agent too long')
  .optional();

// Delay validation (in milliseconds)
export const delaySchema = z.number()
  .int('Delay must be an integer')
  .min(0, 'Delay cannot be negative')
  .max(15000, 'Delay cannot exceed 15 seconds')
  .optional()
  .default(2000);

// Screenshot request validation with security enhancements
export const enhancedScreenshotSchema = z.object({
  url: urlSchema,
  device: deviceSchema.optional().default('desktop'),
  format: formatSchema.optional().default('png'),
  fullPage: fullPageSchema,
  quality: qualitySchema,
  delay: delaySchema, // Page load delay
  timeout: timeoutSchema,
  viewport: viewportSchema,
  userAgent: userAgentSchema,
  waitForSelector: z.string().max(500).optional(), // CSS selector to wait for
  waitForTimeout: z.number().int().min(0).max(10000).optional(), // Max 10 seconds additional wait
  blockAds: z.boolean().optional().default(true), // Block ads by default
  blockTrackers: z.boolean().optional().default(true), // Block trackers by default
  allowCookies: z.boolean().optional().default(false), // Block cookies by default for privacy
  headers: z.record(z.string(), z.string().max(1000)).optional(), // Custom headers
});

// API key validation
export const apiKeySchema = z.string()
  .min(1, 'API key is required')
  .max(100, 'API key too long')
  .refine(key => key.startsWith('sk_'), 'API key must start with sk_');

// Rate limit validation
export const rateLimitSchema = z.object({
  endpoint: z.string().max(100),
  userId: z.string().uuid('Invalid user ID'),
  plan: z.enum(['free', 'pro', 'team']),
  limit: z.number().int().min(1).max(10000),
  windowMs: z.number().int().min(60000).max(3600000), // 1 min to 1 hour
});

// IP validation
export const ipSchema = z.string()
  .max(45, 'IP address too long')
  .refine(
    ip => {
      // Validate IPv4 or IPv6 format
      const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
      return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
    },
    'Invalid IP address format'
  );

// Request size validation
export const requestSizeSchema = z.object({
  contentLength: z.number().int().max(10 * 1024 * 1024), // Max 10MB
  bodySize: z.number().int().max(1024 * 1024), // Max 1MB for JSON body
});

// Security headers validation
export const securityHeadersSchema = z.object({
  'user-agent': z.string().max(1000).optional(),
  'x-forwarded-for': z.string().max(100).optional(),
  'x-real-ip': z.string().max(100).optional(),
  'cf-connecting-ip': z.string().max(100).optional(),
  'x-api-key': apiKeySchema.optional(),
});

// Validation helper functions
export function validateUrl(url: string): string {
  try {
    return urlSchema.parse(url);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.issues[0].message, 400, 'VALIDATION_ERROR');
    }
    throw error;
  }
}

export function validateScreenshotRequest(data: unknown) {
  try {
    return enhancedScreenshotSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        error.issues.map(e => e.message).join(', '),
        400,
        'VALIDATION_ERROR'
      );
    }
    throw error;
  }
}

export function validateApiKey(apiKey: string): string {
  try {
    return apiKeySchema.parse(apiKey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.issues[0].message, 401, 'INVALID_API_KEY');
    }
    throw error;
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[{}]/g, '') // Remove curly braces
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
}

export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(headers)) {
    const sanitizedKey = sanitizeInput(key.toLowerCase());
    const sanitizedValue = sanitizeInput(value);
    
    // Only include safe headers
    const allowedHeaders = [
      'user-agent',
      'accept',
      'accept-language',
      'accept-encoding',
      'cache-control',
      'connection',
      'upgrade-insecure-requests',
      'sec-fetch-site',
      'sec-fetch-mode',
      'sec-fetch-user',
      'sec-fetch-dest',
    ];
    
    if (allowedHeaders.includes(sanitizedKey)) {
      sanitized[sanitizedKey] = sanitizedValue;
    }
  }
  
  return sanitized;
}

// Rate limiting helper
export function createRateLimitKey(userId: string, endpoint: string): string {
  return `rate_limit:${endpoint}:${userId}`;
}

// Request fingerprinting for additional security
export function createRequestFingerprint(
  ip: string,
  userAgent: string,
  timestamp: number
): string {
  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}:${Math.floor(timestamp / 60000)}`) // 1-minute window
    .digest('hex');
}