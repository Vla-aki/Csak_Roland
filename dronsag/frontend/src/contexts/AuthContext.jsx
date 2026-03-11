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
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Hiba a user adatok betöltésekor');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Egyszerűsített login - bármilyen adatot elfogad
  const login = (userData) => {
    // Ha stringként kapjuk, akkor objektummá alakítjuk
    if (typeof userData === 'string') {
      try {
        userData = JSON.parse(userData);
      } catch {
        userData = { email: userData, name: userData.split('@')[0] };
      }
    }
    
    // Alapértelmezett mezők biztosítása
    const userWithDefaults = {
      id: userData.id || Date.now(),
      name: userData.name || (userData.email ? userData.email.split('@')[0] : 'Felhasználó'),
      email: userData.email || 'felhasznalo@pelda.hu',
      role: userData.role || 'customer',
      verified: userData.verified || true,
      createdAt: userData.createdAt || new Date().toISOString()
    };
    
    setUser(userWithDefaults);
    localStorage.setItem('user', JSON.stringify(userWithDefaults));
    localStorage.setItem('userRole', userWithDefaults.role);
    
    return { success: true, user: userWithDefaults };
  };

  // Demo bejelentkezés előre beállított szerepkörökkel
  const loginAsCustomer = () => {
    const userData = {
      id: 1,
      name: 'Kovács János (Megbízó)',
      email: 'megbizo@demo.hu',
      role: 'customer',
      verified: true,
      createdAt: new Date().toISOString()
    };
    return login(userData);
  };

  const loginAsDriver = () => {
    const userData = {
      id: 2,
      name: 'Kovács Péter (Pilóta)',
      email: 'pilota@demo.hu',
      role: 'driver',
      verified: true,
      createdAt: new Date().toISOString()
    };
    return login(userData);
  };

  const register = async (userData) => {
    // Egyszerűsített regisztráció - azonnal be is jelentkeztet
    const newUser = {
      id: Date.now(),
      name: userData.name || 'Új felhasználó',
      email: userData.email || 'uj@felhasznalo.hu',
      role: userData.role || 'customer',
      verified: true,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('userRole', newUser.role);
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loginAsCustomer,
    loginAsDriver,
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