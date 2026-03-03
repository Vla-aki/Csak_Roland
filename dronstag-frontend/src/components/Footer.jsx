import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-white text-xl font-light mb-4">HOVER<span className="font-semibold">HIRE</span></div>
            <p className="text-sm leading-relaxed">
              Magyarország legnagyobb drónos közössége 2016 óta.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Szolgáltatások</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ipari" className="hover:text-white transition">Ipari drónozás</Link></li>
              <li><Link to="/foto" className="hover:text-white transition">Légifotó</Link></li>
              <li><Link to="/terkepezes" className="hover:text-white transition">Térképezés</Link></li>
              <li><Link to="/kereses" className="hover:text-white transition">Keresés és mentés</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Rólunk</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/csapat" className="hover:text-white transition">Csapat</Link></li>
              <li><Link to="/hirek" className="hover:text-white transition">Hírek</Link></li>
              <li><Link to="/kapcsolat" className="hover:text-white transition">Kapcsolat</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Kövess minket</h4>
            <div className="flex gap-4">
              <a href="#" className="text-2xl hover:text-white transition"><FaFacebook /></a>
              <a href="#" className="text-2xl hover:text-white transition"><FaYoutube /></a>
              <a href="#" className="text-2xl hover:text-white transition"><FaInstagram /></a>
              <a href="#" className="text-2xl hover:text-white transition"><FaLinkedin /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          © 2026 HoverHire. Minden jog fenntartva.
        </div>
      </div>
    </footer>
  );
};

export default Footer;