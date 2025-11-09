import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { getUserByEmail, getUserById, getUsersCollection } from '@/lib/mongodb';
import { renewUserCredits } from '@/lib/credits';

// Optional: tighten body size if desired
export const config = {
  api: {
    bodyParser: true,
  },
};

type SyncBody = {
  userId?: string;
  email?: string;
  stripeCustomerId?: string;
};

type Plan = 'pro' | 'team';

async function resolvePlanFromSubscriptionItem(item: Stripe.SubscriptionItem): Promise<Plan | undefined> {
  try {
    const priceId = (item?.price?.id as string) || undefined;
    const envPro = process.env.STRIPE_PRO_PRICE_ID;
    const envTeam = process.env.STRIPE_TEAM_PRICE_ID;
    if (priceId && envPro && priceId === envPro) return 'pro';
    if (priceId && envTeam && priceId === envTeam) return 'team';

    const nickname = ((item as any)?.price?.nickname || '').toLowerCase();
    if (nickname.includes('pro')) return 'pro';
    if (nickname.includes('team')) return 'team';

    const productRef = item?.price?.product as string | Stripe.Product | undefined;
    const productId = typeof productRef === 'string' ? productRef : productRef?.id;
    if (productId) {
      const product = await stripe.products.retrieve(productId);
      const metaPlan = (product.metadata?.plan || product.metadata?.tier || '').toLowerCase();
      const byName = (product.name || '').toLowerCase();
      if (metaPlan === 'pro' || byName.includes('pro')) return 'pro';
      if (metaPlan === 'team' || byName.includes('team')) return 'team';
    }
  } catch (e) {
    console.warn('resolvePlanFromSubscriptionItem failed:', e);
  }
  return undefined;
}

async function findStripeCustomerId(input: { userStripeId?: string; email?: string }): Promise<string | null> {
  if (input.userStripeId) return input.userStripeId;
  if (!input.email) return null;
  const customers = await stripe.customers.list({ email: input.email, limit: 1 });
  return customers.data[0]?.id || null;
}

async function getLatestRelevantSubscription(customerId: string): Promise<Stripe.Subscription | null> {
  // Prefer active/trialing/past_due/unpaid; fallback to most recent subscription
  const preferredStatuses: Stripe.Subscription.Status[] = ['active', 'trialing', 'past_due', 'unpaid'];
  for (const status of preferredStatuses) {
    const list = await stripe.subscriptions.list({ customer: customerId, status, limit: 1 });
    if (list.data[0]) return list.data[0];
  }
  const anyList = await stripe.subscriptions.list({ customer: customerId, limit: 1 });
  return anyList.data[0] || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const adminSecret = process.env.ADMIN_SYNC_SECRET;
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
    if (!adminSecret || token !== adminSecret) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const body: SyncBody = (req.body || {}) as SyncBody;
    if (!body.userId && !body.email && !body.stripeCustomerId) {
      return res.status(400).json({ success: false, error: 'Provide one of: userId, email, stripeCustomerId' });
    }

    // Load user by id/email if provided so we can also update Mongo
    const user = body.userId
      ? await getUserById(body.userId)
      : body.email
      ? await getUserByEmail(body.email)
      : null;

    const email = user?.email || body.email;
    const stripeCustomerId = await findStripeCustomerId({ userStripeId: (user as any)?.stripe_customer_id || body.stripeCustomerId || undefined, email: email || undefined });

    if (!stripeCustomerId) {
      return res.status(404).json({ success: false, error: 'Stripe customer not found for given identifiers' });
    }

    const subscription = await getLatestRelevantSubscription(stripeCustomerId);
    if (!subscription) {
      return res.status(404).json({ success: false, error: 'No subscriptions found for customer' });
    }

    const item = subscription.items.data[0];
    const plan = await resolvePlanFromSubscriptionItem(item);

    // Update Mongo if we have a user record
    let updated = null as any;
    if (user) {
      const usersCollection = await getUsersCollection();
      const { ObjectId } = require('mongodb');
      const update: any = {
        stripe_customer_id: stripeCustomerId,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_end_date: new Date((subscription as any).current_period_end * 1000),
        updated_at: new Date(),
      };
      if (plan) update.plan = plan;

      await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        { $set: update },
      );

      // Renew credits only when plan is known (paid tiers)
      if (plan) {
        await renewUserCredits(user.id);
      }
      updated = { ...user, ...update };
    }

    return res.status(200).json({
      success: true,
      data: {
        stripe_customer_id: stripeCustomerId,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_end_date: new Date((subscription as any).current_period_end * 1000),
        resolved_plan: plan || null,
        ...(updated ? { updated_user: updated } : {}),
      },
    });
  } catch (error: any) {
    console.error('sync-subscription error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}
