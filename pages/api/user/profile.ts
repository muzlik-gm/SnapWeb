import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, getUsersCollection } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  preferences: z.object({
    defaultFormat: z.enum(['png', 'jpeg', 'webp']).optional(),
    defaultResolution: z.string().optional(),
    emailNotifications: z.boolean().optional(),
    secretPhrase: z.string().max(100).optional(),
    customErrorImageUrl: z.string().url().max(2048).optional(),
  }).optional(),
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
    return handleGetProfile(req, res, session.user.id);
  } else if (req.method === 'PUT') {
    return handleUpdateProfile(req, res, session.user.id);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleGetProfile(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // Remove sensitive data
    const { password_hash, api_key, ...safeUser } = user;

    res.status(200).json(createApiResponse(true, safeUser));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}

async function handleUpdateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const updates = updateProfileSchema.parse(req.body);
    const users = await getUsersCollection();
    const { ObjectId } = require('mongodb');

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...(updates as any), 
          updated_at: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // Remove sensitive data
    const { password_hash, api_key, ...safeUser } = result;
    const userWithId = { ...safeUser, id: result._id.toString() };

    res.status(200).json(
      createApiResponse(true, userWithId, 'Profile updated successfully')
    );
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}