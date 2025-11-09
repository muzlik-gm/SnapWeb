// lib/screenshot.ts
import { chromium, Browser, Page } from "playwright-core";
import { deviceConfigs, validateUrl, AppError } from './utils';
import type { ScreenshotRequest } from '@/types';

async function launchBrowser(): Promise<Browser> {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  
  if (isServerless) {
    const sparticuzChromium = require("@sparticuz/chromium");
    const execPath = await sparticuzChromium.executablePath();
    return await chromium.launch({
      executablePath: execPath,
      args: sparticuzChromium.args.concat([
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--hide-scrollbars",
      ]),
      headless: true,
    });
  }
  return await chromium.launch({ headless: true });
}

async function applyStealth(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    (window as any).chrome = (window as any).chrome || { runtime: {} };
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
  });
}

// Environment helpers
function isServerlessEnv() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

// Try to disable lazy-loading so resources load without requiring intersection
async function disableLazyLoading(page: Page) {
  await page.addInitScript(() => {
    try {
      // Force eager loading on images/iframes created after this point
      const origImg = HTMLImageElement.prototype.setAttribute;
HTMLImageElement.prototype.setAttribute = function(this: any, name: string, value: string) {
        if (name === 'loading') {
          return origImg.call(this as any, name, 'eager');
        }
        return origImg.call(this as any, name, value);
      } as any;
      const origIframe = HTMLIFrameElement.prototype.setAttribute;
HTMLIFrameElement.prototype.setAttribute = function(this: any, name: string, value: string) {
        if (name === 'loading') {
          return origIframe.call(this as any, name, 'eager');
        }
        return origIframe.call(this as any, name, value);
      } as any;
    } catch {}
  });
}

// Some sites rely on IntersectionObserver to reveal content/images.
// Override to immediately mark observed elements as intersecting.
async function bypassIntersectionObserver(page: Page) {
  await page.addInitScript(() => {
    try {
      const OriginalIO = (window as any).IntersectionObserver;
      (window as any).IntersectionObserver = class FakeIO {
        _cb: any;
        constructor(cb: any) { this._cb = cb; }
        observe(target: Element) {
          const rect = (target as Element).getBoundingClientRect();
          const entry: any = {
            isIntersecting: true,
            intersectionRatio: 1,
            target,
            time: performance.now(),
            boundingClientRect: rect,
            intersectionRect: rect,
            rootBounds: rect
          };
          this._cb([entry], this);
        }
        unobserve() {}
        disconnect() {}
        takeRecords() { return []; }
      } as any;
      (window as any).IntersectionObserverEntry = (OriginalIO && (OriginalIO as any).Entry) || (window as any).IntersectionObserverEntry || function(){};
    } catch {}
  });
}

// Aggressively hydrate common lazy media attributes after navigation
async function hydrateLazyMedia(page: Page) {
  await page.evaluate(() => {
    // Images with data-src / data-srcset
    Array.from(document.querySelectorAll('img[data-src], img[data-lazy-src]') as NodeListOf<HTMLImageElement>).forEach((img) => {
      const ds = img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
      if (ds && !img.src) img.src = ds;
      const dss = img.getAttribute('data-srcset');
      if (dss && !img.srcset) img.srcset = dss;
      img.loading = 'eager';
      img.decoding = 'sync' as any;
    });
    // Next.js <Image>
    Array.from(document.querySelectorAll('img[data-nimg]') as NodeListOf<HTMLImageElement>).forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'sync' as any;
    });
    // Picture/source elements with data-srcset
    document.querySelectorAll('source[data-srcset]').forEach((s: any) => {
      if (!s.srcset) s.srcset = s.getAttribute('data-srcset');
    });
    // Iframes
    document.querySelectorAll('iframe[loading="lazy"]').forEach((f: any) => f.setAttribute('loading', 'eager'));
  });
}

