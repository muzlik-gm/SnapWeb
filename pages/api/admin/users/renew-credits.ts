import type { NextApiRequest, NextApiResponse } from 'next';
import { renewUserCredits } from '@/lib/credits';

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

    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Provide userId' });
    }

    const result = await renewUserCredits(userId);

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('admin/users/renew-credits error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}
