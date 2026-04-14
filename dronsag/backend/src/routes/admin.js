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

// Admin jogosultság
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Nincs jogosultságod ehhez a művelethez (Csak Admin)!' });
    }
    next();
};

// Middleware-ek
router.use(authMiddleware, isAdmin);

// Statisztikák lekérése
router.get('/stats', async (req, res) => {
    try {
        const [[activeProjects]] = await pool.query("SELECT COUNT(*) as count FROM projects WHERE status = 'active'");
        const [[totalProposals]] = await pool.query("SELECT COUNT(*) as count FROM bids");
        const [[completedProjects]] = await pool.query("SELECT COUNT(*) as count FROM projects WHERE status = 'completed'");
        const [[totalUsers]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role != 'admin'");

        res.json({
            success: true,
            stats: {
                activeProjects: activeProjects.count,
                totalProposals: totalProposals.count,
                completedProjects: completedProjects.count,
                totalUsers: totalUsers.count
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a statisztikák lekérésekor.' });
    }
});

// Projektek lekérése
router.get('/projects', async (req, res) => {
    try {
        const [projects] = await pool.query('SELECT p.*, u.email as user_email, u.name as user_name FROM projects p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC');
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a projektek lekérésekor.' });
    }
});

// Projekt törlése
router.delete('/projects/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Projekt sikeresen törölve a rendszerből!' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba a projekt törlésekor.' });
    }
});

// Felhasználók lekérése
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, phone, role FROM users ORDER BY id DESC');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a felhasználók lekérésekor.' });
    }
});

// Felhasználó törlése
router.delete('/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Felhasználó sikeresen törölve!' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba a felhasználó törlésekor.' });
    }
});

// Összes üzenet lekérése (Admin megfigyelő)
router.get('/messages', async (req, res) => {
    try {
        // Lekérjük a legutóbbi 500 üzenetet a feladó és címzett nevével
        const query = `
            SELECT m.id, m.message, m.created_at, 
                   s.name as sender_name, s.role as sender_role,
                   r.name as receiver_name, r.role as receiver_role
            FROM messages m
            JOIN users s ON m.sender_id = s.id
            JOIN users r ON m.receiver_id = r.id
            ORDER BY m.created_at DESC
            LIMIT 500
        `;
        const [messages] = await pool.query(query);
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba az üzenetek lekérésekor.' });
    }
});

module.exports = router;
