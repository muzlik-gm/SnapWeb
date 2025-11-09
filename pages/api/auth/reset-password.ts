import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUsersCollection } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { z } from 'zod';

const resetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetConfirmSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return handleResetRequest(req, res);
  } else if (req.method === 'PUT') {
    return handleResetConfirm(req, res);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleResetRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = resetRequestSchema.parse(req.body);

    const user = await getUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return res.status(200).json(
        createApiResponse(true, null, 'If the email exists, a reset link has been sent')
      );
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '1h' }
    );

    // In production, send email with reset link
    // For now, just log it
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`);

    res.status(200).json(
      createApiResponse(true, null, 'If the email exists, a reset link has been sent')
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    res.status(500).json(
      createApiResponse(false, null, 'Internal server error')
    );
  }
}

async function handleResetConfirm(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token, password } = resetConfirmSchema.parse(req.body);

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    
    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user password using MongoDB
    const usersCollection = await getUsersCollection();
    const { ObjectId } = require('mongodb');
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password_hash: passwordHash, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json(
        createApiResponse(false, null, 'User not found')
      );
    }

    res.status(200).json(
      createApiResponse(true, null, 'Password updated successfully')
    );
  } catch (error) {
    console.error('Password reset confirm error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json(
        createApiResponse(false, null, 'Invalid or expired reset token')
      );
    }

    res.status(500).json(
      createApiResponse(false, null, 'Internal server error')
    );
  }
}