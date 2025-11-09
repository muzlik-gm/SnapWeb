// SEO utility functions

export function generateJsonLd(type, data) {
  const baseJsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(baseJsonLd);
}

export function generateSoftwareApplicationJsonLd() {
  return generateJsonLd('SoftwareApplication', {
    name: 'SnapWeb',
    url: 'https://snap-web-livid.vercel.app/',
    operatingSystem: 'Web',
    applicationCategory: 'DeveloperTool',
    description: 'Generate website screenshots in seconds. Desktop, tablet, mobile support and API access.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'SnapWeb Team',
    },
  });
}

export function generateBlogPostJsonLd(post) {
  return generateJsonLd('BlogPosting', {
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
  });
}

export function generateOrganizationJsonLd() {
  return generateJsonLd('Organization', {
    name: 'SnapWeb',
    url: 'https://snap-web-livid.vercel.app',
    description: 'Fast, reliable website screenshot generation service',
    foundingDate: '2024',
    logo: 'https://snap-web-livid.vercel.app/logo.svg',
  });
}

export const defaultSEO = {
  title: 'SnapWeb - Website Screenshot Generator',
  description: 'Generate beautiful, pixel-perfect website screenshots in seconds. Desktop, tablet & mobile. PNG, JPEG, WebP. API access for automation.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://snap-web-livid.vercel.app/',
    site_name: 'SnapWeb',
    title: 'SnapWeb - Website Screenshot Generator',
    description: 'Fast, accurate previews for marketing, QA and development. PNG, JPEG, WebP. API access included.',
    images: [
      {
        url: 'https://snap-web-livid.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SnapWeb - Website Screenshot Generator',
      },
    ],
  },
  twitter: {
    handle: '@snapweb',
    site: '@snapweb',
    cardType: 'summary_large_image',
  },
};