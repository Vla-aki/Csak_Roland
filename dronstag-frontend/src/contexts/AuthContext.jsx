import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

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

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user:', storedUser); // Debug log
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - determine role based on email
    const role = email.includes('drone') ? 'driver' : 'customer';
    const userData = {
      id: 1,
      email,
      role: role,
      name: email.split('@')[0]
    };
    
    console.log('Logging in with:', userData); // Debug log
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    console.log('Logging out'); // Debug log
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};