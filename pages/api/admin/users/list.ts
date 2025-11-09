import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const adminSecret = process.env.ADMIN_SYNC_SECRET;
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
    if (!adminSecret || token !== adminSecret) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const limit = Math.min(parseInt((req.query.limit as string) || '25', 10), 100);

    const usersCollection = await getUsersCollection();
    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ updated_at: -1 })
      .limit(limit)
      .toArray();

    const sanitized = users.map((u: any) => ({ ...u, id: u._id?.toString?.() }));

    return res.status(200).json({ success: true, data: sanitized });
  } catch (error: any) {
    console.error('admin/users/list error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}
