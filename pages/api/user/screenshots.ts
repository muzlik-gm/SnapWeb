import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserScreenshots, deleteScreenshot, updateScreenshotDownloads } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  search: z.string().optional(),
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
    return handleGetScreenshots(req, res, session.user.id);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleGetScreenshots(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { page, limit, search } = querySchema.parse(req.query);
    
    // For now, get all screenshots (pagination can be added later)
    const screenshots = await getUserScreenshots(userId, limit * page);
    
    // Filter by search if provided
    let filteredScreenshots = screenshots;
    if (search) {
      filteredScreenshots = screenshots.filter(screenshot => 
        screenshot.original_url.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedScreenshots = filteredScreenshots.slice(startIndex, endIndex);

    res.status(200).json(
      createApiResponse(true, {
        screenshots: paginatedScreenshots,
        pagination: {
          page,
          limit,
          total: filteredScreenshots.length,
          totalPages: Math.ceil(filteredScreenshots.length / limit),
        },
      })
    );
  } catch (error) {
    console.error('Get screenshots error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}