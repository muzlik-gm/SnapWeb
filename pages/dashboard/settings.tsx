import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export default function Settings() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    defaultFormat: 'png',
    defaultResolution: '1920x1080',
    emailNotifications: true,
    secretPhrase: '',
    customErrorImageUrl: '',
  });
  const [credits, setCredits] = useState<{current:number;usedThisMonth:number;monthlyAllowance:number;plan:string}|null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [profileRes, creditsRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/user/credits'),
        ]);
        const profileJson = await profileRes.json();
        const creditsJson = await creditsRes.json();
        if (profileJson.success) {
          const p = profileJson.data;
          setForm({
            defaultFormat: p?.preferences?.defaultFormat || 'png',
            defaultResolution: p?.preferences?.defaultResolution || '1920x1080',
            emailNotifications: p?.preferences?.emailNotifications ?? true,
            secretPhrase: p?.preferences?.secretPhrase || '',
            customErrorImageUrl: p?.preferences?.customErrorImageUrl || '',
          });
        }
        if (creditsJson.success) setCredits(creditsJson.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            defaultFormat: form.defaultFormat,
            defaultResolution: form.defaultResolution,
            emailNotifications: form.emailNotifications,
            secretPhrase: form.secretPhrase || undefined,
            customErrorImageUrl: form.customErrorImageUrl || undefined,
          }
        })
      });
      const json = await res.json();
      if (json.success) setSuccess('Settings saved'); else setError(json.error || 'Failed to save');
    } catch {
      setError('Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <Layout title="Settings - SnapWeb" description="Manage account settings">
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-secondary-900 mb-6">Settings</h1>

          {loading ? (
            <div className="flex items-center gap-2 text-secondary-600"><span>Loading...</span></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-secondary-200 rounded-lg p-6">
                  <h2 className="text-lg font-medium text-secondary-900 mb-4">Preferences</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-secondary-900">Default format</label>
                      <select className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" value={form.defaultFormat} onChange={e=>setForm(f=>({...f, defaultFormat: e.target.value}))}>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-900">Default resolution</label>
                      <input className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" value={form.defaultResolution} onChange={e=>setForm(f=>({...f, defaultResolution: e.target.value}))} />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input id="emails" type="checkbox" checked={form.emailNotifications} onChange={e=>setForm(f=>({...f, emailNotifications: e.target.checked}))} />
                      <label htmlFor="emails" className="text-sm text-secondary-800">Email notifications</label>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-secondary-200 rounded-lg p-6">
                  <h2 className="text-lg font-medium text-secondary-900 mb-4">Security</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-secondary-900">Secret phrase</label>
                      <input className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" placeholder="(not set)" value={form.secretPhrase} onChange={e=>setForm(f=>({...f, secretPhrase: e.target.value}))} />
                      <p className="text-xs text-secondary-500 mt-1">Optional phrase for custom security workflows.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-900">Custom error image URL</label>
                      <input className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-lg" placeholder="https://..." value={form.customErrorImageUrl} onChange={e=>setForm(f=>({...f, customErrorImageUrl: e.target.value}))} />
                      <p className="text-xs text-secondary-500 mt-1">Shown in tools that support custom error images.</p>
                    </div>
                  </div>
                </div>

                {error && <div className="p-3 bg-error-50 border border-error-200 rounded text-error-700">{error}</div>}
                {success && <div className="p-3 bg-success-50 border border-success-200 rounded text-success-700">{success}</div>}

                <Button onClick={handleSave} loading={saving}>Save settings</Button>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-secondary-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-secondary-900 mb-2">Account status</h3>
                  {credits ? (
                    <ul className="text-sm text-secondary-700 space-y-1">
                      <li>Plan: <span className="capitalize">{credits.plan}</span></li>
                      <li>Screenshots or PDFs left: {Math.max(0, (credits.monthlyAllowance - credits.usedThisMonth))}</li>
                      <li>Credits remaining: {credits.current}</li>
                    </ul>
                  ) : <span className="text-secondary-600">—</span>}
                </div>
                <div className="bg-white border border-secondary-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-secondary-900 mb-2">Billing</h3>
                  <Button variant="outline" onClick={async ()=>{
                    const r = await fetch('/api/stripe/create-portal',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({})});
                    const j = await r.json();
                    if (j.success && j.data.url) window.location.href = j.data.url;
                  }}>Open customer portal</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin?callbackUrl=/dashboard/settings', permanent: false } } as any;
  }
  return { props: {} } as any;
};
