// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 border-t border-gray-800 dark:border-gray-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Cég info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              HOVER<span className="text-blue-500">HIRE</span>
            </h3>
            <p className="text-sm max-w-sm mx-auto md:mx-0">
              Magyarország legnagyobb drónos piactere. Gyorsan, egyszerűen, biztonságosan.
            </p>
          </div>

          {/* Közösségi média */}
          <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <FaLinkedinIn />
              </a>
          </div>
        </div>
      </div>

      {/* Alsó rész - JAVÍTVA */}
      <div className="border-t border-gray-800 bg-black py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-500">
              © {currentYear} HoverHire. Minden jog fenntartva.
            </div>
            <div className="flex flex-wrap gap-4">
              {/* JAVÍTVA: Helyes útvonalak az App.jsx alapján */}
              <Link to="/terms" className="hover:text-blue-400 transition-colors">
                ÁSZF
              </Link>
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                Adatvédelem
              </Link>
              <Link to="/cookie" className="hover:text-blue-400 transition-colors">
                Cookie
              </Link>
              <Link to="/impressum" className="hover:text-blue-400 transition-colors">
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