import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activePrograms: 0,
    openRequests: 0,
    resourceViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/admin/dashboard-stats');
        const data = response.data?.data || response.data || {};

        if (!mounted) {
          return;
        }

        setStats({
          totalStudents: data.totalStudents ?? 0,
          activePrograms: data.activePrograms ?? 0,
          openRequests: data.openRequests ?? 0,
          resourceViews: data.resourceViews ?? 0,
        });
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.response?.data?.message || 'Unable to load admin dashboard metrics.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform activity overview.</p>
      </div>

      {error ? <p className="state-error">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Students">{loading ? 'Loading...' : stats.totalStudents.toLocaleString()}</Card>
        <Card title="Active Programs">{loading ? 'Loading...' : stats.activePrograms.toLocaleString()}</Card>
        <Card title="Open Requests">{loading ? 'Loading...' : stats.openRequests.toLocaleString()}</Card>
        <Card title="Resource Views">{loading ? 'Loading...' : stats.resourceViews.toLocaleString()}</Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
