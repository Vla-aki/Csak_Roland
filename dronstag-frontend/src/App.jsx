import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import CreateProject from './pages/customer/CreateProject';
import MyProjects from './pages/customer/MyProjects';
import DroneDashboard from './pages/drone/DroneDashboard';
import AvailableProjects from './pages/drone/AvailableProjects';

// Components
import NewNavbar from './components/NewNavbar';  // Changed this line

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <NewNavbar />  {/* Changed this line */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/projects" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <MyProjects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/projects/create" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <CreateProject />
                </ProtectedRoute>
              } 
            />
            
            {/* Drone Routes */}
            <Route 
              path="/drone" 
              element={
                <ProtectedRoute allowedRole="driver">
                  <DroneDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/drone/projects" 
              element={
                <ProtectedRoute allowedRole="driver">
                  <AvailableProjects />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;