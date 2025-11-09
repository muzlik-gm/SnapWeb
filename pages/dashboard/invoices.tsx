import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Layout from '@/components/Layout';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export default function Invoices() {
  return (
    <Layout title="Invoices - SnapWeb" description="View and manage invoices">
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-secondary-900 mb-6">Invoices</h1>
          <div className="bg-white border border-secondary-200 rounded-lg p-6">
            <p className="text-secondary-700">All billing documents are available via the customer portal.</p>
            <div className="mt-4">
              <Button onClick={async ()=>{
                const r = await fetch('/api/stripe/create-portal',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({})});
                const j = await r.json();
                if (j.success && j.data.url) window.location.href = j.data.url;
              }}>Open billing portal</Button>
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
    return { redirect: { destination: '/auth/signin?callbackUrl=/dashboard/invoices', permanent: false } } as any;
  }
  return { props: {} } as any;
};
