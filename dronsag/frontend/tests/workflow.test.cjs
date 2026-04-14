const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

describe('Teljes Felhasználói Folyamatok (Regisztráció, Projektfeladás)', () => {
    let driver;
    // Egyedi emailek, hogy ne akadjon össze korábbi tesztekkel
    const customerEmail = `customer_${Date.now()}@example.com`;
    const pilotEmail = `pilot_${Date.now()}@example.com`;

    // Segédfüggvény a biztonságos kattintáshoz (kikerüli a Sticky Navbart)
    const safeClick = async (element) => {
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
        await driver.sleep(500); // Várunk egy picit a görgetés után
        await element.click();
    };

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        // Ablak maximalizálása, hogy minden UI elem (gombok, kártyák) látható legyen
        await driver.manage().window().maximize();
    });

    afterAll(async () => { if (driver) await driver.quit(); });

    // --- MEGBÍZÓ FOLYAMAT ---
    describe('Megbízó Workflow', () => {
        it('1. Sikeres regisztráció megbízóként és átirányítás a vezérlőpultra', async () => {
            await driver.get('http://localhost:5173/register');
            await driver.sleep(1000);
            
            await driver.findElement(By.id('name')).sendKeys('Selenium Megbízó');
            await driver.findElement(By.id('email')).sendKeys(customerEmail);
            await driver.findElement(By.id('password')).sendKeys('RobotJelszo123!');
            await driver.findElement(By.id('confirmPassword')).sendKeys('RobotJelszo123!');
            
            const submitBtn = await driver.findElement(By.xpath("//button[@type='submit']"));
            
            const imageBefore = await driver.takeScreenshot();
            fs.writeFileSync(path.resolve(__dirname, 'screenshots/12_register_customer_filled.png'), imageBefore, 'base64');
            
            await safeClick(submitBtn);
            
            await driver.wait(until.urlContains('/dashboard'), 10000);
            
            const dashboardTitle = await driver.wait(until.elementLocated(By.css('h1')), 5000);
            expect(await dashboardTitle.getText()).toContain('Üdvözlünk');
            
            await driver.sleep(1500);
            const imageAfter = await driver.takeScreenshot();
            fs.writeFileSync(path.resolve(__dirname, 'screenshots/13_customer_dashboard.png'), imageAfter, 'base64');
        });

        it('2. Új projekt létrehozása a többlépéses űrlapon keresztül', async () => {
            const createBtn = await driver.wait(until.elementLocated(By.xpath("//a[contains(@href, '/create-project')]")), 5000);
            await safeClick(createBtn);
            await driver.wait(until.urlContains('/create-project'), 5000);

            // 1. LÉPÉS
            await driver.findElement(By.id('title')).sendKeys('Automata Teszt Projekt');
            const categoryBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Videózás')]")), 5000);
            await safeClick(categoryBtn);
            await driver.findElement(By.id('description')).sendKeys('Ez egy Selenium robottal automatikusan létrehozott projekt.');
            const nextBtn1 = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább a részletekhez')]"));
            await safeClick(nextBtn1);
            
            // 2. LÉPÉS
            await driver.wait(until.elementLocated(By.id('location')), 5000);
            await driver.findElement(By.id('location')).sendKeys('Budapest');
            await driver.findElement(By.id('budget')).sendKeys('150000');
            
            // Dátum beállítása JS-sel a makacs böngésző naptárak miatt
            const deadlineInput = await driver.findElement(By.id('deadline'));
            await driver.executeScript(`
                const input = arguments[0];
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                setter.call(input, '2026-12-31');
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            `, deadlineInput);
            
            const nextBtn2 = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább az áttekintéshez')]"));
            await safeClick(nextBtn2);

            // 3. LÉPÉS
            await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Projekt összefoglaló')]")), 5000);
            const createProjectBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Projekt létrehozása')]"));
            await safeClick(createProjectBtn);

            // Várjuk meg az átirányítást
            await driver.wait(until.urlContains('/my-projects'), 10000);
            const successTitle = await driver.wait(until.elementLocated(By.css('h1')), 5000);
            expect(await successTitle.getText()).toContain('Projektjeim');

            const imageFinal = await driver.takeScreenshot();
            fs.writeFileSync(path.resolve(__dirname, 'screenshots/14_project_created_success.png'), imageFinal, 'base64');
        });
    });

    // --- PILÓTA FOLYAMAT ---
    describe('Pilóta Workflow', () => {
        it('3. Kijelentkezés a Megbízó fiókból és regisztráció Pilótaként', async () => {
            // Kijelentkezés (profil menü megnyitása, majd Kijelentkezés gomb)
            await driver.executeScript("localStorage.clear();"); // Gyors kijelentkezés
            await driver.get('http://localhost:5173/register');
            await driver.sleep(1000);

            // Szerepkör váltás Pilótára
            const driverRoleBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Pilóta')]")), 5000);
            await safeClick(driverRoleBtn);
            await driver.sleep(500);

            // Adatok kitöltése
            await driver.findElement(By.id('name')).sendKeys('Selenium Pilóta');
            await driver.findElement(By.id('email')).sendKeys(pilotEmail);
            await driver.findElement(By.id('password')).sendKeys('RobotJelszo123!');
            await driver.findElement(By.id('confirmPassword')).sendKeys('RobotJelszo123!');
            
            const submitBtn = await driver.findElement(By.xpath("//button[@type='submit']"));
            await safeClick(submitBtn);
            
            // Várjuk meg az átirányítást a pilóta dashboardra
            await driver.wait(until.urlContains('/drone-dashboard'), 10000);
            const imageDriver = await driver.takeScreenshot();
            fs.writeFileSync(path.resolve(__dirname, 'screenshots/15_driver_dashboard.png'), imageDriver, 'base64');
        });

        it('4. Ajánlattétel a Megbízó által feladott projektre', async () => {
            await driver.get('http://localhost:5173/find-work');
            await driver.sleep(1500);

            // Megkeressük a gombot a listában és rákattintunk biztonságosan az "Érdekel" gombra
            const applyBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Érdekel')]")), 5000);
            await safeClick(applyBtn);
            
            // Várunk, amíg a modal bejön
            await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Ajánlattétel')]")), 5000);
            
            await driver.findElement(By.css("input[type='number']")).sendKeys('120000'); // amount
            await driver.findElements(By.css("input[type='number']")).then(els => els[1].sendKeys('3')); // days
            await driver.findElement(By.css("textarea")).sendKeys('Szia! Én egy robot vagyok, és szívesen megcsinálom a drónozást!');
            
            const imageBeforeBid = await driver.takeScreenshot();
            fs.writeFileSync(path.resolve(__dirname, 'screenshots/16_bid_filled.png'), imageBeforeBid, 'base64');

            const submitBidBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Ajánlat elküldése')]"));
            await safeClick(submitBidBtn);
            await driver.sleep(2000); // Várjuk meg a siker üzenetet
        });
    });
});