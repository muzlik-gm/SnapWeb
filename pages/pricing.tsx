import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { pricingTiers } from '@/lib/utils';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';

export default function Pricing() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string, priceId?: string) => {
    if (!session) {
      window.location.href = '/auth/signin?callbackUrl=/pricing';
      return;
    }

    try {
      setLoading(priceId || tierId);
      
      const body: any = {
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      };
      if (priceId) body.priceId = priceId; else body.plan = tierId;

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success && result.data.url) {
        window.location.href = result.data.url;
      } else {
        alert(result.error || 'Failed to create checkout session');
      }
    } catch (error) {
      alert('Failed to create checkout session');
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      setLoading('portal');
      
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/dashboard`,
        }),
      });

      const result = await response.json();

      if (result.success && result.data.url) {
        window.location.href = result.data.url;
      } else {
        alert(result.error || 'Failed to access billing portal');
      }
    } catch (error) {
      alert('Failed to access billing portal');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                  <Button size="sm" onClick={handleManageBilling} disabled={loading === 'portal'}>
                    {loading === 'portal' ? 'Loading...' : 'Manage Billing'}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold text-secondary-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-lg border overflow-hidden ${
                tier.popular ? 'border-primary-600 shadow-lg' : 'border-secondary-200'
              }`}
            >
              {tier.popular && (
                <div className="bg-primary-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-secondary-900 mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-semibold text-secondary-900">${tier.price}</span>
                  <span className="text-secondary-600">/month</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-success-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.id === 'free' ? (
                  <Link href={session ? '/dashboard' : '/auth/signup'}>
                    <Button className="w-full" variant={tier.popular ? 'primary' : 'outline'}>
                      {session ? 'Current Plan' : 'Get Started Free'}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full"
                    variant={tier.popular ? 'primary' : 'outline'}
                    onClick={() => handleSubscribe(tier.id, tier.stripePriceId || undefined)}
                    disabled={loading === (tier.stripePriceId || tier.id)}
                    loading={loading === (tier.stripePriceId || tier.id)}
                  >
                    Subscribe to {tier.name}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-secondary-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-secondary-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: 'Can I change plans at any time?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.'
              },
              {
                question: 'What happens to my screenshots if I downgrade?',
                answer: 'Your existing screenshots will remain accessible. However, your monthly credit allowance will be adjusted to match your new plan.'
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact our support team if you\'re not satisfied with the service.'
              },
              {
                question: 'Is there an API available?',
                answer: 'Yes, API access is included with Pro and Team plans. You\'ll get an API key to integrate SnapWeb into your applications and workflows.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-secondary-200 p-6">
                <div className="flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-secondary-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-white rounded-lg border border-secondary-200 p-12">
          <h2 className="text-3xl font-semibold text-secondary-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and marketers who trust SnapWeb for their screenshot needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={session ? '/dashboard' : '/auth/signup'}>
              <Button size="lg" className="w-full sm:w-auto">
                {session ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
};
