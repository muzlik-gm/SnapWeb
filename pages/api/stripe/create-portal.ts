import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createBillingPortalSession } from '@/lib/stripe';
import { getUserById } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { z } from 'zod';

const portalSchema = z.object({
  returnUrl: z.string().url().optional(),
});

import { securityMiddleware, corsMiddleware } from '@/lib/security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apply security and CORS middleware
  await corsMiddleware(req, res);
  const securityResult = await securityMiddleware(req, res);
  if (!securityResult) return; // Stop if security check fails
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  let session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    const { getToken } = await import('next-auth/jwt');
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    if (token?.sub) {
      session = { user: { id: token.sub as string } } as any;
    }
  }

  if (!session?.user?.id) {
    return res.status(401).json(createApiResponse(false, null, 'Unauthorized'));
  }

  try {
    const { returnUrl } = portalSchema.parse(req.body);

    // Get user details
    const user = await getUserById(session.user.id);
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    if (!user.stripe_customer_id) {
      return res.status(400).json(
        createApiResponse(false, null, 'No billing information found. Please subscribe to a plan first.')
      );
    }

    // Create billing portal session
    const portalSession = await createBillingPortalSession(
      user.stripe_customer_id,
      returnUrl || `${process.env.NEXTAUTH_URL}/dashboard`
    );

    res.status(200).json(
      createApiResponse(true, {
        url: portalSession.url,
      })
    );
  } catch (error) {
    console.error('Create portal error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}