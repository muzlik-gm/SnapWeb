import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - SnapWeb</title>
        <meta
          name="description"
          content="SnapWeb Terms of Service - Legal terms and conditions for using our website screenshot generation service."
        />
        <link rel="canonical" href="https://snap-web-livid.vercel.app/terms" />
      </Head>

      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> November 4, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using SnapWeb ("the Service"), you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                SnapWeb is a website screenshot generation service that allows users to capture screenshots 
                of websites in various formats and resolutions. The service includes both web interface and 
                API access for different subscription tiers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To access certain features of the Service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Updating your information to keep it current</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Screenshot websites without proper authorization where required</li>
                <li>Attempt to circumvent usage limits or restrictions</li>
                <li>Use the service for malicious or harmful purposes</li>
                <li>Overload or interfere with the service infrastructure</li>
                <li>Screenshot illegal content or content that violates third-party rights</li>
                <li>Reverse engineer or attempt to extract the source code of our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription and Billing</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Subscription Plans</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Free Plan:</strong> 10 screenshots per month, no API access</li>
                <li><strong>Pro Plan:</strong> 500 screenshots per month, API access, priority processing</li>
                <li><strong>Team Plan:</strong> Custom quotas, team features, SLA support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Billing Terms</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Paid subscriptions are billed in advance on a monthly basis</li>
                <li>You may cancel your subscription at any time</li>
                <li>Cancellations take effect at the end of the current billing period</li>
                <li>No refunds for partial months unless required by law</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content Ownership</h2>
              <p className="text-gray-600 mb-4">
                You retain ownership of the screenshots you generate using our service. However, you are 
                responsible for ensuring you have the right to screenshot the websites you capture. 
                We do not claim ownership of your screenshots, but we may temporarily store them to provide our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
              <p className="text-gray-600 mb-4">
                We strive to maintain high service availability, but we do not guarantee uninterrupted access. 
                The service may be temporarily unavailable due to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Scheduled maintenance</li>
                <li>Technical difficulties</li>
                <li>Third-party service outages</li>
                <li>Force majeure events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                In no event shall SnapWeb, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including 
                without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
                from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Refund Policy</h2>
              <p className="text-gray-600 mb-4">
                We offer a 30-day money-back guarantee for all paid plans. To request a refund:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Contact us within 30 days of your initial payment</li>
                <li>Provide a reason for the refund request</li>
                <li>Refunds will be processed within 5-10 business days</li>
                <li>Refunds are issued to the original payment method</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior 
                notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-600 mb-4">
                Upon termination, your right to use the Service will cease immediately. If you wish to terminate 
                your account, you may simply discontinue using the Service or contact us to delete your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                of the Service, to understand our practices regarding the collection and use of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The Service and its original content, features, and functionality are owned by SnapWeb and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual 
                property or proprietary rights laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. 
                What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be interpreted and governed by the laws of the State of California, United States, 
                without regard to conflict of law provisions. Any disputes arising from these terms will be resolved 
                in the courts of California.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@snapweb.com<br />
                  <strong>Address:</strong> SnapWeb Legal Department<br />
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