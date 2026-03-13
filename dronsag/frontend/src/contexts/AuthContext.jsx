// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const data = await api.login(email, password, role);
      
      // Mentés localStorage-ba
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Hiba történt a bejelentkezés során' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Hiba történt a regisztráció során' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isDriver: user?.role === 'driver'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};