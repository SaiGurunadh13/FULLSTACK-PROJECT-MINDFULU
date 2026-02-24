import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const moods = ['😊 Happy', '😐 Okay', '😔 Stressed'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    enrolledPrograms: 0,
    completedPrograms: 0,
    supportRequests: 0,
  });
  const [programs, setPrograms] = useState([]);
  const [resources, setResources] = useState([]);
  const [mood, setMood] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const statsRes = await API.get('/student/stats');
      const progRes = await API.get('/student/enrolled');
      const resRes = await API.get('/resources/recent');

      const statsPayload = statsRes.data?.data || statsRes.data || {};
      const programsPayload = progRes.data?.data || progRes.data || [];
      const resourcesPayload = resRes.data?.data || resRes.data || [];

      setStats({
        enrolledPrograms: statsPayload.enrolledPrograms ?? 0,
        completedPrograms: statsPayload.completedPrograms ?? 0,
        supportRequests: statsPayload.supportRequests ?? 0,
      });
      setPrograms(Array.isArray(programsPayload) ? programsPayload : []);
      setResources(Array.isArray(resourcesPayload) ? resourcesPayload : []);
    } catch (fetchError) {
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async () => {
    if (!mood) {
      setStatusMessage('Please select a mood first.');
      return;
    }

    try {
      await API.post('/student/mood', { mood });
      setStatusMessage('Mood recorded successfully 💙');
      setMood('');
    } catch {
      setStatusMessage('Failed to save mood. Please try again.');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-brand-50 to-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {user?.name || 'Student'} 👋</h1>
        <p className="mt-1 text-sm text-slate-600">
          Here&apos;s your wellness snapshot for today. Small consistent actions make a big difference.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Enrolled Programs" value={stats.enrolledPrograms} subtitle="Programs joined" loading={loading} />
        <StatCard
          title="Completed Programs"
          value={stats.completedPrograms}
          subtitle="Programs completed"
          loading={loading}
        />
        <StatCard
          title="Support Requests"
          value={stats.supportRequests}
          subtitle="Requests sent"
          loading={loading}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card
          title="Your Programs"
          right={<span className="text-xs font-medium text-slate-500">{programs.length} total</span>}
        >
          {loading ? <p className="text-sm text-slate-500">Loading programs...</p> : null}

          {!loading && programs.length === 0 ? (
            <p className="text-sm text-slate-500">No programs enrolled yet.</p>
          ) : null}

          <div className="space-y-3">
            {programs.map((program) => (
              <article
                key={program.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">{program.programName}</h3>
                  <p className="text-xs text-slate-500">{program.duration} weeks</p>
                </div>
                <span
                  className={program.status === 'COMPLETED' ? 'tone-success' : 'tone-warning'}
                >
                  {program.status}
                </span>
              </article>
            ))}
          </div>
        </Card>

        <Card title="Recommended Resources">
          {loading ? <p className="text-sm text-slate-500">Loading resources...</p> : null}

          <div className="space-y-3">
            {resources.map((resource) => (
              <article key={resource.id} className="rounded-xl border border-slate-200 p-3">
                <h3 className="font-semibold text-slate-800">{resource.title}</h3>
                <p className="mt-1 text-xs text-slate-500">Category: {resource.category}</p>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <Card title="How are you feeling today?">
        <div className="flex flex-wrap gap-2">
          {moods.map((item) => (
            <button
              key={item}
              onClick={() => {
                setMood(item);
                setStatusMessage('');
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                mood === item
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={handleMoodSubmit}>Save Mood</Button>
          {statusMessage ? <p className="text-sm text-slate-600">{statusMessage}</p> : null}
        </div>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, loading }) => (
  <Card title={title}>
    <p className="text-3xl font-bold text-slate-900">{loading ? '--' : value}</p>
    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
  </Card>
);

export default Dashboard;
