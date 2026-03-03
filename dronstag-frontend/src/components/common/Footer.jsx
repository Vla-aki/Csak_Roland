import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 border-t border-gray-800 dark:border-gray-800 transition-all duration-700">
      {/* Fő footer tartalom */}
      <div className="container mx-auto px-6 py-12 transition-all duration-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Cég info */}
          <div className="transition-all duration-700">
            <h3 className="text-2xl font-bold text-white dark:text-white mb-4 transition-all duration-700">
              HOVER<span className="text-blue-500 dark:text-blue-400">HIRE</span>
            </h3>
            <p className="text-sm leading-relaxed mb-4 text-gray-400 dark:text-gray-400 transition-all duration-700">
              Magyarország legnagyobb drónos piactere. 2016 óta segítjük összekapcsolni a megbízókat a profi drónpilótákkal.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 transition-all duration-700">
                <span className="w-2 h-2 bg-green-500 rounded-full transition-all duration-700"></span>
                <span className="text-gray-300 dark:text-gray-400 transition-all duration-700">500+ pilóta</span>
              </div>
              <div className="flex items-center gap-1 transition-all duration-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full transition-all duration-700"></span>
                <span className="text-gray-300 dark:text-gray-400 transition-all duration-700">1200+ projekt</span>
              </div>
            </div>
          </div>

          {/* Navigáció */}
          <div className="transition-all duration-700">
            <h4 className="text-white dark:text-white font-semibold mb-4 transition-all duration-700">Navigáció</h4>
            <ul className="space-y-2 text-sm">
              <li className="transition-all duration-700">
                <Link to="/" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Főoldal
                </Link>
              </li>
              <li className="transition-all duration-700">
                <Link to="/find-work" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Munka keresés
                </Link>
              </li>
              <li className="transition-all duration-700">
                <Link to="/find-freelancers" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Pilóták
                </Link>
              </li>
              <li className="transition-all duration-700">
                <Link to="/about" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Rólunk
                </Link>
              </li>
            </ul>
          </div>

          {/* Szolgáltatások */}
          <div className="transition-all duration-700">
            <h4 className="text-white dark:text-white font-semibold mb-4 transition-all duration-700">Szolgáltatások</h4>
            <ul className="space-y-2 text-sm">
              <li className="transition-all duration-700">
                <Link to="/category/photography" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Légifotózás
                </Link>
              </li>
              <li className="transition-all duration-700">
                <Link to="/category/videography" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Videózás
                </Link>
              </li>
              <li className="transition-all duration-700">
                <Link to="/category/inspection" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Ipari ellenőrzés
                </Link>
              </li>
              <li className="transition-all duration-700">
                <Link to="/category/mapping" className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                  Térképezés
                </Link>
              </li>
            </ul>
          </div>

          {/* Közösségi média */}
          <div className="transition-all duration-700">
            <h4 className="text-white dark:text-white font-semibold mb-4 transition-all duration-700">Kövess minket</h4>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-300">
                <span className="text-lg text-gray-300 dark:text-gray-300 transition-all duration-700">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-300">
                <span className="text-lg text-gray-300 dark:text-gray-300 transition-all duration-700">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-300">
                <span className="text-lg text-gray-300 dark:text-gray-300 transition-all duration-700">📺</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-300">
                <span className="text-lg text-gray-300 dark:text-gray-300 transition-all duration-700">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-300">
                <span className="text-lg text-gray-300 dark:text-gray-300 transition-all duration-700">🔗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Elérhetőségek - KÜLÖN SORBAN */}
      <div className="border-t border-gray-800 dark:border-gray-800 bg-gray-950/50 dark:bg-gray-900/50 transition-all duration-700 py-8">
        <div className="container mx-auto px-6 transition-all duration-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            
            {/* Cím */}
            <div className="flex items-start gap-3 transition-all duration-700">
              <span className="text-blue-500 dark:text-blue-400 text-xl transition-all duration-700">📍</span>
              <div className="transition-all duration-700">
                <p className="font-medium text-white dark:text-white mb-1 transition-all duration-700">Székhely</p>
                <p className="text-gray-400 dark:text-gray-400 transition-all duration-700">1137 Budapest<br />Drón utca 12.</p>
              </div>
            </div>

            {/* Telefon */}
            <div className="flex items-start gap-3 transition-all duration-700">
              <span className="text-blue-500 dark:text-blue-400 text-xl transition-all duration-700">📞</span>
              <div className="transition-all duration-700">
                <p className="font-medium text-white dark:text-white mb-1 transition-all duration-700">Telefon</p>
                <p className="text-gray-400 dark:text-gray-400 transition-all duration-700">+36 30 123 4567</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs transition-all duration-700">H-P: 9-18</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 transition-all duration-700">
              <span className="text-blue-500 dark:text-blue-400 text-xl transition-all duration-700">✉️</span>
              <div className="transition-all duration-700">
                <p className="font-medium text-white dark:text-white mb-1 transition-all duration-700">Email</p>
                <p className="text-gray-400 dark:text-gray-400 transition-all duration-700">info@hoverhire.hu</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs transition-all duration-700">Ügyelet: info@hoverhire.hu</p>
              </div>
            </div>

            {/* Nyitvatartás */}
            <div className="flex items-start gap-3 transition-all duration-700">
              <span className="text-blue-500 dark:text-blue-400 text-xl transition-all duration-700">🕒</span>
              <div className="transition-all duration-700">
                <p className="font-medium text-white dark:text-white mb-1 transition-all duration-700">Nyitvatartás</p>
                <p className="text-gray-400 dark:text-gray-400 transition-all duration-700">Hétfő - Péntek: 9:00 - 18:00</p>
                <p className="text-gray-400 dark:text-gray-400 transition-all duration-700">Szombat - Vasárnap: Ügyelet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alsó rész - Copyright + Legal */}
      <div className="border-t border-gray-800 dark:border-gray-800 bg-gray-950 dark:bg-black transition-all duration-700 py-4">
        <div className="container mx-auto px-6 transition-all duration-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-400 dark:text-gray-500 transition-all duration-700">
              © {currentYear} HoverHire. Minden jog fenntartva.
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/aszf" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                ÁSZF
              </Link>
              <Link to="/adatvedelem" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                Adatvédelem
              </Link>
              <Link to="/cookie" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                Cookie
              </Link>
              <Link to="/impresszum" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300">
                Impresszum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;