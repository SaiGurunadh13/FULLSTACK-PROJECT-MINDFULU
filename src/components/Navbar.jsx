import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-surface-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <img src={logo} alt="Mindful U" className="h-9 w-9 rounded-lg border border-surface-200 object-cover" />
          Mindful U
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-1.5 sm:flex">
            <span className="text-xs font-semibold text-brand-700">{user?.role}</span>
            <span className="text-sm text-slate-700">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="rounded-xl bg-accent-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
