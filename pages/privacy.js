import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - SnapWeb</title>
        <meta
          name="description"
          content="SnapWeb Privacy Policy - Learn how we collect, use, and protect your personal information when using our screenshot generation service."
        />
        <link rel="canonical" href="https://snap-web-livid.vercel.app/privacy" />
      </Head>

      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> November 4, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                When you use SnapWeb, we may collect the following personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Email address (when you create an account)</li>
                <li>Name (when you create an account or contact us)</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Usage data and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Usage patterns and interactions with our service</li>
                <li>Screenshots you generate (temporarily stored)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Provide and improve our screenshot generation service</li>
                <li>Process payments and manage your account</li>
                <li>Send important service updates and notifications</li>
                <li>Provide customer support</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Retention</h2>
              <p className="text-gray-600 mb-4">We retain your data as follows:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Screenshots:</strong> Automatically deleted after 30 days for free users, 90 days for paid users</li>
                <li><strong>Account information:</strong> Retained until you delete your account</li>
                <li><strong>Usage logs:</strong> Retained for 90 days for service improvement</li>
                <li><strong>Payment records:</strong> Retained as required by law (typically 7 years)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell or rent your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Service providers:</strong> Stripe (payments), Vercel (hosting), analytics services</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">We use cookies and similar technologies for:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Authentication and session management</li>
                <li>Remembering your preferences</li>
                <li>Analytics and performance monitoring (Google Analytics)</li>
                <li>Advertising (Google AdSense)</li>
              </ul>
              <p className="text-gray-600 mb-4">
                You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Encryption in transit (HTTPS) and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
                <li>Object to processing of your personal information</li>
              </ul>
              <p className="text-gray-600 mb-4">
                To exercise these rights, contact us at privacy@snapweb.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                Our service integrates with third-party services that have their own privacy policies:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Stripe:</strong> Payment processing - <a href="https://stripe.com/privacy" className="text-blue-600 hover:text-blue-700">Stripe Privacy Policy</a></li>
                <li><strong>Google Analytics:</strong> Usage analytics - <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-700">Google Privacy Policy</a></li>
                <li><strong>Google AdSense:</strong> Advertising - <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-700">Google Privacy Policy</a></li>
                <li><strong>Vercel:</strong> Hosting and CDN - <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:text-blue-700">Vercel Privacy Policy</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe 
                your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this privacy policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last updated" date. 
                We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@snapweb.com<br />
                  <strong>Address:</strong> SnapWeb Privacy Team<br />
                  123 Tech Street, Suite 100<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}