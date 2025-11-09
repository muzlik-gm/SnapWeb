import { NextApiRequest, NextApiResponse } from 'next';
import { createContactMessage } from '@/lib/mongodb';
import { createApiResponse, getClientIP } from '@/lib/utils';

import { securityMiddleware, corsMiddleware } from '@/lib/security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apply security and CORS middleware
  await corsMiddleware(req, res);
  const securityResult = await securityMiddleware(req, res);
  if (!securityResult) return; // Stop if security check fails
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json(
      createApiResponse(false, null, 'All fields are required')
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json(
      createApiResponse(false, null, 'Invalid email format')
    );
  }

  try {
    // Save to database
    const contactMessage = await createContactMessage({
      name,
      email,
      subject,
      message,
      ip_address: getClientIP(req),
      user_agent: req.headers['user-agent'],
    });

    console.log('Contact form submission saved:', contactMessage.id);

    res.status(200).json(
      createApiResponse(true, null, 'Message sent successfully')
    );

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json(
      createApiResponse(false, null, 'Failed to send message')
    );
  }
}