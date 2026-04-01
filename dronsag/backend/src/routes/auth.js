// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// Adatbázis kapcsolat
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'dronsag_mysql',
    user: process.env.DB_USER || 'dronsag_user',
    password: process.env.DB_PASSWORD || 'dronsag_password',
    database: process.env.DB_NAME || 'dronsag',
    waitForConnections: true,
    connectionLimit: 10
});

// Regisztráció
router.post('/register', async (req, res) => {
    console.log('📝 Regisztrációs kérés:', req.body);
    
    const { name, email, phone, password, confirmPassword, role } = req.body;

    // Validáció
    if (!name || !password || !confirmPassword || !role) {
        return res.status(400).json({ message: 'Minden kötelező mezőt ki kell tölteni!' });
    }

    if (!email && !phone) {
        return res.status(400).json({ message: 'Email vagy telefonszám megadása kötelező!' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'A jelszavak nem egyeznek!' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'A jelszónak legalább 6 karakter hosszúnak kell lennie!' });
    }

    try {
        // Ellenőrizzük a létező felhasználót
        let checkQuery = '';
        let checkValues = [];
        
        if (email) {
            checkQuery = 'SELECT id FROM users WHERE email = ?';
            checkValues = [email];
        } else {
            checkQuery = 'SELECT id FROM users WHERE phone = ?';
            checkValues = [phone];
        }

        const [existingUsers] = await pool.query(checkQuery, checkValues);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Ez az email vagy telefonszám már regisztrálva van!' });
        }

        // Jelszó hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // Felhasználó beszúrása (created_at automatikusan kitöltődik)
        const insertQuery = `
            INSERT INTO users (name, email, phone, password, role, verified, member_since)
            VALUES (?, ?, ?, ?, ?, ?, CURDATE())
        `;
        
        const insertValues = [name, email || null, phone || null, hashedPassword, role, false];
        
        const [result] = await pool.query(insertQuery, insertValues);
        
        console.log('✅ Felhasználó létrehozva, ID:', result.insertId);
        
        // Token generálása
        const token = jwt.sign(
            { id: result.insertId, email: email || phone, role },
            process.env.JWT_SECRET || 'titkos_kulcs',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Sikeres regisztráció!',
            token,
            user: {
                id: result.insertId,
                name,
                email: email || null,
                phone: phone || null,
                role,
                verified: false
            }
        });

    } catch (error) {
        console.error('❌ Regisztrációs hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

// Bejelentkezés
router.post('/login', async (req, res) => {
        console.log('🔑 Bejelentkezési kérés:', req.body);
    
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
        return res.status(400).json({ message: 'Minden kötelező mezőt ki kell tölteni!' });
    }

    try {
        let userQuery = '';
        let userValues = [];
        
        if (email) {
            userQuery = 'SELECT * FROM users WHERE email = ?';
            userValues = [email];
        } else {
            userQuery = 'SELECT * FROM users WHERE phone = ?';
            userValues = [phone];
        }

        const [users] = await pool.query(userQuery, userValues);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Hibás bejelentkezési adatok!' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Hibás bejelentkezési adatok!' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'titkos_kulcs',
            { expiresIn: '7d' }
        );

        // Szakterületek lekérése, ha a felhasználó pilóta
        let skills = [];
        if (user.role === 'driver') {
            const [skillRows] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [user.id]);
            skills = skillRows.map(row => row.skill);
        }

        console.log('✅ Bejelentkezés sikeres:', user.email || user.phone);

        res.json({
            success: true,
            message: 'Sikeres bejelentkezés!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verified: user.verified === 1,
                location: user.location,
                bio: user.bio,
                profile_image: user.profile_image,
                hourly_rate: user.hourly_rate,
                availability: user.availability,
                completed_jobs: user.completed_jobs,
                rating: user.rating,
                reviews_count: user.reviews_count,
                member_since: user.member_since,
                skills: skills
            }
        });

    } catch (error) {
        console.error('❌ Bejelentkezési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

// Profil frissítése
router.put('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Nincs jogosultságod a művelethez!' });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titkos_kulcs');
        const userId = decoded.id;

        const { name, phone, location, bio, hourly_rate, availability, skills, profile_image } = req.body;

        // Felhasználó alap adatainak frissítése
        const updateQuery = `
            UPDATE users 
            SET name = ?, phone = ?, location = ?, bio = ?, hourly_rate = ?, availability = ?, profile_image = ?
            WHERE id = ?
        `;
        await pool.query(updateQuery, [
            name, phone || null, location || null, bio || null, hourly_rate || null, availability || null, profile_image || null, userId
        ]);

        // Szakterületek frissítése (régi törlése, újak beszúrása)
        if (skills && Array.isArray(skills)) {
            await pool.query('DELETE FROM user_skills WHERE user_id = ?', [userId]);
            if (skills.length > 0) {
                const skillValues = skills.map(skill => [userId, skill]);
                await pool.query('INSERT INTO user_skills (user_id, skill) VALUES ?', [skillValues]);
            }
        }

        res.json({ success: true, message: 'Profil sikeresen frissítve!' });
    } catch (error) {
        console.error('❌ Profil frissítési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

module.exports = router;