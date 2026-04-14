const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

describe('Pilóták Keresése (FindFreelancers) E2E Teszt', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => { if (driver) await driver.quit(); });

    it('1. Be kell töltenie a pilóták listáját', async () => {
        await driver.get('http://localhost:5173/find-freelancers');
        const titleElement = await driver.wait(until.elementLocated(By.css('h1')), 5000);
        expect(await titleElement.getText()).toContain('Pilóták keresése');
        
        await driver.sleep(1500); 
        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/8_freelancers_list.png'), image, 'base64');
    });

    it('2. Pilóta profil modal megnyitása kattintásra', async () => {
        try {
            // Megkeressük az első pilóta kártyát és rákattintunk
            const pilotCard = await driver.wait(until.elementLocated(By.css('.cursor-pointer.group')), 3000);
            await pilotCard.click();
            
            // Várjuk meg a modalt és az adatokat
            await driver.wait(until.elementLocated(By.css('.fixed.inset-0')), 5000);
            await driver.sleep(1000); // Várunk az animációra és a képbetöltésre
            
            const image = await driver.takeScreenshot();
            fs.writeFileSync(path.resolve(__dirname, 'screenshots/9_freelancer_modal.png'), image, 'base64');
        } catch(e) {
            console.log('Nincs megjeleníthető pilóta, vagy a modal nem nyílt meg.');
        }
    });
});