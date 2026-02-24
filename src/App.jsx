import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePrograms from './pages/admin/ManagePrograms';
import ManageResources from './pages/admin/ManageResources';
import SupportRequests from './pages/admin/SupportRequests';
import UsageMetrics from './pages/admin/UsageMetrics';
import Dashboard from './pages/student/Dashboard';
import MyPrograms from './pages/student/MyPrograms';
import Programs from './pages/student/Programs';
import Resources from './pages/student/Resources';
import Support from './pages/student/Support';

function AppLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 via-surface-50 to-brand-50/30">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 pb-6 pt-4 md:flex-row md:gap-6 md:px-6">
        <Sidebar role={user?.role} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function PublicOnly({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />

      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <AppLayout>
              <Resources />
            </AppLayout>
          }
        />
        <Route
          path="/programs"
          element={
            <AppLayout>
              <Programs />
            </AppLayout>
          }
        />
        <Route
          path="/my-programs"
          element={
            <AppLayout>
              <MyPrograms />
            </AppLayout>
          }
        />
        <Route
          path="/support"
          element={
            <AppLayout>
              <Support />
            </AppLayout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route
          path="/admin"
          element={
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <AppLayout>
              <ManageResources />
            </AppLayout>
          }
        />
        <Route
          path="/admin/programs"
          element={
            <AppLayout>
              <ManagePrograms />
            </AppLayout>
          }
        />
        <Route
          path="/admin/support-requests"
          element={
            <AppLayout>
              <SupportRequests />
            </AppLayout>
          }
        />
        <Route
          path="/admin/metrics"
          element={
            <AppLayout>
              <UsageMetrics />
            </AppLayout>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
