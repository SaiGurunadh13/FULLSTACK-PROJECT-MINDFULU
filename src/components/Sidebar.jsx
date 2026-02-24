import { NavLink } from 'react-router-dom';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resources', label: 'Resources' },
  { to: '/programs', label: 'Programs' },
  { to: '/my-programs', label: 'My Programs' },
  { to: '/support', label: 'Support' },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard' },
  { to: '/admin/resources', label: 'Manage Resources' },
  { to: '/admin/programs', label: 'Manage Programs' },
  { to: '/admin/support-requests', label: 'Support Requests' },
  { to: '/admin/metrics', label: 'Usage Metrics' },
];

function Sidebar({ role = 'STUDENT' }) {
  const links = role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <aside className="w-full md:w-72">
      <div className="md:sticky md:top-20 md:p-3">
        <div className="rounded-2xl border border-surface-200 bg-white p-3 shadow-sm">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
            {role === 'ADMIN' ? 'Admin Panel' : 'Student Panel'}
          </p>
          <nav className="flex gap-2 overflow-x-auto md:flex md:flex-col md:gap-1 md:overflow-visible">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `shrink-0 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition md:w-full ${
                isActive
                  ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
                  : 'text-slate-600 hover:bg-surface-100 hover:text-slate-900'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
