import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicRequest from './pages/PublicRequest';
import PublicStatus from './pages/PublicStatus';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Disbursements from './pages/Disbursements';
import Ledger from './pages/Ledger';
import AuditLogs from './pages/AuditLogs';

// Guard for Protected Routes
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuth = localStorage.getItem('trh_admin_auth') === 'true';
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRequest />} />
        <Route path="/status" element={<PublicStatus />} />
        
        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/admin/disbursements" element={<ProtectedRoute><Disbursements /></ProtectedRoute>} />
        <Route path="/admin/ledger" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
        <Route path="/admin/audit" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;