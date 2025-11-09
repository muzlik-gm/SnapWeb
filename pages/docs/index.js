import Head from 'next/head';
import Link from 'next/link';

export default function Docs() {
  return (
    <>
      <Head>
        <title>Documentation - SnapWeb</title>
        <meta
          name="description"
          content="Complete documentation for SnapWeb screenshot generation service. Learn how to use our web interface and integrate with our API."
        />
        <meta property="og:title" content="SnapWeb Documentation - Complete Guide" />
        <meta property="og:description" content="Everything you need to know about using SnapWeb for website screenshots." />
        <link rel="canonical" href="https://snap-web-livid.vercel.app/docs" />
      </Head>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about using SnapWeb for website screenshot generation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Navigation</h3>
                <ul className="space-y-2">
                  <li><a href="#getting-started" className="text-blue-600 hover:text-blue-800">Getting Started</a></li>
                  <li><a href="#web-interface" className="text-blue-600 hover:text-blue-800">Web Interface</a></li>
                  <li><a href="#device-options" className="text-blue-600 hover:text-blue-800">Device Options</a></li>
                  <li><a href="#formats" className="text-blue-600 hover:text-blue-800">Image Formats</a></li>
                  <li><a href="#best-practices" className="text-blue-600 hover:text-blue-800">Best Practices</a></li>
                  <li><a href="#troubleshooting" className="text-blue-600 hover:text-blue-800">Troubleshooting</a></li>
                  <li><Link href="/api-docs" className="text-blue-600 hover:text-blue-800">API Reference</Link></li>
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Getting Started */}
              <section id="getting-started">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Getting Started</h2>
                <p className="text-gray-600 mb-6">
                  SnapWeb makes it easy to generate high-quality website screenshots. Whether you're using 
                  our web interface or API, you can capture any website in seconds.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Start</h3>
                  <ol className="list-decimal list-inside space-y-2 text-blue-800">
                    <li>Enter the website URL you want to capture</li>
                    <li>Choose your device type (desktop, tablet, or mobile)</li>
                    <li>Select your preferred image format</li>
                    <li>Click "Generate Screenshot" and wait for processing</li>
                    <li>Download your screenshot or save it to your dashboard</li>
                  </ol>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Benefits</h3>
                <p className="text-gray-600 mb-4">
                  While you can use SnapWeb without an account, creating one provides additional benefits:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Save screenshots to your dashboard for later access</li>
                  <li>Track your usage and remaining credits</li>
                  <li>Access API keys for programmatic use (Pro plan)</li>
                  <li>Higher quality options and priority processing</li>
                </ul>
              </section>

              {/* Web Interface */}
              <section id="web-interface">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Using the Web Interface</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">URL Input</h3>
                <p className="text-gray-600 mb-4">
                  Enter any valid website URL in the input field. SnapWeb supports both HTTP and HTTPS URLs. 
                  Make sure to include the protocol (https://) for best results.
                </p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2"><strong>Examples of valid URLs:</strong></p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• https://example.com</li>
                    <li>• https://www.google.com</li>
                    <li>• https://github.com/user/repo</li>
                    <li>• https://subdomain.example.com/path</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Generation Options</h3>
                <p className="text-gray-600 mb-4">
                  Customize your screenshot with these options:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li><strong>Full Page:</strong> Capture the entire webpage or just the visible viewport</li>
                  <li><strong>Device Type:</strong> Choose how the website should be rendered</li>
                  <li><strong>Format:</strong> Select the output image format</li>
                </ul>
              </section>

              {/* Device Options */}
              <section id="device-options">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Device Options</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Desktop</h3>
                    <p className="text-gray-600 text-sm mb-2">1920 × 1080 pixels</p>
                    <p className="text-gray-600 text-sm">
                      Standard desktop resolution, perfect for showcasing full website layouts and desktop-specific features.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tablet</h3>
                    <p className="text-gray-600 text-sm mb-2">768 × 1024 pixels</p>
                    <p className="text-gray-600 text-sm">
                      iPad-style resolution, ideal for testing responsive designs and tablet-optimized layouts.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile</h3>
                    <p className="text-gray-600 text-sm mb-2">375 × 667 pixels</p>
                    <p className="text-gray-600 text-sm">
                      iPhone-style resolution, perfect for mobile-first designs and testing mobile user experience.
                    </p>
                  </div>
                </div>
              </section>

              {/* Image Formats */}
              <section id="formats">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Image Formats</h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">PNG (Recommended)</h3>
                    <p className="text-gray-600 mb-2">
                      Lossless compression with support for transparency. Best for screenshots with text, 
                      sharp edges, and when file size is not a primary concern.
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Use for:</strong> Documentation, presentations, high-quality archives
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">JPEG</h3>
                    <p className="text-gray-600 mb-2">
                      Lossy compression with smaller file sizes. Good for photographs and images where 
                      slight quality loss is acceptable for reduced file size.
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Use for:</strong> Email attachments, web publishing, social media
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">WebP</h3>
                    <p className="text-gray-600 mb-2">
                      Modern format with excellent compression and quality. Smaller file sizes than PNG 
                      and JPEG while maintaining high quality.
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Use for:</strong> Web optimization, modern browsers, performance-critical applications
                    </p>
                  </div>
                </div>
              </section>

              {/* Best Practices */}
              <section id="best-practices">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">URL Preparation</h3>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Always include the protocol (https:// or http://)</li>
                  <li>Test the URL in your browser first to ensure it loads correctly</li>
                  <li>Consider using specific page URLs rather than just domain names</li>
                  <li>Be aware that some websites may block automated access</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Optimization</h3>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Use PNG for text-heavy pages and documentation</li>
                  <li>Choose JPEG for image-heavy websites to reduce file size</li>
                  <li>Select WebP for the best balance of quality and file size</li>
                  <li>Use full-page capture for complete documentation</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Tips</h3>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Screenshots typically take 2-5 seconds to generate</li>
                  <li>Complex websites with lots of JavaScript may take longer</li>
                  <li>Consider the target website's loading speed</li>
                  <li>Use appropriate device types for your use case</li>
                </ul>
              </section>

              {/* Troubleshooting */}
              <section id="troubleshooting">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Common Issues</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-red-800">Screenshot generation fails</h4>
                        <p className="text-red-700 text-sm">
                          Check if the URL is accessible and loads correctly in your browser. 
                          Some websites block automated access or require authentication.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-red-800">Timeout errors</h4>
                        <p className="text-red-700 text-sm">
                          The website may be slow to load or have heavy JavaScript. Try again 
                          or consider using a simpler page URL.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-red-800">Blank or incomplete screenshots</h4>
                        <p className="text-red-700 text-sm">
                          Some websites use complex JavaScript that may not render properly. 
                          Try waiting a moment and generating the screenshot again.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Rate Limits</h3>
                    <p className="text-yellow-800 text-sm mb-2">
                      Free users are limited to 10 screenshots per month. Pro users get 500 screenshots 
                      per month with higher priority processing.
                    </p>
                    <p className="text-yellow-800 text-sm">
                      If you hit rate limits, consider upgrading to a Pro plan or wait for your 
                      monthly limit to reset.
                    </p>
                  </div>
                </div>
              </section>

              {/* Support */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Need More Help?</h2>
                <p className="text-gray-600 mb-6">
                  If you can't find what you're looking for in this documentation, we're here to help.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
                    <p className="text-gray-600 mb-4">
                      Learn how to integrate SnapWeb into your applications with our comprehensive API guide.
                    </p>
                    <Link href="/api-docs" className="text-blue-600 hover:text-blue-700 font-medium">
                      View API Docs →
                    </Link>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
                    <p className="text-gray-600 mb-4">
                      Have a specific question or need technical support? Our team is ready to help.
                    </p>
                    <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                      Contact Us →
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}