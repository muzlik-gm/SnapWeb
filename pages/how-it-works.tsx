import Layout from '@/components/Layout';

export default function HowItWorks() {
  return (
    <Layout title="How it works - SnapWeb" description="How SnapWeb works">
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-semibold text-secondary-900 mb-6">How it works</h1>
          <div className="space-y-6 bg-white border border-secondary-200 rounded-lg p-6">
            <ol className="list-decimal pl-6 space-y-3 text-secondary-800">
              <li>Enter the website URL you want to capture.</li>
              <li>Pick device, format, and whether to capture full page.</li>
              <li>We load the page, wait for content and network to be idle, and take a high-quality screenshot.</li>
              <li>Download instantly or find it later in your dashboard.</li>
            </ol>
            <p className="text-secondary-600">For developers, use our REST API from your apps. See API builder and docs.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
