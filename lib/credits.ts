import { getUserById, updateUserCredits, getUsersCollection, getScreenshotsCollection } from './mongodb';
import { pricingTiers } from './utils';

export interface CreditRenewalResult {
  userId: string;
  oldCredits: number;
  newCredits: number;
  plan: string;
}

// Renew credits for a user based on their plan
export async function renewUserCredits(userId: string): Promise<CreditRenewalResult> {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const planTier = pricingTiers.find(tier => tier.id === user.plan);
  if (!planTier) {
    throw new Error('Invalid plan');
  }

  const oldCredits = user.credits;
  const newCredits = planTier.credits;

  // Update user credits
  await updateUserCredits(userId, newCredits);

  return {
    userId,
    oldCredits,
    newCredits,
    plan: user.plan,
  };
}

// Renew credits for all active subscription users
export async function renewAllSubscriptionCredits(): Promise<CreditRenewalResult[]> {
  // Get all users with active subscriptions
  const usersCollection = await getUsersCollection();
  const users = await usersCollection
    .find({
      plan: { $in: ['pro', 'team'] },
      subscription_status: 'active'
    })
    .toArray();

  const results: CreditRenewalResult[] = [];

  for (const user of users) {
    try {
      const userId = (user as any)._id.toString();
      const result = await renewUserCredits(userId);
      results.push(result);
    } catch (error) {
      console.error(`Failed to renew credits for user ${(user as any)._id}:`, error);
    }
  }

  return results;
}

// Check if user needs credit renewal (for cron jobs)
export async function checkCreditRenewal(): Promise<void> {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Only run on the first day of the month
  if (now.getDate() === 1) {
    console.log('Running monthly credit renewal...');
    const results = await renewAllSubscriptionCredits();
    console.log(`Renewed credits for ${results.length} users`);
  }
}

// Get credit usage analytics
export async function getCreditAnalytics(userId?: string) {
  const screenshotsCollection = await getScreenshotsCollection();
  
  const filter = userId ? { user_id: userId } : {};
  const screenshots = await screenshotsCollection
    .find(filter)
    .project({ user_id: 1, created_at: 1 })
    .toArray();

  // Group by month
  const monthlyUsage: Record<string, number> = {};
  
  screenshots.forEach(screenshot => {
    const date = new Date(screenshot.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyUsage[monthKey] = (monthlyUsage[monthKey] || 0) + 1;
  });

  return {
    totalScreenshots: screenshots.length,
    monthlyUsage,
  };
}

// Calculate cost for additional credits
export function calculateCreditCost(credits: number): number {
  // $0.01 per credit for additional credits
  return credits * 0.01;
}

// Validate credit transaction
export function validateCreditTransaction(
  currentCredits: number,
  requestedCredits: number,
  maxCredits: number = 10000
): { valid: boolean; error?: string } {
  if (requestedCredits <= 0) {
    return { valid: false, error: 'Credits must be positive' };
  }

  if (currentCredits + requestedCredits > maxCredits) {
    return { valid: false, error: `Cannot exceed ${maxCredits} credits` };
  }

  return { valid: true };
}