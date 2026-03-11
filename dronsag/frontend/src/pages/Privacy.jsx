// src/pages/Privacy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCookie, FaLock, FaUserSecret, FaDatabase, FaEnvelope } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Privacy = () => {
  const sections = [
    {
      id: 'intro',
      title: '1. Bevezetés',
      icon: <FaShieldAlt />,
      content: [
        'A HoverHire Kft. (székhely: 1137 Budapest, Drón utca 12., adószám: 12345678-1-42, cégjegyzékszám: 01-09-123456, továbbiakban: Adatkezelő vagy HoverHire) elkötelezett az ügyfelei és a weboldal látogatói személyes adatainak védelme iránt.',
        'Jelen Adatvédelmi Tájékoztató célja, hogy átfogó képet adjon arról, hogyan kezeljük az Ön személyes adatait a hoverhire.hu weboldalon és a kapcsolódó szolgáltatások igénybevétele során.',
        'Kérjük, figyelmesen olvassa el a tájékoztatót, és amennyiben kérdése merülne fel, forduljon hozzánk bizalommal.'
      ]
    },
    {
      id: 'definitions',
      title: '2. Fogalommeghatározások',
      icon: <FaUserSecret />,
      content: [
        'Személyes adat: Azonosított vagy azonosítható természetes személyre vonatkozó bármely információ.',
        'Adatkezelés: A személyes adatokon végzett bármely művelet, beleértve a gyűjtést, rögzítést, tárolást, felhasználást, továbbítást és törlést.',
        'Adatkezelő: Az a természetes vagy jogi személy, aki az adatkezelés célját és eszközeit meghatározza.',
        'Adatfeldolgozó: Az a természetes vagy jogi személy, aki az Adatkezelő megbízásából adatokat kezel.',
        'Érintett: Bármely azonosított vagy azonosítható természetes személy, akinek személyes adatait kezeljük.'
      ]
    },
    {
      id: 'data',
      title: '3. Az általunk kezelt adatok köre',
      icon: <FaDatabase />,
      tables: [
        {
          title: 'Regisztráció során kezelt adatok:',
          headers: ['Adat típusa', 'Cél', 'Jogalap', 'Megőrzési idő'],
          rows: [
            ['Név', 'Azonosítás, kapcsolattartás', 'Szerződés teljesítése', 'A regisztráció törléséig'],
            ['Email cím', 'Kapcsolattartás, értesítések', 'Szerződés teljesítése', 'A regisztráció törléséig'],
            ['Telefonszám (opcionális)', 'Kapcsolattartás', 'Hozzájárulás', 'A regisztráció törléséig'],
            ['Profilkép (opcionális)', 'Bemutatkozás', 'Hozzájárulás', 'A regisztráció törléséig']
          ]
        },
        {
          title: 'Projekt meghirdetése során kezelt adatok:',
          headers: ['Adat típusa', 'Cél', 'Jogalap', 'Megőrzési idő'],
          rows: [
            ['Projekt adatok', 'Szolgáltatás nyújtása', 'Szerződés teljesítése', 'A projekt lezárását követő 1 év'],
            ['Helyszín adatok', 'Pontos helymeghatározás', 'Szerződés teljesítése', 'A projekt lezárását követő 1 év']
          ]
        },
        {
          title: 'Technikai adatok:',
          headers: ['Adat típusa', 'Cél', 'Jogalap', 'Megőrzési idő'],
          rows: [
            ['IP cím', 'Biztonság, statisztika', 'Jogos érdek', '30 nap'],
            ['Cookie-k', 'Felhasználói élmény javítása', 'Hozzájárulás', 'A cookie típusától függően'],
            ['Böngésző adatok', 'Kompatibilitás biztosítása', 'Jogos érdek', '30 nap']
          ]
        }
      ]
    },
    {
      id: 'purpose',
      title: '4. Az adatkezelés céljai',
      icon: <FaShieldAlt />,
      content: [
        'Személyes adatait az alábbi célokból kezeljük:',
        '• A regisztráció és a felhasználói fiók kezelése',
        '• A szolgáltatások nyújtása (projektek meghirdetése, ajánlattétel, szerződéskötés)',
        '• Kapcsolattartás, ügyfélszolgálati tevékenység',
        '• A fizetési rendszer működtetése',
        '• Jogi kötelezettségek teljesítése (pl. számviteli előírások)',
        '• Visszaélések megelőzése, biztonsági intézkedések',
        '• Statisztikák készítése, a szolgáltatások fejlesztése'
      ]
    },
    {
      id: 'legal',
      title: '5. Az adatkezelés jogalapja',
      icon: <FaLock />,
      content: [
        'Személyes adatait az alábbi jogalapokon kezeljük:',
        '• Szerződés teljesítése (pl. regisztráció, projektek kezelése)',
        '• Jogos érdek (pl. biztonsági intézkedések, visszaélések megelőzése)',
        '• Jogi kötelezettség teljesítése (pl. számviteli bizonylatok megőrzése)',
        '• Az érintett hozzájárulása (pl. hírlevél küldése, cookie-k kezelése)'
      ]
    },
    {
      id: 'duration',
      title: '6. Adatmegőrzési idő',
      icon: <FaDatabase />,
      content: [
        'A személyes adatokat csak a cél megvalósulásához szükséges ideig tároljuk.',
        'A regisztrációs adatokat a felhasználói fiók törléséig kezeljük.',
        'A projektekhez kapcsolódó adatokat a projekt lezárását követő 1 évig tároljuk jogi igények érvényesítése céljából.',
        'A számviteli bizonylatokat a számviteli törvény előírásai szerint 8 évig megőrizzük.',
        'A hozzájáruláson alapuló adatkezelések esetén a hozzájárulás visszavonásáig kezeljük az adatokat.'
      ]
    },
    {
      id: 'rights',
      title: '7. Az érintettek jogai',
      icon: <FaUserSecret />,
      content: [
        'Ön az adatkezeléssel kapcsolatban az alábbi jogokkal élhet:',
        '• Tájékoztatás kérése a kezelt adatokról',
        '• Adatok helyesbítésének kérése',
        '• Adatok törlésének kérése',
        '• Adatkezelés korlátozásának kérése',
        '• Adathordozhatósághoz való jog',
        '• Hozzájárulás visszavonása',
        '• Panasz benyújtása a felügyeleti hatósághoz',
        'Jogainak gyakorlásával kapcsolatban az info@hoverhire.hu email címen kereshet meg minket.'
      ]
    },
    {
      id: 'cookies',
      title: '8. Cookie-k (sütik)',
      icon: <FaCookie />,
      content: [
        'Weboldalunk cookie-kat (sütiket) használ a felhasználói élmény javítása, statisztikák készítése és a weboldal működésének biztosítása érdekében.',
        'A cookie-k kis szöveges fájlok, amelyeket a böngésző tárol el a számítógépén vagy mobil eszközén.',
        'Az alábbi típusú cookie-kat használjuk:',
        '• Alapvető működést biztosító cookie-k (pl. bejelentkezés, biztonság)',
        '• Analitikai cookie-k (pl. Google Analytics)',
        '• Funkcionális cookie-k (pl. nyelvi beállítások)',
        'A cookie-k használatához hozzájárulását kérjük. A hozzájárulást bármikor visszavonhatja böngészője beállításaiban.'
      ]
    },
    {
      id: 'data-security',
      title: '9. Adatbiztonság',
      icon: <FaLock />,
      content: [
        'Személyes adatait megfelelő technikai és szervezési intézkedésekkel védjük a jogosulatlan hozzáférés, megváltoztatás, továbbítás vagy megsemmisítés ellen.',
        'Adatai védelme érdekében SSL titkosítást, tűzfalakat és biztonságos szervereket alkalmazunk.',
        'Munkatársaink titoktartási kötelezettséggel tartoznak, és csak a feladatuk ellátásához szükséges mértékben férhetnek hozzá az adatokhoz.'
      ]
    },
    {
      id: 'contact',
      title: '10. Kapcsolat',
      icon: <FaEnvelope />,
      content: [
        'Adatkezeléssel kapcsolatos kérdéseit, észrevételeit az alábbi elérhetőségeken jelezheti:',
        'Email: info@hoverhire.hu',
        'Postacím: 1137 Budapest, Drón utca 12.',
        'Telefon: +36 30 123 4567',
        'Adatvédelmi tisztviselő: Dr. Jogász Elek, jogasz@hoverhire.hu'
      ]
    },
    {
      id: 'authority',
      title: '11. Felügyeleti hatóság',
      icon: <FaShieldAlt />,
      content: [
        'Amennyiben úgy érzi, hogy adatkezelésünk során megsértettük a hatályos adatvédelmi előírásokat, panasszal élhet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH):',
        'Cím: 1055 Budapest, Falk Miksa utca 9-11.',
        'Postacím: 1363 Budapest, Pf.: 9.',
        'Email: ugyfelszolgalat@naih.hu',
        'Web: www.naih.hu'
      ]
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
              <FaShieldAlt className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Adatvédelmi tájékoztató
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              Hatályos: 2024. január 1-től
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Általános Szerződési Feltételek
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                to="/cookie"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Cookie szabályzat
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                to="/impresszum"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Impresszum
              </Link>
            </div>
          </div>

          {/* Tartalom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  
                  {section.content && (
                    <div className="space-y-3 ml-14">
                      {section.content.map((item, index) => (
                        <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item}
                        </p>
                      ))}
                    </div>
                  )}

                  {section.tables && section.tables.map((table, tableIndex) => (
                    <div key={tableIndex} className="mt-4 ml-14">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {table.title}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                              {table.headers.map((header, i) => (
                                <th key={i} className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                                {row.map((cell, j) => (
                                  <td key={j} className="p-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </section>
              ))}
            </div>

            {/* Elfogadás */}
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <FaShieldAlt className="text-2xl text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Adatai biztonságban vannak
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    A HoverHire-nél kiemelten fontosnak tartjuk adatai védelmét. Ha bármilyen kérdése van az adatkezeléssel kapcsolatban, kérjük, lépjen kapcsolatba <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">ügyfélszolgálatunkkal</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verzió információk */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Utolsó frissítés: 2024. január 1.</p>
            <p>Verziószám: 2.0.0</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;