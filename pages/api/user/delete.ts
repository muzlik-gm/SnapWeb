import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUsersCollection, getScreenshotsCollection } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { securityMiddleware, corsMiddleware } from '@/lib/security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res);
  const securityResult = await securityMiddleware(req, res);
  if (!securityResult) return;

  if (req.method !== 'DELETE') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json(createApiResponse(false, null, 'Unauthorized'));
  }

  try {
    const users = await getUsersCollection();
    const screenshots = await getScreenshotsCollection();
    const { ObjectId } = require('mongodb');

    // Delete screenshots owned by user
    await screenshots.deleteMany({ user_id: session.user.id });

    // Delete user
    await users.deleteOne({ _id: new ObjectId(session.user.id) });

    return res.status(200).json(createApiResponse(true, null, 'Account deleted successfully'));
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}