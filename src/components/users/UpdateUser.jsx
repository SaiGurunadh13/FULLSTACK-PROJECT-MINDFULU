import { useEffect, useState } from 'react';

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;

function UpdateUser({ user, onUpdate, onCancel, loading }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setError('');
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Name is required.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      await onUpdate(user.id, { name: trimmedName, email: trimmedEmail });
    } catch (submitError) {
      setError(submitError?.message || 'Unable to update user.');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Update User</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-4">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-200 focus:ring"
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-200 focus:ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}

export default UpdateUser;
