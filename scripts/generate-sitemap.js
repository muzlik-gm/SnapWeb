const fs = require('fs');
const path = require('path');

const baseUrl = 'https://snap-web-livid.vercel.app';

// Static pages
const staticPages = [
  '',
  '/pricing',
  '/about',
  '/blog',
  '/docs',
  '/api-docs',
  '/privacy',
  '/terms',
  '/contact',
  '/dashboard',
];

// Blog posts (in production, you would read from your CMS or file system)
const blogPosts = [
  '/blog/top-10-ways-website-screenshots-marketing',
  '/blog/automate-screenshot-generation-api',
  '/blog/speed-seo-fast-preview-images',
];

const allPages = [...staticPages, ...blogPosts];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => {
    const url = `${baseUrl}${page}`;
    const lastmod = new Date().toISOString().split('T')[0];
    const priority = page === '' ? '1.0' : page.startsWith('/blog/') ? '0.7' : '0.8';
    
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully');
}

function generateRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);
  console.log('✅ Robots.txt generated successfully');
}

// Generate both files
generateSitemap();
generateRobots();

console.log('🚀 SEO files generated and ready for deployment!');