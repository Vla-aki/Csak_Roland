import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Drónos piactér`}
      description="HoverHire - Magyarország vezető drónos piactere. Projektfeladás, ajánlatküldés, szerződéskötés egy helyen.">
      <HomepageHeader />
      <main>
        <div className="container" style={{padding: '2rem 0'}}>
          <div className="row">
            <div className="col col--12">
              <div className="card" style={{padding: '2rem', marginBottom: '2rem'}}>
                <h2>Bemutatkozás</h2>
                <p>
                  A <strong>HoverHire</strong> egy modern, könnyen kezelhető webalkalmazás, ahol a megbízók és drónpilóták könnyedén egymásra találnak. 
                  Az ötlet onnan jött, hogy rengeteg megbízó keres profi drónost, a pilóták pedig munkát, de nincs egy igazán jól működő magyar platform, 
                  ahol ezt megtehetnék. Ezért született a HoverHire, ahol minden egy helyen van: projektfeladás, ajánlatküldés, szerződéskötés és fizetés. 
                  Célunk, hogy Magyarország első számú drónos piactere legyünk, ahol gyorsan, egyszerűen és biztonságosan lehet üzletelni.
                </p>
                <p>
                  A projektet <strong><a href="https://github.com/Vla-aki" target="_blank" rel="noopener noreferrer">Csák Roland</a></strong> és <strong><a href="https://github.com/AMXB" target="_blank" rel="noopener noreferrer">Szalai Bence</a></strong> készítette.
                </p>
              </div>

              <div className="card" style={{padding: '2rem', marginBottom: '2rem'}}>
                <h2>Főbb funkciók</h2>
                <ul>
                  <li><strong>Regisztráció és bejelentkezés</strong> – A felhasználók könnyedén létrehozhatnak fiókot, akár megbízóként, akár pilótaként.</li>
                  <li><strong>Profilok és szerepkörök</strong> – Kétféle felhasználó van eltérő lehetőségekkel.</li>
                  <li><strong>Projektfeladás</strong> – Három egyszerű lépésben adhatják fel a megbízók a munkákat.</li>
                  <li><strong>Ajánlatküldés</strong> – A pilóták ajánlatot küldhetnek a számukra szimpatikus projektekre.</li>
                  <li><strong>Szerződéskötés</strong> – Az elfogadott ajánlatból automatikusan szerződés jön létre.</li>
                  <li><strong>Pilótakereső</strong> – A megbízók kereshetnek és szűrhetnek a pilóták között.</li>
                  <li><strong>Üzenetváltás</strong> – Beépített chat rendszer olvasottsági státusszal.</li>
                  <li><strong>Bevételkövetés</strong> – A pilóták nyomon követhetik a bevételeiket.</li>
                  <li><strong>Kapcsolat és infók</strong> – Kapcsolatfelvételi űrlap, GYIK, jogi információk.</li>
                </ul>
              </div>

              <div className="card" style={{padding: '2rem'}}>
                <h2>Összegzés</h2>
                <p>
                  A HoverHire egy teljes körű megoldást kínál projekt meghirdetésére, ajánlattételre, szerződéskötésre, 
                  üzenetváltásra, értékelésre és fizetéskezelésre. A platform modern, letisztult dizájnnal rendelkezik, 
                  támogatja a sötét módot, és minden eszközön kényelmesen használható.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}