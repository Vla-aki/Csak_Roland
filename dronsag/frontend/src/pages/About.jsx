// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaRocket, FaHandshake, FaShieldAlt, FaStar, FaCheckCircle, FaAward, FaHeart } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const About = () => {
  const stats = [
    { value: '2016', label: 'Alapítás éve' },
    { value: '500+', label: 'Ellenőrzött pilóta' },
    { value: '1200+', label: 'Sikeres projekt' },
    { value: '98%', label: 'Ügyfél elégedettség' }
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
      name: 'Kovács Péter',
      role: 'Alapító - CEO',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Korábbi drónpilóta és projektmenedzser. 10+ év tapasztalat a dróniparban és az online piacterek fejlesztésében.',
      linkedin: '#',
      email: 'peter.kovacs@hoverhire.hu'
    },
    {
      name: 'Nagy Eszter',
      role: 'Műszaki igazgató',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Mérnöki végzettségű szakértő, 8 éve foglalkozik drónokkal és légi felvételezéssel. Felelős a technikai minőségbiztosításért.',
      linkedin: '#',
      email: 'eszter.nagy@hoverhire.hu'
    },
    {
      name: 'Szabó István',
      role: 'Ügyfélszolgálati vezető',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      bio: 'Korábban nemzetközi ügyfélszolgálati csapatokat vezetett. Célja, hogy minden felhasználónk elégedett legyen.',
      linkedin: '#',
      email: 'istvan.szabo@hoverhire.hu'
    },
    {
      name: 'Kiss Anna',
      role: 'Közösségi menedzser',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      bio: 'Felelős a pilóták és megbízók közötti kapcsolattartásért, közösségépítésért és a rendezvények szervezéséért.',
      linkedin: '#',
      email: 'anna.kiss@hoverhire.hu'
    }
  ];

  const timeline = [
    {
      year: '2016',
      title: 'Az ötlet megszületik',
      description: 'Kovács Péter, maga is drónpilóta, felismerte, hogy szükség van egy megbízható platformra a megbízók és pilóták összekapcsolására.'
    },
    {
      year: '2017',
      title: 'Elindul a HoverHire',
      description: 'A platform béta verziója elindul 50 pilótával és az első projektekkel Budapesten.'
    },
    {
      year: '2019',
      title: 'Országos terjeszkedés',
      description: 'A szolgáltatás elérhetővé válik az ország minden pontján, a pilóták száma eléri a 200-at.'
    },
    {
      year: '2021',
      title: 'Nemzetközi díj',
      description: 'A HoverHire elnyeri az "Év Innovatív Startupja" díjat a Drón Technológiai Konferencián.'
    },
    {
      year: '2024',
      title: '500+ pilóta',
      description: 'Mára több mint 500 ellenőrzött pilóta és 1200+ sikeres projekt tartozik a platformhoz.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16">
        {/* Hero szekció - hullám nélkül, sima kocka */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4 text-white transition-all duration-700">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700">
              Rólunk
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90 transition-all duration-700">
              2016 óta segítjük összekapcsolni a megbízókat a profi drónpilótákkal.
              Magyarország legnagyobb és legmegbízhatóbb drónos piactere.
            </p>
          </div>
        </section>

        {/* Történet szekció */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800 transition-all duration-700">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="transition-all duration-700">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700">
                  A HoverHire története
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
                  A HoverHire ötlete 2016-ban született meg, amikor alapítónk, Kovács Péter, 
                  maga is drónpilótaként szembesült azzal a problémával, hogy nehéz megbízható 
                  megbízókat találni.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
                  A kezdeti időkben csak egy egyszerű weboldal működött, ahol a pilóták 
                  listázhatták magukat, és a megbízók elérhették őket. A sikereken felbuzdulva 
                  folyamatosan fejlesztettük a platformot.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 transition-all duration-700">
                  Ma már egy komplex piactérként működünk, ahol a megbízók könnyedén 
                  meghirdethetik projektjeiket, a pilóták pedig ajánlatokat tehetnek rájuk. 
                  Mindezt egy biztonságos, ellenőrzött környezetben.
                </p>
              </div>
              <div className="relative transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Drón a levegőben"
                  className="rounded-lg shadow-2xl transition-all duration-700"
                />
                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-xl transition-all duration-700">
                  <p className="text-4xl font-bold transition-all duration-700">8+</p>
                  <p className="text-sm transition-all duration-700">év tapasztalat</p>
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

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  {/* Év jelölő */}
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-700">
                      {item.year}
                    </span>
                  </div>
                  
                  {/* Pont a vonalon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-4 h-4 mt-2 bg-blue-600 rounded-full transition-all duration-700"></div>
                    {index < timeline.length - 1 && (
                      <div className="absolute top-6 left-2 w-0.5 h-24 bg-blue-200 dark:bg-blue-800 transition-all duration-700"></div>
                    )}
                  </div>
                  
                  {/* Tartalom */}
                  <div className="flex-1 pb-8 transition-all duration-700">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* CTA szekció */}
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
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg"
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