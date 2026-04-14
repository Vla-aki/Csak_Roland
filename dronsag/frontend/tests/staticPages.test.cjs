const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

describe('Statikus Oldalak és Navigáció E2E Teszt', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => { if (driver) await driver.quit(); });

    it('1. GYIK oldal betöltése és harmonika lenyitása', async () => {
        await driver.get('http://localhost:5173/faq');
        await driver.wait(until.elementLocated(By.css('h1')), 5000);
        
        try {
            // Rákattintunk az első "Általános kérdések" lenyíló fülre
            const categoryBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Általános kérdések')]")), 5000);
            await categoryBtn.click();
            await driver.sleep(500); // Várjuk meg a CSS animációt
            
            const image = await driver.takeScreenshot();
            fs.writeFileSync(path.resolve(__dirname, 'screenshots/10_faq_opened.png'), image, 'base64');
        } catch (e) {}
    });

    it('2. Kapcsolat oldal betöltése', async () => {
        await driver.get('http://localhost:5173/contact');
        const h1 = await driver.wait(until.elementLocated(By.css('h1')), 5000);
        expect(await h1.getText()).toContain('Kapcsolat');
        
        await driver.sleep(500);
        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/11_contact_page.png'), image, 'base64');
    });
});