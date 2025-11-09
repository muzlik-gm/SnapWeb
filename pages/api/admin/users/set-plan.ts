import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from '@/lib/mongodb';

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

    const { userId, plan } = req.body || {};
    if (!userId || !['free','pro','team'].includes(plan)) {
      return res.status(400).json({ success: false, error: 'Provide userId and valid plan (free|pro|team)' });
    }

    const users = await getUsersCollection();
    const { ObjectId } = require('mongodb');
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { plan, updated_at: new Date() } }
    );

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('admin/users/set-plan error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}
