// src/pages/Cookie.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCookie, FaCookieBite, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaChartLine, FaUserCog } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Cookie = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  const toggleCookieSetting = (type) => {
    if (type !== 'necessary') {
      setCookieSettings(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    }
  };

  const cookieTypes = [
    {
      id: 'necessary',
      icon: <FaCookieBite />,
      title: 'Alapvető cookie-k',
      description: 'Ezek a cookie-k elengedhetetlenek a weboldal működéséhez. Lehetővé teszik a bejelentkezést, a biztonságos böngészést és a weboldal alapfunkcióinak használatát.',
      examples: ['Bejelentkezési állapot', 'Biztonsági elemek', 'Munkamenet azonosító'],
      alwaysOn: true,
      duration: 'Munkamenet'
    },
    {
      id: 'functional',
      icon: <FaUserCog />,
      title: 'Funkcionális cookie-k',
      description: 'Ezek a cookie-k segítenek a weboldal testreszabásában és a felhasználói élmény javításában. Megjegyzik a beállításaidat és a választásaidat.',
      examples: ['Nyelvi beállítások', 'Felhasználói preferenciák', 'Megtekintett tartalmak'],
      alwaysOn: false,
      duration: '1 év'
    },
    {
      id: 'analytics',
      icon: <FaChartLine />,
      title: 'Analitikai cookie-k',
      description: 'A statisztikai cookie-k segítségével információkat gyűjtünk arról, hogyan használják látogatóink a weboldalt. Ez segít a weboldal fejlesztésében és a felhasználói élmény javításában.',
      examples: ['Google Analytics', 'Látogatói statisztikák', 'Oldalmegtekintések'],
      alwaysOn: false,
      duration: '2 év'
    },
    {
      id: 'marketing',
      icon: <FaInfoCircle />,
      title: 'Marketing cookie-k',
      description: 'A marketing cookie-k segítségével releváns hirdetéseket jeleníthetünk meg, és mérhetjük a kampányok hatékonyságát.',
      examples: ['Facebook pixel', 'Google Ads', 'Remarketing'],
      alwaysOn: false,
      duration: '30 nap'
    }
  ];

  const handleSaveSettings = () => {
    // TODO: Cookie beállítások mentése
    console.log('Mentett beállítások:', cookieSettings);
    setShowSettings(false);
    // Sikeres mentés jelzése
    alert('Cookie beállítások elmentve!');
  };

  const handleAcceptAll = () => {
    setCookieSettings({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
    // TODO: Összes cookie elfogadása
    console.log('Összes cookie elfogadva');
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    setCookieSettings({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    });
    // TODO: Csak alapvető cookie-k
    console.log('Csak alapvető cookie-k');
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Fejléc */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FaCookie className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Cookie szabályzat
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              Tájékoztató a sütik használatáról
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                ÁSZF
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                to="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Adatvédelem
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                to="/impresszum"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Impresszum
              </Link>
            </div>
          </div>

          {/* Bevezető */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-all duration-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Mik azok a cookie-k (sütik)?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              A cookie-k (magyarul: sütik) kis szöveges fájlok, amelyeket a weboldal helyez el az Ön számítógépén, 
              tabletjén vagy mobiltelefonján, amikor meglátogatja a weboldalt. A cookie-k lehetővé teszik a weboldal 
              számára, hogy megjegyezze az Ön beállításait, és felismerje a böngészőjét a későbbi látogatások során.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A HoverHire weboldal cookie-kat használ a felhasználói élmény javítása, a weboldal működésének biztosítása, 
              statisztikák készítése és marketing célok érdekében. Ön jogosult eldönteni, hogy mely cookie-kat engedélyezi.
            </p>

            {/* Gyors műveletek */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAcceptAll}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaCheckCircle />
                Összes elfogadása
              </button>
              <button
                onClick={handleRejectAll}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaTimesCircle />
                Csak alapvető cookie-k
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                Részletes beállítások
              </button>
            </div>
          </div>

          {/* Részletes beállítások */}
          {showSettings && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Részletes cookie beállítások
              </h2>

              <div className="space-y-6">
                {cookieTypes.map((cookie) => (
                  <div key={cookie.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {cookie.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {cookie.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {cookie.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              ⏱️ Tárolási idő: {cookie.duration}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              📌 Példák: {cookie.examples.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cookieSettings[cookie.id]}
                            onChange={() => toggleCookieSetting(cookie.id)}
                            disabled={cookie.alwaysOn}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer ${
                            cookie.alwaysOn
                              ? 'bg-blue-600 cursor-not-allowed'
                              : cookieSettings[cookie.id]
                                ? 'bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white'
                                : 'bg-gray-200 dark:bg-gray-700'
                          } after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                        {cookie.alwaysOn && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mindig aktív</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Mégse
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Beállítások mentése
                </button>
              </div>
            </div>
          )}

          {/* Cookie típusok részletesen */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-all duration-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Cookie-k részletes leírása
            </h2>

            <div className="space-y-8">
              {cookieTypes.map((cookie) => (
                <div key={cookie.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {cookie.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {cookie.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 ml-11">
                    {cookie.description}
                  </p>
                  <div className="ml-11">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-medium">Tárolási idő:</span> {cookie.duration}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Példák:</span> {cookie.examples.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cookie kezelése böngészőben */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cookie-k kezelése a böngészőben
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A legtöbb böngésző lehetőséget biztosít a cookie-k kezelésére. Általában a böngésző 
              "Beállítások" vagy "Preferenciák" menüjében találhatóak ezek az opciók.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Google Chrome</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beállítások → Adatvédelem és biztonság → Cookie-k és egyéb webhelyadatok
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mozilla Firefox</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beállítások → Adatvédelem és biztonság → Cookie-k és webhelyadatok
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Safari</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beállítások → Adatvédelem → Cookie-k kezelése
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Microsoft Edge</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beállítások → Cookie-k és webhelyengedélyek → Cookie-k kezelése
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Felhívjuk figyelmét, hogy ha letiltja az alapvető cookie-kat, a weboldal egyes funkciói nem 
              fognak megfelelően működni.
            </p>
          </div>

          {/* Kapcsolat */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Ha bármilyen kérdése van a cookie-k használatával kapcsolatban, kérjük, lépjen kapcsolatba velünk a{' '}
              <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                kapcsolatfelvételi űrlapon
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cookie;