import React, { useState, useEffect } from 'react';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

const Layout = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Dark mode követés
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-white text-gray-900'
    }`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;