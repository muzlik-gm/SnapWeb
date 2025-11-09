import { Browser, Page } from 'puppeteer-core';
import { deviceConfigs, validateUrl, AppError } from './utils';
import type { ScreenshotRequest, DeviceConfig } from '@/types';

export interface ScreenshotOptions extends ScreenshotRequest {
  timeout?: number;
}

export interface ScreenshotResult {
  buffer: Buffer;
  metadata: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
    captureTime: number;
    deviceType: string;
  };
}

// Ultra-lightweight screenshot function optimized for Vercel Hobby plan
export async function generateScreenshotLight(options: ScreenshotOptions): Promise<ScreenshotResult> {
  const startTime = Date.now();
  
  // Validate URL
  const urlValidation = validateUrl(options.url);
  if (!urlValidation.isValid) {
    throw new AppError(urlValidation.error || 'Invalid URL', 400, 'INVALID_URL');
  }

  const sanitizedUrl = urlValidation.sanitizedUrl!;
  const device = options.device || 'desktop';
  const format = options.format || 'png';
  const fullPage = options.fullPage ?? false;
  const quality = options.quality || (format === 'jpeg' ? 60 : undefined); // Lower quality for memory
  const timeout = options.timeout || 15000; // Shorter timeout

  // Get device configuration
  const deviceConfig = deviceConfigs[device];
  if (!deviceConfig) {
    throw new AppError('Invalid device type', 400, 'INVALID_DEVICE');
  }

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Launch browser - use serverless Chromium on Vercel, regular Puppeteer locally
    const isProduction = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    if (isProduction) {
      // Use serverless Chromium for Vercel/Lambda
      const chromium = require('@sparticuz/chromium');
      const puppeteerCore = require('puppeteer-core');
      
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // Use regular Puppeteer for local development
      const puppeteer = require('puppeteer');
      
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });
    }

    if (!browser) {
      throw new AppError('Failed to launch browser', 500, 'BROWSER_LAUNCH_FAILED');
    }

    page = await browser.newPage();

    // Set minimal viewport
    await page.setViewport({
      width: Math.min(deviceConfig.width, 1280), // Cap width to reduce memory
      height: Math.min(deviceConfig.height, 720), // Cap height to reduce memory
      deviceScaleFactor: 1, // Force scale factor to 1 to reduce memory
      isMobile: deviceConfig.isMobile,
      hasTouch: deviceConfig.hasTouch,
    });

    await page.setUserAgent(deviceConfig.userAgent);

    // Set aggressive timeout
    page.setDefaultTimeout(timeout);
    page.setDefaultNavigationTimeout(timeout);

    // Block all non-essential resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      const url = request.url();
      
      // Only allow essential resources
      if (resourceType === 'document' || resourceType === 'stylesheet' || 
          (resourceType === 'image' && url.includes(sanitizedUrl))) {
        request.continue();
      } else {
        request.abort();
      }
    });

    // Navigate with minimal wait
    await page.goto(sanitizedUrl, {
      waitUntil: 'domcontentloaded', // Don't wait for all resources
      timeout,
    });

    // Minimal wait for content
    await new Promise(resolve => setTimeout(resolve, 500));

    // Take screenshot with minimal options
    const screenshotOptions: any = {
      type: format,
      fullPage: false, // Force viewport screenshot to reduce memory
    };

    if (format === 'jpeg' && quality) {
      screenshotOptions.quality = quality;
    }

    // Always use clip to control memory usage
    screenshotOptions.clip = {
      x: 0,
      y: 0,
      width: Math.min(deviceConfig.width, 1280),
      height: Math.min(deviceConfig.height, 720),
    };

    const screenshotBuffer = await page.screenshot(screenshotOptions);
    const buffer = Buffer.isBuffer(screenshotBuffer) ? screenshotBuffer : Buffer.from(screenshotBuffer as string);
    const captureTime = Date.now() - startTime;

    return {
      buffer,
      metadata: {
        width: Math.min(deviceConfig.width, 1280),
        height: Math.min(deviceConfig.height, 720),
        fileSize: buffer.length,
        format,
        captureTime,
        deviceType: device,
      },
    };
  } catch (error) {
    console.error('Screenshot generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new AppError('Screenshot generation timed out', 408, 'TIMEOUT');
      }
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new AppError('Website not found or unreachable', 404, 'SITE_NOT_FOUND');
      }
      if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        throw new AppError('Connection refused by target website', 503, 'CONNECTION_REFUSED');
      }
    }
    
    throw new AppError('Failed to generate screenshot', 500, 'SCREENSHOT_FAILED');
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('Error closing page:', e);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
}