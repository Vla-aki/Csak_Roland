
# Vizsgatervezet – Drónbérléses Webalkalmazás (HoverHire)

## Tartalomjegyzék

* [Projekt célja](#projekt-célja)
* [1. Regisztráció és bejelentkezés modul](#1-regisztráció-és-bejelentkezés-modul)
* [2. Profilok és szerepkörök](#2-profilok-és-szerepkörök)
* [3. Projektfeladás](#3-projektfeladás)
* [4. Ajánlatküldés](#4-ajánlatküldés)
* [5. Szerződéskötés](#5-szerződéskötés)
* [6. Pilótakereső](#6-pilótakereső)
* [7. Üzenetváltás](#7-üzenetváltás)
* [8. Bevételkövetés](#8-bevételkövetés)
* [9. Kapcsolat és infók](#9-kapcsolat-és-infók)
* [10. Kinézet és dizájn](#10-kinézet-és-dizájn)
* [11. Tesztelés](#11-tesztelés)
* [12. Összegzés](#12-összegzés)

## Projekt célja:
Egy modern, könnyen kezelhető weboldal építése, ahol a megbízók és drónpilóták könnyedén egymásra találnak.
Az ötlet onnan jött, hogy rengeteg megbízó keres profi drónost, a pilóták pedig munkát, de nincs egy igazán jól működő magyar platform, ahol ezt megtehetnék.
Ezért született a HoverHire, ahol minden egy helyen van: projektfeladás, ajánlatküldés, szerződéskötés és fizetés.
Magyarország első számú drónos piactere szeretnénk lenni, ahol gyorsan, egyszerűen és biztonságosan lehet üzletelni.

## 1. Regisztráció és bejelentkezés modul
A felhasználók könnyedén létrehozhatnak fiókot, akár megbízóként, akár pilótaként. Csak néhány alapadat kell: név, email, jelszó és hogy melyik oldalon szeretnének tevékenykedni.
A rendszer ellenőrzi, hogy az email cím még nem szerepel-e az adatbázisban, és ha minden rendben, máris lehet jelentkezni. A belépés után mindenki a saját szerepkörének megfelelő felületet látja.
Fejlesztés közben egyszerűsítettük a dolgot: bármilyen jelszóval be lehet lépni, és a szerepkört is ki lehet próbálgatni. Élesben persze komolyabb biztonság lesz, jelszótitkosítással és tokenes azonosítással.

## 2. Profilok és szerepkörök
Kétféle felhasználó van, teljesen más lehetőségekkel.

### Aki megbízó:

- Feladhatja a munkákat
- Válogathat a beérkezett ajánlatok közül
- Szerződést köthet a kiválasztott pilótával
- Értékelheti az elkészült munkát

### Aki pilóta:

- Böngészhet az elérhető projektek között
- Árajánlatot adhat rájuk
- Szerződhet a megbízóval
- Követheti a bevételeit
- Mutathatja a portfólióját és gyűjtheti az értékeléseket

A profilokat mindenki testreszabhatja: lehet profilkép, bemutatkozás, szakterületek, óradíj és hogy mikor érhető el. A pilóták még képeket is feltölthetnek korábbi munkáikról.

## 3. Projektfeladás
A megbízók három egyszerű lépésben adhatják fel a munkákat:

- Első kör: projekt címe, kategória (fotó, videó, ellenőrzés, térképezés, szállítás) és részletes leírás
- Második kör: pontos helyszín, mennyit szánnak rá (fix összeg vagy óradíj), határidő
- Harmadik kör: milyen készségek kellenek hozzá, aztán egy összefoglaló és a véglegesítés

A feladott projektek azonnal megjelennek a listában, ahol a pilóták megtalálhatják őket. A megbízók a saját felületükön követhetik, hogy állnak a munkák és mennyi ajánlat érkezett rájuk.

## 4. Ajánlatküldés
A pilóták a számukra szimpatikus projektekre küldhetnek ajánlatot. Meg kell adniuk:

- Mennyiért vállalják
- Mennyi idő kell hozzá
- Egy rövid üzenetet a megbízónak

A megbízók egy helyen látják az összes ajánlatot, összehasonlíthatják az árakat, a tapasztalatot és a korábbi értékeléseket. Ha valaki megtetszik, elfogadhatják, ha nem, elutasíthatják.

## 5. Szerződéskötés
Az elfogadott ajánlatból jön létre a szerződés. Ebben benne van a projekt összes adata, a vállalt összeg és a határidő. A rendszerben lehet követni:

- Hol tart a munka
- Milyen mérföldkövek vannak
- Mikor lett kész
- Ha gond van, lehet vitát indítani

A pilóták egy külön oldalon látják az összes szerződésüket: mik az aktívak, mik függőben és mik a lezártak. Mindegyikhez részletes infók tartoznak, még a fizetés állapotát is mutatja.

## 6. Pilótakereső
A megbízók nem csak várhatják az ajánlatokat, hanem maguk is kereshetnek pilóták között. Egy külön oldalon lehet böngészni:

- Lehet szűrni kategóriára, városra, óradíjra és arra, hogy mikor érnek rá
- Lehet rendezni értékelésre, árra vagy a projektek számára
- Meg lehet nézni a pilóták profilját részletesen

Minden sikeres munka után lehet értékelést írni és csillagozni. Az értékelések ott virítanak a pilóták profiljában, így a megbízók könnyebben döntenek.

## 7. Üzenetváltás
A rendszerben van saját üzenetküldő is, hogy ne kelljen más alkalmazásokat használni. Az üzenetek:

- Azonnal megjönnek (WebSocket)
- Lehet őket projektekhez kötni
- Látszik, ha elküldték, megkapták vagy elolvasták

Az üzenetek egy központi helyen vannak, ahol lehet váltogatni a beszélgetések között. Így minden kommunikáció megmarad a platformon.

## 8. Bevételkövetés
A pilóták számára van egy külön oldal, ahol követhetik a pénzügyeiket:

- Látják a teljes bevételt, a még ki nem fizetett tételeket és a már kifizetetteket
- Egy grafikon mutatja a havi bontást
- Lehet listázni az összes tranzakciót és szűrni rájuk
- Ki is lehet kérni a kimutatásokat

A rendszer automatikusan számolja, mennyi jár a sikeres projektek után, és jelzi, ha valami még függőben van.

## 9. Kapcsolat és infók
A "Kapcsolat" menüpontban két dolog van:

- Egy űrlap, ahol bárki írhat az ügyfélszolgálatnak. Lehet kérdezni, reklamálni vagy jelezni, ha valami nem működik. Az űrlap ellenőrzi a bevitt adatokat, és ha minden oké, vissza is jelez.
- Egy GYIK oldal, ahol a leggyakoribb kérdésekre lehet választ találni. Kategóriákba szedve, könnyen áttekinthetően.
- Van még egy "Rólunk" oldal, ahol le van írva a cég története, kik vagyunk, mik a céljaink és a csapat. Illetve a jogi dolgok: ÁSZF, Adatvédelem, Cookie-k és Impresszum, mert azért rendes cégnek ezek is kellenek.

## 10. Kinézet és dizájn
A weboldal modern, letisztult és minden eszközön jól mutat. Akár telefonon, akár tableten, akár gépen nézi valaki, ugyanolyan jó élményt nyújt.

Ami még kiemelhető:

- Sötét mód: Lehet váltani a világos és sötét között, és minden szépen, egyenletesen változik át
- Színek: Professzionális kék árnyalatok, sötét módban szürkék
- Ikonok: A React Icons könyvtárat használjuk
- Animációk: A számok szépen felszaladnak, a gombok reagálnak, az ablakok szépen nyílnak

## 11. Tesztelés
Mielőtt élesedne a rendszer, többféleképpen is ellenőrizzük:

- Működési teszt: minden funkciót kipróbálunk, regisztrációtól a fizetésig
- Használhatósági teszt: mások is megnézik, hogy érthető-e és könnyű-e kezelni
- Reszponzivitás: megnézzük telefonon, tableten, hogy mindenhol jól néz-e ki
- Sötét mód: minden elemet megnézünk sötétben is, hogy semmi se lógjon ki
- Adatáramlás: ellenőrizzük, hogy a modulok között rendben mennek-e az adatok
- Biztonság: megnézzük, hogy csak oda jut-e valaki, ahova szabad

A hibákat felírjuk és kijavítjuk, aztán újra tesztelünk.

## 12. Összegzés
A cél egy olyan hely létrehozása volt, ahol a megbízók és drónpilóták könnyen megtalálják egymást, és minden egy helyen intézhető. Legyen szó projektfeladásról, ajánlatküldésről, szerződéskötésről vagy fizetésről.

Jelenleg 22 oldal működik:

- 11 publikus: Landing, Login, Register, Rólunk, Kapcsolat, Munka keresés, Pilóták keresése, GYIK, ÁSZF, Adatvédelem, Cookie, Impresszum
- 2 közös védett: Profil, Üzenetek
- 4 megbízói: Dashboard, Projekt létrehozás, Projektjeim, Projekt ajánlatok
- 5 pilóta: Pilóta dashboard, Elérhető projektek, Ajánlataim, Szerződéseim, Bevételek