async function waitForContentRendered(
  page: Page,
  opts = { textLen: 100, visibleEls: 50, timeout: 8000 }
) {
  const { textLen, visibleEls, timeout } = opts;
  await page.waitForFunction(
    ({ minText, minEls }: { minText: number; minEls: number }) => {
      const body = document.body;
      if (!body) return false;
      if ((body.innerText || "").trim().length < minText) return false;
      const visible = Array.from(document.querySelectorAll("*")).filter((el) => {
        const tag = el.tagName.toLowerCase();
        if (["script", "style", "meta", "link", "head"].includes(tag)) return false;
        const s = window.getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity || "1") === 0)
          return false;
        const r = (el as Element).getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        return true;
      });
      return visible.length >= minEls;
    },
    { minText: textLen, minEls: visibleEls },
    { timeout }
  );
}

async function waitForFontsAndImages(page: Page, imageTimeout = 5000) {
  try {
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    });
  } catch {}
  
  try {
    await page.waitForFunction(
      ({ threshold }: { threshold: number }) => {
        const imgs = Array.from(document.images || []);
        if (imgs.length === 0) return true;
        const loaded = imgs.filter((img) => img.complete && (img.naturalWidth || img.naturalHeight));
        return loaded.length >= Math.ceil(imgs.length * threshold);
      },
      { threshold: 0.8 },
      { timeout: imageTimeout }
    );
  } catch {
    // tolerate some failure
  }
}

async function autoScroll(page: Page, stepMs = 200) {
  // Fast banded scroll to trigger most IntersectionObserver lazy-loaders within tight budget
  await page.evaluate(async ({ ms }: { ms: number }) => {
    const sleep = (t: number) => new Promise((r) => setTimeout(r, t));
    const doc = document.documentElement;
    const totalH = Math.max(doc.scrollHeight, document.body.scrollHeight);
    const positions: number[] = [];
    for (let p = 0.1; p <= 1.0; p += 0.1) positions.push(parseFloat(p.toFixed(2)));
    positions.push(0.97, 1);
    // Jump between bands quickly
    for (const p of positions) {
      const y = Math.min(totalH - window.innerHeight, Math.floor(totalH * p));
      window.scrollTo(0, Math.max(0, y));
      window.dispatchEvent(new Event('scroll'));
      await sleep(ms);
    }
    // Return to top for consistent screenshots
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('scroll'));
    await sleep(200);
  }, { ms: stepMs });
}

