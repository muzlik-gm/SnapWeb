import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Layout from '@/components/Layout';
import { authOptions } from '@/lib/auth';

export default function Profile() {
  return (
    <Layout title="Profile - SnapWeb" description="Manage your profile">
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-secondary-900 mb-6">Profile</h1>
          <div className="bg-white border border-secondary-200 rounded-lg p-6">
            <p className="text-secondary-700">Basic profile settings are managed under Settings for now.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin?callbackUrl=/dashboard/profile', permanent: false } } as any;
  }
  return { props: {} } as any;
};
