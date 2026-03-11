// src/pages/FAQ.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaChevronUp, FaQuestionCircle, FaUserTie, FaRocket, FaMoneyBillWave, FaShieldAlt, FaClock } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState({
    general: true,
    customers: false,
    pilots: false,
    payment: false,
    technical: false
  });
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = [
    {
      category: 'general',
      icon: <FaQuestionCircle />,
      title: 'Általános kérdések',
      questions: [
        {
          id: 'g1',
          question: 'Mi az a HoverHire?',
          answer: 'A HoverHire Magyarország legnagyobb drónos piactere, ahol megbízók projektet hirdethetnek, drónpilóták pedig munkát vállalhatnak. Platformunk összeköti a megbízókat a profi drónpilótákkal, biztosítva a minőségi munkavégzést és a biztonságos fizetést.'
        },
        {
          id: 'g2',
          question: 'Mennyibe kerül a regisztráció?',
          answer: 'A regisztráció teljesen ingyenes mind a megbízók, mind a pilóták számára. Csak a sikeres projektek után számolunk fel jutalékot, amelynek mértéke 10% a pilóták és 5% a megbízók esetében.'
        },
        {
          id: 'g3',
          question: 'Hol működik a szolgáltatás?',
          answer: 'Jelenleg Magyarország egész területén elérhetőek vagyunk. A legtöbb projekt Budapesten és nagyobb városokban található, de vidéki helyszínekre is lehet jelentkezni.'
        },
        {
          id: 'g4',
          question: 'Milyen típusú munkák találhatóak a platformon?',
          answer: 'Számos kategóriában találsz projekteket: légifotózás, videózás, ipari ellenőrzés, hőkamerás vizsgálat, térképezés, 3D modellezés, mezőgazdasági monitorozás, rendezvényfotózás, szállítás és még sok más.'
        }
      ]
    },
    {
      category: 'customers',
      icon: <FaUserTie />,
      title: 'Megbízóknak',
      questions: [
        {
          id: 'c1',
          question: 'Hogyan hirdethetek meg egy projektet?',
          answer: 'Regisztráció és bejelentkezés után a dashboardon található "Új projekt létrehozása" gombra kattintva indíthatod el a folyamatot. Itt meg kell adnod a projekt címét, részletes leírását, helyszínét, költségkeretét és határidejét. Minél részletesebb a leírás, annál pontosabb ajánlatokat kapsz.'
        },
        {
          id: 'c2',
          question: 'Hogyan válasszak pilótát?',
          answer: 'Az ajánlatok beérkezése után összehasonlíthatod a jelentkezők tapasztalatát, értékeléseit, portfólióját és ajánlati árait. Érdemes megnézni a pilóták korábbi munkáit és az értékeléseket. A legjobb ajánlatot elfogadva szerződést köthetsz a pilótával.'
        },
        {
          id: 'c3',
          question: 'Mi történik, ha nem vagyok elégedett a munkával?',
          answer: 'A HoverHire biztonsági rendszerrel működik: a fizetés addig letétben marad, amíg mindkét fél elégedetten le nem zárja a projektet. Ha probléma merül fel, vitarendezési folyamatot indíthatsz, ahol munkatársaink segítenek a megoldásban.'
        },
        {
          id: 'c4',
          question: 'Kaphatok segítséget a projekt meghirdetéséhez?',
          answer: 'Igen, ügyfélszolgálatunk készséggel segít a projekt részleteinek megadásában, a pontos költségkeret meghatározásában és a megfelelő pilóta kiválasztásában. Keress minket a kapcsolatfelvételi űrlapon keresztül.'
        }
      ]
    },
    {
      category: 'pilots',
      icon: <FaRocket />,  // Változtatva: FaDrone helyett FaRocket
      title: 'Pilótáknak',
      questions: [
        {
          id: 'p1',
          question: 'Milyen feltételeknek kell megfelelnem, hogy pilóta lehessek?',
          answer: 'Rendelkezned kell érvényes drónpilóta engedéllyel, felelősségbiztosítással és saját felszereléssel. Emellett fontos a megbízhatóság, pontosság és a jó kommunikációs készség. Profilodban bemutathatod tapasztalataidat, képesítéseidet és portfóliódat.'
        },
        {
          id: 'p2',
          question: 'Hogyan kaphatok kiemelt ajánlatokat?',
          answer: 'A platform algoritmusa figyelembe veszi az értékeléseidet, a sikeres projektek számát, a gyors válaszadást és a profilteljességet. Minél aktívabb vagy és minél jobb értékeléseket kapsz, annál több releváns projektajánlatot kapsz.'
        },
        {
          id: 'p3',
          question: 'Mekkora jutalékot számoltok fel?',
          answer: 'A pilóták számára a sikeres projektek után 10% jutalékot számolunk fel. Ez magában foglalja a platform használatát, a biztonságos fizetési rendszert, az ügyfélszolgálatot és a marketinget.'
        },
        {
          id: 'p4',
          question: 'Hogyan kapom meg a fizetséget?',
          answer: 'A megbízó által letétbe helyezett összeg a projekt sikeres lezárása után kerül átutalásra a bankszámládra. A kifizetés banki átutalással történik, általában 1-3 munkanapon belül.'
        }
      ]
    },
    {
      category: 'payment',
      icon: <FaMoneyBillWave />,
      title: 'Fizetés és díjak',
      questions: [
        {
          id: 'pay1',
          question: 'Hogyan működik a biztonságos fizetés?',
          answer: 'A megbízó a projekt összegét letétbe helyezi a platformon. A pilóta elkezdi a munkát, majd annak befejezése után a megbízó ellenőrzi és jóváhagyja a munkát. Ekkor a letétben lévő összeg automatikusan átutalásra kerül a pilóta számlájára.'
        },
        {
          id: 'pay2',
          question: 'Mikor kell kifizetnem a projektet?',
          answer: 'A megbízóknak a projekt indításakor kell letétbe helyezniük a teljes összeget. Ez biztosítja a pilóta számára, hogy a munka elvégzése után biztosan megkapja a fizetséget.'
        },
        {
          id: 'pay3',
          question: 'Visszakaphatom a pénzt, ha mégsem valósul meg a projekt?',
          answer: 'Igen, ha a projekt bármilyen okból nem valósul meg, és még nem kezdődött el a munka, a letétbe helyezett összeg visszautalható a megbízó számára. Részleges munka esetén a pilótával egyeztetve arányos kifizetés lehetséges.'
        }
      ]
    },
    {
      category: 'technical',
      icon: <FaShieldAlt />,
      title: 'Technikai kérdések',
      questions: [
        {
          id: 't1',
          question: 'Milyen eszközökkel kell rendelkeznem?',
          answer: 'A pilótáknak rendelkezniük kell saját drónnal, amely alkalmas az adott típusú munkára. A pontos eszközlista a projekt típusától függ: légifotózáshoz jó minőségű kamera, ipari ellenőrzéshez hőkamera, stb. A megbízóknak csak internetkapcsolatra és egy számítógépre vagy okostelefonra van szükségük.'
        },
        {
          id: 't2',
          question: 'Milyen biztonsági intézkedések vannak?',
          answer: 'Minden pilóta ellenőrzésen esik át regisztrációkor. Profiljukban láthatók az engedélyeik és biztosításaik. A platform SSL titkosítással védi az adatokat, és biztonságos fizetési rendszert működtet.'
        },
        {
          id: 't3',
          question: 'Mi történik, ha technikai probléma merül fel?',
          answer: 'Technikai problémák esetén ügyfélszolgálatunk munkanapokon 9-18 óra között elérhető. Emellett részletes súgó oldalainkon is találsz válaszokat a gyakori kérdésekre.'
        }
      ]
    }
  ];

  const filteredFaqs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Hero szekció */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Gyakori kérdések
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 transition-all duration-700">
              Válaszok a leggyakoribb kérdésekre a HoverHire-rel kapcsolatban
            </p>
            
            {/* Kereső */}
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keresés a kérdések között..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700"
              />
            </div>
          </div>

          {/* Kategória gyorsugrók */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {faqData.map((category, index) => (
              <button
                key={index}
                onClick={() => {
                  const element = document.getElementById(category.category);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-blue-600 dark:text-blue-400">{category.icon}</span>
                {category.title}
              </button>
            ))}
          </div>

          {/* FAQ kategóriák */}
          <div className="space-y-6">
            {filteredFaqs.map((category, index) => (
              <div
                key={index}
                id={category.category}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-700"
              >
                {/* Kategória fejléc */}
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {category.title}
                    </h2>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                      {category.questions.length} kérdés
                    </span>
                  </div>
                  {openCategories[category.category] ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>

                {/* Kérdések */}
                {openCategories[category.category] && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {category.questions.map((q) => (
                      <div key={q.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <button
                          onClick={() => toggleQuestion(q.id)}
                          className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-start justify-between gap-4"
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {q.question}
                            </h3>
                            {openQuestions[q.id] && (
                              <p className="text-gray-600 dark:text-gray-400 mt-3 transition-all duration-700">
                                {q.answer}
                              </p>
                            )}
                          </div>
                          {openQuestions[q.id] ? (
                            <FaChevronUp className="text-gray-400 flex-shrink-0 mt-1" />
                          ) : (
                            <FaChevronDown className="text-gray-400 flex-shrink-0 mt-1" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ha nincs találat */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <FaQuestionCircle className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nincs találat
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sajnos nem találtunk kérdést a keresési feltételeknek megfelelően.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Keresés törlése
              </button>
            </div>
          )}

          {/* Még kérdés? */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Még mindig van kérdésed?</h3>
            <p className="text-lg mb-6 opacity-90">
              Keress minket bizalommal, ügyfélszolgálatunk készséggel segít!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium"
              >
                Kapcsolatfelvétel
              </Link>
              <Link
                to="/messages"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium"
              >
                Üzenet küldése
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;