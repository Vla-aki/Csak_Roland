// src/pages/Privacy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          
          {/* Fejléc */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Adatvédelmi tájékoztató
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 transition-all duration-700">
              Hatályos: 2026. január 1-től
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">ÁSZF</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/cookie" className="text-blue-600 dark:text-blue-400 hover:underline">Cookie</Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link to="/impressum" className="text-blue-600 dark:text-blue-400 hover:underline">Impresszum</Link>
            </div>
          </div>

          {/* Tartalom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-700">
            <div className="space-y-8">
              
              {/* Adatkezelő */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Adatkezelő adatai</h2>
                <div className="space-y-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p><strong>Cégnév:</strong> HoverHire Kft.</p>
                  <p><strong>Székhely:</strong> 1137 Budapest, Drón utca 12.</p>
                  <p><strong>Adószám:</strong> 12345678-1-42</p>
                  <p><strong>Email:</strong> info@hoverhire.hu</p>
                  <p><strong>Telefon:</strong> +36 30 123 4567</p>
                  <p><strong>Adatvédelmi tisztviselő:</strong> Dr. Jogász Elek, jogasz@hoverhire.hu</p>
                </div>
              </section>

              {/* Fogalmak */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Fogalommeghatározások</h2>
                <div className="space-y-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p><strong>Személyes adat:</strong> Azonosított vagy azonosítható természetes személyre vonatkozó bármely információ.</p>
                  <p><strong>Adatkezelés:</strong> A személyes adatokon végzett bármely művelet, beleértve a gyűjtést, rögzítést, tárolást, felhasználást, továbbítást és törlést.</p>
                  <p><strong>Adatkezelő:</strong> Az a természetes vagy jogi személy, aki az adatkezelés célját és eszközeit meghatározza.</p>
                  <p><strong>Érintett:</strong> Bármely azonosított vagy azonosítható természetes személy, akinek személyes adatait kezeljük.</p>
                </div>
              </section>

              {/* Kezelt adatok */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Kezelt adatok köre</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Regisztráció során kezelt adatok:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>Név (kötelező)</li>
                      <li>Email cím (kötelező)</li>
                      <li>Telefonszám (opcionális)</li>
                      <li>Profilkép (opcionális)</li>
                      <li>Jelszó (hashelt formában tárolva)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Projektek során kezelt adatok:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>Projekt adatok (cím, leírás, helyszín)</li>
                      <li>Költségkeret és határidő</li>
                      <li>Ajánlatok és üzenetek</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Technikai adatok:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>IP cím</li>
                      <li>Böngésző típusa és verziója</li>
                      <li>Látogatott oldalak</li>
                      <li>Cookie-k</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Célok */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Adatkezelés célja</h2>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>A regisztráció és a felhasználói fiók kezelése</li>
                  <li>A szolgáltatások nyújtása (projektek meghirdetése, ajánlattétel, szerződéskötés)</li>
                  <li>Kapcsolattartás, ügyfélszolgálati tevékenység</li>
                  <li>A fizetési rendszer működtetése</li>
                  <li>Jogi kötelezettségek teljesítése (pl. számviteli előírások)</li>
                  <li>Visszaélések megelőzése, biztonsági intézkedések</li>
                  <li>Statisztikák készítése, a szolgáltatások fejlesztése</li>
                </ul>
              </section>

              {/* Jogalap */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Az adatkezelés jogalapja</h2>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><strong>Szerződés teljesítése:</strong> regisztráció, projektek kezelése</li>
                  <li><strong>Jogos érdek:</strong> biztonsági intézkedések, visszaélések megelőzése</li>
                  <li><strong>Jogi kötelezettség:</strong> számviteli bizonylatok megőrzése</li>
                  <li><strong>Hozzájárulás:</strong> hírlevél küldése, cookie-k kezelése</li>
                </ul>
              </section>

              {/* Adattovábbítás */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Adattovábbítás</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                  Személyes adatait harmadik fél számára csak a következő esetekben továbbítjuk:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Tárhelyszolgáltató (DigitalOcean, LLC)</li>
                  <li>Fizetési szolgáltató (banki átutalások kezelése)</li>
                  <li>Hatósági megkeresés esetén</li>
                  <li>Az Ön előzetes hozzájárulásával</li>
                </ul>
              </section>

              {/* Adatmegőrzés */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Adatmegőrzési idő</h2>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><strong>Regisztrációs adatok:</strong> a felhasználói fiók törléséig</li>
                  <li><strong>Projekt adatok:</strong> a projekt lezárását követő 1 évig</li>
                  <li><strong>Számviteli bizonylatok:</strong> 8 évig</li>
                  <li><strong>IP cím, napló adatok:</strong> 30 napig</li>
                </ul>
              </section>

              {/* Jogok */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Az érintettek jogai</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                  Ön az alábbi jogokkal élhet adatkezeléssel kapcsolatban:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Tájékoztatás kérése a kezelt adatokról</li>
                  <li>Adatok helyesbítésének kérése</li>
                  <li>Adatok törlésének kérése</li>
                  <li>Adatkezelés korlátozásának kérése</li>
                  <li>Adathordozhatósághoz való jog</li>
                  <li>Hozzájárulás visszavonása</li>
                  <li>Panasz benyújtása a felügyeleti hatósághoz</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
                  Jogainak gyakorlásával kapcsolatban az info@hoverhire.hu email címen kereshet meg minket.
                </p>
              </section>

              {/* Adatbiztonság */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Adatbiztonság</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Személyes adatait megfelelő technikai és szervezési intézkedésekkel védjük a jogosulatlan hozzáférés, 
                  megváltoztatás, továbbítás vagy megsemmisítés ellen. Adatai védelme érdekében SSL titkosítást, 
                  tűzfalakat és biztonságos szervereket alkalmazunk.
                </p>
              </section>

              {/* Kapcsolat */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Kapcsolat</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Adatkezeléssel kapcsolatos kérdéseit, észrevételeit az alábbi elérhetőségeken jelezheti:
                </p>
                <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                  <p><strong>Email:</strong> info@hoverhire.hu</p>
                  <p><strong>Postacím:</strong> 1137 Budapest, Drón utca 12.</p>
                  <p><strong>Telefon:</strong> +36 30 123 4567</p>
                </div>
              </section>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jelen adatvédelmi tájékoztató 2026. január 1-jén lép hatályba. Fenntartjuk a jogot a tájékoztató módosítására, 
                  amelyről a Felhasználókat előzetesen értesítjük.
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

export default Privacy;