// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Login = () => {
  const navigate = useNavigate();
  
  // State management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  // Validate form - CSAK AZ EMAIL FORMÁTUMOT ELLENŐRIZZÜK, A JELSZÓT NEM!
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Az email cím megadása kötelező';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Érvénytelen email cím';
    }
    
    if (!formData.password) {
      newErrors.password = 'A jelszó megadása kötelező';
    }
    // NINCS JELSZÓ HOSSZ ELLENŐRZÉS!
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    // TODO: API hívás a backend felé
    // A backend fogja eldönteni, hogy a jelszó helyes-e
    try {
      // Mock API hívás - később cseréld ki valódi API hívásra
      const response = await mockApiCall(formData);
      
      if (response.success) {
        // TODO: Auth context frissítése a backend által visszaadott user adatokkal
        navigate('/dashboard');
      } else {
        setLoginError(response.error || 'Hibás email cím vagy jelszó');
      }
    } catch (error) {
      setLoginError('Hiba történt a bejelentkezés során. Kérlek próbáld újra később.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API hívás - ezt később cseréld ki valódi fetch-re
  const mockApiCall = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Itt a backend válaszát szimuláljuk
        // A backend dönti el, hogy a jelszó jó-e
        if (data.email === 'demo@hoverhire.hu' && data.password === 'password123') {
          resolve({
            success: true,
            user: {
              id: 1,
              name: 'Kovács János',
              email: data.email,
              role: 'customer'
            }
          });
        } else {
          resolve({
            success: false,
            error: 'Hibás email cím vagy jelszó'
          });
        }
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-md">
          {/* Fejléc */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Üdvözöljük újra!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Jelentkezz be a fiókodba, hogy folytasd a munkát
            </p>
          </div>

          {/* Login form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all duration-700">
            
            {/* Általános hibaüzenet */}
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {loginError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email mező */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                  Email cím
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-700 border ${
                      errors.email 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700`}
                    placeholder="pelda@email.hu"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Jelszó mező - CSAK ÜRESEN ELLENŐRIZZÜK */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                  Jelszó
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border ${
                      errors.password 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300" />
                    ) : (
                      <FaEye className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
                {/* NINCS JELSZÓ HOSSZRA VONATKOZÓ ÜZENET */}
              </div>

              {/* Emlékezz rám + Elfelejtett jelszó */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">
                    Emlékezz rám
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-all duration-300"
                >
                  Elfelejtett jelszó?
                </Link>
              </div>

              {/* Bejelentkezés gomb */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 ${
                  isLoading 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Bejelentkezés...
                  </span>
                ) : (
                  'Bejelentkezés'
                )}
              </button>

              {/* Regisztráció link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">
                  Még nincs fiókod?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-all duration-300"
                  >
                    Regisztrálj most
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Demo bejelentkezés - csak fejlesztéshez */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500 transition-all duration-700">
              Demo: demo@hoverhire.hu / bármilyen jelszó (backend fogja validálni)
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;