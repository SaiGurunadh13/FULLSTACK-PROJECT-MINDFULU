import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import api from '../../services/api';

const initialForm = {
  title: '',
  category: 'MENTAL',
  description: '',
  url: '',
};

function ManageResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchResources = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/resources');
      const data = response.data?.data || response.data || [];
      setResources(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Unable to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
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
        await api.put(`/admin/resources/${editingId}`, form);
      } else {
        await api.post('/admin/resources', form);
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchResources();
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to save resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id || resource._id);
    setForm({
      title: resource.title || '',
      category: resource.category || 'MENTAL',
      description: resource.description || '',
      url: resource.url || '',
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      return;
    }

    setError('');

    try {
      await api.delete(`/admin/resources/${id}`);
      await fetchResources();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete resource.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Manage Resources</h1>
        <p className="mt-1 text-sm text-slate-600">Create, update, and remove wellness resources.</p>
      </div>

      <Card title={editingId ? 'Edit Resource' : 'Add Resource'}>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Title"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
          >
            <option value="MENTAL">Mental</option>
            <option value="FITNESS">Fitness</option>
            <option value="NUTRITION">Nutrition</option>
          </select>
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="URL (optional)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring md:col-span-2"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring md:col-span-2"
          />
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Resource' : 'Create Resource'}
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
      {loading ? <p className="text-sm text-slate-600">Loading resources...</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => {
          const id = resource.id || resource._id;

          return (
            <Card key={id || resource.title} title={resource.title || 'Resource'}>
              <p className="text-sm text-slate-600">{resource.description || 'No description'}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">{resource.category || 'GENERAL'}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(resource)}
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

export default ManageResources;
