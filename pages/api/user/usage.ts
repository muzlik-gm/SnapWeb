import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, getScreenshotsCollection } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import type { UserStats } from '@/types';

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
    return handleGetUsage(req, res, session.user.id);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleGetUsage(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    // Get user data
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // Get screenshots collection
    const screenshots = await getScreenshotsCollection();

    // Get this month's screenshots count
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const thisMonthCount = await screenshots.countDocuments({
      user_id: userId,
      created_at: { $gte: monthStart }
    });

    // Get popular screenshots (most downloaded)
    const popularScreenshots = await screenshots
      .find({ user_id: userId })
      .sort({ downloads: -1 })
      .limit(5)
      .toArray();

    // Get recent screenshots
    const recentScreenshots = await screenshots
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();

    const stats: UserStats = {
      totalScreenshots: user.total_screenshots || 0,
      creditsRemaining: user.credits || 0,
      thisMonthScreenshots: thisMonthCount || 0,
      popularScreenshots: popularScreenshots.map(s => ({ ...s, id: s._id.toString() })) || [],
    };

    res.status(200).json(
      createApiResponse(true, {
        stats,
        recentScreenshots: recentScreenshots.map(s => ({ ...s, id: s._id.toString() })) || [],
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          avatar_url: user.avatar_url,
          preferences: user.preferences,
        },
      })
    );
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}