import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { Screenshot } from '@/types';
import { 
  Image, Download, Trash2, Search, X, Plus, 
  ArrowLeft, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface ScreenshotsData {
  screenshots: Screenshot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Screenshots() {
  const [data, setData] = useState<ScreenshotsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchScreenshots();
  }, [page, search]);

  const fetchScreenshots = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
      });

      const response = await fetch(`/api/user/screenshots?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load screenshots');
      }
    } catch (error) {
      setError('Failed to load screenshots');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (screenshotId: string) => {
    if (!confirm('Are you sure you want to delete this screenshot?')) {
      return;
    }

    try {
      setDeleting(screenshotId);
      const response = await fetch(`/api/user/screenshots/${screenshotId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchScreenshots();
      } else {
        alert(result.error || 'Failed to delete screenshot');
      }
    } catch (error) {
      alert('Failed to delete screenshot');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (screenshot: Screenshot) => {
    try {
      await fetch(`/api/user/screenshots/${screenshot.id}?action=download`, {
        method: 'POST',
      });

      const link = document.createElement('a');
      link.href = screenshot.url;
      link.download = screenshot.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchScreenshots();
  };

  if (loading && !data) {
    return (
      <Layout title="My Screenshots - SnapWeb" description="View and manage your screenshots">
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-secondary-600">Loading screenshots...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="My Screenshots - SnapWeb" 
      description="View, download, and manage all your generated screenshots"
    >
      <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-secondary-900">My Screenshots</h1>
              <p className="text-secondary-600 mt-1">
                {data?.pagination.total || 0} screenshots total
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Screenshot
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by URL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
              />
            </div>
            <Button type="submit" size="md">
              Search
            </Button>
            {search && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                  fetchScreenshots();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>

        {error && (
          <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Screenshots Grid */}
        {data?.screenshots.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-secondary-200">
            <Image className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No screenshots found</h3>
            <p className="text-secondary-600 mb-6">
              {search ? 'Try adjusting your search terms.' : 'Create your first screenshot to get started.'}
            </p>
            <Link href="/">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Screenshot
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.screenshots.map((screenshot) => (
                <div key={screenshot.id} className="bg-white rounded-lg border border-secondary-200 overflow-hidden hover:border-primary-600 transition-colors">
                  <div className="relative">
                    <img
                      src={screenshot.url}
                      alt="Screenshot"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-secondary-900 truncate mb-3">
                      {screenshot.original_url}
                    </h3>
                    <div className="text-xs text-secondary-600 space-y-1 mb-4">
                      <p>{formatDate(screenshot.created_at)}</p>
                      <p>{formatFileSize(screenshot.metadata.fileSize)} • {screenshot.metadata.width} × {screenshot.metadata.height}</p>
                      <p>{screenshot.downloads} downloads</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(screenshot)}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(screenshot.id)}
                        disabled={deleting === screenshot.id}
                      >
                        {deleting === screenshot.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="px-4 text-sm text-secondary-600">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.pagination.totalPages || loading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    const cookies = (context.req as any).cookies || {};
    const hasToken = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];
    if (!hasToken) {
      return {
        redirect: {
          destination: '/auth/signin?callbackUrl=/dashboard/screenshots',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};
