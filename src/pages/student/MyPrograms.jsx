import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

function MyPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchEnrolledPrograms = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/programs/my');
        const data = response.data?.data || response.data || [];

        if (mounted) {
          setPrograms(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.response?.data?.message || 'Unable to load your enrolled programs.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEnrolledPrograms();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1 className="page-title">My Programs</h1>
        <p className="page-subtitle">Track programs you have already joined.</p>
      </div>

      {error ? <p className="state-error">{error}</p> : null}
      {loading ? <p className="state-info">Loading your programs...</p> : null}

      {!loading && programs.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">You have not enrolled in any programs yet.</p>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.id || program._id || program.title} title={program.title || 'Program'}>
            <p className="text-sm text-slate-600">{program.description || 'No description provided.'}</p>
            <p className="mt-4">
              <span className="soft-badge">Status: {program.status || 'Active'}</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MyPrograms;
