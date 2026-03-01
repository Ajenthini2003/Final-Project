// src/app/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Contexts
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// UI Components
import { Toaster } from "sonner";

// Public Pages
import OnboardingPage from "./pages/OnboardingPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

// User Protected Pages
import DashboardPage from "./pages/DashboardPage";
import PlansPage from "./pages/PlansPage";
import ServicesPage from "./pages/ServicesPage";
import TechniciansPage from "./pages/TechniciansPage";
import BookServicePage from "./pages/BookServicePage";
import ServiceHistoryPage from "./pages/ServiceHistoryPage";
import PaymentsPage from "./pages/PaymentsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SupportPage from "./pages/SupportPage";
import ProfilePage from "./pages/ProfilePage";

// Admin Pages
import SettingsPage from "./pages/admin/SettingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import TechniciansManagement from "./pages/admin/TechniciansManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import PlansManagement from "./pages/admin/PlansManagement";
import PaymentsManagement from "./pages/admin/PaymentsManagement";
import BookingsManagement from "./pages/admin/BookingsManagement";
import AdminNotifications from "./pages/admin/AdminNotifications";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";

// Admin Auth Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";

// Loading Component
import { PageLoader } from "./components/common/Loader/PageLoader";
import { useAuth } from "./contexts/AuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import {DashboardLayout} from "./components/layout/DashboardLayout"; // Make sure to import this

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check for token in both storage locations
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Show loader while checking authentication
  if (initialLoading) {
    return <PageLoader />;
  }

  // Check if user is authenticated
  const isUserAuthenticated = isAuthenticated && user && token;

  // If not authenticated, redirect to login
  if (!isUserAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children inside DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
}

// Admin Route Component
function AdminRoute({ children }) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (initialLoading) {
    return <PageLoader />;
  }

  const isUserAuthenticated = isAuthenticated && user && token;
  const isAdmin = user?.role === 'admin';

  if (!isUserAuthenticated || !isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location.pathname }} replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

// Public Route Component (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const isUserAuthenticated = isAuthenticated && user && token;

  if (initialLoading) {
    return <PageLoader />;
  }

  if (isUserAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicRoute>
          <OnboardingPage />
        </PublicRoute>
      } />
      <Route path="/home" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignUpPage />
        </PublicRoute>
      } />
      
      {/* Public pages that don't require auth but can be accessed by anyone */}
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/technicians" element={<TechniciansPage />} />
      <Route path="/support" element={<SupportPage />} />

      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/book-service" element={
        <ProtectedRoute>
          <BookServicePage />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <ServiceHistoryPage />
        </ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute>
          <PaymentsPage />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Admin Auth */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<AdminSignup />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <UsersManagement />
        </AdminRoute>
      } />
      <Route path="/admin/technicians" element={
        <AdminRoute>
          <TechniciansManagement />
        </AdminRoute>
      } />
      <Route path="/admin/services" element={
        <AdminRoute>
          <ServicesManagement />
        </AdminRoute>
      } />
      <Route path="/admin/plans" element={
        <AdminRoute>
          <PlansManagement />
        </AdminRoute>
      } />
      <Route path="/admin/payments" element={
        <AdminRoute>
          <PaymentsManagement />
        </AdminRoute>
      } />
      <Route path="/admin/bookings" element={
        <AdminRoute>
          <BookingsManagement />
        </AdminRoute>
      } />
      <Route path="/admin/notifications" element={
        <AdminRoute>
          <AdminNotifications />
        </AdminRoute>
      } />
      <Route path="/admin/reports" element={
        <AdminRoute>
          <ReportsAnalytics />
        </AdminRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminRoute>
          <SettingsPage />
        </AdminRoute>
      } />

      {/* Catch all - redirect to home */}
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
                <AppRoutes />
                <Toaster position="top-right" richColors />
              </NotificationProvider>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}