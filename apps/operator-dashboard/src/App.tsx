import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AppLayout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { BookingDetail } from './pages/BookingDetail';
import { Inventory } from './pages/Inventory';
import { InventoryEditor } from './pages/InventoryEditor';
import { Compliance } from './pages/Compliance';
import { AgentFingerprinting } from './pages/AgentFingerprinting';
import { Staff } from './pages/Staff';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          fontFamily: "'Inter', sans-serif",
          colorPrimary: '#166534', // Forest Green
          colorBgBase: '#ffffff',
          colorTextBase: '#1e293b',
        },
        components: {
          Layout: {
            bodyBg: '#f8fafc',
            headerBg: '#ffffff',
          },
        },
      }}
    >
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/new" element={<InventoryEditor />} />
            <Route path="inventory/:id/edit" element={<InventoryEditor />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="fingerprinting" element={<AgentFingerprinting />} />
            <Route path="staff" element={<Staff />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ConfigProvider>
  );
}
