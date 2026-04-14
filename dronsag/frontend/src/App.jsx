// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import FloatingChat from './components/FloatingChat';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import FindWork from './pages/FindWork';
import FindFreelancers from './pages/FindFreelancers';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Impressum from './pages/Impressum';
import Cookie from './pages/Cookie';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import ContractWorkspace from './pages/ContractWorkspace';
import CreateProject from './pages/customer/CreateProject';
import MyProjects from './pages/customer/MyProjects';
import ProjectBids from './pages/customer/ProjectBids';
import Billing from './pages/customer/Billing';

// Drone pages
import DroneDashboard from './pages/drone/DroneDashboard';
import MyBids from './pages/drone/MyBids';
import MyContracts from './pages/drone/MyContracts';
import Earnings from './pages/drone/Earnings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashBoard.jsx';

// Téma beállítása az oldal betöltésekor, hogy frissítésnél is megmaradjon
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Lebegő Chat gomb a bal alsó sarokban (csak ha be van jelentkezve) */}
        <FloatingChat />
        <Routes>
          {/* Publikus oldalak */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/find-work" element={<FindWork />} />
          <Route path="/find-freelancers" element={<FindFreelancers />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/cookie" element={<Cookie />} />
          
          {/* Védett oldalak - mindenki számára */}
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/contract/:id" element={
            <PrivateRoute>
              <ContractWorkspace />
            </PrivateRoute>
          } />
          <Route path="/messages" element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          } />
          
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
          <Route path="/project/:projectId/bids" element={
            <PrivateRoute requiredRole="customer">
              <ProjectBids />
            </PrivateRoute>
          } />
          <Route path="/billing" element={
            <PrivateRoute requiredRole="customer">
              <Billing />
            </PrivateRoute>
          } />
          
          {/* Védett oldalak - Pilóta */}
          <Route path="/drone-dashboard" element={
            <PrivateRoute requiredRole="driver">
              <DroneDashboard />
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
          <Route path="/earnings" element={
            <PrivateRoute requiredRole="driver">
              <Earnings />
            </PrivateRoute>
          } />

          {/* Védett oldalak - Admin */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;