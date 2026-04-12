// src/pages/Terms.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          
          {/* Fejléc */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Általános Szerződési Feltételek
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              Hatályos: 2026. január 1-től
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Adatvédelem</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/cookie" className="text-blue-600 dark:text-blue-400 hover:underline">Cookie</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/impressum" className="text-blue-600 dark:text-blue-400 hover:underline">Impresszum</Link>
            </div>
          </div>

          {/* Tartalom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            <div className="space-y-8">
              
              {/* Általános */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Általános rendelkezések</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>1.1. Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) a HoverHire Kft. (székhely: 1137 Budapest, Drón utca 12., adószám: 12345678-1-42, cégjegyzékszám: 01-09-123456, továbbiakban: Szolgáltató) által üzemeltetett hoverhire.hu weboldal (továbbiakban: Weboldal) használatának feltételeit tartalmazza.</p>
                  <p>1.2. A Weboldal használatával a Felhasználó elfogadja a jelen ÁSZF-ben foglaltakat, és tudomásul veszi, hogy azok kötelező érvényűek rá nézve.</p>
                  <p>1.3. A Szolgáltató fenntartja a jogot, hogy az ÁSZF-et egyoldalúan módosítsa. A módosítások a Weboldalon történő közzététellel lépnek hatályba.</p>
                  <p>1.4. A Felhasználó köteles az ÁSZF módosításait figyelemmel kísérni. A módosítások hatályba lépését követő használat a módosítások elfogadását jelenti.</p>
                </div>
              </section>

              {/* Fogalmak */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Fogalommeghatározások</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p><strong>Felhasználó:</strong> A Weboldalt bármilyen formában használó természetes vagy jogi személy.</p>
                  <p><strong>Megbízó:</strong> Az a Felhasználó, aki projektet hirdet meg a Weboldalon.</p>
                  <p><strong>Pilóta:</strong> Az a Felhasználó, aki drónos szolgáltatásokat kínál és projektekre jelentkezik.</p>
                  <p><strong>Projekt:</strong> A Megbízó által meghirdetett, drónos szolgáltatást igénylő feladat.</p>
                  <p><strong>Ajánlat:</strong> A Pilóta által egy projektre tett árajánlat.</p>
                  <p><strong>Szerződés:</strong> A Megbízó és a Pilóta között a projektre vonatkozóan létrejött megállapodás.</p>
                </div>
              </section>

              {/* Regisztráció */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Regisztráció</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>3.1. A Weboldal használatához regisztráció szükséges. A regisztráció során megadott adatok valódiságáért a Felhasználó felel.</p>
                  <p>3.2. A Felhasználó köteles a bejelentkezési adatait bizalmasan kezelni. Azok illetéktelenek általi használatából eredő károkért a Szolgáltató nem felel.</p>
                  <p>3.3. A Szolgáltató fenntartja a jogot, hogy a regisztrációt indokolás nélkül visszautasítsa, illetve a felhasználói fiókot felfüggessze vagy törölje, ha a Felhasználó megsérti a jelen ÁSZF-et.</p>
                  <p>3.4. A Felhasználó jogosult a regisztrációját bármikor törölni az ügyfélszolgálaton keresztül.</p>
                </div>
              </section>

              {/* Projektek */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Projektek meghirdetése</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>4.1. A Megbízó a regisztrációt követően jogosult projekteket meghirdetni a Weboldalon.</p>
                  <p>4.2. A projektek meghirdetése ingyenes. A Megbízó köteles a projekt részletes leírását, a pontos helyszínt, a tervezett időpontot és a költségkeretet megadni.</p>
                  <p>4.3. A Szolgáltató fenntartja a jogot, hogy a nem megfelelő tartalmú projekteket indokolás nélkül eltávolítsa.</p>
                  <p>4.4. A Megbízó vállalja, hogy a projekttel kapcsolatban megadott információk a valóságnak megfelelnek.</p>
                </div>
              </section>

              {/* Ajánlatok */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Ajánlattétel</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>5.1. A Pilóta a regisztrációt követően jogosult ajánlatot tenni a meghirdetett projektekre.</p>
                  <p>5.2. Az ajánlatnak tartalmaznia kell a vállalási árat és a munka elvégzésének tervezett időtartamát.</p>
                  <p>5.3. A Megbízó jogosult az ajánlatok közül szabadon választani. Az ajánlat elfogadásával jön létre a szerződés a Megbízó és a Pilóta között.</p>
                  <p>5.4. A szerződés létrejöttét követően a Megbízó köteles a projekt összegét letétbe helyezni a platformon.</p>
                </div>
              </section>

              {/* Fizetés */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Fizetés</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>6.1. A Szolgáltató biztonságos letéti rendszert működtet. A Megbízó által letétbe helyezett összeg a projekt sikeres teljesítéséig zárolásra kerül.</p>
                  <p>6.2. A Pilóta a projekt befejezését követően jelzi a Megbízónak, hogy a munka készen áll az átadásra.</p>
                  <p>6.3. A Megbízó köteles a munka átvételét követő 3 munkanapon belül azt elfogadni vagy kifogásolni. Ha a Megbízó nem nyilatkozik, a projekt automatikusan elfogadottnak minősül.</p>
                  <p>6.4. Az elfogadást követően a letétben lévő összeg, a Szolgáltató jutalékának levonása után, átutalásra kerül a Pilóta bankszámlájára.</p>
                </div>
              </section>

              {/* Jutalékok */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Jutalékok</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>7.1. A regisztráció és a Weboldal használata alapvetően ingyenes.</p>
                  <p>7.2. A Pilóta által a sikeres projektek után fizetendő jutalék mértéke 10% (azaz tíz százalék).</p>
                  <p>7.3. A Megbízó által a sikeres projektek után fizetendő jutalék mértéke 5% (azaz öt százalék).</p>
                  <p>7.4. A Szolgáltató fenntartja a jogot a jutalékok mértékének módosítására, amelyről a Felhasználókat előzetesen értesíti.</p>
                </div>
              </section>

              {/* Felelősség */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Felelősség</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>8.1. A Pilóta köteles a vállalt munkát a szerződésben foglaltaknak megfelelően, szakszerűen és határidőre elvégezni.</p>
                  <p>8.2. A Megbízó köteles a Pilótának a munka elvégzéséhez szükséges információkat és hozzáférést biztosítani.</p>
                  <p>8.3. A Pilóta felel a munkája során okozott károkért. Javasolt felelősségbiztosítás kötése.</p>
                  <p>8.4. A Megbízó felel a projekt meghirdetése során megadott információk valódiságáért.</p>
                </div>
              </section>

              {/* Vitarendezés */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Vitarendezés</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>9.1. Ha a Megbízó és a Pilóta között vita merül fel, először meg kell kísérelniük a békés egyeztetést.</p>
                  <p>9.2. Ha ez nem vezet eredményre, bármelyik fél kérheti a Szolgáltató közreműködését a vitarendezésben.</p>
                  <p>9.3. A Szolgáltató meghallgatja mindkét felet, és állást foglal a vitás kérdésben. A Szolgáltató döntése nem kötelező érvényű, de iránymutatásul szolgál.</p>
                  <p>9.4. Amennyiben a vita nem rendezhető, a felek a hatáskörrel és illetékességgel rendelkező bírósághoz fordulhatnak.</p>
                </div>
              </section>

              {/* Záró rendelkezések */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Záró rendelkezések</h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>10.1. A jelen ÁSZF-re a magyar jog az irányadó.</p>
                  <p>10.2. A Szolgáltató és a Felhasználó között esetlegesen felmerülő jogvitákra a magyar bíróságok rendelkeznek hatáskörrel és illetékességgel.</p>
                  <p>10.3. A jelen ÁSZF egyes pontjainak esetleges érvénytelensége nem érinti a többi pont érvényességét.</p>
                  <p>10.4. A Szolgáltató fenntartja a jogot, hogy a Weboldal szolgáltatásait módosítsa, bővítse vagy korlátozza.</p>
                </div>
              </section>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A jelen dokumentum 2026. január 1-jén lép hatályba és visszavonásig érvényes. 
                  Kérdés esetén forduljon ügyfélszolgálatunkhoz a <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">kapcsolatfelvételi űrlapon</Link> keresztül.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;