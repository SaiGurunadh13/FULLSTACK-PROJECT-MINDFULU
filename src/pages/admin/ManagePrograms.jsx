import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import api from '../../services/api';

const initialForm = {
  title: '',
  description: '',
  duration: '',
};

function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPrograms = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/programs');
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/admin/programs/${editingId}`, form);
      } else {
        await api.post('/admin/programs', form);
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchPrograms();
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to save program.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.id || program._id);
    setForm({
      title: program.title || '',
      description: program.description || '',
      duration: program.duration || '',
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      return;
    }

    setError('');

    try {
      await api.delete(`/admin/programs/${id}`);
      await fetchPrograms();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete program.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Manage Programs</h1>
        <p className="mt-1 text-sm text-slate-600">Create, update, and remove wellness programs.</p>
      </div>

      <Card title={editingId ? 'Edit Program' : 'Add Program'}>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Program title"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
          />
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration (e.g. 8 weeks)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring md:col-span-2"
          />
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Program' : 'Create Program'}
            </Button>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </Card>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading programs...</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => {
          const id = program.id || program._id;

          return (
            <Card key={id || program.title} title={program.title || 'Program'}>
              <p className="text-sm text-slate-600">{program.description || 'No description'}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">Duration: {program.duration || 'Flexible'}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(program)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Delete
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

export default ManagePrograms;
