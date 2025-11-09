export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  userId?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  
  private constructor() {}
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  async log(entry: LogEntry): Promise<void> {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level: entry.level,
      message: entry.message,
      context: entry.context || {},
      user_id: entry.userId,
      ip_address: entry.ip,
      user_agent: entry.userAgent,
      endpoint: entry.endpoint,
      method: entry.method,
      status_code: entry.statusCode,
      response_time_ms: entry.responseTime,
      error_message: entry.error?.message,
      error_stack: entry.error?.stack,
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, entry.context || '');
      if (entry.error) {
        console.error('Error:', entry.error);
      }
    }
    
    // Log to MongoDB for production monitoring
    try {
      const { getLogsCollection } = await import('./mongodb');
      const logs = await getLogsCollection();
      await logs.insertOne(logData);
    } catch (error) {
      console.error('Failed to log to database:', error);
    }
  }
  
  async info(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'info', message, context });
  }
  
  async warn(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'warn', message, context });
  }
  
  async error(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    await this.log({ level: 'error', message, error, context });
  }
  
  async debug(message: string, context?: Record<string, any>): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      await this.log({ level: 'debug', message, context });
    }
  }
}

export const logger = Logger.getInstance();

// Security event logging
export async function logSecurityEvent(
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: Record<string, any>
): Promise<void> {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    severity,
    details,
  };
  
  try {
    const { getSecurityEventsCollection } = await import('./mongodb');
    const securityEvents = await getSecurityEventsCollection();
    await securityEvents.insertOne(logData);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
  
  // Alert on high/critical events
  if (severity === 'high' || severity === 'critical') {
    await logger.warn(`Security Alert: ${event}`, details);
  }
}

// Performance monitoring
export async function logPerformanceMetric(
  metric: string,
  value: number,
  unit: string,
  tags?: Record<string, string>
): Promise<void> {
  const metricData = {
    timestamp: new Date().toISOString(),
    metric,
    value,
    unit,
    tags: tags || {},
  };
  
  try {
    const { getPerformanceMetricsCollection } = await import('./mongodb');
    const metrics = await getPerformanceMetricsCollection();
    await metrics.insertOne(metricData);
  } catch (error) {
    console.error('Failed to log performance metric:', error);
  }
}

// Error tracking
export async function trackError(
  error: Error,
  context?: Record<string, any>
): Promise<void> {
  await logger.error(error.message, error, context);
  
  // Log to error tracking service if available
  if (process.env.SENTRY_DSN) {
    try {
      const Sentry = require('@sentry/nextjs');
      Sentry.captureException(error, { extra: context });
    } catch (sentryError) {
      console.error('Failed to send to Sentry:', sentryError);
    }
  }
}

// Usage analytics
export async function logUsageEvent(
  event: string,
  userId?: string,
  properties?: Record<string, any>
): Promise<void> {
  const usageData = {
    timestamp: new Date().toISOString(),
    event,
    user_id: userId,
    properties: properties || {},
  };
  
  try {
    const { getUsageEventsCollection } = await import('./mongodb');
    const usageEvents = await getUsageEventsCollection();
    await usageEvents.insertOne(usageData);
  } catch (error) {
    console.error('Failed to log usage event:', error);
  }
}