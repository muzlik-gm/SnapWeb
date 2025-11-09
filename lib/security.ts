import { NextApiRequest, NextApiResponse } from 'next';
import { logger, logSecurityEvent } from './logging';
import { sanitizeInput } from './validation';

// Security headers that should be present
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
};

// Blocked user agents (known bots, scrapers, etc.)
const BLOCKED_USER_AGENTS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
  /apache/i,
];

// Blocked IP patterns (private ranges, localhost, etc.)
const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

export interface SecurityConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxPayloadSize: number;
  enableRateLimiting: boolean;
  enableUserAgentCheck: boolean;
  enableIPBlocking: boolean;
  enableHeaderValidation: boolean;
}

const defaultConfig: SecurityConfig = {
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000,
  maxPayloadSize: 10 * 1024 * 1024, // 10MB
  enableRateLimiting: true,
  enableUserAgentCheck: true,
  enableIPBlocking: true,
  enableHeaderValidation: true,
};

// In-memory request tracking (use Redis in production)
const requestTracker = new Map<string, { count: number; resetTime: number }>();

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function isBlockedIP(ip: string): boolean {
  return BLOCKED_IP_PATTERNS.some(pattern => pattern.test(ip));
}

function isBlockedUserAgent(userAgent: string): boolean {
  return BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent));
}

function getRequestKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

function checkRateLimit(key: string, config: SecurityConfig): boolean {
  if (!config.enableRateLimiting) return true;
  
  const now = Date.now();
  const record = requestTracker.get(key);
  
  if (!record || now > record.resetTime) {
    requestTracker.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }
  
  if (record.count >= config.maxRequestsPerMinute) {
    return false;
  }
  
  record.count++;
  return true;
}

function sanitizeRequest(req: NextApiRequest): void {
  // Sanitize headers
  if (req.headers) {
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        req.headers[key] = sanitizeInput(value);
      }
    }
  }
  
  // Sanitize query parameters
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        req.query[key] = sanitizeInput(value);
      }
    }
  }
  
  // Sanitize body (if it's a string)
  if (req.body && typeof req.body === 'string') {
    req.body = sanitizeInput(req.body);
  }
}



export async function securityMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Partial<SecurityConfig> = {}
): Promise<boolean> {
  const securityConfig = { ...defaultConfig, ...config };
  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || '';
  const endpoint = req.url || 'unknown';
  
  try {
    // Set security headers
    Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
    
    // IP blocking check (skip in development)
    if (securityConfig.enableIPBlocking && process.env.NODE_ENV === 'production' && isBlockedIP(clientIP)) {
      await logSecurityEvent('blocked_ip_access', 'medium', {
        ip: clientIP,
        userAgent,
        endpoint,
        reason: 'private_or_localhost_ip',
      });
      
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return false;
    }
    
    // User agent check (skip in development)
    if (securityConfig.enableUserAgentCheck && process.env.NODE_ENV === 'production' && isBlockedUserAgent(userAgent)) {
      await logSecurityEvent('blocked_user_agent', 'medium', {
        ip: clientIP,
        userAgent,
        endpoint,
        reason: 'automated_user_agent',
      });
      
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return false;
    }
    
    // Rate limiting
    const requestKey = getRequestKey(clientIP, endpoint);
    if (!checkRateLimit(requestKey, securityConfig)) {
      await logSecurityEvent('rate_limit_exceeded', 'medium', {
        ip: clientIP,
        userAgent,
        endpoint,
        limit: securityConfig.maxRequestsPerMinute,
      });
      
      res.status(429).json({
        success: false,
        message: 'Too many requests',
        retryAfter: 60,
      });
      return false;
    }
    
    // Payload size check
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > securityConfig.maxPayloadSize) {
      await logSecurityEvent('payload_too_large', 'medium', {
        ip: clientIP,
        userAgent,
        endpoint,
        size: contentLength,
        maxSize: securityConfig.maxPayloadSize,
      });
      
      res.status(413).json({
        success: false,
        message: 'Payload too large',
      });
      return false;
    }
    
    // Sanitize request inputs
    sanitizeRequest(req);
    
    return true;
    } catch (error) {
    logger.error('Error in security middleware', error as Error, {
      ip: clientIP,
      userAgent,
      endpoint,
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
    return false;
    }
    }
    
    export function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
}
    
    // Request validation middleware
    export function validateRequestMiddleware(
      requiredFields: string[] = [],
      allowedFields: string[] = []
    ): (req: NextApiRequest, res: NextApiResponse) => boolean {
      return (req: NextApiRequest, res: NextApiResponse): boolean => {
        // Check required fields
        for (const field of requiredFields) {
          if (!req.body[field]) {
            res.status(400).json({
              success: false,
              message: `Missing required field: ${field}`,
            });
            return false;
          }
        }
        
        // Check allowed fields
        if (allowedFields.length > 0) {
          const bodyFields = Object.keys(req.body);
          const invalidFields = bodyFields.filter(field => !allowedFields.includes(field));
          
          if (invalidFields.length > 0) {
            res.status(400).json({
              success: false,
              message: `Invalid fields: ${invalidFields.join(', ')}`,
            });
            return false;
          }
        }
        
        return true;
      };
    }