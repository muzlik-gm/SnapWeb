import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, getUserById } from '@/lib/mongodb';

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

    const { email, userId } = req.body || {};
    if (!email && !userId) {
      return res.status(400).json({ success: false, error: 'Provide email or userId' });
    }

    const user = userId ? await getUserById(userId) : await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    console.error('admin/users/search error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}
