// ============================================================
// ZimVisit Traveler Portal - App Component (Routes)
// ============================================================

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Spin, Layout } from 'antd';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkipToContent from './components/SkipToContent';
import CookieConsent from './components/CookieConsent';
import ZimPassDemo from './components/ZimPassDemo';

// ---- Lazy-loaded Pages ----
const Landing = lazy(() => import('./pages/Landing'));
const Explore = lazy(() => import('./pages/Explore'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const BookingDetail = lazy(() => import('./pages/BookingDetail'));
const ZimPass = lazy(() => import('./pages/ZimPass'));
const Profile = lazy(() => import('./pages/Profile'));
const EconomicImpact = lazy(() => import('./pages/EconomicImpact'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const CancellationPolicy = lazy(() => import('./pages/CancellationPolicy'));

// ---- Loading Spinner ----
const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}
  >
    <Spin size="large" />
  </div>
);

// ---- Protected Route ----
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ---- Auth Route (redirect to explore if already logged in) ----
const AuthRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
};

// ---- Routes that show Navbar + Footer ----
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <SkipToContent />
    <header role="banner">
      <Navbar />
    </header>
    {/* Spacer for government bar (28px) + navbar (72px) */}
    <div style={{ height: 100 }} />
    <main id="main-content" role="main" tabIndex={-1} style={{ outline: 'none' }}>
      <Layout.Content style={{ minHeight: '100vh' }}>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </Layout.Content>
    </main>
    <footer role="contentinfo">
      <Footer />
    </footer>
    <ZimPassDemo />
    <CookieConsent />
  </>
);

// ---- Routes without Navbar/Footer (auth pages) ----
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// ============================================================
// App Component
// ============================================================
const App: React.FC = () => {
  return (
    <Routes>
      {/* ===================== PUBLIC ROUTES ===================== */}

      {/* Landing Page */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Landing />
          </MainLayout>
        }
      />

      {/* Explore / Search */}
      <Route
        path="/explore"
        element={
          <MainLayout>
            <Explore />
          </MainLayout>
        }
      />

      {/* Tour Detail */}
      <Route
        path="/tours/:id"
        element={
          <MainLayout>
            <TourDetail />
          </MainLayout>
        }
      />

      {/* Hotel Detail (placeholder - can be expanded) */}
      <Route
        path="/hotels/:id"
        element={
          <MainLayout>
            <TourDetail />
          </MainLayout>
        }
      />

      {/* Privacy Policy */}
      <Route
        path="/privacy"
        element={
          <MainLayout>
            <PrivacyPolicy />
          </MainLayout>
        }
      />

      {/* Terms of Service */}
      <Route
        path="/terms"
        element={
          <MainLayout>
            <TermsOfService />
          </MainLayout>
        }
      />

      {/* Help Center */}
      <Route
        path="/help"
        element={
          <MainLayout>
            <HelpCenter />
          </MainLayout>
        }
      />

      {/* Contact Us */}
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactUs />
          </MainLayout>
        }
      />

      {/* Cancellation Policy */}
      <Route
        path="/cancellation"
        element={
          <MainLayout>
            <CancellationPolicy />
          </MainLayout>
        }
      />

      {/* ===================== AUTH ROUTES ===================== */}

      {/* Login */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </AuthRoute>
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          <AuthRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </AuthRoute>
        }
      />

      {/* ===================== PROTECTED ROUTES ===================== */}

      {/* My Bookings */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyBookings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Booking Detail */}
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookingDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ZimPass QR Itinerary */}
      <Route
        path="/zimpass"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ZimPass />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Economic Impact Dashboard */}
      <Route
        path="/impact"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EconomicImpact />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* AI Travel Assistant */}
      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AIAssistant />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ===================== FALLBACK ===================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
