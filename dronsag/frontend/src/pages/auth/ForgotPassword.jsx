import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaLock, FaCheckCircle, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [resetToken, setResetToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // 1. lépés: Kód kiküldése
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        setError(data.message || 'Hiba történt.');
      }
    } catch (err) {
      setError('Hálózati hiba történt!');
    }
    setLoading(false);
  };

  // 2. lépés: Kód ellenőrzése
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (data.success) {
        setResetToken(data.resetToken);
        setStep(3);
      } else {
        setError(data.message || 'Helytelen kód!');
      }
    } catch (err) {
      setError('Hálózati hiba történt!');
    }
    setLoading(false);
  };

  // 3. lépés: Új jelszó mentése
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (passwords.new !== passwords.confirm) {
      return setError('A jelszavak nem egyeznek!');
    }
    if (passwords.new.length < 6) {
      return setError('A jelszónak legalább 6 karakternek kell lennie!');
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword: passwords.new })
      });
      const data = await res.json();
      if (data.success) {
        setStep(4);
      } else {
        setError(data.message || 'Hiba történt.');
      }
    } catch (err) {
      setError('Hálózati hiba történt!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="flex-1 flex pt-24 pb-16 justify-center items-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 transition-all">
          
          {step < 4 && (
            <button onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)} className="text-gray-500 hover:text-blue-600 transition-colors mb-6 flex items-center gap-2 text-sm font-medium">
              <FaArrowLeft /> Vissza
            </button>
          )}

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 1 && 'Elfelejtett jelszó'}
              {step === 2 && 'Kód megadása'}
              {step === 3 && 'Új jelszó beállítása'}
              {step === 4 && 'Sikeres visszaállítás!'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {step === 1 && 'Add meg a regisztrációkor használt email címedet, és küldünk egy visszaállító kódot.'}
              {step === 2 && `Elküldtük a 6 számjegyű kódot a(z) ${email} címre.`}
              {step === 3 && 'Adj meg egy új, biztonságos jelszót a fiókodhoz.'}
              {step === 4 && 'A jelszavadat sikeresen frissítettük az adatbázisban.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm font-medium rounded-r-lg">
              {error}
            </div>
          )}

          {/* 1. Email bekérése */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email cím</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                    placeholder="pelda@email.hu" />
                </div>
              </div>
              <button type="submit" disabled={loading || !email} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? 'Küldés...' : 'Kód kérése'}
              </button>
            </form>
          )}

          {/* 2. Kód bekérése */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">6 számjegyű kód</label>
                <div className="relative">
                  <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required value={code} onChange={e => setCode(e.target.value)} maxLength="6"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-2xl font-bold text-gray-900 dark:text-white transition-all"
                    placeholder="000000" />
                </div>
              </div>
              <button type="submit" disabled={loading || code.length !== 6} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? 'Ellenőrzés...' : 'Kód ellenőrzése'}
              </button>
            </form>
          )}

          {/* 3. Új jelszó */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Új Jelszó</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})}
                    className="w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jelszó megerősítése</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                    placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading || !passwords.new || !passwords.confirm} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? 'Mentés...' : 'Jelszó mentése'}
              </button>
            </form>
          )}

          {/* 4. Siker */}
          {step === 4 && (
            <div className="text-center">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
              <Link to="/login" className="inline-block w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Tovább a bejelentkezéshez
              </Link>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;