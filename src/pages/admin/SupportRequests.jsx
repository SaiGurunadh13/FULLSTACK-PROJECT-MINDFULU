import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

function SupportRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/support-requests');
      const data = response.data?.data || response.data || [];
      setRequests(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Unable to load support requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    if (!id) {
      return;
    }

    setUpdatingId(id);
    setError('');

    try {
      await api.patch(`/admin/support-requests/${id}`, { status });
      setRequests((previous) =>
        previous.map((request) =>
          (request.id || request._id) === id ? { ...request, status } : request
        )
      );
    } catch (updateError) {
      setError(updateError.response?.data?.message || 'Unable to update request status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Support Requests</h1>
        <p className="mt-1 text-sm text-slate-600">Review and respond to student support tickets.</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading support requests...</p> : null}

      {!loading && requests.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">No support requests found.</p>
        </Card>
      ) : null}

      <div className="space-y-3">
        {requests.map((request) => {
          const id = request.id || request._id;
          const isUpdating = updatingId === id;

          return (
            <Card
              key={id || request.subject}
              title={request.subject || 'Support Request'}
              right={
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {request.status || 'OPEN'}
                </span>
              }
            >
              <p className="text-sm text-slate-600">{request.message || 'No message provided.'}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {request.studentEmail || request.email || 'Student'} • {request.category || 'GENERAL'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(id, 'IN_PROGRESS')}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-60"
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(id, 'RESOLVED')}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                  >
                    {isUpdating ? 'Updating...' : 'Resolve'}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default SupportRequests;
