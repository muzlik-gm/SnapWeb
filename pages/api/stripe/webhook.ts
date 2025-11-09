import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { getUsersCollection, createPayment, getUserByEmail } from '@/lib/mongodb';

async function getRawBody(req: NextApiRequest): Promise<Buffer[]> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(chunks));
    req.on('error', reject);
  });
}
import { renewUserCredits } from '@/lib/credits';

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = Buffer.concat(await getRawBody(req));
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      // Some accounts send invoice.paid instead of invoice.payment_succeeded
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  if (!session.customer || !session.subscription) {
    console.error('Missing customer or subscription in checkout session');
    return;
  }

  // Get customer details
  const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
  
  // Find the user by Stripe customer ID first (most reliable), then by email as a fallback
  const usersCollectionPre = await getUsersCollection();
  const userDoc = await usersCollectionPre.findOne({ stripe_customer_id: customer.id } as any);
  let user = userDoc ? ({ ...(userDoc as any), id: (userDoc as any)._id?.toString?.() } as any) : null;
  if (!user && customer.email) {
    user = await getUserByEmail(customer.email);
  }

  if (!user) {
    console.error('User not found for customer:', customer.id, customer.email);
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const item = subscription.items.data[0];
  const priceId = item?.price?.id as string | undefined;

  // Determine plan based on price ID -> env map, then product metadata/name fallback
  let plan: 'pro' | 'team' | undefined = undefined;
  const envPro = process.env.STRIPE_PRO_PRICE_ID;
  const envTeam = process.env.STRIPE_TEAM_PRICE_ID;
  if (priceId && envPro && priceId === envPro) plan = 'pro';
  else if (priceId && envTeam && priceId === envTeam) plan = 'team';
  else {
    try {
      // Try nickname on the price first
      const priceNickname = (((item as any)?.price?.nickname) || '').toLowerCase();
      if (priceNickname.includes('pro')) plan = 'pro';
      else if (priceNickname.includes('team')) plan = 'team';

      // Fall back to product metadata/name
      if (!plan) {
      const productRef = item?.price?.product as string | Stripe.Product | undefined;
      const productId = typeof productRef === 'string' ? productRef : productRef?.id;
      if (productId) {
        const product = await stripe.products.retrieve(productId);
        const metaPlan = (product.metadata?.plan || product.metadata?.tier || '').toLowerCase();
        const byName = (product.name || '').toLowerCase();
        if (metaPlan === 'pro' || byName.includes('pro')) plan = 'pro';
        else if (metaPlan === 'team' || byName.includes('team')) plan = 'team';
      }
      }
    } catch (e) {
      console.warn('Webhook plan fallback failed:', e);
    }
  }

  // Update user with subscription details using MongoDB
  const usersCollection = await getUsersCollection();
  const { ObjectId } = require('mongodb');
  await usersCollection.updateOne(
    { _id: new ObjectId(user.id) },
    { 
      $set: {
        stripe_customer_id: customer.id,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_end_date: new Date((subscription as any).current_period_end * 1000),
        ...(plan && { plan }),
        updated_at: new Date()
      }
    }
  );

  // Renew credits only if we successfully determined a paid plan
  if (plan) {
    await renewUserCredits(user.id);
  }

  // Record payment
  await createPayment({
    user_id: user.id,
    type: 'subscription',
    provider: 'stripe',
    provider_id: session.payment_intent as string,
    amount: (session.amount_total || 0) / 100,
    currency: session.currency || 'usd',
    status: 'completed',
    description: plan ? `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan subscription` : 'Subscription purchase',
    processed_at: new Date(),
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);

  if (!invoice.customer) {
    return;
  }

  // Get customer
  const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
  
  // Prefer lookup by Stripe customer ID; fallback to email if needed
  const usersCollection = await getUsersCollection();
  const userDoc = await usersCollection.findOne({ stripe_customer_id: customer.id } as any);
  let user = userDoc ? ({ ...(userDoc as any), id: (userDoc as any)._id?.toString?.() } as any) : null;
  if (!user && customer.email) {
    user = await getUserByEmail(customer.email);
  }

  if (!user) {
    console.warn('Payment succeeded but user not found for customer:', customer.id, customer.email);
    return;
  }

  // Try to determine plan and subscription details from invoice
  let plan: 'free' | 'pro' | 'team' | undefined;
  let subscriptionId: string | undefined = (invoice as any).subscription as string | undefined;
  let subscription: Stripe.Subscription | undefined;

  try {
    if (subscriptionId) {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const item = subscription.items.data[0];
      const priceId = item?.price?.id as string | undefined;
      const envPro = process.env.STRIPE_PRO_PRICE_ID;
      const envTeam = process.env.STRIPE_TEAM_PRICE_ID;
      if (priceId && envPro && priceId === envPro) plan = 'pro';
      else if (priceId && envTeam && priceId === envTeam) plan = 'team';
      else if (item?.price?.product) {
        const product = await stripe.products.retrieve(item.price.product as string);
        const metaPlan = (product.metadata?.plan || product.metadata?.tier || '').toLowerCase();
        const byName = (product.name || '').toLowerCase();
        if (metaPlan === 'pro' || byName.includes('pro')) plan = 'pro';
        else if (metaPlan === 'team' || byName.includes('team')) plan = 'team';
      }
    } else if ((invoice.lines?.data?.[0] as any)?.price?.id) {
      const price = (invoice.lines.data[0] as any).price!;
      const envPro = process.env.STRIPE_PRO_PRICE_ID;
      const envTeam = process.env.STRIPE_TEAM_PRICE_ID;
      if (price.id && envPro && price.id === envPro) plan = 'pro';
      else if (price.id && envTeam && price.id === envTeam) plan = 'team';
      else {
        const nickname = (price.nickname || '').toLowerCase();
        if (nickname.includes('pro')) plan = 'pro';
        else if (nickname.includes('team')) plan = 'team';
        else if (price.product) {
          const productRef = price.product as string | Stripe.Product;
          const productId = typeof productRef === 'string' ? productRef : productRef?.id;
          if (productId) {
            const product = await stripe.products.retrieve(productId);
            const metaPlan = (product.metadata?.plan || product.metadata?.tier || '').toLowerCase();
            const byName = (product.name || '').toLowerCase();
            if (metaPlan === 'pro' || byName.includes('pro')) plan = 'pro';
            else if (metaPlan === 'team' || byName.includes('team')) plan = 'team';
          }
        }
      }
    }
  } catch (e) {
    console.warn('Invoice plan resolution failed:', e);
  }

  // On initial subscription_create we also want to set plan and credits
  if (['subscription_create', 'subscription_cycle', 'subscription_update'].includes((invoice as any).billing_reason)) {
    try {
      const usersCollection = await getUsersCollection();
      const { ObjectId } = require('mongodb');
      await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            stripe_customer_id: customer.id,
            ...(subscription && { subscription_id: subscription.id, subscription_status: subscription.status, subscription_end_date: new Date((subscription as any).current_period_end * 1000) }),
            ...(plan && { plan }),
            updated_at: new Date()
          }
        }
      );

      // Renew credits on initial and recurring subscription events when plan is known
      if (plan) {
        await renewUserCredits(user.id);
      }
    } catch (e) {
      console.error('Failed to update user on invoice.payment_succeeded:', e);
    }
  }

  // Record payment
  await createPayment({
    user_id: user.id,
    type: 'subscription',
    provider: 'stripe',
    provider_id: (invoice as any).payment_intent as string,
    amount: (invoice.amount_paid || 0) / 100,
    currency: invoice.currency || 'usd',
    status: 'completed',
    description: `Invoice ${invoice.number}`,
    processed_at: new Date(),
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);

  if (!invoice.customer) {
    return;
  }

  const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
  
  // Prefer lookup by Stripe customer ID; fallback to email
  const usersCollection2 = await getUsersCollection();
  const userDoc2 = await usersCollection2.findOne({ stripe_customer_id: customer.id } as any);
  let user2 = userDoc2 ? ({ ...(userDoc2 as any), id: (userDoc2 as any)._id?.toString?.() } as any) : null;
  if (!user2 && customer.email) {
    user2 = await getUserByEmail(customer.email);
  }

  if (!user2) {
    return;
  }

  // Record failed payment
  await createPayment({
    user_id: user2.id,
    type: 'subscription',
    provider: 'stripe',
    provider_id: (invoice as any).payment_intent as string || invoice.id,
    amount: (invoice.amount_due || 0) / 100,
    currency: invoice.currency || 'usd',
    status: 'failed',
    description: `Failed payment for invoice ${invoice.number}`,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  if (!subscription.customer) {
    return;
  }

  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  
  // Prefer lookup by Stripe customer ID; fallback to email
  const usersCollection3pref = await getUsersCollection();
  const userDoc3 = await usersCollection3pref.findOne({ stripe_customer_id: customer.id } as any);
  let user3 = userDoc3 ? ({ ...(userDoc3 as any), id: (userDoc3 as any)._id?.toString?.() } as any) : null;
  if (!user3 && customer.email) {
    user3 = await getUserByEmail(customer.email);
  }

  if (!user3) {
    return;
  }

  // Try to resolve plan from the current subscription items
  let plan: 'pro' | 'team' | undefined = undefined;
  try {
    const sub = await stripe.subscriptions.retrieve(subscription.id);
    const item = sub.items.data[0];
    const priceId = item?.price?.id as string | undefined;
    const envPro = process.env.STRIPE_PRO_PRICE_ID;
    const envTeam = process.env.STRIPE_TEAM_PRICE_ID;
    if (priceId && envPro && priceId === envPro) plan = 'pro';
    else if (priceId && envTeam && priceId === envTeam) plan = 'team';
    else {
      const nickname = (((item as any)?.price?.nickname) || '').toLowerCase();
      if (nickname.includes('pro')) plan = 'pro';
      else if (nickname.includes('team')) plan = 'team';
      else if (item?.price?.product) {
        const productRef = item.price.product as string | Stripe.Product;
        const productId = typeof productRef === 'string' ? productRef : productRef?.id;
        if (productId) {
          const product = await stripe.products.retrieve(productId);
          const metaPlan = (product.metadata?.plan || product.metadata?.tier || '').toLowerCase();
          const byName = (product.name || '').toLowerCase();
          if (metaPlan === 'pro' || byName.includes('pro')) plan = 'pro';
          else if (metaPlan === 'team' || byName.includes('team')) plan = 'team';
        }
      }
    }
  } catch (e) {
    console.warn('Failed to resolve plan on subscription update:', e);
  }

  // Update subscription status (and plan if resolved) using MongoDB
  const usersCollection3 = await getUsersCollection();
  const { ObjectId } = require('mongodb');
  await usersCollection3.updateOne(
    { _id: new ObjectId(user3.id) },
    { 
      $set: {
        subscription_status: subscription.status,
        subscription_end_date: new Date((subscription as any).current_period_end * 1000),
        ...(plan && { plan }),
        updated_at: new Date()
      }
    }
  );

  // Only renew credits if a paid plan is confirmed
  if (plan) {
    await renewUserCredits(user3.id);
  }
}
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  if (!subscription.customer) {
    return;
  }

  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  
  // Prefer lookup by Stripe customer ID; fallback to email
  const usersCollection4pref = await getUsersCollection();
  const userDoc4 = await usersCollection4pref.findOne({ stripe_customer_id: customer.id } as any);
  let user4 = userDoc4 ? ({ ...(userDoc4 as any), id: (userDoc4 as any)._id?.toString?.() } as any) : null;
  if (!user4 && customer.email) {
    user4 = await getUserByEmail(customer.email);
  }

  if (!user4) {
    return;
  }

  // Downgrade to free plan using MongoDB
  const usersCollection4 = await getUsersCollection();
  const { ObjectId } = require('mongodb');
  await usersCollection4.updateOne(
    { _id: new ObjectId(user4.id) },
    { 
      $set: {
        plan: 'free' as const,
        subscription_status: 'canceled',
        credits: 10, // Reset to free plan credits
        updated_at: new Date()
      },
      $unset: {
        subscription_id: '',
        subscription_end_date: ''
      }
    }
  );
}