import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '@/lib/mongodb';
import { createApiResponse, AppError } from '@/lib/utils';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  try {
    const { name, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json(
        createApiResponse(false, null, 'User with this email already exists')
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await createUser({
      name,
      email,
      password_hash: passwordHash,
      plan: 'free',
      credits: 10,
      total_screenshots: 0,
      preferences: {
        defaultFormat: 'png',
        defaultResolution: '1920x1080',
        emailNotifications: true,
      },
    });

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.status(201).json(
      createApiResponse(true, userWithoutPassword, 'User created successfully')
    );
  } catch (error) {
    console.error('Registration error:', error);
    
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