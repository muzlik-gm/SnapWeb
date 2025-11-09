import Head from 'next/head';
import BlogCard from '../../components/BlogCard';

export default function Blog({ posts }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SnapWeb Blog',
    description: 'Tips, tutorials, and insights about website screenshots and web development',
    url: 'https://snap-web-livid.vercel.app/blog',
  };

  return (
    <>
      <Head>
        <title>Blog - SnapWeb</title>
        <meta
          name="description"
          content="Tips, tutorials, and insights about website screenshots, web development, and marketing automation."
        />
        <meta property="og:title" content="SnapWeb Blog - Tips & Tutorials" />
        <meta property="og:description" content="Learn how to use website screenshots effectively for marketing, QA, and development." />
        <link rel="canonical" href="https://snap-web-livid.vercel.app/blog" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SnapWeb Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tips, tutorials, and insights about website screenshots and web development
            </p>
          </div>

          {/* AdSense Ad Placeholder */}
          <div className="mb-12">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">AdSense Advertisement</p>
              <p className="text-sm text-gray-400">728x90 Leaderboard</p>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* AdSense Ad Placeholder */}
          <div className="mt-12">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">AdSense Advertisement</p>
              <p className="text-sm text-gray-400">728x90 Leaderboard</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  // Sample blog posts - in production, fetch from CMS or markdown files
  const posts = [
    {
      slug: 'top-10-ways-website-screenshots-marketing',
      title: 'Top 10 Ways to Use Website Screenshots for Marketing',
      excerpt: 'Discover creative ways to leverage website screenshots in your marketing campaigns, from social media posts to email newsletters and beyond.',
      date: '2024-11-01',
      formattedDate: 'November 1, 2024',
      readTime: 8,
      tags: ['Marketing', 'Screenshots', 'Social Media'],
      image: '/blog/marketing-screenshots.webp',
    },
    {
      slug: 'automate-screenshot-generation-api',
      title: 'How to Automate Screenshot Generation with SnapWeb API',
      excerpt: 'Learn how to integrate SnapWeb API into your workflow for automated screenshot generation, perfect for QA testing and content creation.',
      date: '2024-10-28',
      formattedDate: 'October 28, 2024',
      readTime: 12,
      tags: ['API', 'Automation', 'Development'],
      image: '/blog/api-automation.webp',
    },
    {
      slug: 'speed-seo-fast-preview-images',
      title: 'Speed & SEO: Why Fast Preview Images Matter',
      excerpt: 'Explore the impact of fast-loading preview images on SEO rankings and user experience, plus tips for optimization.',
      date: '2024-10-25',
      formattedDate: 'October 25, 2024',
      readTime: 6,
      tags: ['SEO', 'Performance', 'Web Development'],
      image: '/blog/seo-performance.webp',
    },
  ];

  return {
    props: {
      posts,
    },
    revalidate: 3600, // Revalidate every hour
  };
}