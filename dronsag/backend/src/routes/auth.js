const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Adatbázis kapcsolat
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'dronsag_mysql',
    user: process.env.DB_USER || 'dronsag_user',
    password: process.env.DB_PASSWORD || 'dronsag_password',
    database: process.env.DB_NAME || 'dronsag',
    waitForConnections: true,
    connectionLimit: 10
});

// Email küldő beállítása
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// JELSZÓ VISSZAÁLLÍTÁS - 1. Kód kiküldése
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await pool.query('SELECT name FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'Ezzel az email címmel nem található fiók!' });

        // Biztosítjuk, hogy a tábla létezik (itt hívjuk meg, amikor az adatbázis már biztosan fut)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                code VARCHAR(6) NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6 számjegyű kód generálása
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Töröljük a régi kódokat ehhez az emailhez, és beszúrjuk az újat
        await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);
        await pool.query('INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))', [email, code]);

        // Email küldése
        if (process.env.SMTP_USER && process.env.SMTP_USER.includes('@')) {
            try {
                await transporter.sendMail({
                    from: `"HoverHire Ügyfélszolgálat" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: "Jelszó visszaállítás - HoverHire",
                    html: `<div style="font-family: Arial, sans-serif; padding: 20px; max-w-md;">
                            <h2>Kedves ${users[0].name}!</h2>
                            <p>Kérés érkezett a jelszavad visszaállítására a HoverHire fiókodhoz.</p>
                            <p>A visszaállító kódod:</p>
                            <h1 style="background: #f3f4f6; padding: 10px; text-align: center; letter-spacing: 5px; color: #2563eb;">${code}</h1>
                            <p style="color: #6b7280; font-size: 12px;">A kód 15 percig érvényes. Ha nem te kérted, kérjük hagyd figyelmen kívül ezt az emailt!</p>
                           </div>`
                });
            } catch (mailError) {
                console.error('❌ Email küldési hiba:', mailError);
                return res.status(500).json({ message: 'Az emailt nem sikerült elküldeni! Valószínűleg hibás a jelszó a .env fájlban.' });
            }
        } else {
            console.log('⚠️ Nincs SMTP beállítva! A generált kód:', code); // Fejlesztéshez kiírjuk a konzolra
        }

        res.json({ success: true, message: 'A 6 számjegyű kódot elküldtük az email címedre!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hiba történt a kód generálása során.' });
    }
});

// JELSZÓ VISSZAÁLLÍTÁS - 2. Kód ellenőrzése
router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const [resets] = await pool.query('SELECT * FROM password_resets WHERE email = ? AND code = ?', [email, code]);
        if (resets.length === 0) return res.status(400).json({ message: 'Helytelen kód!' });
        
        if (new Date(resets[0].expires_at) < new Date()) {
            await pool.query('DELETE FROM password_resets WHERE id = ?', [resets[0].id]);
            return res.status(400).json({ message: 'A kód lejárt! Kérj újat.' });
        }

        // Ha jó a kód, adunk egy rövid idejű engedélyező tokent
        const resetToken = jwt.sign({ email, reset: true }, process.env.JWT_SECRET || 'titkos_kulcs', { expiresIn: '15m' });
        res.json({ success: true, resetToken });
    } catch (error) {
        res.status(500).json({ message: 'Hiba a kód ellenőrzésekor.' });
    }
});

// JELSZÓ VISSZAÁLLÍTÁS - 3. Új jelszó mentése
router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword } = req.body;
    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'titkos_kulcs');
        if (!decoded.reset) throw new Error();
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, decoded.email]);
        await pool.query('DELETE FROM password_resets WHERE email = ?', [decoded.email]); // Kód eltakarítása
        res.json({ success: true, message: 'Jelszó sikeresen frissítve!' });
    } catch (error) {
        res.status(400).json({ message: 'Érvénytelen vagy lejárt munkamenet!' });
    }
});

// Regisztráció
router.post('/register', async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Ez az email cím már foglalt!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, phone, member_since) VALUES (?, ?, ?, ?, ?, CURDATE())',
            [name, email, hashedPassword, role, phone || null]
        );

        const newUserId = result.insertId;

        const token = jwt.sign(
            { id: newUserId, role: role },
            process.env.JWT_SECRET || 'titkos_kulcs',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Sikeres regisztráció!',
            token: token,
            user: { id: newUserId, name, email, role, phone: phone || null }
        });
    } catch (error) {
        console.error('❌ Regisztrációs hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a regisztráció során.' });
    }
});

// Bejelentkezés
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ message: 'Hibás email vagy jelszó!' });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Hibás email vagy jelszó!' });

        if (user.role === 'driver') {
            const [skills] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [user.id]);
            user.skills = skills.map(s => s.skill);
            
            const [portfolio] = await pool.query('SELECT image_url FROM portfolio WHERE user_id = ?', [user.id]);
            user.portfolio = portfolio.map(p => p.image_url);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'titkos_kulcs', { expiresIn: '1d' });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ message: 'Sikeres bejelentkezés!', token, user: userWithoutPassword });
    } catch (error) {
        console.error('❌ Bejelentkezési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a bejelentkezés során.' });
    }
});

// Pilóták lekérése
router.get('/pilots', async (req, res) => {
    try {
        const query = `
            SELECT id, name, location, hourly_rate as hourlyRate, availability, 
                   completed_jobs as completedProjects, rating, reviews_count as reviews, 
                   verified, profile_image as image, bio as description, COALESCE(member_since, DATE(created_at)) as memberSince
            FROM users 
            WHERE role = 'driver'
            ORDER BY rating DESC, completed_jobs DESC
        `;
        const [pilots] = await pool.query(query);

        for (let pilot of pilots) {
            const [skills] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [pilot.id]);
            pilot.skills = skills.map(s => s.skill);
            
            const [portfolio] = await pool.query('SELECT image_url FROM portfolio WHERE user_id = ?', [pilot.id]);
            pilot.portfolio = portfolio.map(p => p.image_url);
            
            if (!pilot.image) {
                pilot.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(pilot.name)}&background=2563eb&color=fff`;
            }
            pilot.verified = pilot.verified === 1;
            pilot.featured = pilot.rating >= 4.8;
            pilot.memberSince = pilot.memberSince ? new Date(pilot.memberSince).toLocaleDateString('hu-HU') : 'Ismeretlen';
        }

        res.json({ success: true, pilots });
    } catch (error) {
        console.error('❌ Pilóták lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a pilóták lekérésekor.' });
    }
});

