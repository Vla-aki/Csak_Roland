// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import CreateProject from './pages/customer/CreateProject';
import MyProjects from './pages/customer/MyProjects';

// Drone pages
import DroneDashboard from './pages/drone/DroneDashboard';
import AvailableProjects from './pages/drone/AvailableProjects';
import MyBids from './pages/drone/MyBids';
import MyContracts from './pages/drone/MyContracts';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Publikus oldalak */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Védett oldalak - Megbízó */}
          <Route path="/dashboard" element={
            <PrivateRoute requiredRole="customer">
              <CustomerDashboard />
            </PrivateRoute>
          } />
          <Route path="/create-project" element={
            <PrivateRoute requiredRole="customer">
              <CreateProject />
            </PrivateRoute>
          } />
          <Route path="/my-projects" element={
            <PrivateRoute requiredRole="customer">
              <MyProjects />
            </PrivateRoute>
          } />
          
          {/* Védett oldalak - Pilóta */}
          <Route path="/drone-dashboard" element={
            <PrivateRoute requiredRole="driver">
              <DroneDashboard />
            </PrivateRoute>
          } />
          <Route path="/available-projects" element={
            <PrivateRoute requiredRole="driver">
              <AvailableProjects />
            </PrivateRoute>
          } />
          <Route path="/my-bids" element={
            <PrivateRoute requiredRole="driver">
              <MyBids />
            </PrivateRoute>
          } />
          <Route path="/my-contracts" element={
            <PrivateRoute requiredRole="driver">
              <MyContracts />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;