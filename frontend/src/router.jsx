import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { PageLoader } from "./components/common/Loader/PageLoader";
import { useAuth } from "./app/contexts/AuthContext";
import DashboardLayout from "./app/components/DashboardLayout";
import AdminLayout from "./app/components/admin/AdminLayout";

// Your existing pages
import LandingPage from "./app/pages/LandingPage";
import LoginPage from "./app/pages/LoginPage";
import SignUpPage from "./app/pages/SignUpPage";
import DashboardPage from "./app/pages/DashboardPage";
import ProfilePage from "./app/pages/ProfilePage";
import ServicesPage from "./app/pages/ServicesPage";
import BookServicePage from "./app/pages/BookServicePage";
import ServiceHistoryPage from "./app/pages/ServiceHistoryPage";
import PaymentsPage from "./app/pages/PaymentsPage";
import PlansPage from "./app/pages/PlansPage";
import NotificationsPage from "./app/pages/NotificationsPage";
import SupportPage from "./app/pages/SupportPage";
import OnboardingPage from "./app/pages/OnboardingPage";

// Admin pages
import AdminDashboard from "./app/pages/admin/AdminDashboard";
import UsersManagement from "./app/pages/admin/UsersManagement";
import TechniciansManagement from "./app/pages/admin/TechniciansManagement";
import ServicesManagement from "./app/pages/admin/ServicesManagement";
import BookingsManagement from "./app/pages/admin/BookingsManagement";
import PaymentsManagement from "./app/pages/admin/PaymentsManagement";
import PlansManagement from "./app/pages/admin/PlansManagement";
import ReportsAnalytics from "./app/pages/admin/ReportsAnalytics";
import AdminNotifications from "./app/pages/admin/AdminNotifications";

const ProtectedRoute = ({ children, allowedRoles = ["user", "admin", "technician"] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(LandingPage),
  },
  {
    path: "/login",
    element: withSuspense(LoginPage),
  },
  {
    path: "/signup",
    element: withSuspense(SignUpPage),
  },
  {
    path: "/onboarding",
    element: withSuspense(OnboardingPage),
  },
  {
    path: "/services",
    element: withSuspense(ServicesPage),
  },
  {
    path: "/plans",
    element: withSuspense(PlansPage),
  },
  {
    path: "/support",
    element: withSuspense(SupportPage),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: "profile", element: withSuspense(ProfilePage) },
      { path: "book-service", element: withSuspense(BookServicePage) },
      { path: "history", element: withSuspense(ServiceHistoryPage) },
      { path: "payments", element: withSuspense(PaymentsPage) },
      { path: "notifications", element: withSuspense(NotificationsPage) },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(AdminDashboard) },
      { path: "users", element: withSuspense(UsersManagement) },
      { path: "technicians", element: withSuspense(TechniciansManagement) },
      { path: "services", element: withSuspense(ServicesManagement) },
      { path: "bookings", element: withSuspense(BookingsManagement) },
      { path: "payments", element: withSuspense(PaymentsManagement) },
      { path: "plans", element: withSuspense(PlansManagement) },
      { path: "reports", element: withSuspense(ReportsAnalytics) },
      { path: "notifications", element: withSuspense(AdminNotifications) },
    ],
  },
]);