const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

describe('Autentikáció (Bejelentkezés és Regisztráció) E2E Teszt', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        const dir = path.resolve(__dirname, 'screenshots');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('1. Üres bejelentkezési űrlapnál piros hibaüzenetet kell adnia az inputok alatt', async () => {
        await driver.get('http://localhost:5173/login');
        
        // Megkeressük a Bejelentkezés gombot és rákattintunk üres űrlappal
        const submitBtn = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 5000);
        await submitBtn.click();
        
        // Várjuk meg a hibaüzenetet (A jelszó megadása kötelező)
        const errorMsg = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'kötelező')]")), 5000);
        const text = await errorMsg.getText();
        expect(text).toContain('kötelező');

        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/3_login_empty_error.png'), image, 'base64');
    });

    it('2. Rossz jelszó esetén ki kell írnia a "Hibás email" alertet a tetején', async () => {
        await driver.get('http://localhost:5173/login');
        
        // Robot begépeli az adatokat
        await driver.findElement(By.id('email')).sendKeys('rossz.email@teszt.hu');
        await driver.findElement(By.id('password')).sendKeys('rosszjelszo123');
        
        await driver.findElement(By.xpath("//button[@type='submit']")).click();
        
        // Várjuk meg a backendtől visszajövő piros hibaüzenet dobozt
        const errorAlert = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Hibás email')]")), 5000);
        const alertText = await errorAlert.getText();
        expect(alertText).toContain('Hibás email');

        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/4_login_wrong_creds.png'), image, 'base64');
    });
    
    it('3. A regisztrációs oldalon a Pilóta gombra kattintva annak ki kell jelölődnie', async () => {
        await driver.get('http://localhost:5173/register');
        
        const driverBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Pilóta')]")), 5000);
        await driverBtn.click();
        
        const className = await driverBtn.getAttribute('class');
        expect(className).toContain('text-blue-600'); // Kék lett a gomb?

        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/5a_register_role_switch.png'), image, 'base64');
    });

    it('4. Elfelejtett jelszó: elküldi a kódot és a következő lépésre ugrik', async () => {
        await driver.get('http://localhost:5173/login');
        
        // Rákattint az "Elfelejtett jelszó?" linkre
        await driver.findElement(By.linkText('Elfelejtett jelszó?')).click();
        
        // Megvárja, amíg betölt az új oldal
        await driver.wait(until.urlContains('/forgot-password'), 5000);
        
        // Beír egy létező emailt (az init.sql-ből)
        await driver.findElement(By.css("input[type='email']")).sendKeys('testm@gmail.com');
        await driver.findElement(By.xpath("//button[contains(text(), 'Kód kérése')]")).click();
        
        // Várjuk meg, amíg megjelenik a következő lépés szövege
        const nextStepText = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Elküldtük a 6 számjegyű kódot')]")), 5000);
        expect(await nextStepText.getText()).toContain('Elküldtük');

        const image = await driver.takeScreenshot();
        fs.writeFileSync(path.resolve(__dirname, 'screenshots/5b_forgot_password_sent.png'), image, 'base64');
    });
});