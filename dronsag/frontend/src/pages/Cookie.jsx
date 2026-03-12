// src/pages/Cookie.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Cookie = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Fejléc */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Cookie szabályzat
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              Tájékoztató a sütik használatáról
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">ÁSZF</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Adatvédelem</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/impressum" className="text-blue-600 dark:text-blue-400 hover:underline">Impresszum</Link>
            </div>
          </div>

          {/* Tartalom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            <div className="space-y-8">
              
              {/* Bevezető */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mik azok a cookie-k (sütik)?</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  A cookie-k (magyarul: sütik) kis szöveges fájlok, amelyeket a weboldal helyez el az Ön számítógépén, 
                  tabletjén vagy mobiltelefonján, amikor meglátogatja a weboldalt. A cookie-k lehetővé teszik a weboldal 
                  számára, hogy megjegyezze az Ön beállításait, és felismerje a böngészőjét a későbbi látogatások során.
                </p>
              </section>

              {/* Cookie típusok */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookie-k típusai</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Alapvető cookie-k</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ezek a cookie-k elengedhetetlenek a weboldal működéséhez. Lehetővé teszik a bejelentkezést, 
                      a biztonságos böngészést és a weboldal alapfunkcióinak használatát. Ezek a cookie-k mindig aktívak.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Példák: bejelentkezési állapot, munkamenet azonosító</p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Funkcionális cookie-k</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ezek a cookie-k segítenek a weboldal testreszabásában és a felhasználói élmény javításában. 
                      Megjegyzik a beállításaidat és a választásaidat.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Példák: nyelvi beállítások, felhasználói preferenciák</p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analitikai cookie-k</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      A statisztikai cookie-k segítségével információkat gyűjtünk arról, hogyan használják látogatóink a weboldalt. 
                      Ez segít a weboldal fejlesztésében és a felhasználói élmény javításában.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Példák: Google Analytics, látogatói statisztikák</p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Marketing cookie-k</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      A marketing cookie-k segítségével releváns hirdetéseket jeleníthetünk meg, és mérhetjük a kampányok hatékonyságát.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Példák: Facebook pixel, Google Ads, remarketing</p>
                  </div>
                </div>
              </section>

              {/* Cookie kezelése */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookie-k kezelése</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  A legtöbb böngésző lehetőséget biztosít a cookie-k kezelésére. Általában a böngésző 
                  "Beállítások" vagy "Preferenciák" menüjében találhatóak ezek az opciók.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Felhívjuk figyelmét, hogy ha letiltja az alapvető cookie-kat, a weboldal egyes funkciói nem 
                    fognak megfelelően működni.
                  </p>
                </div>
              </section>

              {/* Cookie beállítások gomb */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Cookie beállítások módosítása
                </button>
              </div>

              {/* Cookie beállítások panel */}
              {showSettings && (
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cookie beállítások</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Alapvető cookie-k</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">A weboldal működéséhez szükségesek</p>
                      </div>
                      <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm">
                        Mindig aktív
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Funkcionális cookie-k</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Javítják a felhasználói élményt</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Analitikai cookie-k</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Statisztikai adatok gyűjtése</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Marketing cookie-k</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Személyre szabott hirdetések</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      Mégse
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Beállítások mentése
                    </button>
                  </div>
                </div>
              )}

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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cookie;