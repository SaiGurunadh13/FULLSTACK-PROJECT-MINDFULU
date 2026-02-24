import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import api from '../../services/api';

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/programs');
      const data = response.data?.data || response.data || [];
      setPrograms(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Unable to load programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEnroll = async (programId) => {
    setProcessingId(programId);
    setError('');

    try {
      await api.post(`/programs/${programId}/enroll`);
      setPrograms((previous) =>
        previous.map((program) =>
          (program.id || program._id) === programId
            ? { ...program, enrolled: true }
            : program
        )
      );
    } catch (enrollError) {
      setError(enrollError.response?.data?.message || 'Unable to enroll right now.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1 className="page-title">Programs</h1>
        <p className="page-subtitle">Explore wellness programs and enroll in one click.</p>
      </div>

      {error ? <p className="state-error">{error}</p> : null}
      {loading ? <p className="state-info">Loading programs...</p> : null}

      {!loading && programs.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">No programs are available at the moment.</p>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => {
          const id = program.id || program._id;
          const isEnrolled = Boolean(program.enrolled);
          const isProcessing = processingId === id;

          return (
            <Card key={id || program.title} title={program.title || 'Program'}>
              <p className="text-sm text-slate-600">{program.description || 'No description provided.'}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="soft-badge">Duration: {program.duration || 'Flexible'}</span>
                <Button
                  onClick={() => handleEnroll(id)}
                  disabled={isEnrolled || isProcessing || !id}
                  className={isEnrolled ? 'bg-emerald-500 hover:bg-emerald-500' : ''}
                >
                  {isEnrolled ? 'Enrolled' : isProcessing ? 'Enrolling...' : 'Enroll'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Programs;
