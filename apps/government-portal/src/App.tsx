import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GovLayout } from './components/GovLayout';
import { Dashboard } from './pages/Dashboard';
import { Operators } from './pages/Operators';
import { OperatorDetail } from './pages/OperatorDetail';
import { Revenue } from './pages/Revenue';
import { RiskForecast } from './pages/RiskForecast';
import { ComplianceGrid } from './pages/ComplianceGrid';
import { Login } from './pages/Login';
import { useAuthStore } from './store/authStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><GovLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="operators" element={<Operators />} />
        <Route path="operators/:id" element={<OperatorDetail />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="risk-forecast" element={<RiskForecast />} />
        <Route path="compliance-grid" element={<ComplianceGrid />} />
      </Route>
    </Routes>
  );
}
