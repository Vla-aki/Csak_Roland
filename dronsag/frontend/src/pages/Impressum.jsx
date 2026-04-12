// src/pages/Impressum.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          
          {/* Fejléc */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Impresszum
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              A HoverHire Kft. hivatalos cégadatok
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">ÁSZF</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Adatvédelem</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/cookie" className="text-blue-600 dark:text-blue-400 hover:underline">Cookie</Link>
            </div>
          </div>

          {/* Tartalom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            <div className="space-y-8">
              
              {/* Cégadatok */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Céginformációk</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cégnév</p>
                      <p className="font-semibold text-gray-900 dark:text-white">HoverHire Kft.</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Korlátolt Felelősségű Társaság</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Székhely</p>
                      <p className="font-semibold text-gray-900 dark:text-white">1137 Budapest, Drón utca 12.</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Magyarország</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Adószám</p>
                      <p className="font-semibold text-gray-900 dark:text-white">12345678-1-42</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cégjegyzékszám</p>
                      <p className="font-semibold text-gray-900 dark:text-white">01-09-123456</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fővárosi Törvényszék Cégbírósága</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bejegyzés dátuma: 2026. március 15.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Képviselő</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Kovács Péter</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ügyvezető</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                      <a href="tel:+36301234567" className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                        +36 30 123 4567
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a href="mailto:info@hoverhire.hu" className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                        info@hoverhire.hu
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Weboldal</p>
                      <a href="https://www.hoverhire.hu" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                        www.hoverhire.hu
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bankszámla */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bankszámla adatok</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bankszámlaszám</p>
                    <p className="font-semibold text-gray-900 dark:text-white">12345678-12345678-12345678</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bank neve</p>
                    <p className="font-semibold text-gray-900 dark:text-white">OTP Bank Nyrt.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">IBAN</p>
                    <p className="font-semibold text-gray-900 dark:text-white">HU12 1234 5678 1234 5678 1234 5678</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SWIFT/BIC</p>
                    <p className="font-semibold text-gray-900 dark:text-white">OTPVHUHB</p>
                  </div>
                </div>
              </section>

              {/* Adatvédelem */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Adatvédelmi tisztviselő</h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400"><span className="font-semibold">Név:</span> Dr. Jogász Elek</p>
                  <p className="text-gray-600 dark:text-gray-400"><span className="font-semibold">Email:</span> <a href="mailto:jogasz@hoverhire.hu" className="text-blue-600 dark:text-blue-400 hover:underline">jogasz@hoverhire.hu</a></p>
                  <p className="text-gray-600 dark:text-gray-400"><span className="font-semibold">Telefon:</span> +36 30 987 6543</p>
                </div>
              </section>

              {/* Tárhely */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tárhelyszolgáltató</h2>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">DigitalOcean, LLC</p>
                  <p className="text-gray-600 dark:text-gray-400">101 Avenue of the Americas, 10th Floor</p>
                  <p className="text-gray-600 dark:text-gray-400">New York, NY 10013, USA</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Web: <a href="https://www.digitalocean.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">www.digitalocean.com</a>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Email: <a href="mailto:legal@digitalocean.com" className="text-blue-600 dark:text-blue-400 hover:underline">legal@digitalocean.com</a>
                  </p>
                </div>
              </section>

              {/* Engedélyek */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Engedélyek, tanúsítványok</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Engedély száma</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Kibocsátó</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Érvényesség</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">DM-2026-12345</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">Nemzeti Közlekedési Hatóság</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">2027.01.14.</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">NK-2026-6789</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">Nemzeti Média- és Hírközlési Hatóság</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">2027.01.31.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Jogi nyilatkozat */}
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A HoverHire Kft. a fenti adatokban bekövetkezett változásokat haladéktalanul frissíti. 
                  A weboldalon található információk tájékoztató jellegűek, a teljesség igénye nélkül kerültek feltüntetésre.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Utolsó frissítés: 2026. január 1.
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

export default Impressum;