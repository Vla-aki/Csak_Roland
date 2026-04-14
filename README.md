# HoverHire
Modern, biztonságos és átlátható drónbérléses piactér és közösségi platform.

## Tartalomjegyzék
* [Projekt bemutatása](#projekt-bemutatása)
* [Főbb funkciók és Architektúra](#főbb-funkciók-és-architektúra)
* [Alkalmazott technológiák](#alkalmazott-technológiák)
* [Fejlesztők és Felelősségi körök](#fejlesztők-és-felelősségi-körök)
* [Telepítés és Futtatás (Docker)](#telepítés-és-futtatás-docker)

## Projekt bemutatása
A HoverHire egy komplex, vizsgaremekként készült Single Page Application (SPA) alapú piactér és közösségi platform, amely összeköti a professzionális drónpilótákat a megbízókkal. A rendszer ötvözi a modern szabadúszó portálok (pl. Upwork) letisztult élményét a specifikus drónos szolgáltatások (légifotózás, videózás, ipari ellenőrzés stb.) funkcionális igényeivel.

A projekt elsődleges célja egy olyan aktív, kreatív ökoszisztéma kialakítása, ahol a felhasználók (megbízók és pilóták) egyetlen, központi felületen tudják menedzselni a projektfeladást, az ajánlattételt, a szerződéskötést, az üzenetváltást és a biztonságos fizetési folyamatokat.

## Főbb funkciók és Architektúra

### Dinamikus Kereső és Projektkezelés
* **Többlépéses Projektfeladás:** A megbízók kategóriákra bontva, részletes leírással, határidővel és költségkerettel (fix vagy óradíjas) írhatnak ki munkákat.
* **Komplex Keresőmotor:** A rendszer lehetővé teszi a projektek és a pilóták kiterjesztett szűrését dinamikus paraméterek (helyszín, ár, kategória, értékelés, elérhetőség) alapján.
* **Ajánlattétel és Szerződéskötés:** A pilóták árajánlatokat küldhetnek a nyitott projektekre. A megbízók ezeket összehasonlíthatják, elfogadhatják, amiből a rendszer automatikusan szerződést generál.
* **Mélyreható Pénzügyi Statisztikák:** Mind a pilóták, mind a megbízók dedikált felületeken követhetik nyomon a függőben lévő letéteiket, bevételeiket és kiadásaikat dinamikus grafikonokon.

### Közösségi Interakciók és Kommunikáció
* **Értékelési Rendszer:** A sikeresen lezárt projektek után a megbízók szöveges és csillagos értékelést hagyhatnak a pilótáknak, ami megjelenik a publikus profiljukon.
* **Privát Chat és Értesítések:** Beépített üzenetküldő rendszer kép- és fájlfeltöltési lehetőséggel (Multer és Node.js feldolgozással), valamint Emoji támogatással. A felhasználók valós időben kapnak rendszerértesítéseket az új ajánlatokról, üzenetekről és a szerződések státuszváltozásairól.

### Biztonság és Jogosultságkezelés
* **JWT Hitelesítés és Route Protection:** A teljes rendszer biztonságos JSON Web Token alapú bejelentkezést használ. A React kliensoldalon Higher-Order Componentek (HOC) védik a privát útvonalakat (Külön Megbízói, Pilóta és Admin jogosultságok).
* **Titkosítás:** A jelszavak nyílt szöveg helyett bcrypt.js segítségével, sózva (salted hash) kerülnek a MySQL adatbázisba.
* **Adminisztrációs Vezérlőpult:** Egy dedikált, csak Admin jogosultsággal elérhető felület a platform moderálására. Lehetőséget ad a projektek és felhasználók biztonságos kezelésére, törlésére, valamint a globális platformstatisztikák áttekintésére.

## Alkalmazott technológiák

**Kliensoldal (Frontend):**
* React.js (Vite) – Gyors, optimalizált fejlesztői környezet és kliensoldali renderelés
* React Router DOM – Kliensoldali dinamikus navigáció
* Tailwind CSS – Teljesen egyedi, modern UI, reszponzív kialakítás és beépített "Glassmorphism" sötét téma (Dark Mode)
* React Icons & Emoji Picker – Ikonográfia és interaktív kommunikációs elemek

**Szerveroldal és Adatbázis (Backend):**
* Node.js & Express.js – Robusztus, aszinkron RESTful API szerver
* MySQL – Relációs adatbázis a stabil, normalizált adattároláshoz és a komplex relációk kezeléséhez
* Bcrypt.js & JWT – Biztonsági réteg és munkamenet-kezelés
* Multer – Multipart/form-data kérések fogadása, fizikai profilképek és portfóliók feltöltéséhez

**Tesztelés és DevOps:**
* Jest & Supertest – Backend API végpontok és middleware-ek automatizált tesztelése
* Selenium WebDriver – Frontend E2E (End-to-End) tesztelés automatizált böngészővel a főbb felhasználói folyamatokra
* Docker & Docker Compose – A teljes architektúra konténerizált futtatásához

## Fejlesztők és Felelősségi körök

A projektet a modern agilis szoftverfejlesztési elveknek megfelelően építettük fel.

**Csák Roland (Full-Stack Fejlesztő / Alapító)**
* **Kliensoldali Architektúra és UI/UX:** A teljes React.js (Vite) frontend alapjainak lefektetése. A Tailwind CSS alapú designrendszer, a reszponzív elrendezések és a beépített sötét téma (Dark Mode) elkészítése.
* **Projekt- és Ajánlatkezelés (Frontend):** A többlépéses projektfeladási folyamat, a komplex pilótakereső szűrőrendszer és a dinamikus dashboard-ok (Megbízó/Pilóta) vizuális megvalósítása.
* **Automatizált Tesztelés (E2E):** A Selenium WebDriver alapú end-to-end tesztek írása (regisztráció, projektfeladás, szűrés), biztosítva a kritikus felhasználói folyamatok megbízhatóságát.

**Szalai Bence (Full-Stack Fejlesztő / Társalapító)**
* **Adatbázis-tervezés és Backend Logika:** A MySQL relációs adatbázis sémájának megtervezése, a táblák normalizálása és az összetett SQL lekérdezések optimalizálása (projektek, ajánlatok, szerződések, üzenetek integrációja).
* **Hitelesítés és Kriptográfia:** A Node.js szerveren a JWT alapú autentikáció és a Bcrypt jelszótitkosítás API szintű implementálása.
* **Fájlkezelés és Infrastruktúra (DevOps):** A Multer alapú profilkép- és portfólió fájlfeltöltő modulok megírása, a teljes alkalmazás (MySQL, phpMyAdmin, Backend, Frontend) Docker Compose alapú konténerizálása, valamint a Jest backend unit/integrációs tesztek elkészítése.

## Telepítés és Futtatás (Docker)

Ez a projekt a Docker és Docker Compose, valamint a mellékelt gyorsindító `.bat` szkriptek segítségével egyetlen paranccsal elindítható (Windows környezetben). A rendszer automatikusan felépíti az adatbázist, és elindítja a backend, valamint a frontend szervereket.

### Előfeltételek
* **Docker Desktop** telepítve és fut.
* **Node.js** telepítve (kizárólag az npm parancsok és a kliens futtatásához).

### Indítás
Nyiss egy terminált a projekt gyökérkönyvtárában (ahol a `start.bat` és a `docker-compose.yml` fájlok is találhatók), és futtasd a szkriptet:

```bash
start.bat
```

A szkript a következőket végzi el automatikusan:
1. Elindítja a **MySQL**, **phpMyAdmin** és **Backend** konténereket a háttérben (`docker-compose up -d`).
2. Telepíti a Frontend függőségeit (`npm install`).
3. Megnyit egy új terminálablakot, és elindítja a React fejlesztői szervert (`npm run dev`).

### Elérhetőségek indítás után
A sikeres indítást követően az alkalmazás részei az alábbi alapértelmezett címeken lesznek elérhetőek a böngésződből:

* **Frontend (HoverHire):** http://localhost:5173
* **Backend API:** http://localhost:5000
* **Adatbázis-kezelő (phpMyAdmin):** http://localhost:8081

### Leállítás
A projekt teljes leállításához futtasd a leállító szkriptet a projekt gyökerében:

```bash
stop.bat
```
*(Ez automatikusan leállítja a Docker konténereket és bezárja a háttérben maradt frontend node/cmd folyamatokat.)*
