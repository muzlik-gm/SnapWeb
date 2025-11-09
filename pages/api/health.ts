import { NextApiRequest, NextApiResponse } from 'next';
import { healthCheck } from '@/lib/screenshot';
import { getUsersCollection } from '@/lib/mongodb';
import { createApiResponse } from '@/lib/utils';

import { corsMiddleware } from '@/lib/security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  corsMiddleware(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  const startTime = Date.now();

  try {
    // Check database connection using MongoDB
    let dbHealthy = false;
    try {
      const usersCollection = await getUsersCollection();
      await usersCollection.findOne({}, { projection: { _id: 1 } });
      dbHealthy = true;
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      dbHealthy = false;
    }

    // Check screenshot service
    const screenshotHealthy = await healthCheck();

    // Calculate response time
    const responseTime = Date.now() - startTime;

    const isHealthy = dbHealthy && screenshotHealthy;

    const healthData = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        screenshot: screenshotHealthy ? 'healthy' : 'unhealthy',
      },
      responseTime,
      version: '1.0.0',
    };

    res.status(isHealthy ? 200 : 503).json(
      createApiResponse(isHealthy, healthData)
    );
  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(503).json(
      createApiResponse(false, {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        responseTime: Date.now() - startTime,
      })
    );
  }
}