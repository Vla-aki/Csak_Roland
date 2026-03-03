import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
  FaCamera,
  FaMapMarkedAlt,
  FaIndustry,
  FaNewspaper,
  FaQuoteRight,
  FaUsers,
  FaRegCalendarAlt,
  FaStar,
  FaRocket,
  FaChartLine,
  FaUserTie,
  FaPlay
} from 'react-icons/fa';

const Landing = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [counts, setCounts] = useState({ pilots: 0, projects: 0, years: 0 });
  const [showVideo, setShowVideo] = useState(false);
  const sectionRefs = {
    hero: useRef(null),
    services: useRef(null),
    stats: useRef(null),
    howItWorks: useRef(null),
    news: useRef(null),
    team: useRef(null),
    cta: useRef(null)
  };

  // Intersection Observer a görgetés követéséhez
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Számláló animáció
  useEffect(() => {
    const targetCounts = { pilots: 528, projects: 1247, years: 10 };
    const duration = 2000;
    const step = 50;
    let current = { pilots: 0, projects: 0, years: 0 };
    
    const timer = setInterval(() => {
      const progress = Math.min(1, (Date.now() - startTime) / duration);
      setCounts({
        pilots: Math.floor(progress * targetCounts.pilots),
        projects: Math.floor(progress * targetCounts.projects),
        years: Math.floor(progress * targetCounts.years)
      });
      
      if (progress >= 1) clearInterval(timer);
    }, step);
    
    const startTime = Date.now();
    return () => clearInterval(timer);
  }, []);

  const szolgaltatasok = [
    {
      icon: <FaIndustry className="text-3xl text-indigo-600" />,
      title: "Ipari drónozás",
      description: "Gyáregységek, építkezések, nehézgépes anyagmozgatás ellenőrzése és kivitelezése.",
      features: ["Anyagmozgatás", "Struktúra ellenőrzés", "Biztonsági monitoring"]
    },
    {
      icon: <FaCamera className="text-3xl text-indigo-600" />,
      title: "Légifotó és videó",
      description: "Esküvő, ingatlanfotózás, reklámfilmek - professzionális kivitelezésben.",
      features: ["4K / 8K felbontás", "Stabilizált felvétel", "Utómunka"]
    },
    {
      icon: <FaMapMarkedAlt className="text-3xl text-indigo-600" />,
      title: "Térképezés, felmérés",
      description: "Precíziós mezőgazdaság, erdőgazdálkodás, 3D modellek készítése.",
      features: ["3D modellek", "NDVI elemzés", "Topográfiai térképek"]
    },
    {
      icon: <FaShieldAlt className="text-3xl text-indigo-600" />,
      title: "Keresés és mentés",
      description: "Hőkamerás drónokkal végzett keresések, mentési műveletek támogatása.",
      features: ["Hőkamera", "Éjjellátó", "Gyors reagálás"]
    }
  ];

  const hirek = [
    {
      title: "DJI korlátozás: 120 méter a C0-ás drónoknak",
      excerpt: "Az új szoftverfrissítés után a 250g alatti drónok sem emelkedhetnek 120 méter fölé.",
      date: "2026.01.25.",
      category: "Technológia",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "DJI FlyCart 30: ipari anyagmozgatás drónokkal",
      excerpt: "Gyáregységek tetejére telepített drónok forradalmasítják a logisztikát.",
      date: "2026.01.18.",
      category: "Ipari alkalmazás",
      image: "https://images.unsplash.com/photo-1579829366248-204feedb6cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Potensic Atom 2: beépített kijelzős távirányító",
      excerpt: "Vége a kábelrengetegnek - új korszak a drónvezérlésben.",
      date: "2026.01.12.",
      category: "Termékbemutató",
      image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const csapat = [
    {
      name: "Pataki András",
      nickname: "BanDeE",
      role: "Alapító",
      quote: "Nyomjuk meg, ez az utolsó akkumulátor…",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      expertise: ["Stratégia", "Közösségépítés"]
    },
    {
      name: "Tóth Tamás",
      nickname: "Tomeedey",
      role: "Tesztpilóta",
      quote: "Mindjárt indulok, most pakolok…",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      expertise: ["Tesztelés", "Oktatás"]
    },
    {
      name: "Mákos Kristóf",
      nickname: "Mákostészta",
      role: "Videós",
      quote: "Kétféle pilóta létezik…",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      expertise: ["Videózás", "Vágás"]
    }
  ];

  const folyamat = [
    {
      step: 1,
      title: "Projekt meghirdetése",
      description: "Add meg a projekt részleteit, helyszínt, időpontot és költségkeretet."
    },
    {
      step: 2,
      title: "Ajánlatok fogadása",
      description: "A regisztrált pilóták ajánlatokat küldenek, te pedig kiválasztod a legjobbat."
    },
    {
      step: 3,
      title: "Munka elvégzése",
      description: "A pilóta elvégzi a munkát, te pedig élőben követheted a folyamatot."
    },
    {
      step: 4,
      title: "Értékelés és fizetés",
      description: "Ha elégedett vagy, a pénz kifizetésre kerül, és értékelheted a pilótát."
    }
  ];

  return (
    <div className="bg-white">
      {/* Oldalsó navigációs indikátor */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-3">
          {['hero', 'services', 'stats', 'howItWorks', 'news', 'team', 'cta'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === section 
                  ? 'bg-indigo-600 h-6' 
                  : 'bg-gray-300 hover:bg-indigo-400'
              }`}
              onClick={(e) => {
                e.preventDefault();
                sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>

      {/* HERO SZEKCIÓ */}
      <section id="hero" ref={sectionRefs.hero} className="min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm">
                <FaRocket className="text-indigo-600" />
                <span>Magyarország legnagyobb drónos közössége</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light leading-tight">
                Drónszolgáltatások
                <span className="block font-bold text-indigo-600 mt-2">professzionális szinten</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Több mint 10 éve segítjük a drónok iránt érdeklődőket. 
                Találd meg a projektedhez legmegfelelőbb pilótát percek alatt.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/register" 
                  className="group bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl flex items-center gap-2 text-lg"
                >
                  Projektet hirdetek 
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
                <button 
                  onClick={() => setShowVideo(true)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition flex items-center gap-2 text-lg"
                >
                  <FaPlay className="text-sm" /> Bemutató videó
                </button>
              </div>

              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <img 
                      key={i}
                      src={`https://randomuser.me/api/portraits/men/${30+i}.jpg`}
                      alt="Pilóta"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">500+</span> aktív pilóta
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Drone"
                className="rounded-3xl shadow-2xl"
              />
              
              {/* Floating statisztika */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">100% biztonságos</div>
                    <div className="text-sm text-gray-500">Letéti számla védelem</div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-bold">4.9</span>
                  <span className="text-gray-500">(128 értékelés)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SZOLGÁLTATÁSOK */}
      <section id="services" ref={sectionRefs.services} className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">Szolgáltatások</span>
            <h2 className="text-4xl font-light mt-4 mb-6">Minden, amire szükséged lehet</h2>
            <p className="text-xl text-gray-600">
              Legyen szó ipari alkalmazásról vagy kreatív projektről, nálunk megtalálod a megfelelő szakembert.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {szolgaltatasok.map((item, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-6 transform group-hover:scale-110 transition duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                      <FaCheckCircle className="text-indigo-400 text-xs" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISZTIKÁK */}
      <section id="stats" ref={sectionRefs.stats} className="py-24 bg-indigo-600">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">{counts.pilots}+</div>
              <div className="text-indigo-200 text-lg">Igazolt pilóta</div>
              <p className="text-indigo-300 text-sm mt-2">Szigorúan ellenőrzött szakemberek</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">{counts.projects}+</div>
              <div className="text-indigo-200 text-lg">Elvégzett projekt</div>
              <p className="text-indigo-300 text-sm mt-2">Elégedett ügyfelek országszerte</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">{counts.years}+</div>
              <div className="text-indigo-200 text-lg">Év tapasztalat</div>
              <p className="text-indigo-300 text-sm mt-2">2016 óta folyamatosan fejlődünk</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOGYAN MŰKÖDIK */}
      <section id="howItWorks" ref={sectionRefs.howItWorks} className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">Hogyan működik</span>
            <h2 className="text-4xl font-light mt-4 mb-6">Négy egyszerű lépésben</h2>
            <p className="text-xl text-gray-600">
              Percek alatt megtalálhatod a projektedhez legmegfelelőbb drónpilótát.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 relative">
            {folyamat.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative z-10">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0">
                    <FaArrowRight className="text-gray-300 text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HÍREK */}
      <section id="news" ref={sectionRefs.news} className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between mb-12">
            <div>
              <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">Legfrissebb hírek</span>
              <h2 className="text-4xl font-light mt-2">Drónos világ hírei</h2>
            </div>
            <Link to="/hirek" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
              Összes hír megtekintése <FaArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hirek.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <FaRegCalendarAlt className="text-indigo-400" />
                    <span>{item.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-indigo-600 font-medium">{item.category}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{item.excerpt}</p>
                  <Link to={`/hirek/${index}`} className="text-indigo-600 font-medium hover:gap-2 flex items-center gap-1">
                    Bővebben <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSAPAT */}
      <section id="team" ref={sectionRefs.team} className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">A csapat</span>
            <h2 className="text-4xl font-light mt-4 mb-6">Akikre a projektet bízhatod</h2>
            <p className="text-xl text-gray-600">
              Tapasztalt szakemberek, akik szenvedéllyel végzik munkájukat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {csapat.map((person, index) => (
              <div key={index} className="group">
                <div className="relative mb-6">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition">
                    <p className="text-sm">"{person.quote}"</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold">{person.name}</h3>
                <p className="text-indigo-600 font-medium mb-2">"{person.nickname}"</p>
                <p className="text-gray-500 text-sm mb-3">{person.role}</p>
                <div className="flex gap-2">
                  {person.expertise.map((exp, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-3xl mx-auto text-center bg-indigo-50 p-12 rounded-3xl">
            <FaUsers className="text-5xl text-indigo-600 mx-auto mb-6" />
            <p className="text-xl text-gray-700 leading-relaxed">
              "Célunk egy aktív, hiteles közösség építése, ahol márkafüggetlenül születnek 
              vélemények a drónokról és szolgáltatásokról."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" ref={sectionRefs.cta} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Drone"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 to-purple-900/95"></div>
        </div>

        <div className="relative container mx-auto px-6 text-center text-white max-w-4xl">
          <h2 className="text-5xl font-bold mb-6">Készen állsz a felszállásra?</h2>
          <p className="text-2xl mb-12 opacity-90">
            Csatlakozz Magyarország legnagyobb drónos közösségéhez!
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-indigo-600 px-10 py-5 rounded-xl hover:bg-gray-100 transition shadow-2xl text-lg font-semibold"
            >
              Projektet hirdetek
            </Link>
            <Link 
              to="/register?type=driver" 
              className="border-2 border-white text-white px-10 py-5 rounded-xl hover:bg-white/10 transition text-lg font-semibold"
            >
              Pilóta leszek
            </Link>
          </div>
          <div className="flex justify-center gap-8 mt-12 text-white/80">
            <span>✓ Ingyenes regisztráció</span>
            <span>✓ Ellenőrzött pilóták</span>
            <span>✓ Biztonságos fizetés</span>
          </div>
        </div>
      </section>

      {/* Videó modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
            >
              Bezárás
            </button>
            <div className="relative pt-[56.25%]">
              <iframe 
                className="absolute inset-0 w-full h-full rounded-xl"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="HoverHire bemutató"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;