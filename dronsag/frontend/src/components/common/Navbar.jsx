// src/components/common/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaCog, FaSun, FaMoon, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem('notif_muted') === 'true');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dark mode követés
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    
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

  // Kattintás a profil menün kívül (bezárás)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Értesítések lekérése
  useEffect(() => {
    if (user) {
      const fetchNotifs = async () => {
        try {
          const token = localStorage.getItem('token');
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const res = await fetch(`${apiUrl}/notifications`, { headers: { 'Authorization': `Bearer ${token}` }});
          const data = await res.json();
          if (data.success) setNotifications(data.notifications);
        } catch (e) {}
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 15000); // 15 másodpercenként frissít
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/notifications/read-all`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }});
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (e) {}
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('notif_muted', newMuted.toString());
  };

  const toggleDarkMode = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setIsDark(nextTheme === 'dark');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white dark:bg-gray-900 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-gray-900 dark:text-white">HOVER</span>
            <span className="text-blue-600 dark:text-blue-400">HIRE</span>
          </Link>

          {/* Szerepkör-alapú Desktop menü */}
          <div className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <Link to="/find-work" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Munkák</Link>
                <Link to="/find-freelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Pilóták</Link>
              </>
            )}
            
            {user?.role === 'customer' && (
              <>
                <Link to="/my-projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Saját munkáim</Link>
                <Link to="/create-project" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Munka hirdetés</Link>
                <Link to="/find-work" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Munkák keresése</Link>
                <Link to="/find-freelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Pilóták</Link>
              </>
            )}

            {user?.role === 'driver' && (
              <>
                <Link to="/my-bids" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Ajánlataim</Link>
                <Link to="/find-work" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Munkák keresése</Link>
                <Link to="/find-freelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Pilóták</Link>
              </>
            )}

            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Rólunk</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {isDark ? <FaSun size={18} className="text-yellow-400" /> : <FaMoon size={18} />}
            </button>

            {/* Értesítések Harang ikon */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                  <FaBell size={18} />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white">Értesítések</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{n.message || n.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleDateString('hu-HU')}</p>
                        </div>
                      )) : <p className="p-4 text-sm text-gray-500 text-center">Nincs új értesítésed.</p>}
                    </div>
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={markAllAsRead} className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-1.5 transition-colors">Összes olvasottnak jelölése</button>
                  </div>
                )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {user.profile_image ? (
                    <img src={user.profile_image} alt="Profil" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden lg:block font-medium text-gray-700 dark:text-gray-200 text-sm max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Lenyíló menü (Dropdown) */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email || user.phone}</p>
                    </div>

                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'customer' ? '/dashboard' : '/drone-dashboard'}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaCog className="text-gray-400 text-lg" /> Vezérlőpult
                    </Link>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaUserCircle className="text-gray-400 text-lg" /> Profil beállítások
                    </Link>

                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                    
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FaSignOutAlt className="text-lg" /> Kijelentkezés
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">
                  Bejelentkezés
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md">
                  Regisztráció
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          >
            <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {!user && (
                <>
                  <Link to="/find-work" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Munkák</Link>
                  <Link to="/find-freelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Pilóták</Link>
                </>
              )}
              {user?.role === 'customer' && (
                <>
                  <Link to="/my-projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Saját munkáim</Link>
                  <Link to="/create-project" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Munka hirdetés</Link>
                  <Link to="/find-work" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Munkák keresése</Link>
                  <Link to="/find-freelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Pilóták</Link>
                </>
              )}
              {user?.role === 'driver' && (
                <>
                  <Link to="/my-bids" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Ajánlataim</Link>
                  <Link to="/find-work" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Munkák keresése</Link>
                  <Link to="/find-freelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Pilóták</Link>
                </>
              )}
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Rólunk
              </Link>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                      {user.profile_image ? (
                        <img src={user.profile_image} alt="Profil" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email || user.phone}</p>
                        </div>
                      </div>
                      <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {isDark ? <FaSun className="text-yellow-400"/> : <FaMoon />}
                      </button>
                    </div>
                    
                    <div className="flex flex-col space-y-2 mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'customer' ? '/dashboard' : '/drone-dashboard'} onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-300">
                        <FaCog className="text-gray-400 text-lg" /> Vezérlőpult
                      </Link>
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-300">
                        <FaUserCircle className="text-gray-400 text-lg" /> Profil beállítások
                      </Link>
                      <button onClick={() => { setIsOpen(false); logout(); navigate('/'); }} className="flex items-center gap-3 py-2 text-red-600 text-left">
                        <FaSignOutAlt className="text-lg" /> Kijelentkezés
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Link to="/login" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 dark:text-gray-300 font-medium">
                        Bejelentkezés
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                        Regisztráció
                      </Link>
                    </div>
                    <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {isDark ? <FaSun className="text-yellow-400"/> : <FaMoon />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;