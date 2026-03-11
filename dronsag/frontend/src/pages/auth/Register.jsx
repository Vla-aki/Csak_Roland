// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // State management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'A név megadása kötelező';
    }
    
    if (!formData.email) {
      newErrors.email = 'Az email cím megadása kötelező';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Érvénytelen email cím';
    }
    
    if (!formData.password) {
      newErrors.password = 'A jelszó megadása kötelező';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'A jelszó megerősítése kötelező';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'A jelszavak nem egyeznek';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'El kell fogadnod a felhasználási feltételeket';
    }
    
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
    
    try {
      // Regisztráció - azonnal be is jelentkeztet
      await register(formData);
      
      // Átirányítás a megfelelő dashboardra
      if (formData.role === 'customer') {
        navigate('/dashboard');
      } else {
        navigate('/drone-dashboard');
      }
      
    } catch (error) {
      setErrors({ form: 'Hiba történt a regisztráció során' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-md">
          {/* Fejléc */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Hozd létre fiókod
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Csatlakozz Magyarország legnagyobb drónos közösségéhez
            </p>
          </div>

          {/* Register form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all duration-700">
            
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Név mező */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teljes név
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-700 border ${
                      errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                    placeholder="Pl. Kovács János"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email mező */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                    placeholder="pelda@email.hu"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Jelszó mező */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <FaEye className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Jelszó megerősítése */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jelszó megerősítése
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <FaEye className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Szerepkör választás */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Regisztráció mint
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                    className={`p-4 border rounded-lg text-center transition-all duration-300 ${
                      formData.role === 'customer'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <FaUserCircle className={`mx-auto text-2xl mb-2 ${
                      formData.role === 'customer' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <h3 className={`font-semibold ${
                      formData.role === 'customer' ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                    }`}>Megbízó</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Projektet hirdetek
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'driver' }))}
                    className={`p-4 border rounded-lg text-center transition-all duration-300 ${
                      formData.role === 'driver'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <span className={`text-2xl mb-2 block ${
                      formData.role === 'driver' ? 'text-blue-600' : 'text-gray-400'
                    }`}>🚁</span>
                    <h3 className={`font-semibold ${
                      formData.role === 'driver' ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                    }`}>Pilóta</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Munkát vállalok
                    </p>
                  </button>
                </div>
              </div>

              {/* Felhasználási feltételek */}
              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Elfogadom a{' '}
                    <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                      felhasználási feltételeket
                    </Link>{' '}
                    és az{' '}
                    <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                      adatvédelmi irányelveket
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
                )}
              </div>

              {/* Regisztráció gomb */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  'Regisztráció'
                )}
              </button>

              {/* Login link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Már van fiókod?{' '}
                  <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Jelentkezz be
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Információ */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              ⚡ Fejlesztői mód: regisztráció után azonnal bejelentkezve.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;