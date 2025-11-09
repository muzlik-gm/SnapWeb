import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection, getUserByEmail, getUserById } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, error: 'Disabled in production' });
    }

    const elevateSecret = process.env.DEV_ELEVATE_SECRET;
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
    if (!elevateSecret || token !== elevateSecret) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { userId, email } = req.body || {};
    if (!userId && !email) {
      return res.status(400).json({ success: false, error: 'Provide userId or email' });
    }

    const user = userId ? await getUserById(userId) : await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const users = await getUsersCollection();
    const { ObjectId } = require('mongodb');

    await users.updateOne(
      { _id: new ObjectId(user.id) } as any,
      { $set: { role: 'admin', updated_at: new Date() } } as any
    );

    return res.status(200).json({ success: true, data: { userId: user.id, role: 'admin' } });
  } catch (error: any) {
    console.error('dev/elevate-admin error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}
