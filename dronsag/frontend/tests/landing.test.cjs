const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

describe('Főoldal (Landing) és Kereső E2E Teszt', () => {
    let driver;

    // Minden teszt előtt megnyitunk egy új, tiszta Chrome böngészőt
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        // Érdemes ezt is maximalizálni a biztos kattintásokhoz
        await driver.manage().window().maximize(); 
        
        const dir = path.resolve(__dirname, 'screenshots');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Ha végzett a robot, bezárja a böngészőt
    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('1. Be kell töltenie a Főoldalt, megkeresni a címet, és csinálni egy fotót', async () => {
        await driver.get('http://localhost:5173');
        
        const titleElement = await driver.wait(until.elementLocated(By.css('h1')), 5000);
        const titleText = await titleElement.getText();
        
        expect(titleText).toContain('Találd meg a legjobb');
        
        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/1_landing_page.png'), image, 'base64');
    });

    it('2. Át kell navigálnia a Bejelentkezés oldalra, ha a gombra kattint', async () => {
        const loginButton = await driver.wait(until.elementLocated(By.linkText('Bejelentkezés')), 5000);
        
        // Biztonságos kattintás (a menü sáv elkerülésére)
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", loginButton);
        await driver.sleep(300);
        await loginButton.click();
        
        // Várjuk meg, amíg az URL megváltozik
        await driver.wait(until.urlContains('/login'), 5000);
        
        // JAVÍTÁS: Kifejezetten a "Bejelentkezés" szövegű H1-et keressük, hogy véletlenül se a régi oldal címét fogja meg a React átmenet közben!
        const loginTitle = await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Bejelentkezés')]")), 5000);
        const text = await loginTitle.getText();
        
        expect(text).toBe('Bejelentkezés');

        await driver.sleep(500); // Várunk egy felet az oldal-áttűnés animációjára
        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/2_login_page.png'), image, 'base64');
    });
});
