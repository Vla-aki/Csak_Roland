const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const authMiddleware = require('../middleware/authMiddleware');

// Adatbázis kapcsolat
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'dronsag_mysql',
    user: process.env.DB_USER || 'dronsag_user',
    password: process.env.DB_PASSWORD || 'dronsag_password',
    database: process.env.DB_NAME || 'dronsag',
    waitForConnections: true,
    connectionLimit: 10
});

// Pilóta saját ajánlatai
router.get('/my-bids', authMiddleware, async (req, res) => {
    if (req.user.role !== 'driver') return res.status(403).json({ message: 'Csak pilóták kérhetik le!' });
    try {
        const query = `
            SELECT b.id, b.amount as bidAmount, b.message, b.estimated_days as estimatedDuration, b.status, b.created_at as submittedDate,
                   p.id as projectId, p.title as projectTitle, p.location as projectLocation, p.budget_type as bidType, p.deadline,
                   u.name as clientName, u.rating as clientRating
            FROM bids b
            JOIN projects p ON b.project_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE b.driver_id = ?
            ORDER BY b.created_at DESC
        `;
        const [bids] = await pool.query(query, [req.user.id]);
        res.json({ success: true, bids });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

// Ajánlat státuszának frissítése (pl. Megbízó elutasítja)
router.put('/:id/status', authMiddleware, async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE bids SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Státusz frissítve!' });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

module.exports = router;