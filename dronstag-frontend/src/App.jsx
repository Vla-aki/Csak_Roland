import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CreateProject from './pages/customer/CreateProject';
import MyProjects from './pages/customer/MyProjects';

// Drone Pages
import DroneDashboard from './pages/drone/DroneDashboard';
import AvailableProjects from './pages/drone/AvailableProjects';

const Navigation = () => {
  const { user, logout } = useAuth();
  
  console.log('Navigation - user:', user); // Debug log
  
  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">DroneTag</span>
        {user ? (
          <div className="flex items-center space-x-6">
            <span className="text-gray-600">Welcome, <span className="font-semibold">{user.name}</span>!</span>
            {user.role === 'customer' && (
              <>
                <a href="/customer" className="text-gray-600 hover:text-blue-600">Dashboard</a>
                <a href="/customer/projects" className="text-gray-600 hover:text-blue-600">My Projects</a>
                <a href="/customer/projects/create" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Post Project
                </a>
              </>
            )}
            {user.role === 'driver' && (
              <>
                <a href="/drone" className="text-gray-600 hover:text-blue-600">Dashboard</a>
                <a href="/drone/projects" className="text-gray-600 hover:text-blue-600">Available Projects</a>
                <a href="/drone/my-bids" className="text-gray-600 hover:text-blue-600">My Bids</a>
              </>
            )}
            <button 
              onClick={logout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
            <a href="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</a>
          </div>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoute - user:', user, 'loading:', loading); // Debug log
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    console.log('Wrong role, redirecting to appropriate dashboard');
    return <Navigate to={`/${user.role}`} />;
  }
  
  console.log('Access granted to:', user.role);
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
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
              
              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;