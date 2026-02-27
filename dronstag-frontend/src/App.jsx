import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <Router>
      <AuthProvider>  {/* Ez kell, hogy minden komponens hozzáférjen */}
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;