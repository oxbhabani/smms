// Defines all app routes with protection (auth required) and public-only access

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import MachineListPage from '../pages/MachineListPage';
import AddMachinePage from '../pages/AddMachinePage';
import EditMachinePage from '../pages/EditMachinePage';
import ScheduleListPage from '../pages/ScheduleListPage';
import WorkOrderListPage from '../pages/WorkOrderListPage';
import CreateWorkOrderPage from '../pages/CreateWorkOrderPage';
import WorkOrderDetailPage from '../pages/WorkOrderDetailPage';
import HistoryPage from '../pages/HistoryPage';
import LogsPage from '../pages/LogsPage';
import LoadingSpinner from '../components/LoadingSpinner';

// Redirects unauthenticated users to login; shows spinner while checking auth
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Redirects already-authenticated users to dashboard; shows spinner while checking
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public pages — only accessible when logged out */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected pages — require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Machines */}
      <Route
        path="/machines"
        element={
          <ProtectedRoute>
            <MachineListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/machines/add"
        element={
          <ProtectedRoute>
            <AddMachinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/machines/edit/:id"
        element={
          <ProtectedRoute>
            <EditMachinePage />
          </ProtectedRoute>
        }
      />

      {/* Schedules */}
      <Route
        path="/schedules"
        element={
          <ProtectedRoute>
            <ScheduleListPage />
          </ProtectedRoute>
        }
      />

      {/* Work Orders */}
      <Route
        path="/work-orders"
        element={
          <ProtectedRoute>
            <WorkOrderListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders/create"
        element={
          <ProtectedRoute>
            <CreateWorkOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders/:id"
        element={
          <ProtectedRoute>
            <WorkOrderDetailPage />
          </ProtectedRoute>
        }
      />

      {/* History & Logs */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <LogsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback — redirect root and unknown paths to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
