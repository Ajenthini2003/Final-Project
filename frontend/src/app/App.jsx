// src/app/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LocationProvider } from './contexts/LocationContext';

// UI
import { Toaster } from 'sonner';

// ── Public Pages ─────────────────────────────────────────────────────────
import WelcomePage from './pages/Welcomepage';
import OnboardingPage from './pages/OnboardingPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TechnicianSignupPage from './pages/technician/TechnicianSignupPage';

// ── User Protected Pages ─────────────────────────────────────────────────
import DashboardPage from './pages/DashboardPage';
import PlansPage from './pages/PlansPage';
import ServicesPage from './pages/ServicesPage';
import TechniciansPage from './pages/TechniciansPage';
import BookServicePage from './pages/BookServicePage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportPage from './pages/SupportPage';
import ProfilePage from './pages/ProfilePage';

// ── Technician Panel Pages ───────────────────────────────────────────────
// Note: These might be in src/pages/technician/ (outside app folder)
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianBookings from './pages/technician/TechnicianBookings';
import TechnicianSchedule from './pages/technician/TechnicianSchedule';
import TechnicianEarnings from './pages/technician/TechnicianEarnings';
import TechnicianReviews from './pages/technician/TechnicianReviews';
import TechnicianNotifications from './pages/technician/TechnicianNotifications';
import TechnicianProfile from './pages/technician/TechnicianProfile';

// ── Admin Pages ──────────────────────────────────────────────────────────
// Note: These might be in src/pages/admin/ (outside app folder)
import SettingsPage from './pages/admin/SettingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import TechniciansManagement from './pages/admin/TechniciansManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import PlansManagement from './pages/admin/PlansManagement';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import BookingsManagement from './pages/admin/BookingsManagement';
import AdminNotifications from './pages/admin/AdminNotifications';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';

// ── Layouts ──────────────────────────────────────────────────────────────
import { PageLoader } from './components/common/Loader/PageLoader';
import { useAuth } from './contexts/AuthContext';
import AdminLayout from './components/admin/AdminLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { TechnicianLayout } from './components/layout/TechnicianLayout';

// ── Route Guards ──────────────────────────────────────────────────────────

// Redirect logged-in users to THEIR panel; guests see the page
function PublicRoute({ children }) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (initialLoading) return <PageLoader />;
  if (isAuthenticated && user && token) {
    if (user.role === 'technician') return <Navigate to="/technician/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function PublicAccessRoute({ children }) {
  const { initialLoading } = useAuth();
  if (initialLoading) return <PageLoader />;
  return children;
}

// Any authenticated user
function ProtectedRoute({ children }) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (initialLoading) return <PageLoader />;
  if (!(isAuthenticated && user && token))
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

// Only technicians
function TechnicianRoute({ children }) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (initialLoading) return <PageLoader />;
  if (!(isAuthenticated && user && token))
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== 'technician')
    return <Navigate to="/dashboard" replace />;
  return children;
}

// Only admins
function AdminRoute({ children }) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (initialLoading) return <PageLoader />;
  if (!(isAuthenticated && user && token) || user?.role !== 'admin')
    return <Navigate to="/admin-login" state={{ from: location.pathname }} replace />;
  return children;
}

// ── Routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
      <Route path="/onboarding" element={<PublicRoute><OnboardingPage /></PublicRoute>} />
      <Route path="/home" element={<PublicRoute><LandingPage /></PublicRoute>} />

      {/* Auth */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
      <Route path="/technician-signup" element={<PublicRoute><TechnicianSignupPage /></PublicRoute>} />

      {/* Public-access (visible even when logged in) */}
      <Route path="/about" element={<PublicAccessRoute><LandingPage /></PublicAccessRoute>} />
      <Route path="/contact" element={<PublicAccessRoute><SupportPage /></PublicAccessRoute>} />

      {/* ── User panel ── */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/plans" element={<ProtectedRoute><DashboardLayout><PlansPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><DashboardLayout><ServicesPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/technicians" element={<ProtectedRoute><DashboardLayout><TechniciansPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/book-service" element={<ProtectedRoute><DashboardLayout><BookServicePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><DashboardLayout><ServiceHistoryPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><DashboardLayout><PaymentsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><DashboardLayout><SupportPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />

      {/* ── Technician panel ── */}
      <Route path="/technician/dashboard" element={<TechnicianRoute><TechnicianLayout><TechnicianDashboard /></TechnicianLayout></TechnicianRoute>} />
      <Route path="/technician/bookings" element={<TechnicianRoute><TechnicianLayout><TechnicianBookings /></TechnicianLayout></TechnicianRoute>} />
      <Route path="/technician/active" element={<TechnicianRoute><TechnicianLayout><TechnicianBookings /></TechnicianLayout></TechnicianRoute>} />
      <Route path="/technician/schedule" element={<TechnicianRoute><TechnicianLayout><TechnicianSchedule /></TechnicianLayout></TechnicianRoute>} />
      <Route path="/technician/earnings" element={<TechnicianRoute><TechnicianLayout><TechnicianEarnings /></TechnicianLayout></TechnicianRoute>} />
      <Route path="/technician/reviews" element={<TechnicianRoute><TechnicianLayout><TechnicianReviews /></TechnicianLayout></TechnicianRoute>} />
      <Route path="/technician/notifications" element={<TechnicianRoute><TechnicianLayout><TechnicianNotifications /></TechnicianLayout></TechnicianRoute>} />
      <Route path="/technician/profile" element={<TechnicianRoute><TechnicianLayout><TechnicianProfile /></TechnicianLayout></TechnicianRoute>} />

      {/* ── Admin auth ── */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<AdminSignup />} />

      {/* ── Admin panel ── */}
      <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminLayout><UsersManagement /></AdminLayout></AdminRoute>} />
      <Route path="/admin/technicians" element={<AdminRoute><AdminLayout><TechniciansManagement /></AdminLayout></AdminRoute>} />
      <Route path="/admin/services" element={<AdminRoute><AdminLayout><ServicesManagement /></AdminLayout></AdminRoute>} />
      <Route path="/admin/plans" element={<AdminRoute><AdminLayout><PlansManagement /></AdminLayout></AdminRoute>} />
      <Route path="/admin/payments" element={<AdminRoute><AdminLayout><PaymentsManagement /></AdminLayout></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><AdminLayout><BookingsManagement /></AdminLayout></AdminRoute>} />
      <Route path="/admin/notifications" element={<AdminRoute><AdminLayout><AdminNotifications /></AdminLayout></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminLayout><ReportsAnalytics /></AdminLayout></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminLayout><SettingsPage /></AdminLayout></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <NotificationProvider>
                <LocationProvider>
                  <AppRoutes />
                  <Toaster position="top-right" richColors />
                </LocationProvider>
              </NotificationProvider>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}