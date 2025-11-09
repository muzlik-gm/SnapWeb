import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/utils';
import type { ScreenshotResponse } from '@/types';
import { 
  Monitor, Globe, Camera, Download, CheckCircle, ArrowRight
} from 'lucide-react';

export default function WebsiteScreenshot() {
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState('desktop');
  const [format, setFormat] = useState('png');
  const [fullPage, setFullPage] = useState(false);
  const [delay, setDelay] = useState(3000); // Default 3 seconds
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreenshotResponse | null>(null);
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

      const data = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || data.message || 'Failed to generate website screenshot');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Website Screenshot Tool - Capture Any Website Instantly | SnapWeb"
      description="Take website screenshots instantly with our free online tool. Capture any website in desktop, tablet, or mobile view. High-quality website screenshots in PNG, JPEG, WebP formats."
      keywords="website screenshot, website screenshot tool, website screenshot online, website screenshot free, website screenshot generator, website screenshot service, website screenshot API, website screenshot capture, website screenshot maker, website screenshot online free, website screenshot tool free, website screenshot generator free, website screenshot service free, website screenshot API free, website screenshot capture free, website screenshot maker free, take website screenshot, capture website screenshot, website screenshot online tool, website screenshot generator online, website screenshot tool online, website screenshot service online, website screenshot API online, website screenshot capture online, website screenshot maker online, free website screenshot, free website screenshot tool, free website screenshot online, free website screenshot generator, free website screenshot service, free website screenshot API, free website screenshot capture, free website screenshot maker"
    >
      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-secondary-900 mb-6 leading-tight">
              Website Screenshot Tool
              <br />
              <span className="text-primary-600">Capture Any Website Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              The ultimate website screenshot tool for professionals. Capture pixel-perfect website screenshots in seconds. Perfect for web developers, designers, marketers, and anyone who needs high-quality website captures.
            </p>
          </div>

          {/* Website Screenshot Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-secondary-200 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                  Free Website Screenshot Tool
                </h2>
                <p className="text-secondary-600">
                  Enter any website URL to capture a professional screenshot
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-secondary-900 mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., google.com, github.com)"
                    required
                    className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="device" className="block text-sm font-medium text-secondary-900 mb-1.5">
                      Device View
                    </label>
                    <select
                      id="device"
                      value={device}
                      onChange={(e) => setDevice(e.target.value)}
                      className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    >
                      <option value="desktop">Desktop View (1920×1080)</option>
                      <option value="tablet">Tablet View (768×1024)</option>
                      <option value="mobile">Mobile View (375×667)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="format" className="block text-sm font-medium text-secondary-900 mb-1.5">
                      Screenshot Format
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fullPage"
                    checked={fullPage}
                    onChange={(e) => setFullPage(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-secondary-300 rounded"
                  />
                  <label htmlFor="fullPage" className="ml-2 text-sm font-medium text-secondary-700">
                    Capture full website page (including scrollable content)
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={!url}
              >
                {loading ? 'Capturing Website Screenshot...' : 'Take Website Screenshot'}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              {result && result.imageUrl && (
                <div className="mt-6 p-6 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                    <h3 className="text-lg font-semibold text-success-900">Website Screenshot Captured Successfully</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-2 rounded-lg border border-secondary-200">
                      <img
                        src={result.imageUrl}
                        alt="Website screenshot"
                        className="w-full h-auto rounded"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                      />
                    </div>

                    {result.metadata && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-secondary-600">Screenshot Size:</span>
                          <span className="ml-2 font-medium text-secondary-900">
                            {result.metadata.width} × {result.metadata.height}px
                          </span>
                        </div>
                        <div>
                          <span className="text-secondary-600">File Size:</span>
                          <span className="ml-2 font-medium text-secondary-900">
                            {formatFileSize(result.metadata.fileSize)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={result.imageUrl} download className="flex-1">
                        <Button variant="primary" size="md" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Website Screenshot
                        </Button>
                      </a>
                      
                      {!session && (
                        <Link href="/auth/signup" className="flex-1">
                          <Button variant="outline" size="md" className="w-full">
                            Sign Up to Save Screenshots
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

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-4">
              How to Take Website Screenshots
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Capture professional website screenshots in three simple steps with our advanced website screenshot tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Website URL',
                description: 'Simply paste any website URL you want to capture. Our tool works with any public website, blog, e-commerce site, or web application.',
                icon: Globe,
              },
              {
                step: '2',
                title: 'Choose Screenshot Settings',
                description: 'Select your preferred device view (desktop, tablet, mobile), format (PNG, JPEG, WebP), and whether to capture the full page.',
                icon: Monitor,
              },
              {
                step: '3',
                title: 'Download Your Screenshot',
                description: 'Get your high-quality website screenshot instantly. Download immediately or create an account to save and manage your screenshots.',
                icon: Camera,
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-secondary-200 h-full">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Start Taking Website Screenshots Today
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use our website screenshot tool for their projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-secondary-50 border-white"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/api-docs">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-primary-700"
              >
                View API Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}