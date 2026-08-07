import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

// Landing & Auth Pages
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/auth/Profile';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CreateComplaint from './pages/citizen/CreateComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetail from './pages/citizen/ComplaintDetail';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AssignedComplaints from './pages/officer/AssignedComplaints';
import OfficerReports from './pages/officer/OfficerReports';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if wrong role
    if (user.role === 'Citizen') return <Navigate to="/citizen/dashboard" replace />;
    if (user.role === 'Department Officer') return <Navigate to="/officer/dashboard" replace />;
    if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '12px'
              }
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Profile Route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Citizen Routes */}
            <Route
              path="/citizen/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Citizen']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/create-complaint"
              element={
                <ProtectedRoute allowedRoles={['Citizen', 'Admin']}>
                  <CreateComplaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/my-complaints"
              element={
                <ProtectedRoute allowedRoles={['Citizen']}>
                  <MyComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/complaint/:id"
              element={
                <ProtectedRoute>
                  <ComplaintDetail />
                </ProtectedRoute>
              }
            />

            {/* Department Officer Routes */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Department Officer']}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/complaints"
              element={
                <ProtectedRoute allowedRoles={['Department Officer']}>
                  <AssignedComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/reports"
              element={
                <ProtectedRoute allowedRoles={['Department Officer']}>
                  <OfficerReports />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <DepartmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ComplaintManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
