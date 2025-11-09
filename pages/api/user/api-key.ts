import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, getUsersCollection } from '@/lib/mongodb';
import { createApiResponse, generateApiKey } from '@/lib/utils';

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
    return handleGetApiKey(req, res, session.user.id);
  } else if (req.method === 'POST') {
    return handleGenerateApiKey(req, res, session.user.id);
  } else if (req.method === 'DELETE') {
    return handleRevokeApiKey(req, res, session.user.id);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleGetApiKey(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // Check if user has access to API (Pro or Team plan)
    if (user.plan === 'free') {
      return res.status(403).json(
        createApiResponse(false, null, 'API access requires Pro or Team plan')
      );
    }

    res.status(200).json(
      createApiResponse(true, {
        hasApiKey: !!user.api_key,
        apiKey: user.api_key ? `${user.api_key.substring(0, 8)}...` : null,
        plan: user.plan,
      })
    );
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}

async function handleGenerateApiKey(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    // Check if user has access to API (Pro or Team plan)
    if (user.plan === 'free') {
      return res.status(403).json(
        createApiResponse(false, null, 'API access requires Pro or Team plan. Please upgrade your plan.')
      );
    }

    // Generate new API key
    const apiKey = generateApiKey();

    // Update user with new API key using MongoDB
    const usersCollection = await getUsersCollection();
    const { ObjectId } = require('mongodb');
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { api_key: apiKey, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    res.status(200).json(
      createApiResponse(true, {
        apiKey,
        message: 'API key generated successfully. Please store it securely as it won\'t be shown again.',
      })
    );
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}

async function handleRevokeApiKey(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json(createApiResponse(false, null, 'User not found'));
    }

    if (!user.api_key) {
      return res.status(400).json(createApiResponse(false, null, 'No API key to revoke'));
    }

    // Remove API key using MongoDB
    const usersCollection2 = await getUsersCollection();
    const { ObjectId } = require('mongodb');
    const result = await usersCollection2.updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { api_key: '' }, $set: { updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    res.status(200).json(
      createApiResponse(true, null, 'API key revoked successfully')
    );
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}