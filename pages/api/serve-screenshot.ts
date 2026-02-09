import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

import { securityMiddleware, corsMiddleware } from '@/lib/security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apply security and CORS middleware
  await corsMiddleware(req, res);
  const securityResult = await securityMiddleware(req, res);
  if (!securityResult) return; // Stop if security check fails
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.query;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' });
  }

  // Security: prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  try {
    // Consistent with screenshot generation path logic
    const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const screenshotsDir = isVercel ? '/tmp/screenshots' : path.join(process.cwd(), 'public', 'screenshots');
    const filepath = path.join(screenshotsDir, filename);
    
    // Check if file exists
    await fs.access(filepath);
    
    // Read the file
    const fileBuffer = await fs.readFile(filepath);
    
    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    // Send the file
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error serving screenshot:', error);
    // Return plain text error instead of JSON to avoid "JSON download" bug
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Screenshot not found. It may have expired or was stored on a different server instance.');
  }
}
