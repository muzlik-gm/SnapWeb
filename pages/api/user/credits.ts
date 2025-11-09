import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, updateUserCredits, getScreenshotsCollection } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { z } from 'zod';

const addCreditsSchema = z.object({
  amount: z.number().min(1).max(10000),
  reason: z.string().optional(),
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
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json(createApiResponse(false, null, 'Unauthorized'));
  }

  if (req.method === 'GET') {
    return handleGetCredits(req, res, session.user.id);
  } else if (req.method === 'POST') {
    return handleAddCredits(req, res, session.user.id);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleGetCredits(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // Get credit usage history for this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Get credit usage history for this month using MongoDB
    const screenshotsCollection = await getScreenshotsCollection();
    const usedThisMonth = await screenshotsCollection.countDocuments({
      user_id: userId,
      created_at: { $gte: monthStart }
    });

    // Calculate credits based on plan
    let monthlyAllowance = 10; // Free plan
    if (user.plan === 'pro') {
      monthlyAllowance = 500;
    } else if (user.plan === 'team') {
      monthlyAllowance = 2000;
    }

    res.status(200).json(
      createApiResponse(true, {
        current: user.credits,
        used: user.total_screenshots,
        usedThisMonth: usedThisMonth || 0,
        monthlyAllowance,
        plan: user.plan,
      })
    );
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}

async function handleAddCredits(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { amount, reason } = addCreditsSchema.parse(req.body);

    // Only allow admin users to add credits manually
    // In production, this would be handled by payment webhooks
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // For demo purposes, allow users to add credits
    // In production, remove this and only allow via payment system
    const newCredits = user.credits + amount;
    const updatedUser = await updateUserCredits(userId, newCredits);

    res.status(200).json(
      createApiResponse(true, {
        credits: updatedUser.credits,
        added: amount,
      }, `${amount} credits added successfully`)
    );
  } catch (error) {
    console.error('Add credits error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}