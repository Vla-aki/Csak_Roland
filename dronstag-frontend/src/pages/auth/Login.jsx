import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (formData.email && formData.password) {
        login(formData.email, formData.password);
        navigate('/');
      } else {
        setError('Kérjük, tölts ki minden mezőt!');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Bal oldal - Űrlap */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-light mb-2">Üdvözlünk újra!</h1>
                <p className="text-gray-600">
                  Jelentkezz be a fiókodba, hogy folytasd a munkát.
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email cím
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="pelda@email.hu"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Demo: customer@test.com vagy drone@test.com
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jelszó
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Emlékezz rám</span>
                  </label>
                  <Link 
                    to="/elfelejtett-jelszo" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Elfelejtett jelszó?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                </button>
              </form>

              <p className="mt-8 text-center text-gray-600">
                Még nincs fiókod?{' '}
                <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                  Regisztrálj most
                </Link>
              </p>
            </div>

            {/* Jobb oldal - Bemutató */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Biztonságos bejelentkezés</h3>
                <p className="text-white/80 mb-6">
                  Adataid titkosított csatornán kerülnek továbbításra.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span>Kétfaktoros hitelesítés</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span>GDPR kompatibilis adatkezelés</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span>24/7 ügyfélszolgálat</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h4 className="font-bold mb-4">Miért válassz minket?</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-indigo-600">✓</span>
                    500+ ellenőrzött pilóta
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-indigo-600">✓</span>
                    1000+ sikeres projekt
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-indigo-600">✓</span>
                    10+ év tapasztalat
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Kovács Anna</p>
                    <p className="text-sm text-gray-600">Ingatlanügynök</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "A HoverHire-rel percek alatt találtam profi drónost, aki csodálatos felvételeket készített az ingatlanjaimról."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;