import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';
import { z } from 'zod';

const querySchema = z.object({
  days: z.string().optional().transform(val => val ? parseInt(val) : 30),
  endpoint: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json(createApiResponse(false, null, 'Unauthorized'));
  }

  if (req.method === 'GET') {
    return handleGetApiUsage(req, res, session.user.id);
  } else {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }
}

async function handleGetApiUsage(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { days, endpoint } = querySchema.parse(req.query);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query using MongoDB
    const db = await getDatabase();
    const apiUsageCollection = db.collection('api_usage');
    
    const filter: any = {
      user_id: userId,
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (endpoint) {
      filter.endpoint = endpoint;
    }

    const usage = await apiUsageCollection
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    // Calculate statistics
    const totalRequests = usage?.length || 0;
    const successfulRequests = usage?.filter(u => u.status_code >= 200 && u.status_code < 300).length || 0;
    const errorRequests = usage?.filter(u => u.status_code >= 400).length || 0;
    const avgResponseTime = usage?.length 
      ? usage.reduce((sum, u) => sum + (u.response_time || 0), 0) / usage.length 
      : 0;

    // Group by endpoint
    const endpointStats: Record<string, any> = {};
    usage?.forEach(u => {
      if (!endpointStats[u.endpoint]) {
        endpointStats[u.endpoint] = {
          endpoint: u.endpoint,
          requests: 0,
          errors: 0,
          avgResponseTime: 0,
        };
      }
      endpointStats[u.endpoint].requests++;
      if (u.status_code >= 400) {
        endpointStats[u.endpoint].errors++;
      }
    });

    // Calculate average response times for each endpoint
    Object.keys(endpointStats).forEach(ep => {
      const endpointUsage = usage?.filter(u => u.endpoint === ep) || [];
      endpointStats[ep].avgResponseTime = endpointUsage.length
        ? endpointUsage.reduce((sum, u) => sum + (u.response_time || 0), 0) / endpointUsage.length
        : 0;
    });

    // Group by day for chart data
    const dailyStats: Record<string, number> = {};
    usage?.forEach(u => {
      const date = new Date(u.created_at).toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    res.status(200).json(
      createApiResponse(true, {
        summary: {
          totalRequests,
          successfulRequests,
          errorRequests,
          successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
          avgResponseTime: Math.round(avgResponseTime),
        },
        endpointStats: Object.values(endpointStats),
        dailyStats,
        recentRequests: usage?.slice(0, 50) || [],
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days,
        },
      })
    );
  } catch (error) {
    console.error('Get API usage error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, error.issues[0].message)
      );
    }

    res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}