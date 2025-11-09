import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Layout from '@/components/Layout';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ApiBuilder() {
  const [url, setUrl] = useState('https://example.com');
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [format, setFormat] = useState<'png'|'jpeg'|'webp'>('png');
  const [fullPage, setFullPage] = useState(false);
  const [delay, setDelay] = useState(2000);
  const [apiKeyMasked, setApiKeyMasked] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/user/api-key');
      const json = await res.json();
      if (json.success) {
        setHasApiKey(Boolean(json.data.hasApiKey));
        setApiKeyMasked(json.data.apiKey);
      }
    })();
  }, []);

  const handleGenerateKey = async () => {
    setLoadingKey(true);
    try {
      const res = await fetch('/api/user/api-key', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        // Show partially masked in UI
        const k: string = json.data.apiKey;
        setApiKeyMasked(k.substring(0, 8) + '...');
        setHasApiKey(true);
        alert('API key generated. Copy it now from the response modal.');
      } else {
        alert(json.error || 'Failed to generate API key');
      }
    } finally {
      setLoadingKey(false);
    }
  };

  const payload = JSON.stringify({ url, device, format, fullPage, delay }, null, 2);
  const curl = `curl -X POST "${typeof window !== 'undefined' ? window.location.origin : ''}/api/screenshot" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: {{API_KEY}}" \\
  -d '${payload.replace(/\n/g, ' ')}'`;

  return (
    <Layout title="API Builder - SnapWeb" description="Build and test API requests">
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-secondary-900">API Builder</h1>
            <div className="flex items-center gap-3">
              {hasApiKey ? (
                <span className="text-sm text-secondary-600">API key: {apiKeyMasked || '—'}</span>
              ) : (
                <Button size="sm" onClick={handleGenerateKey} loading={loadingKey}>
                  Generate API key
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-900">URL</label>
                  <input className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" value={url} onChange={e=>setUrl(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary-900">Device</label>
                    <select className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" value={device} onChange={e=>setDevice(e.target.value as any)}>
                      <option value="desktop">desktop</option>
                      <option value="tablet">tablet</option>
                      <option value="mobile">mobile</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-900">Format</label>
                    <select className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" value={format} onChange={e=>setFormat(e.target.value as any)}>
                      <option value="png">png</option>
                      <option value="jpeg">jpeg</option>
                      <option value="webp">webp</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input id="fullPage" type="checkbox" checked={fullPage} onChange={e=>setFullPage(e.target.checked)} />
                    <label htmlFor="fullPage" className="text-sm text-secondary-800">Full page</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-900">Delay (ms)</label>
                    <input type="number" className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" value={delay} onChange={e=>setDelay(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-secondary-900 mb-2">cURL</h3>
              <pre className="text-xs bg-secondary-50 p-3 rounded border border-secondary-200 overflow-auto" style={{whiteSpace:'pre-wrap'}}>{curl}</pre>
              <p className="text-xs text-secondary-500 mt-2">Replace {'{{API_KEY}}'} with your actual key.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: { destination: '/auth/signin?callbackUrl=/dashboard/api-builder', permanent: false },
    } as any;
  }
  return { props: {} } as any;
};
