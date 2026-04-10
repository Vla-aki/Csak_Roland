// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEye, FaEyeSlash, FaRocket, FaShieldAlt } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Állapotok
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Jelszó erősség
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return { text: 'Gyenge', color: 'text-red-600' };
    if (passwordStrength <= 3) return { text: 'Közepes', color: 'text-yellow-600 dark:text-yellow-500' };
    return { text: 'Erős', color: 'text-green-600' };
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Input kezelés
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validáció
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'A név megadása kötelező';
    }
    
    if (!formData.email && !formData.phone) {
      newErrors.email = 'Email vagy telefonszám megadása kötelező!';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Érvénytelen email cím';
    }
    
    if (!formData.password) {
      newErrors.password = 'A jelszó megadása kötelező';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A jelszónak legalább 6 karakter hosszúnak kell lennie';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'A jelszó megerősítése kötelező';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'A jelszavak nem egyeznek';
    }
    
    return newErrors;
  };

  // Űrlap küldés
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        // Sikeres regisztráció után egyből a megfelelő profilba dobjuk a felhasználót
        if (result.user?.role === 'driver') {
          navigate('/drone-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        const errorMsg = result.error || 'Hiba történt a regisztráció során';
        // Ellenőrizzük, hogy a hiba a már létező fiók miatt van-e
        if (errorMsg.toLowerCase().includes('regisztrálva') || errorMsg.toLowerCase().includes('létezik')) {
          setErrors({ 
            email: 'Ez az adat már használatban van.',
            phone: 'Ez az adat már használatban van.',
            form: 'Ezzel az email címmel vagy telefonszámmal már regisztráltak. Kérjük, jelentkezz be, vagy használj másik adatot!'
          });
        } else {
          setErrors({ form: errorMsg });
        }
      }
    } catch (error) {
      setErrors({ form: 'Hiba történt a regisztráció során' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="flex-1 flex pt-16">
        
        {/* Információs sáv */}
        <div className="hidden lg:flex lg:w-1/3 xl:w-1/4 bg-blue-800 dark:bg-gray-900 text-white flex-col justify-between p-10 xl:p-14 relative overflow-hidden transition-colors duration-700">
          
          {/* Háttér animáció */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 dark:opacity-0 transition-opacity duration-700 z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-gray-900 opacity-0 dark:opacity-100 transition-opacity duration-700 z-0"></div>

          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 dark:bg-blue-600 opacity-20 dark:opacity-10 blur-3xl transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-blue-400 dark:bg-blue-500 opacity-20 dark:opacity-10 blur-3xl transition-all duration-700"></div>
          
          <div className="relative z-10 mt-10">
            <h2 className="text-3xl xl:text-4xl font-bold mb-6 leading-tight transition-all duration-700">
              Csatlakozz a <br/>HoverHire-hez!
            </h2>
            <p className="text-blue-100 dark:text-gray-300 text-base mb-12 max-w-sm transition-colors duration-700">
              Magyarország legnagyobb és legmegbízhatóbb drónos piactere, ahol a megbízók és pilóták egymásra találnak.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/30 dark:bg-slate-700/50 p-3 rounded-lg mt-1 transition-colors duration-700">
                  <FaRocket className="text-blue-200 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gyors és egyszerű</h3>
                  <p className="text-blue-200/80 dark:text-gray-400 text-sm mt-1 transition-colors duration-700">Hirdess projektet vagy találj munkát pillanatok alatt.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/30 dark:bg-slate-700/50 p-3 rounded-lg mt-1 transition-colors duration-700">
                  <FaShieldAlt className="text-blue-200 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Biztonságos platform</h3>
                  <p className="text-blue-200/80 dark:text-gray-400 text-sm mt-1 transition-colors duration-700">Ellenőrzött szakemberek és biztonságos, letéti fizetési rendszer.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 text-sm text-blue-200/60 dark:text-gray-500 font-medium transition-colors duration-700">
            &copy; {new Date().getFullYear()} HoverHire. Minden jog fenntartva.
          </div>
        </div>

        {/* Űrlap */}
        <div className="w-full lg:w-2/3 xl:w-3/4 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white dark:bg-gray-900 transition-colors duration-700">
          <div className="w-full max-w-md xl:max-w-lg space-y-8">
            
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-700">Regisztráció</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-700">Hozd létre a fiókod ingyenesen</p>
            </div>

            {errors.form && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg transition-colors duration-700">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium transition-colors duration-700">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Szerepkör választás */}
              <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6 transition-colors duration-700">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all duration-500 ${
                    formData.role === 'customer'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <FaUser /> Megbízó
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'driver' }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all duration-500 ${
                    formData.role === 'driver'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <FaRocket /> Pilóta
                </button>
              </div>

              {/* Név */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-700">
                  Teljes név
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500`}
                  placeholder="Kovács János"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Kapcsolattartás */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-700">
                    Email cím
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500`}
                    placeholder="pelda@email.hu"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Telefon */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-700">
                    Telefon <span className="text-gray-400 text-xs font-normal transition-colors duration-700">(opcionális)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500`}
                    placeholder="+36 30 123 4567"
                  />
                </div>
              </div>

              {/* Jelszó */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-700">
                  Jelszó
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" />
                    )}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1 mb-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength >= level ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <p className={`text-xs font-medium transition-colors duration-500 ${getStrengthText().color}`}>
                        {getStrengthText().text}
                      </p>
                      {passwordStrength <= 2 && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors duration-500">Tipp: használj kis/nagybetűt és számot</p>
                      )}
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-700">
                  Jelszó megerősítése
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Regisztráció */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 active:scale-[0.98]'
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

            </form>
            
            {/* Linkek */}
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors duration-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-700">
                Már van fiókod?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors duration-300">
                  Jelentkezz be
                </Link>
              </p>
              <Link to="/forgot-password" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline transition-colors duration-300">
                Elfelejtett jelszó?
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;