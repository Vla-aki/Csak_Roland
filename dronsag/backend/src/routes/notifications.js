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

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [notifications] = await pool.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
            [req.user.id]
        );
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba az értesítések lekérésekor.' });
    }
});

// Összes olvasottnak jelölése
router.put('/read-all', authMiddleware, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba az értesítések frissítésekor.' });
    }
});

module.exports = router;