# Screenshot Generation - Complete Technical Guide

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Detailed Code Explanation](#detailed-code-explanation)
5. [Wait Strategies](#wait-strategies)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Performance Optimization](#performance-optimization)
8. [Debugging Guide](#debugging-guide)

---

## Overview

This system captures screenshots of websites using Playwright (a browser automation tool). The main challenge is waiting for modern JavaScript frameworks (React, Next.js, Vue, etc.) to fully render before taking the screenshot.

### The Core Problem

Modern websites don't render all content immediately. They:
1. Load HTML (fast)
2. Load JavaScript bundles (medium)
3. Execute JavaScript to render content (slow)
4. Load images and fonts (varies)
5. Lazy-load content on scroll (very slow)

Our screenshot tool must wait for steps 3-5 to complete.

---

## Technology Stack

### Primary Tools
- **Playwright Core** (`playwright-core`): Browser automation library by Microsoft
- **@sparticuz/chromium**: Serverless-optimized Chromium binary for Vercel/AWS Lambda
- **Next.js API Routes**: Backend endpoint handling
- **TypeScript**: Type-safe code

### Why Playwright Over Puppeteer?
1. **Better auto-waiting**: Playwright has smarter built-in waits
2. **Modern framework support**: Better handling of React/Vue/Angular
3. **Active maintenance**: Microsoft actively develops it
4. **Better APIs**: More intuitive and powerful APIs

---

## Architecture

```
User Request
    ↓
Frontend (pages/index.tsx, etc.)
    ↓
API Route (pages/api/screenshot.ts)
    ↓
Screenshot Library (lib/screenshot.ts)
    ↓
Playwright Browser
    ↓
Screenshot Buffer
    ↓
Response to User
```

### File Structure
```
lib/screenshot.ts              # Core screenshot generation logic
pages/api/screenshot.ts        # API endpoint (handles auth, rate limiting, etc.)
pages/index.tsx                # Main frontend form
pages/screenshot-generator.tsx # Alternative frontend
pages/website-screenshot.tsx   # Another frontend variant
lib/utils.ts                   # Device configs, URL validation
types/index.ts                 # TypeScript type definitions
```

---

## Detailed Code Explanation

### 1. Browser Initialization

```typescript
async function createBrowser(): Promise<Browser> {
  const isProduction = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (isProduction) {
    const sparticuzChromium = require('@sparticuz/chromium');
    return await chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  } else {
    return await chromium.launch({
      headless: true,
    });
  }
}
```

**What it does:**
- Detects if running on Vercel/Lambda (serverless)
- In production: Uses `@sparticuz/chromium` (optimized for serverless)
- Locally: Uses system Chromium
- Always runs headless (no visible browser window)

**Why this matters:**
- Serverless environments don't have Chrome installed
- `@sparticuz/chromium` provides a compatible binary
- Different args needed for serverless vs local

### 2. Page Navigation

```typescript
await page.goto(sanitizedUrl, {
  waitUntil: 'domcontentloaded',
  timeout,
});
```

**Wait options explained:**
- `domcontentloaded`: HTML parsed, DOM ready (FAST - ~1-2s)
- `load`: All resources loaded including images/CSS (MEDIUM - ~3-5s)
- `networkidle`: No network activity for 500ms (SLOW - ~5-10s)

**We use `domcontentloaded` because:**
- Fastest option
- Enough for JavaScript to start executing
- We handle remaining waits manually (more control)

### 3. Content Detection Wait

```typescript
await page.waitForFunction(
  () => {
    const body = document.body;
    if (!body) return false;
    
    // Check for text content
    const text = body.innerText || '';
    const hasText = text.trim().length > 100;
    
    // Check for rendered elements (not just scripts/styles)
    const visibleElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const tag = el.tagName.toLowerCase();
      if (['script', 'style', 'meta', 'link', 'head'].includes(tag)) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    return hasText && visibleElements.length > 50;
  },
  { timeout: 8000 }
);
```

**What this does:**
1. Runs JavaScript IN the browser page
2. Checks if body has >100 characters of text
3. Counts visible elements (excludes hidden/script/style tags)
4. Returns true when: text exists AND >50 visible elements
5. Waits up to 8 seconds for this condition

**Why this is critical:**
- React/Next.js apps start with minimal HTML
- JavaScript hydration adds the real content
- This wait ensures content is actually rendered
- Without this, screenshots are blank/partial

### 4. Image Loading Wait

```typescript
await page.waitForFunction(
  () => {
    const images = Array.from(document.images);
    if (images.length === 0) return true;
    const loaded = images.filter(img => img.complete && img.naturalHeight > 0);
    return loaded.length >= images.length * 0.8; // 80% of images loaded
  },
  { timeout: 5000 }
);
```

**What this does:**
1. Gets all `<img>` elements
2. Checks which are fully loaded (`complete` && `naturalHeight > 0`)
3. Waits until 80% of images are loaded
4. Times out after 5 seconds

**Why 80% not 100%:**
- Some images may fail to load (404, slow CDN)
- Waiting for 100% could cause unnecessary delays
- 80% is usually enough for a good screenshot

### 5. Custom Delay (User-Controlled)

```typescript
const requestedDelay = options.delay !== undefined ? options.delay : 2000;
const customDelay = Math.min(requestedDelay, 5000);
if (customDelay > 0) {
  await page.waitForTimeout(customDelay);
}
```

**What this does:**
- User can request a delay (1-5 seconds)
- Default is 2 seconds
- Capped at 5 seconds to avoid timeout
- Simple wait for additional rendering time

**Why this is needed:**
- Some sites have animations/transitions
- JavaScript frameworks may do multiple render passes
- Gives time for any remaining async operations

### 6. Full Page Scrolling

```typescript
if (fullPage) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let scrolled = 0;
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      const scrollStep = () => {
        if (scrolled < scrollHeight) {
          window.scrollTo(0, scrolled);
          scrolled += viewportHeight / 2; // Scroll half viewport at a time
          setTimeout(scrollStep, 200); // Wait 200ms between scrolls
        } else {
          window.scrollTo(0, 0); // Back to top
          setTimeout(() => resolve(), 500);
        }
      };
      
      scrollStep();
    });
  });
  
  await page.waitForTimeout(1000);
}
```

**What this does:**
1. Calculates total page height
2. Scrolls in increments of half the viewport height
3. Waits 200ms between each scroll
4. Scrolls back to top when done
5. Waits 1 more second for lazy-loaded content

**Why scroll slowly:**
- `IntersectionObserver` (lazy loading) needs time to detect elements
- Fast scrolling misses lazy-loaded images/content
- 200ms per step is slow enough to trigger observers
- Scrolling back to top ensures screenshot starts from top

### 7. Taking the Screenshot

```typescript
const screenshot = await page.screenshot({
  type: format as 'png' | 'jpeg',
  quality: format === 'jpeg' ? quality : undefined,
  fullPage: fullPage,
});
const buffer = Buffer.from(screenshot);
```

**Options:**
- `type`: 'png' (lossless, larger) or 'jpeg' (lossy, smaller)
- `quality`: 1-100 for JPEG (default 80)
- `fullPage`: true = entire page, false = viewport only

**Output:**
- Returns a Buffer (binary data)
- Can be saved to file or sent as response
- Typical size: 100KB-2MB depending on page

---

## Wait Strategies

### Strategy 1: DOM Content Loaded
```typescript
waitUntil: 'domcontentloaded'
```
- **Speed**: ⚡⚡⚡ Fast (1-2s)
- **Reliability**: ⭐⭐ Low (content may not be rendered)
- **Use case**: Static HTML sites

### Strategy 2: Load Event
```typescript
waitUntil: 'load'
```
- **Speed**: ⚡⚡ Medium (3-5s)
- **Reliability**: ⭐⭐⭐ Medium (images/CSS loaded, but JS may not be done)
- **Use case**: Traditional server-rendered sites

### Strategy 3: Network Idle
```typescript
waitUntil: 'networkidle'
```
- **Speed**: ⚡ Slow (5-10s)
- **Reliability**: ⭐⭐⭐⭐ High (most content loaded)
- **Use case**: Heavy AJAX sites

### Strategy 4: Content Detection (OUR APPROACH)
```typescript
waitForFunction(() => hasText && visibleElements > 50)
```
- **Speed**: ⚡⚡ Medium (2-8s)
- **Reliability**: ⭐⭐⭐⭐⭐ Very High (actual content verified)
- **Use case**: Modern JS frameworks (React, Vue, Next.js)

### Combined Strategy (What We Use)
1. `domcontentloaded` (fast initial load)
2. Content detection (wait for actual rendering)
3. Image loading (wait for visuals)
4. Custom delay (buffer for animations)
5. Scroll (trigger lazy loading)

**Total time**: 5-15 seconds typically
**Success rate**: ~95% with full content

---

## Common Issues & Solutions

### Issue 1: Blank Screenshots
**Symptom**: Screenshot is completely white/blank

**Causes:**
1. Page hasn't rendered yet
2. JavaScript error preventing render
3. Site blocks headless browsers

**Solutions:**
1. Increase delay to 5 seconds
2. Check browser console for errors
3. Add anti-detection measures

### Issue 2: Partial Content
**Symptom**: Header loads but body is missing

**Causes:**
1. Content loads after initial render
2. Lazy loading not triggered
3. API calls not completed

**Solutions:**
1. Increase content detection timeout
2. Enable full page mode (triggers scroll)
3. Add longer custom delay

### Issue 3: Missing Images
**Symptom**: Layout correct but images are blank

**Causes:**
1. Images lazy-loaded
2. Images load slowly
3. CDN issues

**Solutions:**
1. Enable full page mode
2. Increase image wait timeout
3. Check if images load in real browser

### Issue 4: Timeout (30 seconds)
**Symptom**: "Task timed out after 30 seconds"

**Causes:**
1. Total wait time exceeds 30s
2. Site is very slow
3. Network issues

**Solutions:**
1. Reduce custom delay (max 5s)
2. Reduce timeouts in wait functions
3. Skip full page mode for slow sites

---

## Performance Optimization

### Current Timing Breakdown
```
Navigation (domcontentloaded):  1-2s
Content detection wait:         2-8s
Image loading wait:             1-5s
Custom delay:                   2-5s (user controlled)
Full page scroll:               1-2s (if enabled)
Screenshot capture:             1-2s
Background operations:          2-4s (async, doesn't block)
-------------------------------------------
Total:                          10-24s
```

### Optimization Techniques

**1. Parallel Operations**
- Don't wait for DB save before returning response
- File save, DB save, logging all happen async

**2. Timeout Tuning**
- Content detection: 8s max
- Image loading: 5s max
- Custom delay: 5s max (capped)
- Total stays under 25s to avoid Vercel timeout

**3. Smart Scrolling**
- Only scroll if full page requested
- Scroll in viewport-sized chunks
- 200ms between scrolls (balance speed vs lazy-load detection)

**4. Early Bailout**
- If content detected early, don't wait full timeout
- If 80% images loaded, continue (don't wait for 100%)

---

## Debugging Guide

### Enable Verbose Logging

All console.log statements are visible in Vercel logs:

```typescript
console.log(`[Screenshot] Navigating to: ${url}`);
console.log(`[Screenshot] Content detected`);
console.log(`[Screenshot] Final content:`, contentInfo);
```

### Check Vercel Logs

1. Go to Vercel dashboard
2. Click on deployment
3. Click "Functions" tab
4. Find `/api/screenshot` function
5. View real-time logs

### Key Metrics to Monitor

```typescript
{
  textLength: 4314,      // Should be >100 for content
  images: 12,            // Number of images found
  allElements: 822,      // Total DOM elements
  visibleElements: 650   // Elements actually visible
}
```

**Good values:**
- textLength > 500
- visibleElements > 100
- images > 0 (if site has images)

**Bad values:**
- textLength < 100 (no content)
- visibleElements < 50 (minimal render)
- allElements < 100 (page didn't load)

### Testing Locally

```bash
# Run dev server
npm run dev

# Test screenshot endpoint
curl -X POST http://localhost:3000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","device":"desktop","format":"png","delay":2000}'
```

### Common Error Messages

**"Timeout 8000ms exceeded"**
- Content detection failed
- Site is very slow or broken
- Try increasing timeout or checking site manually

**"net::ERR_NAME_NOT_RESOLVED"**
- Invalid URL
- DNS issue
- Site doesn't exist

**"Task timed out after 30 seconds"**
- Total execution time too long
- Reduce delays and timeouts
- Check if site is extremely slow

---

## API Endpoint Details

### Request Format

```typescript
POST /api/screenshot

{
  "url": "https://example.com",
  "device": "desktop" | "tablet" | "mobile",
  "format": "png" | "jpeg" | "webp",
  "fullPage": boolean,
  "quality": 1-100 (for JPEG),
  "delay": 1000-5000 (milliseconds)
}
```

### Response Format

```typescript
{
  "success": true,
  "data": {
    "id": "screenshot_123456_abc",
    "imageUrl": "data:image/png;base64,...",
    "downloadUrl": "/api/serve-screenshot?filename=...",
    "metadata": {
      "width": 1920,
      "height": 1080,
      "fileSize": 334444,
      "format": "png",
      "captureTime": 12500,
      "deviceType": "desktop"
    }
  }
}
```

### Device Configurations

Defined in `lib/utils.ts`:

```typescript
{
  desktop: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
  },
  tablet: {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)..."
  },
  mobile: {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)..."
  }
}
```

---

## Deployment Checklist

- [ ] `playwright-core` installed
- [ ] `@sparticuz/chromium` installed
- [ ] Environment variables set (if any)
- [ ] Vercel function timeout set to 30s (default)
- [ ] Test with various sites (static, React, Next.js)
- [ ] Monitor Vercel logs for errors
- [ ] Check screenshot quality
- [ ] Verify full page mode works
- [ ] Test all device types
- [ ] Test all image formats

---

## Future Improvements

### Potential Enhancements

1. **Retry Logic**: Retry failed screenshots automatically
2. **Caching**: Cache screenshots for frequently requested URLs
3. **Queue System**: Handle high load with job queue
4. **Multiple Browsers**: Support Firefox, WebKit
5. **Custom Viewports**: Allow arbitrary dimensions
6. **Element Selection**: Screenshot specific elements only
7. **PDF Generation**: Convert pages to PDF
8. **Video Recording**: Record page interactions

### Known Limitations

1. **30-second timeout**: Vercel serverless limit
2. **Memory constraints**: Large pages may fail
3. **No authentication**: Can't screenshot logged-in pages
4. **No interaction**: Can't click buttons, fill forms
5. **Bot detection**: Some sites block headless browsers

---

## Conclusion

This screenshot system uses a multi-layered approach to reliably capture modern JavaScript-heavy websites:

1. Fast initial navigation (`domcontentloaded`)
2. Smart content detection (wait for actual rendering)
3. Image loading verification
4. User-controlled delay buffer
5. Lazy-load triggering via scroll

The key insight is that **waiting for network idle or load events is not enough** for modern SPAs. You must verify that content is actually rendered in the DOM before taking the screenshot.

Total execution time is optimized to stay under 25 seconds to avoid Vercel's 30-second timeout, while still giving enough time for content to load.

---

## Support & Troubleshooting

If screenshots are still blank/partial:

1. Check Vercel logs for content metrics
2. Test the URL in a real browser
3. Increase delay to 5 seconds
4. Enable full page mode
5. Check if site blocks headless browsers
6. Try a different URL to isolate the issue

For persistent issues, the site may require:
- Authentication (not supported)
- User interaction (clicks, scrolls)
- Specific cookies or headers
- Non-headless browser (defeats purpose)

In these cases, consider using a third-party screenshot service or running a non-headless browser in a VM.
