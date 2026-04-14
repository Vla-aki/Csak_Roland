const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

describe('Munkák Keresése (FindWork) E2E Teszt', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => { if (driver) await driver.quit(); });

    it('1. Be kell töltenie az elérhető munkák listáját', async () => {
        await driver.get('http://localhost:5173/find-work');
        
        // Várjuk meg a címsort
        const titleElement = await driver.wait(until.elementLocated(By.css('h1')), 5000);
        expect(await titleElement.getText()).toContain('Elérhető munkák');
        
        // Várjuk meg, hogy legalább egy projekt kártya (vagy az üres állapot) betöltsön a backendből
        await driver.sleep(1500); 
        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/6_findwork_list.png'), image, 'base64');
    });

    it('2. Szűrő használata: kategória kiválasztása', async () => {
        // Megkeressük a kategória legördülő menüt és kiválasztjuk a Légifotózást
        const select = await driver.wait(until.elementLocated(By.css('select')), 5000);
        await select.sendKeys('Légifotózás');
        
        // Várjuk meg a szűrést
        await driver.sleep(1000); 
        
        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/7_findwork_filtered.png'), image, 'base64');
    });
});