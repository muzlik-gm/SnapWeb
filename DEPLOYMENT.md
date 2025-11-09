# SnapWeb Deployment Guide

## Vercel Hobby Plan Optimization

This project has been optimized to work within Vercel's Hobby plan memory limits (2048 MB).

### Key Optimizations Made:

1. **Memory Configuration**: Set to 512 MB in `vercel.json`
2. **Lightweight Screenshot Engine**: Uses `screenshot-light.ts` with minimal memory footprint
3. **Browser Optimization**: Single-process Puppeteer with aggressive memory limits
4. **Resource Blocking**: Blocks non-essential resources to reduce memory usage
5. **Viewport Capping**: Limits screenshot dimensions to reduce memory consumption

### Deployment Steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

3. **Environment Variables** (set in Vercel dashboard):
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   MONGODB_URI=your-mongodb-connection-string
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

### Memory Usage Tips:

- The screenshot function is optimized for minimal memory usage
- Screenshots are limited to reasonable dimensions (max 1280x720)
- Browser instances are created fresh for each request and immediately closed
- Non-essential resources (fonts, media) are blocked during capture

### Troubleshooting:

If you still encounter memory issues:

1. **Reduce memory further** in `vercel.json`:
   ```json
   {
     "functions": {
       "pages/api/screenshot.ts": {
         "memory": 256,
         "maxDuration": 20
       }
     }
   }
   ```

2. **Consider upgrading to Pro plan** for higher memory limits if needed

3. **Alternative**: Use external screenshot service (like Puppeteer as a service)

### Performance Notes:

- Screenshots typically complete in 2-5 seconds
- Memory usage stays under 512 MB
- Supports all major website types
- Automatic cleanup prevents memory leaks

### Monitoring:

Monitor your function performance in the Vercel dashboard:
- Check memory usage graphs
- Monitor execution time
- Watch for timeout errors

If you need higher performance or memory limits, consider upgrading to Vercel Pro plan.