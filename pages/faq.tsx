import Layout from '@/components/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, HelpCircle, CheckCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I take a screenshot of a website?",
          answer: "Simply enter the website URL in our screenshot generator tool, select your preferred device type (desktop, tablet, or mobile), choose the format (PNG, JPEG, or WebP), and click Generate Screenshot. The tool will capture a high-quality screenshot instantly."
        },
        {
          question: "Is the website screenshot tool free?",
          answer: "Yes, SnapWeb offers free website screenshots with no registration required. You can generate up to 3 screenshots per day as an anonymous user, or create a free account for more screenshots and additional features."
        },
        {
          question: "Do I need to register to use the screenshot tool?",
          answer: "No registration is required for basic usage. Anonymous users can take up to 3 screenshots per day. However, creating a free account gives you access to more screenshots, screenshot history, and additional features."
        },
        {
          question: "What websites can I screenshot?",
          answer: "You can screenshot any publicly accessible website. This includes blogs, e-commerce sites, portfolios, documentation sites, social media profiles, and web applications. Private or password-protected sites cannot be captured."
        }
      ]
    },
    {
      category: "Screenshot Features",
      questions: [
        {
          question: "What formats are supported for website screenshots?",
          answer: "SnapWeb supports PNG (best quality), JPEG (smaller file size), and WebP (modern format) for website screenshots. You can choose the format that best suits your needs."
        },
        {
          question: "Can I capture mobile and tablet views of websites?",
          answer: "Yes, SnapWeb can capture website screenshots in desktop (1920×1080), tablet (768×1024), and mobile (375×667) views to show how websites appear on different devices."
        },
        {
          question: "Can I take full-page screenshots of websites?",
          answer: "Yes, you can capture full-page screenshots that include all scrollable content on the webpage. This is perfect for capturing long articles, product pages, or entire website layouts."
        },
        {
          question: "What is the maximum resolution for screenshots?",
          answer: "Desktop screenshots are captured at 1920×1080 resolution, tablet at 768×1024, and mobile at 375×667. Full-page screenshots can be much taller depending on the website content."
        },
        {
          question: "How long does it take to generate a website screenshot?",
          answer: "Most website screenshots are generated in under 3 seconds. The exact time depends on the website's loading speed and complexity, but our optimized system ensures fast processing."
        }
      ]
    },
    {
      category: "Technical Questions",
      questions: [
        {
          question: "Do you offer an API for website screenshots?",
          answer: "Yes, SnapWeb provides a RESTful API for developers to integrate website screenshot generation into their applications. API access is available with Pro and Team plans."
        },
        {
          question: "What programming languages can I use with the API?",
          answer: "Our REST API can be used with any programming language that supports HTTP requests, including JavaScript, Python, PHP, Ruby, Java, C#, Go, and more."
        },
        {
          question: "Can I use the screenshot tool for commercial purposes?",
          answer: "Yes, you can use SnapWeb for commercial purposes. Our Pro and Team plans are specifically designed for businesses and commercial use cases."
        },
        {
          question: "Is there a rate limit for the API?",
          answer: "Yes, rate limits vary by plan. Free users have basic limits, Pro users get higher limits, and Team users get the highest limits. Check our pricing page for specific details."
        },
        {
          question: "Can I integrate the screenshot tool into my website?",
          answer: "Yes, you can integrate our screenshot functionality into your website using our API. We provide comprehensive documentation and code examples for easy integration."
        }
      ]
    },
    {
      category: "Pricing and Plans",
      questions: [
        {
          question: "Is there a limit on how many screenshots I can take?",
          answer: "Anonymous users can take up to 3 screenshots per day. Free registered users get 10 screenshots per month. Pro and Team plans offer higher limits and additional features."
        },
        {
          question: "What's included in the free plan?",
          answer: "The free plan includes 10 screenshots per month, all device views (desktop, tablet, mobile), all formats (PNG, JPEG, WebP), full-page screenshots, and basic support."
        },
        {
          question: "Can I upgrade or downgrade my plan anytime?",
          answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly."
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal. All payments are processed securely through Stripe."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "Why is my screenshot not generating?",
          answer: "Common issues include: invalid URL format, website blocking automated access, temporary server issues, or network connectivity problems. Try using the full URL with https:// prefix."
        },
        {
          question: "The website looks different in the screenshot than in my browser. Why?",
          answer: "This can happen due to different browser engines, cached content, or dynamic content that loads after page load. Our tool captures the initial page load state."
        },
        {
          question: "Can I screenshot password-protected or private websites?",
          answer: "No, our tool can only capture publicly accessible websites. Password-protected, private, or intranet sites cannot be screenshotted for security reasons."
        },
        {
          question: "Why is my full-page screenshot cut off?",
          answer: "Some websites have infinite scroll or very long content. We have reasonable limits to prevent extremely large files. Try capturing specific sections instead of the entire page."
        },
        {
          question: "The screenshot is blurry or low quality. How can I fix this?",
          answer: "Use PNG format for the highest quality. JPEG compression can cause some quality loss. Also, ensure you're viewing the screenshot at its native resolution."
        }
      ]
    },
    {
      category: "Privacy and Security",
      questions: [
        {
          question: "Do you store the websites I screenshot?",
          answer: "We temporarily store screenshots for delivery and don't keep copies of the websites themselves. Screenshots are automatically deleted after the retention period (7 days for anonymous users, 30 days for registered users)."
        },
        {
          question: "Is my data secure?",
          answer: "Yes, we take security seriously. All data is transmitted over HTTPS, we don't store sensitive information, and we're GDPR compliant with automatic data cleanup."
        },
        {
          question: "Can other users see my screenshots?",
          answer: "No, all screenshots are private by default. Only you have access to your screenshots through your account or the direct download link."
        },
        {
          question: "Do you track or log my usage?",
          answer: "We only collect minimal usage statistics for service improvement and billing purposes. We don't track personal browsing habits or store unnecessary data."
        }
      ]
    }
  ];

  return (
    <Layout
      title="Frequently Asked Questions - Website Screenshot Tool | SnapWeb"
      description="Find answers to common questions about our website screenshot tool. Learn how to capture website screenshots, API usage, pricing, troubleshooting, and more."
      keywords="website screenshot FAQ, screenshot tool questions, website capture help, screenshot generator support, website screenshot troubleshooting, screenshot tool guide, website screenshot tutorial, screenshot API questions, website screenshot pricing, screenshot tool features, website capture FAQ, screenshot service help, website screenshot support, screenshot generator FAQ, website screenshot documentation, screenshot tool manual, website capture guide, screenshot API help, website screenshot tips, screenshot tool tricks"
    >
      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-semibold text-secondary-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Everything you need to know about our website screenshot tool. Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          <div className="text-center mb-12">
            <Link href="/">
              <Button size="lg" className="mr-4">
                Try Screenshot Tool
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-semibold text-secondary-900 mb-8 pb-4 border-b border-secondary-200">
                {category.category}
              </h2>
              
              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="bg-white rounded-lg border border-secondary-200 p-6">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-secondary-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-secondary-900 mb-4">
              Quick Links
            </h2>
            <p className="text-lg text-secondary-600">
              Popular pages and resources to help you get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Screenshot Generator",
                description: "Start taking website screenshots instantly",
                link: "/",
                icon: "🖼️"
              },
              {
                title: "API Documentation",
                description: "Integrate screenshots into your applications",
                link: "/api-docs",
                icon: "📚"
              },
              {
                title: "Pricing Plans",
                description: "Choose the right plan for your needs",
                link: "/pricing",
                icon: "💰"
              },
              {
                title: "Website Screenshot",
                description: "Specialized tool for website captures",
                link: "/website-screenshot",
                icon: "🌐"
              },
              {
                title: "Contact Support",
                description: "Get help from our support team",
                link: "/contact",
                icon: "💬"
              },
              {
                title: "About SnapWeb",
                description: "Learn more about our company",
                link: "/about",
                icon: "ℹ️"
              }
            ].map((item, index) => (
              <Link key={index} href={item.link}>
                <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200 hover:border-primary-600 transition-colors cursor-pointer h-full">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Our support team is here to help you get the most out of our website screenshot tool.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-secondary-50 border-white"
              >
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white bg-transparent hover:bg-primary-700"
              >
                Try Screenshot Tool
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}