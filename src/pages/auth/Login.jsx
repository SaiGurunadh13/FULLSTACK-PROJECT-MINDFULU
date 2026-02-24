import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import logo from '../../assets/logo.jpeg';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const loggedInUser = await login(form);
      const destination = loggedInUser?.role === 'ADMIN' ? '/admin' : '/dashboard';
      navigate(destination, { replace: true });
    } catch (submitError) {
      const message = submitError.response?.data?.message || 'Unable to login. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="mb-4 text-center text-4xl font-bold tracking-wide text-brand-600">MINDFUL U</h1>
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="Mindful U" className="h-20 w-20 rounded-2xl border border-slate-200 object-cover" />
          </div>
          <p className="mb-6 text-sm text-slate-600">Login to access your Mindful U dashboard.</p>
          <div className="mb-6 rounded-lg border border-brand-100 bg-brand-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-800">Starter Accounts</p>
            <p className="mt-1">Student: student@wellness.local / Student@123</p>
            <p>Admin: admin@wellness.local / Admin@123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring"
                placeholder="••••••••"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            New here?{' '}
            <Link className="font-semibold text-brand-600 hover:text-brand-500" to="/register">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Login;
