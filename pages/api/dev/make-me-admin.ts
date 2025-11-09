import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByApiKey, getUsersCollection } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow simple browser GET/POST
    if (!['GET','POST'].includes(req.method || '')) {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Do nothing in production
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, error: 'Disabled in production' });
    }

    // Identify current user by API key (supports common places)
    const auth = req.headers.authorization || '';
    const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
    const headerKey = (req.headers['x-api-key'] as string) || '';
    const cookieKey = (req.cookies?.api_key as string) || '';
    const apiKey = bearer || headerKey || cookieKey;

    if (!apiKey) {
      return res.status(401).json({ success: false, error: 'No API key found. Provide via Authorization: Bearer <key>, X-API-Key header, or api_key cookie.' });
    }

    const user = await getUserByApiKey(apiKey);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found for provided API key' });
    }

    const users = await getUsersCollection();
    const { ObjectId } = require('mongodb');
    await users.updateOne(
      { _id: new ObjectId(user.id) } as any,
      { $set: { role: 'admin', updated_at: new Date() } } as any
    );

    return res.status(200).json({ success: true, data: { userId: user.id, role: 'admin' } });
  } catch (error: any) {
    console.error('dev/make-me-admin error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}
