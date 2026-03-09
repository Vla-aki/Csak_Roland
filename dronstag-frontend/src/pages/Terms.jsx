// src/pages/Terms.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaUserTie, FaRocket } from 'react-icons/fa'; // FaDrone helyett FaRocket
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Terms = () => {
  const sections = [
    {
      id: 'general',
      title: '1. Általános rendelkezések',
      content: [
        'A jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) a HoverHire Kft. (székhely: 1137 Budapest, Drón utca 12., adószám: 12345678-1-42, cégjegyzékszám: 01-09-123456, továbbiakban: Szolgáltató) által üzemeltetett hoverhire.hu weboldal (továbbiakban: Weboldal) használatának feltételeit tartalmazza.',
        'A Weboldal használatával a Felhasználó elfogadja a jelen ÁSZF-ben foglaltakat, és tudomásul veszi, hogy azok kötelező érvényűek rá nézve.',
        'A Szolgáltató fenntartja a jogot, hogy az ÁSZF-et egyoldalúan módosítsa. A módosítások a Weboldalon történő közzététellel lépnek hatályba.'
      ]
    },
    {
      id: 'definitions',
      title: '2. Fogalommeghatározások',
      content: [
        'Felhasználó: A Weboldalt bármilyen formában használó természetes vagy jogi személy.',
        'Megbízó: Az a Felhasználó, aki projektet hirdet meg a Weboldalon.',
        'Pilóta: Az a Felhasználó, aki drónos szolgáltatásokat kínál és projektekre jelentkezik.',
        'Projekt: A Megbízó által meghirdetett, drónos szolgáltatást igénylő feladat.',
        'Ajánlat: A Pilóta által egy projektre tett árajánlat.',
        'Szerződés: A Megbízó és a Pilóta között a projektre vonatkozóan létrejött megállapodás.'
      ]
    },
    {
      id: 'registration',
      title: '3. Regisztráció és felhasználói fiók',
      content: [
        'A Weboldal használatához regisztráció szükséges. A regisztráció során megadott adatok valódiságáért a Felhasználó felel.',
        'A Felhasználó köteles a bejelentkezési adatait bizalmasan kezelni. Azok illetéktelenek általi használatából eredő károkért a Szolgáltató nem felel.',
        'A Szolgáltató fenntartja a jogot, hogy a regisztrációt indokolás nélkül visszautasítsa, illetve a felhasználói fiókot felfüggessze vagy törölje, ha a Felhasználó megsérti a jelen ÁSZF-et.'
      ]
    },
    {
      id: 'projects',
      title: '4. Projektek meghirdetése',
      content: [
        'A Megbízó a regisztrációt követően jogosult projekteket meghirdetni a Weboldalon.',
        'A projektek meghirdetése ingyenes. A Megbízó köteles a projekt részletes leírását, a pontos helyszínt, a tervezett időpontot és a költségkeretet megadni.',
        'A Szolgáltató fenntartja a jogot, hogy a nem megfelelő tartalmú projekteket indokolás nélkül eltávolítsa.',
        'A Megbízó vállalja, hogy a projekttel kapcsolatban megadott információk a valóságnak megfelelnek.'
      ]
    },
    {
      id: 'bids',
      title: '5. Ajánlattétel és szerződéskötés',
      content: [
        'A Pilóta a regisztrációt követően jogosult ajánlatot tenni a meghirdetett projektekre.',
        'Az ajánlatnak tartalmaznia kell a vállalási árat és a munka elvégzésének tervezett időtartamát.',
        'A Megbízó jogosult az ajánlatok közül szabadon választani. Az ajánlat elfogadásával jön létre a szerződés a Megbízó és a Pilóta között.',
        'A szerződés létrejöttét követően a Megbízó köteles a projekt összegét letétbe helyezni a platformon.'
      ]
    },
    {
      id: 'payment',
      title: '6. Fizetési feltételek',
      content: [
        'A Szolgáltató biztonságos letéti rendszert működtet. A Megbízó által letétbe helyezett összeg a projekt sikeres teljesítéséig zárolásra kerül.',
        'A Pilóta a projekt befejezését követően jelzi a Megbízónak, hogy a munka készen áll az átadásra.',
        'A Megbízó köteles a munka átvételét követő 3 munkanapon belül azt elfogadni vagy kifogásolni. Ha a Megbízó nem nyilatkozik, a projekt automatikusan elfogadottnak minősül.',
        'Az elfogadást követően a letétben lévő összeg, a Szolgáltató jutalékának levonása után, átutalásra kerül a Pilóta bankszámlájára.'
      ]
    },
    {
      id: 'fees',
      title: '7. Jutalékok és díjak',
      content: [
        'A regisztráció és a Weboldal használata alapvetően ingyenes.',
        'A Pilóta által a sikeres projektek után fizetendő jutalék mértéke 10% (azaz tíz százalék).',
        'A Megbízó által a sikeres projektek után fizetendő jutalék mértéke 5% (azaz öt százalék).',
        'A Szolgáltató fenntartja a jogot a jutalékok mértékének módosítására, amelyről a Felhasználókat előzetesen értesíti.'
      ]
    },
    {
      id: 'rights',
      title: '8. A felek jogai és kötelezettségei',
      content: [
        'A Pilóta köteles a vállalt munkát a szerződésben foglaltaknak megfelelően, szakszerűen és határidőre elvégezni.',
        'A Megbízó köteles a Pilótának a munka elvégzéséhez szükséges információkat és hozzáférést biztosítani.',
        'A Pilóta felel a munkája során okozott károkért. Javasolt felelősségbiztosítás kötése.',
        'A Megbízó felel a projekt meghirdetése során megadott információk valódiságáért.'
      ]
    },
    {
      id: 'disputes',
      title: '9. Vitarendezés',
      content: [
        'Ha a Megbízó és a Pilóta között vita merül fel, először meg kell kísérelniük a békés egyeztetést.',
        'Ha ez nem vezet eredményre, bármelyik fél kérheti a Szolgáltató közreműködését a vitarendezésben.',
        'A Szolgáltató meghallgatja mindkét felet, és állást foglal a vitás kérdésben. A Szolgáltató döntése nem kötelező érvényű, de iránymutatásul szolgál.',
        'Amennyiben a vita nem rendezhető, a felek a hatáskörrel és illetékességgel rendelkező bírósághoz fordulhatnak.'
      ]
    },
    {
      id: 'liability',
      title: '10. A Szolgáltató felelőssége',
      content: [
        'A Szolgáltató kizárólag a platform biztosításáért felel, nem tartozik felelősséggel a Megbízó és a Pilóta közötti szerződés teljesítéséért.',
        'A Szolgáltató nem vállal felelősséget a Pilóták által nyújtott szolgáltatások minőségéért.',
        'A Szolgáltató nem felel a Weboldal esetleges átmeneti üzemszünetéért, karbantartás miatti leállásáért.',
        'A Szolgáltató nem felel a Felhasználók által megadott adatok helyességéért és azok felhasználásából eredő károkért.'
      ]
    },
    {
      id: 'privacy',
      title: '11. Adatvédelem',
      content: [
        'A Szolgáltató elkötelezett a Felhasználók személyes adatainak védelme iránt.',
        'Az adatkezelés részletes szabályait a Weboldalon elérhető Adatvédelmi Tájékoztató tartalmazza.',
        'A Felhasználók hozzájárulnak ahhoz, hogy a Szolgáltató a regisztráció során megadott adatokat a szolgáltatás nyújtása céljából kezelje.',
        'A Felhasználók bármikor kérhetik adataik helyesbítését, törlését.'
      ]
    },
    {
      id: 'misc',
      title: '12. Vegyes rendelkezések',
      content: [
        'A jelen ÁSZF-re a magyar jog az irányadó.',
        'A Szolgáltató és a Felhasználó között esetlegesen felmerülő jogvitákra a magyar bíróságok rendelkeznek hatáskörrel és illetékességgel.',
        'A jelen ÁSZF egyes pontjainak esetleges érvénytelensége nem érinti a többi pont érvényességét.',
        'A Szolgáltató fenntartja a jogot, hogy a Weboldal szolgáltatásait módosítsa, bővítse vagy korlátozza.'
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
              <FaFileContract className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Általános Szerződési Feltételek
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              Hatályos: 2024. január 1-től
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Adatvédelmi tájékoztató
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
                to="/impressum"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Impresszum
              </Link>
            </div>
          </div>

          {/* Gyors navigáció */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ugrás a fejezetekhez:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* Tartalom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Elfogadás */}
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-2xl text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    A HoverHire szolgáltatásainak használatával elfogadja az ÁSZF-ben foglaltakat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ha bármilyen kérdése van a feltételekkel kapcsolatban, kérjük, lépjen kapcsolatba ügyfélszolgálatunkkal a <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">kapcsolatfelvételi űrlapon</Link> keresztül.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verzió információk */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Utolsó frissítés: 2024. január 1.</p>
            <p>Verziószám: 2.1.0</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;