import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Zap, Target, Code, Shield, Users, Globe, Clock, Award, Monitor, Image as ImageIcon, Download } from 'lucide-react';

export default function About() {
  return (
    <Layout
      title="About SnapWeb - Free Website Screenshot Generator | Professional Web Capture Tool"
      description="Learn about SnapWeb, the fastest and most reliable free website screenshot generator. Trusted by 50,000+ developers, marketers, and designers worldwide. Professional quality screenshots in seconds."
      keywords="about snapweb, website screenshot service, professional screenshot tool, web capture service, screenshot generator company, website screenshot API, free screenshot tool, web development tools, screenshot service provider"
    >
      <div className="bg-white">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold text-secondary-900 mb-6">
              About SnapWeb - Professional Website Screenshot Generator
            </h1>
            <p className="text-xl text-secondary-600 max-w-4xl mx-auto leading-relaxed">
              We're building the world's most reliable and developer-friendly website screenshot service. 
              Fast, accurate, and easy to integrate into any workflow. Trusted by developers, marketers, 
              and designers worldwide for professional website capture and automation.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-secondary-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-6">
                  Our Mission: Making Website Screenshots Simple
                </h2>
                <p className="text-lg text-secondary-700 mb-6 leading-relaxed">
                  We believe that generating website screenshots should be simple, fast, and reliable. 
                  Whether you're a developer building automation tools, a marketer creating presentations, 
                  a designer gathering inspiration, or a QA engineer testing responsive designs, SnapWeb makes it effortless.
                </p>
                <p className="text-lg text-secondary-700 leading-relaxed">
                  Our focus is on providing pixel-perfect screenshots with minimal latency, 
                  comprehensive device support, and an API that developers love to use. No complex setup, 
                  no software installation - just professional results in seconds.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-secondary-200">
                <h3 className="text-xl font-semibold text-secondary-900 mb-6">Why Choose SnapWeb?</h3>
                <div className="space-y-4">
                  {[
                    { icon: Zap, text: 'Screenshots generated in under 3 seconds' },
                    { icon: Target, text: 'Pixel-perfect accuracy across all devices' },
                    { icon: Code, text: 'Developer-friendly RESTful API' },
                    { icon: Shield, text: 'GDPR compliant and privacy-first' },
                    { icon: Users, text: 'Trusted by 50,000+ users worldwide' },
                    { icon: Globe, text: 'Works with any public website' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <item.icon className="w-5 h-5 text-success-600 mr-3 flex-shrink-0" />
                      <span className="text-secondary-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-4">
                Professional Website Screenshot Features
              </h2>
              <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
                Everything you need for professional website screenshots, web page capture, and screenshot automation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Monitor,
                  title: 'Multiple Device Views',
                  description: 'Capture websites in desktop (1920×1080), tablet (768×1024), and mobile (375×667) views to see how sites appear on different devices.'
                },
                {
                  icon: ImageIcon,
                  title: 'Multiple Format Support',
                  description: 'Generate screenshots in PNG (best quality), JPEG (smaller size), or WebP (modern format) to match your specific needs.'
                },
                {
                  icon: Download,
                  title: 'Instant Download',
                  description: 'Download your screenshots immediately or save them to your dashboard for future access and organization.'
                },
                {
                  icon: Code,
                  title: 'Developer API',
                  description: 'RESTful API with comprehensive documentation for seamless integration into your applications and automation workflows.'
                },
                {
                  icon: Shield,
                  title: 'Privacy & Security',
                  description: 'GDPR compliant with automatic screenshot cleanup. Your data is secure and private with no unnecessary tracking.'
                },
                {
                  icon: Clock,
                  title: 'Lightning Fast',
                  description: 'Generate professional website screenshots in under 3 seconds with our optimized rendering engine and global infrastructure.'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-secondary-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary-600 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                Trusted by Professionals Worldwide
              </h2>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto">
                Join thousands of developers, marketers, and designers who rely on SnapWeb for their website screenshot needs
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-semibold text-white mb-2">50,000+</div>
                <div className="text-primary-100">Active Users</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold text-white mb-2">1M+</div>
                <div className="text-primary-100">Screenshots Generated</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold text-white mb-2">99.9%</div>
                <div className="text-primary-100">Uptime</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-semibold text-white mb-2">&lt;3s</div>
                <div className="text-primary-100">Average Speed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-secondary-900 mb-4">
                Perfect for Every Use Case
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                From development to marketing, SnapWeb serves professionals across industries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Web Developers & QA Teams',
                  description: 'Automate visual regression testing, capture bug reports, and document website changes across different devices and browsers.',
                  icon: Code
                },
                {
                  title: 'Digital Marketers',
                  description: 'Create compelling presentations, capture competitor analysis, and generate website previews for social media and marketing campaigns.',
                  icon: Users
                },
                {
                  title: 'Web Designers',
                  description: 'Gather design inspiration, create mood boards, and showcase responsive designs across multiple device breakpoints.',
                  icon: Target
                },
                {
                  title: 'Content Creators',
                  description: 'Generate website thumbnails, create tutorials, and capture web content for blogs, videos, and educational materials.',
                  icon: Award
                }
              ].map((useCase, index) => (
                <div key={index} className="bg-secondary-50 p-8 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900">
                      {useCase.title}
                    </h3>
                  </div>
                  <p className="text-secondary-700 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary-900 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Start Generating Professional Screenshots Today
            </h2>
            <p className="text-lg text-secondary-300 mb-8 max-w-2xl mx-auto">
              Join the community of professionals who trust SnapWeb for their website screenshot needs. 
              Free to start, with powerful features for growing teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/'}
                size="lg"
                className="bg-primary-600 hover:bg-primary-700"
              >
                Try Free Now
              </Button>
              <Button
                onClick={() => window.location.href = '/pricing'}
                variant="outline"
                size="lg"
                className="text-white border-white bg-transparent hover:bg-white hover:text-secondary-900"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}