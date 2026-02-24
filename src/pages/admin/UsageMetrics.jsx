import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

function UsageMetrics() {
  const [metrics, setMetrics] = useState({
    dailyLogins: 0,
    resourceClicks: 0,
    programEnrollments: 0,
    supportSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchMetrics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/admin/metrics');
        const data = response.data?.data || response.data || {};

        if (!mounted) {
          return;
        }

        setMetrics({
          dailyLogins: data.dailyLogins ?? 0,
          resourceClicks: data.resourceClicks ?? 0,
          programEnrollments: data.programEnrollments ?? 0,
          supportSubmissions: data.supportSubmissions ?? 0,
        });
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.response?.data?.message || 'Unable to load usage metrics.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMetrics();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Usage Metrics</h1>
        <p className="mt-1 text-sm text-slate-600">Track engagement across the platform.</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Daily Logins">{loading ? 'Loading...' : metrics.dailyLogins.toLocaleString()}</Card>
        <Card title="Resource Clicks">
          {loading ? 'Loading...' : metrics.resourceClicks.toLocaleString()}
        </Card>
        <Card title="Program Enrollments">
          {loading ? 'Loading...' : metrics.programEnrollments.toLocaleString()}
        </Card>
        <Card title="Support Submissions">
          {loading ? 'Loading...' : metrics.supportSubmissions.toLocaleString()}
        </Card>
      </div>
    </div>
  );
}

export default UsageMetrics;
