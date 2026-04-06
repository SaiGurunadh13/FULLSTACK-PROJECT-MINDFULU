import { useMemo, useState } from 'react';

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;

function AddUser({ onAdd, loading }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const isValid = useMemo(() => {
    return form.name.trim().length > 0 && EMAIL_PATTERN.test(form.email.trim());
  }, [form.email, form.name]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setError('Name is required.');
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      await onAdd({ name, email });
      setForm({ name: '', email: '' });
    } catch (submitError) {
      setError(submitError?.message || 'Unable to add user.');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Add User</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-200 focus:ring"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-200 focus:ring"
        />
        <button
          type="submit"
          disabled={loading || !isValid}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}

export default AddUser;
