import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { UserStats, Screenshot, User } from '@/types';
import { 
  Image, CreditCard, Calendar, TrendingUp, Download, 
  Plus, FileText, Code, ArrowUpCircle, ExternalLink 
} from 'lucide-react';

interface DashboardData {
  stats: UserStats;
  recentScreenshots: Screenshot[];
  user: Partial<User>;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/usage');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard - SnapWeb" description="Your SnapWeb dashboard">
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-secondary-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard - SnapWeb" description="Your SnapWeb dashboard">
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-error-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return null;
  }

  const { stats, recentScreenshots, user } = data;

  return (
    <Layout 
      title={`Dashboard - ${user.name} | SnapWeb`}
      description="Manage your screenshots, view usage statistics, and upgrade your plan"
    >
      <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-secondary-900">Dashboard</h1>
              <p className="text-secondary-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
              <Link href="/">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Screenshot
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - compact, balanced */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white rounded-lg border border-secondary-200 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center">
                <Image className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-secondary-600 mb-0.5">Total Screenshots</p>
            <p className="text-xl lg:text-2xl font-semibold text-secondary-900">{stats.totalScreenshots}</p>
          </div>

          <div className="bg-white rounded-lg border border-secondary-200 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-success-100 rounded-md flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-success-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-secondary-600 mb-0.5">Credits Remaining</p>
            <p className="text-xl lg:text-2xl font-semibold text-secondary-900">{stats.creditsRemaining}</p>
          </div>

          <div className="bg-white rounded-lg border border-secondary-200 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-secondary-600 mb-0.5">This Month</p>
            <p className="text-xl lg:text-2xl font-semibold text-secondary-900">{stats.thisMonthScreenshots}</p>
          </div>

          <div className="bg-white rounded-lg border border-secondary-200 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-warning-100 rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-warning-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-secondary-600 mb-0.5">Current Plan</p>
            <p className="text-xl lg:text-2xl font-semibold text-secondary-900 capitalize">{user.plan}</p>
          </div>
        </div>

        {/* Content: Recent (2/3) and Most Downloaded (1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Screenshots */}
          <div className="xl:col-span-2 bg-white rounded-lg border border-secondary-200">
            <div className="px-5 py-3 border-b border-secondary-200">
              <div className="flex justify-between items-center">
                <h2 className="text-base lg:text-lg font-semibold text-secondary-900">Recent Screenshots</h2>
                <Link href="/dashboard/screenshots">
                  <Button variant="ghost" size="sm" className="text-secondary-700 hover:text-primary-700">
                    View All
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-5">
              {recentScreenshots.length === 0 ? (
                <div className="text-center py-10">
                  <Image className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                  <p className="text-secondary-600 mb-4">No screenshots yet</p>
                  <Link href="/">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Screenshot
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-secondary-200">
                  {recentScreenshots.slice(0, 6).map((screenshot) => (
                    <li key={screenshot.id} className="flex items-center gap-4 py-3">
                      <img
                        src={screenshot.url}
                        alt="Screenshot"
                        className="w-20 h-14 object-cover rounded border border-secondary-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">
                          {screenshot.original_url}
                        </p>
                        <p className="text-xs text-secondary-500 mt-0.5">
                          {formatDate(screenshot.created_at)} • {formatFileSize(screenshot.metadata.fileSize)}
                        </p>
                      </div>
                      <a
                        href={screenshot.url}
                        download
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                        aria-label="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Most Downloaded */}
          <div className="bg-white rounded-lg border border-secondary-200">
            <div className="px-5 py-3 border-b border-secondary-200">
              <h2 className="text-base lg:text-lg font-semibold text-secondary-900">Most Downloaded</h2>
            </div>
            <div className="p-5">
              {stats.popularScreenshots.length === 0 ? (
                <div className="text-center py-10">
                  <Download className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                  <p className="text-secondary-600">No downloads yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-secondary-200">
                  {stats.popularScreenshots.map((screenshot) => (
                    <li key={screenshot.id} className="flex items-center gap-4 py-3">
                      <img
                        src={screenshot.url}
                        alt="Screenshot"
                        className="w-16 h-12 object-cover rounded border border-secondary-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">
                          {screenshot.original_url}
                        </p>
                        <p className="text-xs text-secondary-500 mt-0.5">
                          {screenshot.downloads} downloads
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                New Screenshot
              </Button>
            </Link>
            <Link href="/dashboard/screenshots">
              <Button variant="outline" className="w-full">
                <Image className="w-4 h-4 mr-2" />
                View All Screenshots
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button variant="outline" className="w-full">
                <Code className="w-4 h-4 mr-2" />
                API Documentation
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="w-full">
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
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
    // Avoid redirect loops when session token exists but a different lambda can't decode it yet
    const cookies = (context.req as any).cookies || {};
    const hasToken = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];
    if (!hasToken) {
      return {
        redirect: {
          destination: '/auth/signin?callbackUrl=/dashboard',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};