export interface ScreenshotOptions extends ScreenshotRequest {
  timeout?: number;
  delay?: number;
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

export async function generateScreenshot(options: ScreenshotOptions): Promise<ScreenshotResult> {
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
  const quality = options.quality || (format === 'jpeg' ? 80 : undefined);
  const timeout = options.timeout || 30000;

  // Hard runtime budget: keep well under typical serverless limit
  const serverless = isServerlessEnv();
  const maxRuntime = serverless ? Math.min(timeout, 28000) : timeout;
  const startTs = Date.now();
  const timeLeft = () => Math.max(0, maxRuntime - (Date.now() - startTs));
  const wait = async (ms: number) => { await page.waitForTimeout(Math.max(0, Math.min(ms, timeLeft()))); };

  // Get device configuration
  const deviceConfig = deviceConfigs[device];
  if (!deviceConfig) {
    throw new AppError('Invalid device type', 400, 'INVALID_DEVICE');
  }

  const browser = await launchBrowser();
  
  const width = deviceConfig.width;
  const height = deviceConfig.height;
  // Respect user delay but cap it to fit in remaining budget
  const requestedDelay = options.delay ?? 2000;
  const delayCap = serverless ? 2000 : 10000;
  const delay = Math.max(0, Math.min(requestedDelay, delayCap));

  const context = await browser.newContext({
    viewport: { width, height },
    userAgent: deviceConfig.userAgent ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  });

  const page = await context.newPage();

  try {
    await applyStealth(page);
    await disableLazyLoading(page);
    await bypassIntersectionObserver(page);

    console.log(`[Screenshot] Navigating to: ${sanitizedUrl}`);
    await page.goto(sanitizedUrl, { waitUntil: "domcontentloaded", timeout: Math.min(timeout, timeLeft()) });

    // Proactively convert existing lazy assets to eager
    await page.evaluate(() => {
      // Images
      document.querySelectorAll('img[loading="lazy"]').forEach((img: any) => img.setAttribute('loading', 'eager'));
    });
    await hydrateLazyMedia(page);

    console.log(`[Screenshot] Waiting for content to render...`);
    
    // Optional: wait for a specific selector if provided
    if (options && (options as any).waitForSelector) {
      try {
        const selTimeout = Math.min(6000, Math.max(1000, timeLeft() - 20000));
        await page.waitForSelector((options as any).waitForSelector, { state: 'visible', timeout: selTimeout });
        console.log(`[Screenshot] waitForSelector satisfied`);
      } catch {
        console.log(`[Screenshot] waitForSelector timeout`);
      }
    }

    // First wait for basic content
    try {
      const renderTimeout = Math.min(8000, Math.max(1000, timeLeft() - 18000));
      await waitForContentRendered(page, { textLen: 100, visibleEls: 50, timeout: renderTimeout });
      console.log(`[Screenshot] Basic content rendered`);
    } catch (e) {
      console.log(`[Screenshot] Basic content wait timeout`);
    }

    // Wait for network to be truly idle (all API calls done)
    console.log(`[Screenshot] Waiting for network idle...`);
    try {
      const netIdleTimeout = Math.min(5000, Math.max(1000, timeLeft() - 16000));
      await page.waitForLoadState('networkidle', { timeout: netIdleTimeout });
      console.log(`[Screenshot] Network idle reached`);
    } catch {
      console.log(`[Screenshot] Network idle timeout`);
    }

    // Additional wait for content to populate from API responses
    console.log(`[Screenshot] Waiting for dynamic content...`);
    // Respect caller-provided extra timeout as well
    if ((options as any)?.waitForTimeout) {
      await wait(Math.min(3000, (options as any).waitForTimeout));
    }
    await wait(1500);

    // Log what we actually have
    const contentCheck = await page.evaluate(() => {
      const text = document.body?.innerText || '';
      const allEls = document.querySelectorAll('*').length;
      const visibleEls = Array.from(document.querySelectorAll('*')).filter((el) => {
        const tag = el.tagName.toLowerCase();
        if (["script", "style", "meta", "link", "head"].includes(tag)) return false;
        const s = window.getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).length;
      
      // Count actual content elements
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
      const paragraphs = document.querySelectorAll('p').length;
      const images = document.images.length;
      
      return { textLen: text.length, allEls, visibleEls, headings, paragraphs, images };
    });
    console.log(`[Screenshot] Content check:`, contentCheck);

    console.log(`[Screenshot] Waiting for fonts and images...`);
    await waitForFontsAndImages(page, Math.min(4000, Math.max(1000, timeLeft() - 14000)));
    
    // Extra wait to ensure fonts are actually rendered
    await page.waitForTimeout(1000);

    // Wait for specific content indicators (headings, paragraphs beyond hero)
    console.log(`[Screenshot] Checking for full page content...`);
    try {
      await page.waitForFunction(
        () => {
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
          const paragraphs = document.querySelectorAll('p').length;
          const sections = document.querySelectorAll('section, article, div[class*="section"]').length;
          return headings >= 3 && paragraphs >= 5 && sections >= 2;
        },
        { timeout: Math.min(5000, Math.max(1000, timeLeft() - 12000)) }
      );
      console.log(`[Screenshot] Full page content detected`);
    } catch {
      console.log(`[Screenshot] Full page content wait timeout - capturing anyway`);
    }

    console.log(`[Screenshot] Waiting ${delay}ms buffer...`);
    await wait(delay);

    if (fullPage) {
      console.log(`[Screenshot] Scrolling for lazy-loaded content...`);
      // Fast banded scroll (tight budget)
      await autoScroll(page, 150);
      // Brief settle for resources
      const settleTimeout = Math.min(2500, Math.max(500, timeLeft() - 6000));
      await page.waitForLoadState('networkidle', { timeout: settleTimeout }).catch(() => {});
      await waitForFontsAndImages(page, Math.min(3000, Math.max(800, timeLeft() - 5000)));
    }

    // Final check: ensure content is actually visible (not hidden by CSS)
    const finalCheck = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const allText = body.innerText;
      
      // Check for common issues
      const issues = [];
      if (computedStyle.opacity === '0') issues.push('body-opacity-0');
      if (computedStyle.visibility === 'hidden') issues.push('body-hidden');
      if (computedStyle.display === 'none') issues.push('body-display-none');
      
      // Check if main content areas are visible
      const mainContent = document.querySelector('main, [role="main"], #main, .main');
      if (mainContent) {
        const mainStyle = window.getComputedStyle(mainContent);
        if (mainStyle.opacity === '0') issues.push('main-opacity-0');
        if (mainStyle.visibility === 'hidden') issues.push('main-hidden');
      }
      
      return {
        bodyOpacity: computedStyle.opacity,
        bodyVisibility: computedStyle.visibility,
        textLength: allText.length,
        issues: issues.length > 0 ? issues : null
      };
    });
    console.log(`[Screenshot] Final visibility check:`, finalCheck);

    // If there are visibility issues, wait a bit more
    if (finalCheck.issues) {
      console.log(`[Screenshot] Visibility issues detected, waiting 3s more...`);
      await page.waitForTimeout(3000);
    }

    // One final wait to ensure everything is painted
    await wait(400);
    
    console.log(`[Screenshot] Taking screenshot...`);
    const screenshot = await page.screenshot({
      type: format as 'png' | 'jpeg',
      fullPage: Boolean(fullPage),
      quality: format !== "png" && quality ? quality : undefined,
      animations: 'disabled',
    });

    const buffer = Buffer.from(screenshot);
    const captureTime = Date.now() - startTime;

    console.log(`[Screenshot] Complete in ${captureTime}ms, size: ${buffer.length} bytes`);

    // Get dimensions
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };
    });

    await context.close();
    await browser.close();

    return {
      buffer,
      metadata: {
        width: fullPage ? dimensions.width : deviceConfig.width,
        height: fullPage ? dimensions.height : deviceConfig.height,
        fileSize: buffer.length,
        format,
        captureTime,
        deviceType: device,
      },
    };
  } catch (error) {
    console.error('[Screenshot] Error:', error);
    try {
      await context.close();
    } catch {}
    await browser.close();

    if (error instanceof Error) {
      if (error.message.includes('Timeout') || error.message.includes('timeout')) {
        throw new AppError('Screenshot generation timed out. The website may be slow or unresponsive.', 408, 'TIMEOUT');
      }
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new AppError('Website not found. Please check the URL and try again.', 404, 'SITE_NOT_FOUND');
      }
      if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        throw new AppError('Connection refused. The website may be down or blocking our service.', 503, 'CONNECTION_REFUSED');
      }
      if (error.message.includes('net::ERR_EMPTY_RESPONSE')) {
        throw new AppError('The website returned an empty response. It may be misconfigured or down.', 502, 'EMPTY_RESPONSE');
      }
      if (error.message.includes('SSL') || error.message.includes('certificate')) {
        throw new AppError('The website has an invalid SSL certificate. We cannot securely connect.', 495, 'SSL_ERROR');
      }
    }

    throw new AppError('Failed to generate screenshot due to an unexpected error.', 500, 'SCREENSHOT_FAILED');
  }
}

export function getSupportedFormats(): string[] {
  return ['png', 'jpeg', 'webp'];
}

export function getSupportedDevices(): string[] {
  return Object.keys(deviceConfigs);
}

export async function healthCheck(): Promise<boolean> {
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('about:blank');
    await page.close();
    await browser.close();
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
