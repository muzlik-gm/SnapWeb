import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, getStripeCustomerByEmail, createStripeCustomer } from '@/lib/stripe';
import { getUserById, getUsersCollection } from '@/lib/mongodb';
import { createApiResponse, pricingTiers } from '@/lib/utils';
import { z } from 'zod';

const checkoutSchema = z.object({
  priceId: z.string().optional(),
  plan: z.enum(['pro', 'team']).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
}).refine((d) => !!d.priceId || !!d.plan, {
  message: 'priceId or plan is required',
  path: ['priceId'],
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
    // Fallback to JWT decoding to avoid occasional lambda-secret mismatch
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
    const { priceId: bodyPriceId, plan, successUrl, cancelUrl } = checkoutSchema.parse(req.body);

    // Resolve price ID from request or plan env mapping
    const resolvedPriceId = bodyPriceId || (plan === 'pro' ? process.env.STRIPE_PRO_PRICE_ID : plan === 'team' ? process.env.STRIPE_TEAM_PRICE_ID : undefined);
    if (!resolvedPriceId) {
      const missing = plan === 'team' ? 'STRIPE_TEAM_PRICE_ID' : 'STRIPE_PRO_PRICE_ID';
      return res.status(500).json(createApiResponse(false, null, `Stripe not configured: set ${missing} env`));
    }

    // Get user details
    const user = await getUserById(session.user.id);
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // Get or create Stripe customer
    let customer = await getStripeCustomerByEmail(user.email);
    
    if (!customer) {
      customer = await createStripeCustomer(user.email, user.name);
      
      // Update user with Stripe customer ID using MongoDB
      const usersCollection = await getUsersCollection();
      const { ObjectId } = require('mongodb');
      await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        { $set: { stripe_customer_id: customer.id, updated_at: new Date() } }
      );
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      metadata: {
        userId: user.id,
      },
    });

    res.status(200).json(
      createApiResponse(true, {
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
      })
    );
  } catch (error) {
    console.error('Create checkout error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}