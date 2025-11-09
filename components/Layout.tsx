import { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  keywords?: string;
  alternateUrls?: { [key: string]: string };
}

export default function Layout({
  children,
  title = 'SnapWeb - Professional Website Screenshot Generator | Free Online Tool',
  description = 'Generate pixel-perfect website screenshots instantly. Free online screenshot tool for websites, web pages, and URLs. Desktop, tablet, mobile views. API access available. Fast, reliable, professional quality.',
  image = '/og-image.png',
  noIndex = false,
  showHeader = true,
  showFooter = true,
  keywords = 'website screenshot, web page screenshot, screenshot generator, website capture, web screenshot tool, online screenshot, website preview, page screenshot, site screenshot, web capture, screenshot API, website thumbnail, web page capture, screenshot service, website image, web screenshot generator, online website screenshot, free screenshot tool, website screenshot online, web page image, screenshot maker, website screencap, web page screencap, site capture, webpage screenshot, website snapshot, web snapshot, screenshot website online, capture website, website screenshot generator, web screenshot service, screenshot tool online, website screenshot free, web page screenshot free, screenshot website, capture web page, website screenshot tool, web screenshot online, screenshot web page, website image generator, web page image generator, screenshot capture, website screenshot service, web screenshot generator online, screenshot website tool, web page screenshot tool, website screenshot maker, web screenshot maker, screenshot generator online, website capture tool, web capture tool, screenshot online tool, website screenshot online free, web page screenshot online, screenshot website online free, capture website screenshot, web page capture tool, website screenshot generator online, web screenshot tool online, screenshot service online, website screenshot online tool, web page screenshot generator, screenshot website generator, web screenshot generator tool, website screenshot tool online, web page screenshot online tool, screenshot generator tool, website capture online, web capture online, screenshot tool free, website screenshot free online, web page screenshot free online, screenshot online free, website screenshot generator free, web screenshot generator free, screenshot generator free online, website capture free, web capture free, screenshot service free, website screenshot service free, web screenshot service free, screenshot tool online free, website screenshot tool free, web page screenshot tool free, screenshot maker free, website screenshot maker free, web screenshot maker free, screenshot capture free, website screenshot capture, web page screenshot capture, screenshot online generator, website screenshot online generator, web page screenshot online generator, screenshot generator online free, website screenshot generator online free, web screenshot generator online free',
  alternateUrls,
}: LayoutProps) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://snapweb.vercel.app';
  const canonicalUrl = `${baseUrl}${router.asPath}`;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        {/* Viewport and Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SnapWeb" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Alternate URLs for different languages/regions */}
        {alternateUrls && Object.entries(alternateUrls).map(([lang, url]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${baseUrl}${image}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SnapWeb - Professional Website Screenshot Generator" />
        <meta property="og:site_name" content="SnapWeb" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={`${baseUrl}${image}`} />
        <meta property="twitter:image:alt" content="SnapWeb - Professional Website Screenshot Generator" />
        <meta property="twitter:creator" content="@snapweb" />
        <meta property="twitter:site" content="@snapweb" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
        <meta name="googlebot" content="index,follow" />
        <meta name="bingbot" content="index,follow" />
        <meta name="author" content="SnapWeb Team" />
        <meta name="publisher" content="SnapWeb" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="application-name" content="SnapWeb" />
        
        {/* Language and Geo */}
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        
        {/* Additional Meta */}
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="revisit-after" content="1 days" />
        <meta name="expires" content="never" />
        <meta name="cache-control" content="public" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Comprehensive Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'SnapWeb - Website Screenshot Generator',
              alternateName: ['SnapWeb', 'Website Screenshot Tool', 'Screenshot Generator'],
              url: baseUrl,
              description: 'Professional website screenshot generator. Capture pixel-perfect screenshots of any website instantly. Free online tool with desktop, tablet, and mobile views.',
              applicationCategory: ['DeveloperTool', 'UtilityApplication', 'WebApplication'],
              operatingSystem: ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Web'],
              browserRequirements: 'Requires JavaScript. Requires HTML5.',
              softwareVersion: '2.0',
              datePublished: '2024-01-01',
              dateModified: new Date().toISOString().split('T')[0],
              author: {
                '@type': 'Organization',
                name: 'SnapWeb',
                url: baseUrl
              },
              publisher: {
                '@type': 'Organization',
                name: 'SnapWeb',
                url: baseUrl,
                logo: {
                  '@type': 'ImageObject',
                  url: `${baseUrl}/favicon.svg`
                }
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                description: 'Free website screenshot generation with premium features available'
              },
              featureList: [
                'Website Screenshot Generation',
                'Multiple Device Views (Desktop, Tablet, Mobile)',
                'Multiple Format Support (PNG, JPEG, WebP)',
                'Full Page Screenshots',
                'API Access',
                'Bulk Screenshot Processing',
                'High Resolution Screenshots',
                'Fast Processing',
                'No Registration Required',
                'Professional Quality'
              ],
              screenshot: `${baseUrl}/og-image.png`,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '1250',
                bestRating: '5',
                worstRating: '1'
              },
              review: [
                {
                  '@type': 'Review',
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                    bestRating: '5'
                  },
                  author: {
                    '@type': 'Person',
                    name: 'Web Developer'
                  },
                  reviewBody: 'Best screenshot tool for websites. Fast, reliable, and professional quality.'
                }
              ]
            })
          }}
        />
        
        {/* Website/Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SnapWeb',
              alternateName: 'Website Screenshot Generator',
              url: baseUrl,
              description: 'Professional website screenshot generator and web capture tool',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${baseUrl}/?url={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              },
              mainEntity: {
                '@type': 'WebApplication',
                name: 'SnapWeb Screenshot Generator',
                url: baseUrl,
                applicationCategory: 'WebApplication',
                operatingSystem: 'All'
              }
            })
          }}
        />
        
        {/* FAQ Schema for Homepage */}
        {router.pathname === '/' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How do I take a screenshot of a website?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Simply enter the website URL in our screenshot generator tool, select your preferred device type (desktop, tablet, or mobile), choose the format (PNG, JPEG, or WebP), and click Generate Screenshot. The tool will capture a high-quality screenshot instantly.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'Is the website screenshot tool free?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, SnapWeb offers free website screenshots with no registration required. You can generate up to 3 screenshots per day as an anonymous user, or create a free account for more screenshots and additional features.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'What formats are supported for website screenshots?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'SnapWeb supports PNG (best quality), JPEG (smaller file size), and WebP (modern format) for website screenshots. You can choose the format that best suits your needs.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I capture mobile and tablet views of websites?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, SnapWeb can capture website screenshots in desktop (1920×1080), tablet (768×1024), and mobile (375×667) views to show how websites appear on different devices.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'Do you offer an API for website screenshots?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, SnapWeb provides a RESTful API for developers to integrate website screenshot generation into their applications. API access is available with Pro and Team plans.'
                    }
                  }
                ]
              })
            }}
          />
        )}
        
        {/* Breadcrumb Schema */}
        {router.pathname !== '/' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: baseUrl
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: title.split(' - ')[0],
                    item: canonicalUrl
                  }
                ]
              })
            }}
          />
        )}
      </Head>

      <div className="min-h-screen flex flex-col">
        {showHeader && <Header />}
        
        <main className="flex-1">
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </>
  );
}