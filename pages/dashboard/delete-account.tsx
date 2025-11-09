import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Layout from '@/components/Layout';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export default function DeleteAccount() {
  const handleDelete = async () => {
    if (!confirm('This will permanently delete your account and screenshots. Continue?')) return;
    const res = await fetch('/api/user/delete', { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      window.location.href = '/';
    } else {
      alert(json.error || 'Failed to delete account');
    }
  };

  return (
    <Layout title="Delete Account - SnapWeb" description="Delete your account">
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-secondary-900 mb-4">Delete account</h1>
          <div className="bg-white border border-secondary-200 rounded-lg p-6">
            <p className="text-secondary-700">This action is permanent and cannot be undone. All your screenshots and personal data will be deleted.</p>
            <div className="mt-6">
              <Button variant="destructive" onClick={handleDelete}>Delete my account</Button>
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
    return { redirect: { destination: '/auth/signin?callbackUrl=/dashboard/delete-account', permanent: false } } as any;
  }
  return { props: {} } as any;
};
