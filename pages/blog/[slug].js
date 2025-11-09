import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPost({ post }) {
  if (!post) {
    return <div>Post not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'SnapWeb Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SnapWeb',
      logo: {
        '@type': 'ImageObject',
        url: 'https://snap-web-livid.vercel.app/logo.svg',
      },
    },
  };

  return (
    <>
      <Head>
        <title>{post.title} - SnapWeb Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <link rel="canonical" href={`https://snap-web-livid.vercel.app/blog/${post.slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <article className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
              <li>→</li>
              <li><Link href="/blog" className="hover:text-gray-700">Blog</Link></li>
              <li>→</li>
              <li className="text-gray-900">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <time dateTime={post.date}>{post.formattedDate}</time>
              <span className="mx-2">•</span>
              <span>{post.readTime} min read</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {post.excerpt}
            </p>

            {post.image && (
              <div className="aspect-w-16 aspect-h-9 mb-8">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* AdSense Ad Placeholder */}
          <div className="mb-8">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-gray-500">AdSense Advertisement</p>
              <p className="text-sm text-gray-400">300x250 Rectangle</p>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside mb-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-700">{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```\w*\n?/, '').replace(/```$/, '');
                return (
                  <pre key={index} className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    <code>{code}</code>
                  </pre>
                );
              }
              return <p key={index} className="text-gray-700 mb-4">{paragraph}</p>;
            })}
          </div>

          {/* AdSense Ad Placeholder */}
          <div className="mt-12 mb-8">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-gray-500">AdSense Advertisement</p>
              <p className="text-sm text-gray-400">728x90 Leaderboard</p>
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Published by</p>
                <p className="font-semibold text-gray-900">SnapWeb Team</p>
              </div>
              
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Share on Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Share on LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  // Sample blog post slugs - in production, fetch from CMS or file system
  const slugs = [
    'top-10-ways-website-screenshots-marketing',
    'automate-screenshot-generation-api',
    'speed-seo-fast-preview-images',
  ];

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Sample blog posts - in production, fetch from CMS or markdown files
  const posts = {
    'top-10-ways-website-screenshots-marketing': {
      slug: 'top-10-ways-website-screenshots-marketing',
      title: 'Top 10 Ways to Use Website Screenshots for Marketing',
      excerpt: 'Discover creative ways to leverage website screenshots in your marketing campaigns, from social media posts to email newsletters and beyond.',
      date: '2024-11-01',
      formattedDate: 'November 1, 2024',
      readTime: 8,
      tags: ['Marketing', 'Screenshots', 'Social Media'],
      image: '/blog/marketing-screenshots.webp',
      content: `Website screenshots have become an essential tool in modern marketing. They provide visual proof, enhance credibility, and can significantly boost engagement across various marketing channels.

## 1. Social Media Posts

Use screenshots to showcase your website updates, new features, or customer testimonials directly on social media platforms. Visual content performs 40x better than text-only posts.

## 2. Email Marketing Campaigns

Include website screenshots in your email newsletters to drive traffic back to your site. Screenshots of product pages or blog posts can increase click-through rates by up to 300%.

## 3. Case Studies and Portfolio

Screenshots are perfect for documenting your work in case studies. They provide visual evidence of your achievements and help potential clients understand your capabilities.

## 4. Competitive Analysis

Capture competitor websites to analyze their design, pricing, and features. This helps you stay ahead of the competition and identify market opportunities.

## 5. Documentation and Tutorials

Create step-by-step guides using website screenshots. Visual documentation is easier to follow and reduces support requests.

## 6. A/B Testing Documentation

Document different versions of your website for A/B testing. Screenshots help you track changes and measure performance improvements.

## 7. Client Presentations

Use screenshots in client presentations to show progress, propose changes, or demonstrate concepts. Visual presentations are more engaging and persuasive.

## 8. Blog Post Featured Images

Create custom featured images for blog posts using website screenshots. This improves social sharing and makes your content more visually appealing.

## 9. Product Announcements

Announce new features or products using screenshots. Visual announcements generate more excitement and engagement than text-only updates.

## 10. Training Materials

Create training materials for your team using website screenshots. Visual guides help new employees understand processes and procedures faster.

## Best Practices for Marketing Screenshots

- Use high-resolution images for better quality
- Optimize file sizes for faster loading
- Add annotations and callouts to highlight important elements
- Maintain consistency in screenshot styles across campaigns
- Update screenshots regularly to reflect current website design

By incorporating these strategies into your marketing workflow, you can leverage the power of website screenshots to improve engagement, build trust, and drive conversions.`,
    },
    'automate-screenshot-generation-api': {
      slug: 'automate-screenshot-generation-api',
      title: 'How to Automate Screenshot Generation with SnapWeb API',
      excerpt: 'Learn how to integrate SnapWeb API into your workflow for automated screenshot generation, perfect for QA testing and content creation.',
      date: '2024-10-28',
      formattedDate: 'October 28, 2024',
      readTime: 12,
      tags: ['API', 'Automation', 'Development'],
      image: '/blog/api-automation.webp',
      content: `Automating screenshot generation can save hours of manual work and ensure consistency across your projects. The SnapWeb API makes it easy to integrate screenshot capture into your existing workflows.

## Getting Started with the API

First, you'll need to get your API key from the SnapWeb dashboard. Once you have your key, you can start making requests to generate screenshots programmatically.

## Basic API Usage

Here's a simple example of how to generate a screenshot using the API:

\`\`\`javascript
const response = await fetch('https://snap-web-livid.vercel.app/api/screenshot', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    device: 'desktop',
    format: 'png'
  })
});

const result = await response.json();
console.log(result.imageUrl);
\`\`\`

## Automation Use Cases

### QA Testing
Automate visual regression testing by capturing screenshots of your application across different environments and comparing them for changes.

### Content Creation
Generate thumbnails for blog posts, social media content, or marketing materials automatically when new content is published.

### Monitoring
Set up scheduled screenshot capture to monitor your website's appearance and catch visual issues before your users do.

## Advanced Automation Patterns

### Batch Processing
Process multiple URLs in parallel for faster results.

### Error Handling
Implement robust error handling for production use with retries and proper exception management.

## Integration Examples

### GitHub Actions
Integrate screenshot generation into your CI/CD pipeline using GitHub Actions.

### Zapier Integration
Connect SnapWeb to hundreds of other tools using Zapier webhooks for no-code automation.

### Cron Jobs
Set up scheduled screenshot capture using cron jobs for regular monitoring and archival.

## Best Practices

- Implement rate limiting to respect API limits
- Use appropriate error handling and retries
- Cache results when possible to reduce API calls
- Monitor your usage to avoid unexpected charges
- Use webhooks for long-running processes

By following these patterns and best practices, you can build robust automation workflows that save time and improve consistency in your screenshot generation process.`,
    },
    'speed-seo-fast-preview-images': {
      slug: 'speed-seo-fast-preview-images',
      title: 'Speed & SEO: Why Fast Preview Images Matter',
      excerpt: 'Explore the impact of fast-loading preview images on SEO rankings and user experience, plus tips for optimization.',
      date: '2024-10-25',
      formattedDate: 'October 25, 2024',
      readTime: 6,
      tags: ['SEO', 'Performance', 'Web Development'],
      image: '/blog/seo-performance.webp',
      content: `Page speed is a crucial ranking factor for search engines, and images often represent the largest portion of a webpage's total size. Optimizing your preview images can significantly improve both SEO performance and user experience.

## The Impact of Image Speed on SEO

Google's Core Web Vitals include Largest Contentful Paint (LCP), which measures how quickly the main content loads. Preview images are often the largest element on a page, making their optimization critical for good LCP scores.

## Key Performance Metrics

### Largest Contentful Paint (LCP)
LCP should occur within 2.5 seconds of when the page first starts loading. Large, unoptimized images can push this metric well beyond the recommended threshold.

### Cumulative Layout Shift (CLS)
Images without proper dimensions can cause layout shifts as they load, negatively impacting CLS scores. Always specify width and height attributes.

### First Input Delay (FID)
Heavy image processing can block the main thread, increasing FID. Use efficient image formats and lazy loading to minimize this impact.

## Image Optimization Strategies

### Choose the Right Format
- **WebP:** 25-35% smaller than JPEG with similar quality
- **AVIF:** Up to 50% smaller than JPEG (newer format)
- **JPEG:** Good for photographs with many colors
- **PNG:** Best for images with transparency or few colors

### Implement Responsive Images
Use the srcset attribute to serve different image sizes based on device capabilities.

### Lazy Loading
Load images only when they're about to enter the viewport.

## Technical Implementation

### Image Compression
Compress images without significant quality loss. Tools like ImageOptim, TinyPNG, or automated services can reduce file sizes by 60-80%.

### CDN Usage
Serve images from a Content Delivery Network (CDN) to reduce latency and improve loading times globally.

### Preloading Critical Images
Preload above-the-fold images to improve LCP.

## Measuring Performance

### Tools for Testing
- Google PageSpeed Insights
- WebPageTest
- Lighthouse (built into Chrome DevTools)
- GTmetrix

### Key Metrics to Monitor
- Image file sizes and compression ratios
- Loading times across different devices
- Core Web Vitals scores
- User engagement metrics

## SEO Benefits of Fast Images

### Improved Rankings
Faster-loading pages rank higher in search results, especially on mobile devices where speed is even more critical.

### Better User Experience
Fast-loading images reduce bounce rates and increase time on page, both positive signals for search engines.

### Mobile-First Indexing
Google primarily uses mobile versions of pages for indexing. Mobile users are particularly sensitive to slow-loading images.

## Common Mistakes to Avoid

- Serving desktop-sized images to mobile devices
- Not specifying image dimensions
- Using outdated image formats
- Forgetting to compress images
- Loading all images immediately instead of using lazy loading

## Future-Proofing Your Images

Stay ahead of the curve by implementing modern image optimization techniques and monitoring new developments in image formats and compression algorithms.

By prioritizing image optimization, you'll not only improve your SEO rankings but also provide a better experience for your users, leading to higher engagement and conversion rates.`,
    },
  };

  const post = posts[params.slug];

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 3600,
  };
}