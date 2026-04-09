const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const authMiddleware = require('../middleware/authMiddleware');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'dronsag_mysql',
    user: process.env.DB_USER || 'dronsag_user',
    password: process.env.DB_PASSWORD || 'dronsag_password',
    database: process.env.DB_NAME || 'dronsag',
    waitForConnections: true,
    connectionLimit: 10
});

// Middleware: Csak adminisztrátoroknak!
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Nincs jogosultságod ehhez a művelethez (Csak Admin)!' });
    }
    next();
};

// Alkalmazzuk a middleware-eket minden admin route-ra
router.use(authMiddleware, isAdmin);

// Összes projekt lekérése az adminnak
router.get('/projects', async (req, res) => {
    try {
        const [projects] = await pool.query('SELECT p.*, u.email as user_email, u.name as user_name FROM projects p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC');
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a projektek lekérésekor.' });
    }
});

// Projekt törlése (bármelyik)
router.delete('/projects/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Projekt sikeresen törölve a rendszerből!' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba a projekt törlésekor.' });
    }
});

// Összes felhasználó lekérése
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, phone, role FROM users ORDER BY id DESC');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a felhasználók lekérésekor.' });
    }
});

// Felhasználó törlése (ON DELETE CASCADE miatt mindent visz magával)
router.delete('/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Felhasználó sikeresen törölve!' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba a felhasználó törlésekor.' });
    }
});

module.exports = router;