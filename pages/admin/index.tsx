import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';

function useAdminToken() {
  const [token, setToken] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('ADMIN_SYNC_SECRET') || '';
      setToken(t);
    }
  }, []);
  const save = (v: string) => {
    setToken(v);
    if (typeof window !== 'undefined') localStorage.setItem('ADMIN_SYNC_SECRET', v);
  };
  return { token, setToken: save };
}

async function apiFetch(path: string, method: 'GET'|'POST', token: string, body?: any) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json?.error || `Request failed: ${res.status}`);
  }
  return json;
}

export default function AdminPage() {
  const { token, setToken } = useAdminToken();

  const [searchEmail, setSearchEmail] = useState('');
  const [searchUserId, setSearchUserId] = useState('');
  const [foundUser, setFoundUser] = useState<any | null>(null);
  const [syncUserId, setSyncUserId] = useState('');
  const [syncEmail, setSyncEmail] = useState('');
  const [syncCus, setSyncCus] = useState('');
  const [setPlanUserId, setSetPlanUserId] = useState('');
  const [setPlanValue, setSetPlanValue] = useState<'free'|'pro'|'team'>('pro');
  const [renewUserId, setRenewUserId] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const disabled = useMemo(() => !token, [token]);

  const handleSearch = async () => {
    setLoading(true); setMessage(null);
    try {
      const res = await apiFetch('/api/admin/users/search', 'POST', token, { email: searchEmail || undefined, userId: searchUserId || undefined });
      setFoundUser(res.data);
      setMessage('User loaded');
    } catch (e: any) {
      setMessage(e.message);
      setFoundUser(null);
    } finally { setLoading(false); }
  };

  const handleSync = async () => {
    setLoading(true); setMessage(null);
    try {
      const res = await apiFetch('/api/admin/sync-subscription', 'POST', token, {
        userId: syncUserId || undefined,
        email: syncEmail || undefined,
        stripeCustomerId: syncCus || undefined,
      });
      setMessage('Synced: ' + JSON.stringify(res.data));
    } catch (e: any) {
      setMessage(e.message);
    } finally { setLoading(false); }
  };

  const handleSetPlan = async () => {
    setLoading(true); setMessage(null);
    try {
      await apiFetch('/api/admin/users/set-plan', 'POST', token, { userId: setPlanUserId, plan: setPlanValue });
      setMessage('Plan updated');
    } catch (e: any) {
      setMessage(e.message);
    } finally { setLoading(false); }
  };

  const handleRenew = async () => {
    setLoading(true); setMessage(null);
    try {
      const res = await apiFetch('/api/admin/users/renew-credits', 'POST', token, { userId: renewUserId });
      setMessage(`Credits renewed: ${res.data.oldCredits} -> ${res.data.newCredits}`);
    } catch (e: any) {
      setMessage(e.message);
    } finally { setLoading(false); }
  };

  const handleListUsers = async () => {
    setLoading(true); setMessage(null);
    try {
      const res = await apiFetch('/api/admin/users/list?limit=25', 'GET', token);
      setUsers(res.data);
      setMessage('Users loaded');
    } catch (e: any) {
      setMessage(e.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ADMIN_SYNC_SECRET"
                className="border rounded px-2 py-1 w-64"
              />
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                onClick={handleListUsers}
                disabled={disabled || loading}
              >
                Load Users
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {message && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              {message}
            </div>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded shadow p-4 space-y-3">
              <h2 className="font-semibold">Search User</h2>
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1" placeholder="Email" value={searchEmail} onChange={e=>setSearchEmail(e.target.value)} />
                <input className="border rounded px-2 py-1" placeholder="User ID" value={searchUserId} onChange={e=>setSearchUserId(e.target.value)} />
              </div>
              <button className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50" disabled={disabled || loading} onClick={handleSearch}>Search</button>
              {foundUser && (
                <pre className="text-xs bg-gray-50 border rounded p-2 overflow-auto max-h-64">{JSON.stringify(foundUser, null, 2)}</pre>
              )}
            </div>

            <div className="bg-white rounded shadow p-4 space-y-3">
              <h2 className="font-semibold">Sync Subscription</h2>
              <div className="grid grid-cols-3 gap-2">
                <input className="border rounded px-2 py-1" placeholder="User ID" value={syncUserId} onChange={e=>setSyncUserId(e.target.value)} />
                <input className="border rounded px-2 py-1" placeholder="Email" value={syncEmail} onChange={e=>setSyncEmail(e.target.value)} />
                <input className="border rounded px-2 py-1" placeholder="Stripe Customer ID" value={syncCus} onChange={e=>setSyncCus(e.target.value)} />
              </div>
              <button className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50" disabled={disabled || loading} onClick={handleSync}>Sync</button>
            </div>

            <div className="bg-white rounded shadow p-4 space-y-3">
              <h2 className="font-semibold">Set Plan</h2>
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded px-2 py-1" placeholder="User ID" value={setPlanUserId} onChange={e=>setSetPlanUserId(e.target.value)} />
                <select className="border rounded px-2 py-1" value={setPlanValue} onChange={e=>setSetPlanValue(e.target.value as any)}>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="team">Team</option>
                </select>
              </div>
              <button className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50" disabled={disabled || loading} onClick={handleSetPlan}>Update</button>
            </div>

            <div className="bg-white rounded shadow p-4 space-y-3">
              <h2 className="font-semibold">Renew Credits</h2>
              <input className="border rounded px-2 py-1 w-full" placeholder="User ID" value={renewUserId} onChange={e=>setRenewUserId(e.target.value)} />
              <button className="px-3 py-1 rounded bg-purple-600 text-white disabled:opacity-50" disabled={disabled || loading} onClick={handleRenew}>Renew</button>
            </div>
          </section>

          <section className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">Recent Users</h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Plan</th>
                    <th className="py-2 pr-4">Credits</th>
                    <th className="py-2 pr-4">Stripe Customer</th>
                    <th className="py-2 pr-4">Updated</th>
                    <th className="py-2 pr-4">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 pr-4">{u.email}</td>
                      <td className="py-2 pr-4">{u.plan}</td>
                      <td className="py-2 pr-4">{u.credits}</td>
                      <td className="py-2 pr-4">{u.stripe_customer_id}</td>
                      <td className="py-2 pr-4">{u.updated_at && new Date(u.updated_at).toLocaleString()}</td>
                      <td className="py-2 pr-4 text-xs">{u._id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
