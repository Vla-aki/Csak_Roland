// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaRocket, FaHandshake, FaShieldAlt, FaStar, FaCheckCircle, FaAward, FaHeart } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const About = () => {
  const [systemStats, setSystemStats] = useState({ freelancers: 0, completed: 0, earnings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/projects/system-stats`);
        const data = await res.json();
        if (data.success && data.stats) {
          setSystemStats({
            freelancers: data.stats.freelancers || 0,
            completed: data.stats.completed || 0,
            earnings: data.stats.earnings || 0
          });
        }
      } catch (error) {
        console.error("Hiba a statisztikák lekérésekor:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { value: '2026', label: 'Alapítás éve' },
    { value: `${systemStats.freelancers}+`, label: 'Ellenőrzött pilóta' },
    { value: `${systemStats.completed}+`, label: 'Sikeres projekt' },
    { value: `${systemStats.earnings.toLocaleString()} Ft`, label: 'Kifizetett összeg' }
  ];

  const values = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Biztonság',
      description: 'Minden pilóta alapos ellenőrzésen esik át, és rendelkezik a szükséges engedélyekkel és biztosítással.'
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: 'Megbízhatóság',
      description: 'Ügyfeleink és pilótáink is értékelhetik egymást, így garantált a minőségi munka és a korrekt üzleti magatartás.'
    },
    {
      icon: <FaRocket className="text-3xl" />,
      title: 'Innováció',
      description: 'Folyamatosan követjük a legújabb technológiákat és trendeket, hogy a legmodernebb megoldásokat kínálhassuk.'
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: 'Közösség',
      description: 'Magyarország legnagyobb drónos közössége, ahol a szakemberek és megbízók könnyedén találhatnak egymásra.'
    }
  ];

  const team = [
    {
      name: 'Csák Roland',
      role: 'Alapító - CEO',
      image: 'https://ui-avatars.com/api/?name=Csák+Roland&background=2563eb&color=fff&size=256',
      bio: 'A platform megálmodója és vezető fejlesztője. Évek óta szenvedélye a dróntechnológia és a szoftverfejlesztés.',
      linkedin: '#',
      email: 'roland@hoverhire.hu'
    },
    {
      name: 'Szalai Bence',
      role: 'Társalapító - CTO',
      image: 'https://ui-avatars.com/api/?name=Szalai+Bence&background=2563eb&color=fff&size=256',
      bio: 'A technikai architektúra és az infrastruktúra felelőse. Szakértelme garantálja a platform stabil és biztonságos működését.',
      linkedin: '#',
      email: 'bence@hoverhire.hu'
    }
  ];

  const timeline = [
    {
      year: '2026',
      title: 'Az ötlet megszületik',
      description: 'Kovács Péter, maga is drónpilóta, felismerte, hogy szükség van egy modern, hazai platformra a drónos közösség számára.'
    },
    {
      year: '2026',
      title: 'A fejlesztés megkezdése',
      description: 'Elkezdtük építeni a HoverHire platformot, fókuszban a biztonságos fizetéssel és az egyszerű projektkezeléssel.'
    },
    {
      year: '2026',
      title: 'Béta verzió indulása',
      description: 'Sikeresen elindult a béta tesztelés egy zárt, szakmai közösséggel, akik segítettek finomhangolni a funkciókat.'
    },
    {
      year: '2026',
      title: 'Az első felhasználók',
      description: 'Regisztráltak az első hivatalos pilóták és megbízók, majd gazdára talált az első sikeres drónos projekt is.'
    },
    {
      year: '2026',
      title: 'Hivatalos indulás',
      description: 'A platform mindenki számára elérhetővé válik Magyarországon, megnyitva a kaput a drónos munkák új korszaka előtt.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4 text-white transition-all duration-700">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700">
              Rólunk
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90 transition-all duration-700">
              Célunk, hogy segítsük összekapcsolni a megbízókat a profi drónpilótákkal.
              Magyarország legnagyobb és legmegbízhatóbb drónos piactere.
            </p>
          </div>
        </section>

        {/* Történet */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800 transition-all duration-700">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="transition-all duration-700">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700">
                  A HoverHire története
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
                  A HoverHire ötlete 2026-ban született meg, amikor alapítónk, Kovács Péter, 
                  maga is drónpilótaként szembesült azzal a problémával, hogy nehéz megbízható 
                  megbízókat találni egy dedikált, hazai felületen.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
                  Hamar világossá vált, hogy egy olyan modern megoldásra van szükség, ahol a pilóták 
                  és a megbízók nem csak egymásra találhatnak, hanem a szerződéskötés és a fizetés is 
                  biztonságosan, egy helyen történhet.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 transition-all duration-700">
                  Így jött létre a HoverHire platform, amely új korszakot nyit a hazai drónos 
                  szolgáltatások piacán. Célunk, hogy a piac meghatározó szereplőjévé váljunk 
                  egy megbízható és átlátható közösség építésével.
                </p>
              </div>
              <div className="relative transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Drón a levegőben"
                  className="rounded-lg shadow-2xl transition-all duration-700"
                />
                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-xl transition-all duration-700">
                  <p className="text-4xl font-bold transition-all duration-700">100%</p>
                  <p className="text-sm transition-all duration-700">Hazai platform</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statisztikák */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-all duration-700">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center transition-all duration-700">
                  <p className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-all duration-700">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Értékeink */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800 transition-all duration-700">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
                Értékeink
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-700">
                Amik vezérelnek minket a mindennapi munkánk során
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center transition-all duration-700">
                  <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 transition-all duration-700">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-700">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Idővonal */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-all duration-700">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
                Mérföldköveink
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 transition-all duration-700">
                Utunk a kezdetektől napjainkig
              </p>
            </div>
          
            <div className="space-y-0">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6">
                {/* Év */}
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-700">
                      {item.year}
                    </span>
                  </div>
                  
                  {/* Pont a vonalon */}
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div className="w-4 h-4 mt-2 bg-blue-600 rounded-full z-10 transition-all duration-700"></div>
                    {index < timeline.length - 1 && (
                      <div className="absolute top-6 -bottom-2 left-1/2 -translate-x-1/2 w-0.5 bg-blue-200 dark:bg-blue-800 transition-all duration-700"></div>
                    )}
                  </div>
                  
                  {/* Tartalom */}
                  <div className="flex-1 pb-10 transition-all duration-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-all duration-700">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Csapat */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800 transition-all duration-700">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
                Csapatunk
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-700">
                Az emberek, akik a HoverHire mögött állnak
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="text-center group transition-all duration-700">
                  <div className="relative mb-4 overflow-hidden rounded-lg transition-all duration-700">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end justify-center">
                      <div className="p-4 flex gap-3 transition-all duration-700">
                        <a href={member.linkedin} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                          in
                        </a>
                        <a href={`mailto:${member.email}`} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                          ✉
                        </a>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 transition-all duration-700">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mb-2 transition-all duration-700">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white transition-all duration-700">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 transition-all duration-700">
              Csatlakozz Te is a közösségünkhöz!
            </h2>
            <p className="text-xl mb-8 opacity-90 transition-all duration-700">
              Legyél akár megbízó, akár pilóta, nálunk megtalálod a helyed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium shadow-lg"
              >
                Regisztráció
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium"
              >
                Kapcsolatfelvétel
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;