export default function handler(req, res) {
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

  // Blog posts (in production, fetch from your CMS or file system)
  const blogPosts = [
    '/blog/top-10-ways-website-screenshots-marketing',
    '/blog/automate-screenshot-generation-api',
    '/blog/speed-seo-fast-preview-images',
  ];

  const allPages = [...staticPages, ...blogPosts];

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

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}