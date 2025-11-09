import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, getUsersCollection } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { stripe } from '@/lib/stripe';
import { renewUserCredits } from '@/lib/credits';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));

  let session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    const { getToken } = await import('next-auth/jwt');
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    if (token?.sub) session = { user: { id: token.sub as string } } as any;
  }
  if (!session?.user?.id) return res.status(401).json(createApiResponse(false, null, 'Unauthorized'));

  const user = await getUserById(session.user.id);
  if (!user) return res.status(404).json(createApiResponse(false, null, 'User not found'));
  if (!user.stripe_customer_id) return res.status(400).json(createApiResponse(false, null, 'No Stripe customer on file'));

  try {
    const subs = await stripe.subscriptions.list({ customer: user.stripe_customer_id, status: 'all', limit: 3 });
    const sub = subs.data.find(s => s.status === 'active' || s.status === 'trialing');
    if (!sub) return res.status(200).json(createApiResponse(true, { plan: 'free', subscriptionStatus: 'none' }));

    const item = sub.items.data[0];
    const priceId = item?.price?.id as string | undefined;
    let plan: 'free' | 'pro' | 'team' = 'free';
    const envPro = process.env.STRIPE_PRO_PRICE_ID;
    const envTeam = process.env.STRIPE_TEAM_PRICE_ID;
    if (priceId && envPro && priceId === envPro) plan = 'pro';
    else if (priceId && envTeam && priceId === envTeam) plan = 'team';
    else {
      try {
        const productId = (item?.price?.product as string) || undefined;
        if (productId) {
          const product = await stripe.products.retrieve(productId);
          const metaPlan = (product.metadata?.plan || product.metadata?.tier || '').toLowerCase();
          const byName = (product.name || '').toLowerCase();
          if (metaPlan === 'pro' || byName.includes('pro')) plan = 'pro';
          else if (metaPlan === 'team' || byName.includes('team')) plan = 'team';
        }
      } catch {}
    }

    const users = await getUsersCollection();
    const { ObjectId } = require('mongodb');
    await users.updateOne({ _id: new ObjectId(user.id) }, { $set: { plan, subscription_id: sub.id, subscription_status: sub.status, subscription_end_date: new Date((sub as any).current_period_end * 1000), updated_at: new Date() } });

    await renewUserCredits(user.id);

    return res.status(200).json(createApiResponse(true, { plan, subscriptionStatus: sub.status }));
  } catch (e) {
    console.error('Refresh plan error:', e);
    return res.status(500).json(createApiResponse(false, null, 'Failed to refresh plan'));
  }
}