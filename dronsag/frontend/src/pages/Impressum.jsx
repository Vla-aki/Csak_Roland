// src/pages/Impressum.jsx (nem Impresszum.jsx)
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUserTie, FaRegRegistered, FaFileContract } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Impressum = () => {
  const companyData = {
    name: 'HoverHire Kft.',
    legalForm: 'Korlátolt Felelősségű Társaság',
    address: '1137 Budapest, Drón utca 12.',
    postalAddress: '1137 Budapest, Drón utca 12.',
    phone: '+36 30 123 4567',
    email: 'info@hoverhire.hu',
    web: 'www.hoverhire.hu',
    taxNumber: '12345678-1-42',
    companyReg: '01-09-123456',
    courtOfRegistration: 'Fővárosi Törvényszék Cégbírósága',
    registrationDate: '2016. március 15.',
    representative: 'Kovács Péter',
    representativePosition: 'ügyvezető',
    bankAccount: '12345678-12345678-12345678',
    bankName: 'OTP Bank Nyrt.',
    vatNumber: 'HU12345678',
    dataProtectionOfficer: 'Dr. Jogász Elek',
    dataProtectionEmail: 'jogasz@hoverhire.hu',
    hostProvider: {
      name: 'DigitalOcean, LLC',
      address: '101 Avenue of the Americas, 10th Floor, New York, NY 10013, USA',
      web: 'www.digitalocean.com',
      email: 'legal@digitalocean.com'
    }
  };

  const licenses = [
    {
      number: 'DM-2024-12345',
      issuer: 'Nemzeti Közlekedési Hatóság',
      issueDate: '2024.01.15.',
      expiryDate: '2027.01.14.',
      type: 'Drónpilóta képzési engedély'
    },
    {
      number: 'NK-2024-6789',
      issuer: 'Nemzeti Média- és Hírközlési Hatóság',
      issueDate: '2024.02.01.',
      expiryDate: '2027.01.31.',
      type: 'Légifelvétel készítési engedély'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Fejléc */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FaBuilding className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Impresszum
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              A HoverHire Kft. hivatalos cégadatok
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
                to="/cookie"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Cookie szabályzat
              </Link>
            </div>
          </div>

          {/* Cégadatok */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            
            {/* Fő cégadatok */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaBuilding className="text-blue-600 dark:text-blue-400" />
                  Céginformációk
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaBuilding />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cégnév</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{companyData.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{companyData.legalForm}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Székhely</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{companyData.address}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{companyData.postalAddress}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaPhone />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                      <a href={`tel:${companyData.phone}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                        {companyData.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a href={`mailto:${companyData.email}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                        {companyData.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaGlobe />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Weboldal</p>
                      <a href={`https://${companyData.web}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                        {companyData.web}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaRegRegistered className="text-blue-600 dark:text-blue-400" />
                  Regisztrációs adatok
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaRegRegistered />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Adószám</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{companyData.taxNumber}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaRegRegistered />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cégjegyzékszám</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{companyData.companyReg}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{companyData.courtOfRegistration}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bejegyzés dátuma: {companyData.registrationDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaUserTie />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Képviselő</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{companyData.representative}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{companyData.representativePosition}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Adatvédelmi tisztviselő</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{companyData.dataProtectionOfficer}</p>
                      <a href={`mailto:${companyData.dataProtectionEmail}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {companyData.dataProtectionEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bankszámla adatok */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bankszámla adatok</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bankszámlaszám</p>
                  <p className="font-medium text-gray-900 dark:text-white">{companyData.bankAccount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bank neve</p>
                  <p className="font-medium text-gray-900 dark:text-white">{companyData.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Adószám (EU)</p>
                  <p className="font-medium text-gray-900 dark:text-white">{companyData.vatNumber}</p>
                </div>
              </div>
            </div>

            {/* Engedélyek */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engedélyek, tanúsítványok</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Engedély száma</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Kibocsátó</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Kiadás dátuma</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Lejárat</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">Típus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenses.map((license, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">{license.number}</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">{license.issuer}</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">{license.issueDate}</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">{license.expiryDate}</td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">{license.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tárhelyszolgáltató */}
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaGlobe className="text-blue-600 dark:text-blue-400" />
                Tárhelyszolgáltató
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">{companyData.hostProvider.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{companyData.hostProvider.address}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Web: <a href={`https://${companyData.hostProvider.web}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {companyData.hostProvider.web}
                  </a>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Email: <a href={`mailto:${companyData.hostProvider.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {companyData.hostProvider.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Jogi nyilatkozat */}
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="mb-2">
                A HoverHire Kft. a fenti adatokban bekövetkezett változásokat haladéktalanul frissíti. 
                A weboldalon található információk tájékoztató jellegűek, a teljesség igénye nélkül kerültek feltüntetésre.
              </p>
              <p>
                Jelen impresszum utolsó frissítése: 2024. január 1.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Impressum;