import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/utils';
import type { ScreenshotResponse } from '@/types';
import { 
  Monitor, Tablet, Smartphone, Image as ImageIcon, Download, 
  CheckCircle, Zap, Target, Code, Shield, ArrowRight
} from 'lucide-react';

export default function ScreenshotGenerator() {
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
        setError(data.error || data.message || 'Failed to generate screenshot');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Screenshot Generator - Free Online Website Screenshot Tool | SnapWeb"
      description="Professional screenshot generator for websites. Capture any website instantly with our free online screenshot tool. Desktop, tablet, mobile views. PNG, JPEG, WebP formats supported."
      keywords="screenshot generator, website screenshot generator, online screenshot generator, free screenshot generator, web screenshot generator, screenshot tool generator, website capture generator, web page screenshot generator, screenshot maker generator, screenshot service generator, screenshot generator online, screenshot generator free, screenshot generator tool, website screenshot generator free, web screenshot generator free, screenshot generator online free, screenshot generator API, screenshot generator service, screenshot generator software, screenshot generator app, screenshot generator website, screenshot generator web, screenshot generator online tool, screenshot generator free online, screenshot generator tool free, screenshot generator service free, screenshot generator API free, screenshot generator software free, screenshot generator app free, screenshot generator website free, screenshot generator web free"
    >
      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-secondary-900 mb-6 leading-tight">
              Professional Screenshot Generator
              <br />
              <span className="text-primary-600">Capture Any Website Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              The most advanced screenshot generator for websites. Generate pixel-perfect screenshots in seconds with our professional online tool. Perfect for developers, designers, marketers, and QA teams worldwide.
            </p>
          </div>

          {/* Screenshot Generator Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-secondary-200 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                  Free Screenshot Generator
                </h2>
                <p className="text-secondary-600">
                  Generate professional website screenshots with our advanced screenshot generator
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
                    placeholder="Enter any website URL (e.g., example.com)"
                    required
                    className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {error && (
                <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              {result && result.imageUrl && (
                <div className="mt-6 p-6 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                    <h3 className="text-lg font-semibold text-success-900">Screenshot Generated Successfully</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-2 rounded-lg border border-secondary-200">
                      <img
                        src={result.imageUrl}
                        alt="Generated screenshot"
                        className="w-full h-auto rounded"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                      />
                    </div>

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

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={result.imageUrl} download className="flex-1">
                        <Button variant="primary" size="md" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Screenshot
                        </Button>
                      </a>
                      
                      {!session && (
                        <Link href="/auth/signup" className="flex-1">
                          <Button variant="outline" size="md" className="w-full">
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

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-4">
              Advanced Screenshot Generator Features
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Our screenshot generator offers professional-grade features for capturing perfect website screenshots every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Lightning Fast Generation',
                description: 'Generate screenshots in under 3 seconds with our optimized screenshot generator engine.',
                icon: Zap,
              },
              {
                title: 'Multiple Device Views',
                description: 'Capture desktop, tablet, and mobile views with our responsive screenshot generator.',
                icon: Monitor,
              },
              {
                title: 'High Quality Output',
                description: 'Professional quality screenshots with pixel-perfect accuracy from our generator.',
                icon: Target,
              },
              {
                title: 'Developer API',
                description: 'Integrate our screenshot generator into your applications with our RESTful API.',
                icon: Code,
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-secondary-200">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
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

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Start Using Our Screenshot Generator
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our screenshot generator for their website capture needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-secondary-50 border-white"
              >
                Start Free Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/pricing">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-primary-700"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}