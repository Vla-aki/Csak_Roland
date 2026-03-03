import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    termsAccepted: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
  };

  const handleNextStep = () => {
    if (step === 1 && !formData.name) {
      setError('Kérjük, add meg a neved!');
      return;
    }
    if (step === 2 && !formData.email) {
      setError('Kérjük, add meg az email címed!');
      return;
    }
    if (step === 3) {
      if (!formData.password) {
        setError('Kérjük, add meg a jelszavad!');
        return;
      }
      if (formData.password.length < 6) {
        setError('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('A jelszavak nem egyeznek!');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setError('Kérjük, fogadd el az adatvédelmi nyilatkozatot!');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  const passwordStrength = () => {
    const pass = formData.password;
    if (!pass) return { text: 'Add meg a jelszót', color: 'gray' };
    if (pass.length < 6) return { text: 'Gyenge', color: 'red' };
    if (pass.length < 8) return { text: 'Közepes', color: 'yellow' };
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) return { text: 'Erős', color: 'green' };
    return { text: 'Közepes', color: 'yellow' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Fejléc */}
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-light mb-4">
              Csatlakozz a <span className="font-bold text-indigo-600">közösséghez!</span>
            </h1>
            <p className="text-xl text-gray-600">
              Ingyenes regisztráció, ellenőrzött pilóták, biztonságos fizetés.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold relative z-10 ${
                    step > s 
                      ? 'bg-green-500 text-white' 
                      : step === s 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Név</span>
              <span>Email</span>
              <span>Jelszó</span>
              <span>Szerepkör</span>
            </div>
          </div>

          {/* Fő űrlap */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Név */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6">Először is, hogy hívnak?</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teljes név
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                      placeholder="Pl. Kovács János"
                      autoFocus
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition text-lg"
                  >
                    Tovább
                  </button>
                </div>
              )}

              {/* Step 2: Email */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6">Mi az email címed?</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email cím
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                      placeholder="pelda@email.hu"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-300 transition"
                    >
                      Vissza
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition"
                    >
                      Tovább
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Jelszó */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6">Válassz jelszót</h2>
                  
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
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                        placeholder="••••••••"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-16 rounded-full bg-${passwordStrength().color}-500`}></div>
                          <span className={`text-sm text-${passwordStrength().color}-600`}>
                            {passwordStrength().text} jelszó
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jelszó megerősítése
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-300 transition"
                    >
                      Vissza
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition"
                    >
                      Tovább
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Szerepkör + Elfogadás */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6">Milyen szerepkörben csatlakozol?</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <label className={`relative border-2 rounded-xl p-6 cursor-pointer transition ${
                      formData.role === 'customer' 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={formData.role === 'customer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-3">🚀</div>
                        <h3 className="font-bold mb-1">Megbízó</h3>
                        <p className="text-sm text-gray-600">
                          Projektet hirdetek, pilótát keresek
                        </p>
                      </div>
                      {formData.role === 'customer' && (
                        <div className="absolute top-3 right-3 text-indigo-600 font-bold">✓</div>
                      )}
                    </label>

                    <label className={`relative border-2 rounded-xl p-6 cursor-pointer transition ${
                      formData.role === 'driver' 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="driver"
                        checked={formData.role === 'driver'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-3">🚁</div>
                        <h3 className="font-bold mb-1">Pilóta</h3>
                        <p className="text-sm text-gray-600">
                          Munkát vállalok, projektekre jelentkezem
                        </p>
                      </div>
                      {formData.role === 'driver' && (
                        <div className="absolute top-3 right-3 text-indigo-600 font-bold">✓</div>
                      )}
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-600">
                        Elfogadom az <Link to="/aszf" className="text-indigo-600 hover:underline">Adatvédelmi Nyilatkozatot</Link> és az <Link to="/aszf" className="text-indigo-600 hover:underline">ÁSZF</Link>-et
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-300 transition"
                    >
                      Vissza
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                    >
                      {isLoading ? 'Regisztráció...' : 'Regisztráció'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Login link */}
          <p className="text-center mt-8 text-gray-600">
            Már van fiókod?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Jelentkezz be
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;