// src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Ha van requiredRole, akkor ellenőrizzük a user szerepkörét
  if (requiredRole && user.role !== requiredRole) {
    // Ha a szerepkör nem megfelelő, átirányítjuk a megfelelő dashboardra
    if (user.role === 'customer') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'driver') {
      return <Navigate to="/drone-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;