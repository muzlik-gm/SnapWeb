import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow Stripe webhooks to pass through without auth or rate limiting
  // Stripe cannot add session cookies or auth headers, and these requests must
  // be publicly accessible. We only verify them inside the API route using the
  // Stripe signature secret.
  if (pathname.startsWith('/api/stripe/webhook')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    let limit = 100; // Default limit per hour
    let windowMs = 60 * 60 * 1000; // 1 hour

    // Stricter limits for screenshot generation
    if (pathname === '/api/screenshot') {
      limit = 10; // 10 requests per hour for anonymous users
      windowMs = 60 * 60 * 1000;

      // Check if user is authenticated
      const token = await getToken({ req: request });
      if (token) {
        // Authenticated users get higher limits based on plan
        const plan = token.plan as string;
        if (plan === 'pro') {
          limit = 100;
        } else if (plan === 'team') {
          limit = 500;
        } else {
          limit = 20; // Free plan
        }
      }
    }

    const rateLimitKey = getRateLimitKey(ip, pathname);
    const allowed = checkRateLimit(rateLimitKey, limit, windowMs);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Protected routes (exclude Stripe webhook which is handled above)
  const protectedPaths = [
    '/dashboard',
    '/api/user',
    // Protect specific Stripe customer-facing endpoints, but NOT the webhook
    '/api/stripe/create-checkout',
    '/api/stripe/create-portal',
    '/api/stripe/portal'
  ];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    const token = await getToken({ req: request });
    
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // Redirect to sign-in page
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};