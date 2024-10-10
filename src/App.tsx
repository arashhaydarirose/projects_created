import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PasswordReset from './components/PasswordReset';
import AdminPanel from './components/AdminPanel';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/" replace />;
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user && user.username === 'Arash' ? element : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/admin" element={<AdminRoute element={<AdminPanel />} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;