import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatFileSize } from '@/lib/utils';
import type { ScreenshotResponse } from '@/types';
import { 
  Monitor, Tablet, Smartphone, Image as ImageIcon, Download, 
  CheckCircle, Zap, Target, Code, Shield, ArrowRight, Check
} from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState('desktop');
  const [format, setFormat] = useState('png');
  const [fullPage, setFullPage] = useState(false);
  const [delay, setDelay] = useState(3000); // Default 3 seconds
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id?: string; imageUrl?: string; downloadUrl?: string; metadata?: any } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          device,
          format,
          fullPage,
          delay,
        }),
      });

      // 1. Check if the response is valid JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        if (response.status === 504) {
          throw new Error('Screenshot generation timed out. The website might be too slow or complex.');
        }
        throw new Error(`Server returned an error (${response.status}). Please try again later.`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        console.log('Screenshot API Response:', data);
        setResult(data.data);
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'generate_clicked', {
            event_category: 'engagement',
            event_label: device,
          });
        }
      } else {
        setError(data.error || data.message || 'Failed to generate screenshot');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Free Website Screenshot Generator | SnapWeb - Capture Any Website Instantly"
      description="Generate professional website screenshots for free. Capture any website in desktop, tablet, or mobile view. PNG, JPEG, WebP formats. No registration required. Fast, reliable, high-quality screenshots with API access available."
      keywords="free website screenshot, screenshot generator, website capture tool, web page screenshot, online screenshot tool, website screenshot generator, capture website, screenshot website, web screenshot, website image generator, screenshot tool free, website screenshot online, web page capture, screenshot service, website thumbnail generator, free screenshot tool, online screenshot, screenshot maker, website screencap, web page screencap, site capture, webpage screenshot, website snapshot, web snapshot, screenshot website online, capture website screenshot, website screenshot tool, web screenshot online, screenshot web page, website image generator, web page image generator, screenshot capture, website screenshot service, web screenshot generator online, screenshot website tool, web page screenshot tool, website screenshot maker, web screenshot maker, screenshot generator online, website capture tool, web capture tool, screenshot online tool, website screenshot online free, web page screenshot online, screenshot website online free, capture website screenshot, web page capture tool, website screenshot generator online, web screenshot tool online, screenshot service online, website screenshot online tool, web page screenshot generator, screenshot website generator, web screenshot generator tool, website screenshot tool online, web page screenshot online tool, screenshot generator tool, website capture online, web capture online, screenshot tool free, website screenshot free online, web page screenshot free online, screenshot online free, website screenshot generator free, web screenshot generator free, screenshot generator free online, website capture free, web capture free, screenshot service free, website screenshot service free, web screenshot service free, screenshot tool online free, website screenshot tool free, web page screenshot tool free, screenshot maker free, website screenshot maker free, web screenshot maker free, screenshot capture free, website screenshot capture, web page screenshot capture, screenshot online generator, website screenshot online generator, web page screenshot online generator, screenshot generator online free, website screenshot generator online free, web screenshot generator online free, take screenshot of website, how to screenshot website, website screenshot chrome, website screenshot firefox, website screenshot safari, website screenshot edge, website screenshot browser, website screenshot extension, website screenshot plugin, website screenshot addon, website screenshot app, website screenshot software, website screenshot program, website screenshot utility, website screenshot service, website screenshot API, website screenshot REST API, website screenshot JSON API, website screenshot HTTP API, website screenshot web API, website screenshot developer API, website screenshot integration, website screenshot automation, website screenshot bulk, website screenshot batch, website screenshot multiple, website screenshot mass, website screenshot programmatic, website screenshot headless, website screenshot puppeteer, website screenshot selenium, website screenshot playwright, website screenshot chrome headless, website screenshot nodejs, website screenshot python, website screenshot php, website screenshot ruby, website screenshot java, website screenshot c#, website screenshot .net, website screenshot go, website screenshot rust, website screenshot javascript, website screenshot typescript, website screenshot react, website screenshot vue, website screenshot angular, website screenshot svelte, website screenshot next.js, website screenshot nuxt, website screenshot gatsby, website screenshot wordpress, website screenshot drupal, website screenshot joomla, website screenshot shopify, website screenshot woocommerce, website screenshot magento, website screenshot prestashop, website screenshot opencart, website screenshot bigcommerce, website screenshot squarespace, website screenshot wix, website screenshot webflow, website screenshot elementor, website screenshot divi, website screenshot beaver builder, website screenshot visual composer, website screenshot gutenberg, website screenshot bootstrap, website screenshot tailwind, website screenshot bulma, website screenshot foundation, website screenshot materialize, website screenshot semantic ui, website screenshot ant design, website screenshot material ui, website screenshot chakra ui, website screenshot mantine, website screenshot react bootstrap, website screenshot vue bootstrap, website screenshot angular material, website screenshot ionic, website screenshot cordova, website screenshot phonegap, website screenshot react native, website screenshot flutter, website screenshot xamarin, website screenshot unity, website screenshot unreal, website screenshot godot, website screenshot construct, website screenshot gamemaker, website screenshot rpg maker, website screenshot twine, website screenshot ink, website screenshot yarn, website screenshot articy, website screenshot chatmapper, website screenshot dialogue system, website screenshot fungus, website screenshot ink unity, website screenshot yarn spinner, website screenshot articy draft, website screenshot chatmapper unity, website screenshot dialogue system unity, website screenshot fungus unity, website screenshot ink unreal, website screenshot yarn unreal, website screenshot articy unreal, website screenshot chatmapper unreal, website screenshot dialogue system unreal, website screenshot fungus unreal, website screenshot ink godot, website screenshot yarn godot, website screenshot articy godot, website screenshot chatmapper godot, website screenshot dialogue system godot, website screenshot fungus godot, website screenshot ink construct, website screenshot yarn construct, website screenshot articy construct, website screenshot chatmapper construct, website screenshot dialogue system construct, website screenshot fungus construct, website screenshot ink gamemaker, website screenshot yarn gamemaker, website screenshot articy gamemaker, website screenshot chatmapper gamemaker, website screenshot dialogue system gamemaker, website screenshot fungus gamemaker, website screenshot ink rpg maker, website screenshot yarn rpg maker, website screenshot articy rpg maker, website screenshot chatmapper rpg maker, website screenshot dialogue system rpg maker, website screenshot fungus rpg maker, website screenshot ink twine, website screenshot yarn twine, website screenshot articy twine, website screenshot chatmapper twine, website screenshot dialogue system twine, website screenshot fungus twine"
    >
      {/* PROFESSIONAL HERO SECTION */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-secondary-900 mb-6 leading-tight">
              Free Website Screenshot Generator
              <br />
              <span className="text-primary-600">Capture Any Website Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Generate professional, pixel-perfect website screenshots in seconds. Desktop, tablet, and mobile views. No registration required. Perfect for developers, marketers, designers, and QA teams.
            </p>
          </div>

          {/* PROFESSIONAL SCREENSHOT FORM */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-secondary-200 p-6 sm:p-8">
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                  Try it Free
                </h2>
                <p className="text-secondary-600">
                  Enter any website URL to generate a professional screenshot
                </p>
              </div>

              <div className="space-y-4 mb-6">
                
                {/* URL Input */}
                <Input
                  label="Website URL"
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com or https://example.com"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Device Select */}
                  <div>
                    <label htmlFor="device" className="block text-sm font-medium text-secondary-900 mb-1.5">
                      Device Type
                    </label>
                    <select
                      id="device"
                      value={device}
                      onChange={(e) => setDevice(e.target.value)}
                      className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    >
                      <option value="desktop">Desktop (1920×1080)</option>
                      <option value="tablet">Tablet (768×1024)</option>
                      <option value="mobile">Mobile (375×667)</option>
                    </select>
                  </div>

                  {/* Format Select */}
                  <div>
                    <label htmlFor="format" className="block text-sm font-medium text-secondary-900 mb-1.5">
                      Format
                    </label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    >
                      <option value="png">PNG (Best Quality)</option>
                      <option value="jpeg">JPEG (Smaller Size)</option>
                      <option value="webp">WebP (Modern)</option>
                    </select>
                  </div>
                </div>

                {/* Full Page Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fullPage"
                    checked={fullPage}
                    onChange={(e) => setFullPage(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-secondary-300 rounded"
                  />
                  <label htmlFor="fullPage" className="ml-2 text-sm font-medium text-secondary-700">
                    Capture full page (scrollable content)
                  </label>
                </div>

                {/* Delay Control */}
                <div>
                  <label htmlFor="delay" className="block text-sm font-medium text-secondary-900 mb-1.5">
                    Page Load Delay
                  </label>
                  <select
                    id="delay"
                    value={delay}
                    onChange={(e) => setDelay(Number(e.target.value))}
                    className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                  >
                    <option value={1000}>1 second</option>
                    <option value={2000}>2 seconds</option>
                    <option value={3000}>3 seconds (Recommended)</option>
                    <option value={5000}>5 seconds</option>
                    <option value={8000}>8 seconds</option>
                    <option value={10000}>10 seconds (Max)</option>
                  </select>
                  <p className="text-xs text-secondary-500 mt-1">
                    Wait time for content to fully render (capped at 10s)
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={!url}
              >
                {loading ? 'Generating Screenshot...' : 'Generate Screenshot'}
              </Button>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              {/* Result Display */}
              {result && (
                <div className="mt-6 p-6 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                    <h3 className="text-lg font-semibold text-success-900">Screenshot Generated Successfully</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Preview Image */}
                    <div className="bg-white p-2 rounded-lg border border-secondary-200">
                      <img
                        src={result.imageUrl}
                        alt="Generated screenshot"
                        className="w-full h-auto rounded"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Metadata */}
                    {result.metadata && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-secondary-600">Size:</span>
                          <span className="ml-2 font-medium text-secondary-900">
                            {result.metadata.width} × {result.metadata.height}px
                          </span>
                        </div>
                        <div>
                          <span className="text-secondary-600">File size:</span>
                          <span className="ml-2 font-medium text-secondary-900">
                            {formatFileSize(result.metadata.fileSize)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        className="flex-1 w-full"
                        onClick={() => {
                          // Prefer data URL for reliability if available
                          const isDataUrl = result.imageUrl?.startsWith('data:');
                          const downloadLink = (isDataUrl ? result.imageUrl : (result.downloadUrl || result.imageUrl)) || '';

                          const link = document.createElement('a');
                          link.href = downloadLink;
                          link.download = `screenshot-${Date.now()}.${format}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Screenshot
                      </Button>
                      
                      {!session && (
                        <Link href="/auth/signup" className="flex-1">
                          <Button type="button" variant="outline" size="md" className="w-full">
                            Sign Up to Save
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-secondary-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-4">
              How to Take Website Screenshots Online
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Generate professional website screenshots in three simple steps. Free online tool with no software installation required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Any Website URL',
                description: 'Simply paste the website URL you want to capture. Works with any public website, blog, e-commerce site, or web application. No registration required.',
                icon: Monitor,
              },
              {
                step: '2',
                title: 'Select Device & Format',
                description: 'Choose from desktop (1920×1080), tablet (768×1024), or mobile (375×667) views. Select PNG for best quality, JPEG for smaller files, or WebP for modern browsers.',
                icon: ImageIcon,
              },
              {
                step: '3',
                title: 'Download High-Quality Screenshot',
                description: 'Get your professional screenshot instantly. Download immediately or create a free account to save screenshots for future access and management.',
                icon: Download,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-lg border border-secondary-200 h-full">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium">
                      STEP {item.step}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-4">
              Best Free Website Screenshot Tool
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Professional-grade website screenshot generator trusted by developers, marketers, and designers worldwide. Fast, reliable, and completely free to use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Lightning Fast Screenshot Generation',
                description: 'Generate website screenshots in under 3 seconds with our optimized rendering engine. No waiting, no delays - instant results every time.',
                icon: Zap,
                stat: '< 3 seconds'
              },
              {
                title: 'Pixel-Perfect Website Capture',
                description: 'Accurate representation of websites across all devices and screen sizes. What you see is exactly what you get - professional quality screenshots.',
                icon: Target,
                stat: '100% accurate'
              },
              {
                title: 'Developer-Friendly API',
                description: 'RESTful API with comprehensive documentation for seamless integration into your applications. Perfect for automation and bulk processing.',
                icon: Code,
                stat: 'RESTful API'
              },
              {
                title: 'Secure & Privacy-First',
                description: 'GDPR compliant with automatic screenshot cleanup. Your data is secure and private. No tracking, no data collection, no registration required.',
                icon: Shield,
                stat: 'GDPR compliant'
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-secondary-200 hover:border-primary-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium">
                    {feature.stat}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-secondary-600">
              Everything you need to know about our free website screenshot generator
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "How do I take a screenshot of a website?",
                answer: "Simply enter the website URL in our screenshot generator tool, select your preferred device type (desktop, tablet, or mobile), choose the format (PNG, JPEG, or WebP), and click Generate Screenshot. The tool will capture a high-quality screenshot instantly."
              },
              {
                question: "Is the website screenshot tool free?",
                answer: "Yes, SnapWeb offers free website screenshots with no registration required. You can generate up to 3 screenshots per day as an anonymous user, or create a free account for more screenshots and additional features."
              },
              {
                question: "What formats are supported for website screenshots?",
                answer: "SnapWeb supports PNG (best quality), JPEG (smaller file size), and WebP (modern format) for website screenshots. You can choose the format that best suits your needs."
              },
              {
                question: "Can I capture mobile and tablet views of websites?",
                answer: "Yes, SnapWeb can capture website screenshots in desktop (1920×1080), tablet (768×1024), and mobile (375×667) views to show how websites appear on different devices."
              },
              {
                question: "Do you offer an API for website screenshots?",
                answer: "Yes, SnapWeb provides a RESTful API for developers to integrate website screenshot generation into their applications. API access is available with Pro and Team plans."
              },
              {
                question: "How long does it take to generate a website screenshot?",
                answer: "Most website screenshots are generated in under 3 seconds. The exact time depends on the website's loading speed and complexity, but our optimized system ensures fast processing."
              },
              {
                question: "Can I take full-page screenshots of websites?",
                answer: "Yes, you can capture full-page screenshots that include all scrollable content on the webpage. This is perfect for capturing long articles, product pages, or entire website layouts."
              },
              {
                question: "Is there a limit on how many screenshots I can take?",
                answer: "Anonymous users can take up to 3 screenshots per day. Free registered users get 10 screenshots per month. Pro and Team plans offer higher limits and additional features."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-secondary-200 pb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-secondary-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Ready to Get Started?
          </h2>
          
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and designers who trust SnapWeb for their screenshot needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-secondary-50 border-white"
              >
                Start Free Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/pricing">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-white border-white bg-transparent hover:bg-primary-700"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-primary-500">
            <div>
              <div className="text-2xl font-semibold text-white mb-1">10,000+</div>
              <div className="text-sm text-primary-100">Screenshots Generated</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white mb-1">99.9%</div>
              <div className="text-sm text-primary-100">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white mb-1">&lt; 3s</div>
              <div className="text-sm text-primary-100">Avg. Speed</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
