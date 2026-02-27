import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Szolgáltatások', path: '/szolgaltatasok' },
    { name: 'Árak', path: '/arak' },
    { name: 'Rólunk', path: '/rolunk' },
    { name: 'Kapcsolat', path: '/kapcsolat' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-light tracking-tight">
            HOVER<span className="font-semibold text-indigo-600">HIRE</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors relative group ${
                  isActive(link.path) 
                    ? 'text-indigo-600 font-medium' 
                    : scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 transition-transform group-hover:scale-x-100 ${
                  isActive(link.path) ? 'scale-x-100' : ''
                }`}></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className={`text-sm transition-colors ${
                scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Bejelentkezés
            </Link>
            <Link 
              to="/register" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition shadow-sm"
            >
              Regisztráció
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col gap-2">
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 py-2">
                Bejelentkezés
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">
                Regisztráció
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;