import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';
import { authOptions } from '@/lib/auth';
import { getScreenshotById, deleteScreenshot, updateScreenshotDownloads } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';

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

  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json(createApiResponse(false, null, 'Invalid screenshot ID'));
  }

  if (req.method === 'GET') {
    return handleGetScreenshot(req, res, id, session.user.id);
  } else if (req.method === 'DELETE') {
    return handleDeleteScreenshot(req, res, id, session.user.id);
  } else if (req.method === 'POST' && req.query.action === 'download') {
    return handleDownloadScreenshot(req, res, id, session.user.id);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleGetScreenshot(
  req: NextApiRequest,
  res: NextApiResponse,
  screenshotId: string,
  userId: string
) {
  try {
    const screenshot = await getScreenshotById(screenshotId);
    
    if (!screenshot) {
      return res.status(404).json(createApiResponse(false, null, 'Screenshot not found'));
    }

    // Check if user owns the screenshot or if it's public
    if (screenshot.user_id !== userId && !screenshot.is_public) {
      return res.status(403).json(createApiResponse(false, null, 'Access denied'));
    }

    res.status(200).json(createApiResponse(true, screenshot));
  } catch (error) {
    console.error('Get screenshot error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}

async function handleDeleteScreenshot(
  req: NextApiRequest,
  res: NextApiResponse,
  screenshotId: string,
  userId: string
) {
  try {
    const screenshot = await getScreenshotById(screenshotId);
    
    if (!screenshot) {
      return res.status(404).json(createApiResponse(false, null, 'Screenshot not found'));
    }

    // Check if user owns the screenshot
    if (screenshot.user_id !== userId) {
      return res.status(403).json(createApiResponse(false, null, 'Access denied'));
    }

    // Delete file from filesystem
    try {
      const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
      const screenshotsDir = isVercel ? '/tmp/screenshots' : path.join(process.cwd(), 'public', 'screenshots');
      const filepath = path.join(screenshotsDir, screenshot.filename);
      await fs.unlink(filepath);
    } catch (fileError) {
      console.error('File deletion error:', fileError);
      // Continue even if file deletion fails
    }

    // Delete from database
    await deleteScreenshot(screenshotId, userId);

    res.status(200).json(
      createApiResponse(true, null, 'Screenshot deleted successfully')
    );
  } catch (error) {
    console.error('Delete screenshot error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}

async function handleDownloadScreenshot(
  req: NextApiRequest,
  res: NextApiResponse,
  screenshotId: string,
  userId: string
) {
  try {
    const screenshot = await getScreenshotById(screenshotId);
    
    if (!screenshot) {
      return res.status(404).json(createApiResponse(false, null, 'Screenshot not found'));
    }

    // Check if user owns the screenshot or if it's public
    if (screenshot.user_id !== userId && !screenshot.is_public) {
      return res.status(403).json(createApiResponse(false, null, 'Access denied'));
    }

    // Update download count
    await updateScreenshotDownloads(screenshotId);

    res.status(200).json(
      createApiResponse(true, { downloadUrl: screenshot.url }, 'Download tracked')
    );
  } catch (error) {
    console.error('Download screenshot error:', error);
    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}