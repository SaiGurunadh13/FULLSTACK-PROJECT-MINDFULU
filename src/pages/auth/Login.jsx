import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import CaptchaField, { createCaptchaChallenge } from '../../components/CaptchaField';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpeg';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState(createCaptchaChallenge);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCaptchaChange = (event) => {
    setCaptchaValue(event.target.value);
    if (captchaError) {
      setCaptchaError('');
    }
  };

  const handleCaptchaRefresh = () => {
    setCaptcha(createCaptchaChallenge());
    setCaptchaValue('');
    setCaptchaError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCaptchaError('');

    if (captchaValue.trim().toUpperCase() !== captcha.answer) {
      setCaptchaError('Please solve the captcha correctly.');
      setCaptchaValue('');
      setCaptcha(createCaptchaChallenge());
      return;
    }

    try {
      const loggedInUser = await login(form);
      const destination = loggedInUser?.role === 'ADMIN' ? '/admin' : '/dashboard';
      navigate(destination, { replace: true });
    } catch (submitError) {
      const message = submitError.response?.data?.message || 'Unable to login. Please try again.';
      setError(message);
      setCaptchaValue('');
      setCaptcha(createCaptchaChallenge());
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

            <CaptchaField
              value={captchaValue}
              onChange={handleCaptchaChange}
              challenge={captcha}
              onRefresh={handleCaptchaRefresh}
              error={captchaError}
            />

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
