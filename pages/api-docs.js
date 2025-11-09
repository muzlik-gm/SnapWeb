import Head from 'next/head';

export default function ApiDocs() {
  const codeExamples = {
    curl: `curl -X POST "https://snap-web-livid.vercel.app/api/screenshot" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "device": "desktop",
    "format": "webp",
    "fullPage": true
  }'`,
    
    nodejs: `const axios = require('axios');

const response = await axios.post('https://snap-web-livid.vercel.app/api/screenshot', {
  url: 'https://example.com',
  device: 'desktop',
  format: 'webp',
  fullPage: true
}, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

console.log(response.data);`,

    python: `import requests

response = requests.post('https://snap-web-livid.vercel.app/api/screenshot', 
  json={
    'url': 'https://example.com',
    'device': 'desktop',
    'format': 'webp',
    'fullPage': True
  },
  headers={
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
)

print(response.json())`,
  };

  return (
    <>
      <Head>
        <title>API Documentation - SnapWeb</title>
        <meta
          name="description"
          content="Complete API reference for SnapWeb screenshot generation. Integrate website screenshots into your applications with our REST API."
        />
        <meta property="og:title" content="SnapWeb API Documentation" />
        <meta property="og:description" content="REST API for automated website screenshot generation. Complete reference with examples." />
        <link rel="canonical" href="https://snap-web-livid.vercel.app/api-docs" />
      </Head>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
            <p className="text-xl text-gray-600">
              Integrate SnapWeb screenshot generation into your applications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="sticky top-8">
                <ul className="space-y-2">
                  <li><a href="#authentication" className="text-blue-600 hover:text-blue-800">Authentication</a></li>
                  <li><a href="#endpoints" className="text-blue-600 hover:text-blue-800">Endpoints</a></li>
                  <li><a href="#parameters" className="text-blue-600 hover:text-blue-800">Parameters</a></li>
                  <li><a href="#responses" className="text-blue-600 hover:text-blue-800">Responses</a></li>
                  <li><a href="#examples" className="text-blue-600 hover:text-blue-800">Code Examples</a></li>
                  <li><a href="#rate-limits" className="text-blue-600 hover:text-blue-800">Rate Limits</a></li>
                  <li><a href="#errors" className="text-blue-600 hover:text-blue-800">Error Codes</a></li>
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Quick Start */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
                <p className="text-gray-600 mb-4">
                  Get started with the SnapWeb API in minutes. Generate your first screenshot with a simple HTTP request.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{codeExamples.curl}</code>
                  </pre>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                <p className="text-gray-600 mb-4">
                  All API requests require authentication using an API key. Include your API key in the Authorization header:
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
                </div>
                <p className="text-gray-600 mt-4">
                  Get your API key from your <a href="/dashboard" className="text-blue-600 hover:text-blue-800">dashboard</a> after upgrading to Pro.
                </p>
              </section>

              {/* Endpoints */}
              <section id="endpoints">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Endpoints</h2>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Screenshot</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                    <code className="text-sm">/api/screenshot</code>
                  </div>
                  <p className="text-gray-600">Generate a screenshot of any website URL.</p>
                </div>
              </section>

              {/* Parameters */}
              <section id="parameters">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Parameters</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Parameter</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Required</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">url</td>
                        <td className="px-4 py-3 text-sm">string</td>
                        <td className="px-4 py-3 text-sm">Yes</td>
                        <td className="px-4 py-3 text-sm">The website URL to screenshot</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">device</td>
                        <td className="px-4 py-3 text-sm">string</td>
                        <td className="px-4 py-3 text-sm">No</td>
                        <td className="px-4 py-3 text-sm">Device type: desktop, tablet, mobile (default: desktop)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">format</td>
                        <td className="px-4 py-3 text-sm">string</td>
                        <td className="px-4 py-3 text-sm">No</td>
                        <td className="px-4 py-3 text-sm">Image format: png, jpeg, webp (default: png)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">fullPage</td>
                        <td className="px-4 py-3 text-sm">boolean</td>
                        <td className="px-4 py-3 text-sm">No</td>
                        <td className="px-4 py-3 text-sm">Capture full page or viewport only (default: true)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">quality</td>
                        <td className="px-4 py-3 text-sm">number</td>
                        <td className="px-4 py-3 text-sm">No</td>
                        <td className="px-4 py-3 text-sm">JPEG quality 1-100 (default: 90)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Response */}
              <section id="responses">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Format</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Response</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-6">
                  <pre className="text-green-400 text-sm">
                    <code>{`{
  "success": true,
  "imageUrl": "https://snap-web-livid.vercel.app/screenshots/abc123.png",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "fileSize": 245760,
    "format": "png",
    "captureTime": 1234
  }
}`}</code>
                  </pre>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Response</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-red-400 text-sm">
                    <code>{`{
  "success": false,
  "error": "Invalid URL provided",
  "code": "INVALID_URL"
}`}</code>
                  </pre>
                </div>
              </section>

              {/* Code Examples */}
              <section id="examples">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Node.js</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{codeExamples.nodejs}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Python</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{codeExamples.python}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm">
                    <li><strong>Free Plan:</strong> 10 requests per month</li>
                    <li><strong>Pro Plan:</strong> 500 requests per month, 10 requests per minute</li>
                    <li><strong>Team Plan:</strong> Custom limits based on your needs</li>
                  </ul>
                </div>
              </section>

              {/* Error Codes */}
              <section id="errors">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Codes</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">INVALID_URL</td>
                        <td className="px-4 py-3 text-sm">400</td>
                        <td className="px-4 py-3 text-sm">The provided URL is invalid or malformed</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">UNAUTHORIZED</td>
                        <td className="px-4 py-3 text-sm">401</td>
                        <td className="px-4 py-3 text-sm">Invalid or missing API key</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">RATE_LIMITED</td>
                        <td className="px-4 py-3 text-sm">429</td>
                        <td className="px-4 py-3 text-sm">Rate limit exceeded</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono">CAPTURE_FAILED</td>
                        <td className="px-4 py-3 text-sm">500</td>
                        <td className="px-4 py-3 text-sm">Failed to capture screenshot</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Use Case Example */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Use Case: Marketing Thumbnails</h2>
                <p className="text-gray-600 mb-4">
                  Generate marketing thumbnails for multiple pages automatically:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{`const urls = [
  'https://example.com',
  'https://example.com/about',
  'https://example.com/pricing'
];

for (const url of urls) {
  const response = await fetch('/api/screenshot', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      device: 'desktop',
      format: 'webp',
      fullPage: false
    })
  });
  
  const result = await response.json();
  console.log(\`Screenshot for \${url}: \${result.imageUrl}\`);
}`}</code>
                  </pre>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}