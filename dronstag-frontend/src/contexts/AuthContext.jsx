// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

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
    // Ellenőrizzük, hogy van-e mentett user a localStorage-ban
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // TODO: Valódi API hívás a backend felé
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Ha van token, azt is elmentjük
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Hibás email cím vagy jelszó' };
      }
    } catch (error) {
      return { success: false, error: 'Hálózati hiba történt' };
    }
  };

  const register = async (userData) => {
    try {
      // TODO: Valódi API hívás a backend felé
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Regisztrációs hiba' };
      }
    } catch (error) {
      return { success: false, error: 'Hálózati hiba történt' };
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};