// Egy adott felhasználó publikus profilja
router.get('/user/:id', async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT id, name, role, email, phone, location, bio, hourly_rate as hourlyRate, availability, 
                   completed_jobs as completedProjects, rating, reviews_count as reviews, 
                   verified, profile_image as image, COALESCE(member_since, DATE(created_at)) as memberSince
            FROM users 
            WHERE id = ?
        `, [req.params.id]);

        if (users.length === 0) return res.status(404).json({ message: 'Felhasználó nem található' });
        
        const user = users[0];
        
        if (user.role === 'driver') {
            const [skills] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [user.id]);
            user.skills = skills.map(s => s.skill);
            
            const [portfolio] = await pool.query('SELECT image_url FROM portfolio WHERE user_id = ?', [user.id]);
            user.portfolio = portfolio.map(p => p.image_url);
        }
        
        if (!user.image) {
            user.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;
        }
        user.verified = user.verified === 1;
        user.memberSince = user.memberSince ? new Date(user.memberSince).toLocaleDateString('hu-HU') : 'Ismeretlen';

        res.json({ success: true, user });
    } catch (error) {
        console.error('❌ Profil lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a profil lekérésekor.' });
    }
});

// Értékelések lekérése
router.get('/pilots/:id/reviews', async (req, res) => {
    try {
        const [reviews] = await pool.query(`
            SELECT r.id, r.rating, r.comment, r.created_at, u.name as reviewer_name, u.profile_image as reviewer_image
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.reviewee_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.id]);

        const formatted = reviews.map(r => ({
            id: r.id, rating: r.rating, comment: r.comment, date: new Date(r.created_at).toLocaleDateString('hu-HU'),
            reviewerName: r.reviewer_name, reviewerImage: r.reviewer_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer_name)}&background=2563eb&color=fff`
        }));
        res.json({ success: true, reviews: formatted });
    } catch (error) {
        res.status(500).json({ message: 'Hiba az értékelések lekérésekor.' });
    }
});

// Profil frissítése
router.put('/profile', authMiddleware, async (req, res) => {
    const { name, phone, location, bio, hourly_rate, availability, skills, portfolio, profile_image } = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Régi képek lekérése a fizikai törléshez
        const [oldUser] = await connection.query('SELECT profile_image FROM users WHERE id=?', [req.user.id]);
        const [oldPortfolio] = await connection.query('SELECT image_url FROM portfolio WHERE user_id=?', [req.user.id]);
        const oldProfileImage = oldUser[0]?.profile_image;
        const oldPortfolioUrls = oldPortfolio.map(p => p.image_url);

        await connection.query(
            'UPDATE users SET name=?, phone=?, location=?, bio=?, hourly_rate=?, availability=?, profile_image=? WHERE id=?',
            [name, phone, location, bio, hourly_rate || null, availability, profile_image, req.user.id]
        );

        await connection.query('DELETE FROM user_skills WHERE user_id=?', [req.user.id]);
        if (skills && skills.length > 0) {
            const skillValues = skills.map(skill => [req.user.id, skill]);
            await connection.query('INSERT INTO user_skills (user_id, skill) VALUES ?', [skillValues]);
        }

        await connection.query('DELETE FROM portfolio WHERE user_id=?', [req.user.id]);
        if (portfolio && portfolio.length > 0) {
            const portValues = portfolio.map(img => [req.user.id, img]);
            await connection.query('INSERT INTO portfolio (user_id, image_url) VALUES ?', [portValues]);
        }

        await connection.commit();
        
        // 2. FIZIKAI FÁJLOK TÖRLÉSE (ha a mentés sikeres volt)
        const deletePhysicalFile = (fileUrl) => {
            if (!fileUrl) return;
            try {
                const filename = fileUrl.split('/').pop();
                const filepath = path.join(__dirname, '../../../../uploads', filename);
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                }
            } catch (error) {
                console.error('Hiba a fájl fizikai törlésekor:', error);
            }
        };

        if (oldProfileImage && oldProfileImage !== profile_image) {
            deletePhysicalFile(oldProfileImage);
        }

        const newPortfolioUrls = portfolio || [];
        const deletedPortfolioUrls = oldPortfolioUrls.filter(url => !newPortfolioUrls.includes(url));
        deletedPortfolioUrls.forEach(url => deletePhysicalFile(url));

        const [users] = await connection.query('SELECT * FROM users WHERE id=?', [req.user.id]);
        const updatedUser = users[0];
        updatedUser.skills = skills || [];
        updatedUser.portfolio = portfolio || [];

        res.json({ success: true, updatedUser });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Szerver hiba a profil frissítésekor.' });
    } finally {
        if (connection) connection.release();
    }
});

// Jelszó megváltoztatása (Belépett felhasználóknak)
router.put('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'Felhasználó nem található!' });

        const validPassword = await bcrypt.compare(currentPassword, users[0].password);
        if (!validPassword) return res.status(400).json({ message: 'A jelenlegi jelszó helytelen!' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

        res.json({ success: true, message: 'Jelszó sikeresen frissítve!' });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a jelszó módosításakor.' });
    }
});

// Szerepkör váltás
router.put('/switch-role', authMiddleware, async (req, res) => {
    const { newRole } = req.body;
    if (!['customer', 'driver'].includes(newRole)) return res.status(400).json({ message: 'Érvénytelen szerepkör!' });
    try {
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [newRole, req.user.id]);
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const user = users[0];
        
        if (user.role === 'driver') {
            const [skills] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [user.id]);
            user.skills = skills.map(s => s.skill);
            
            const [portfolio] = await pool.query('SELECT image_url FROM portfolio WHERE user_id = ?', [user.id]);
            user.portfolio = portfolio.map(p => p.image_url);
        }
        
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'titkos_kulcs', { expiresIn: '1d' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a szerepkör váltásakor.' });
    }
});

module.exports = router;
