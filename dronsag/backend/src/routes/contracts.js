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

// Szerződés létrehozása (Megbízó elfogad egy ajánlatot)
router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'customer') return res.status(403).json({ message: 'Csak megbízók köthetnek szerződést!' });
    const { bidId } = req.body;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [bids] = await connection.query('SELECT * FROM bids WHERE id = ?', [bidId]);
        if (bids.length === 0) throw new Error('Ajánlat nem található!');
        const bid = bids[0];

        const [projects] = await connection.query('SELECT * FROM projects WHERE id = ?', [bid.project_id]);
        const project = projects[0];
        if (project.user_id !== req.user.id) throw new Error('Nincs jogosultságod ehhez a projekthez!');

        const [result] = await connection.query(
            'INSERT INTO contracts (project_id, bid_id, customer_id, driver_id, amount, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [project.id, bid.id, req.user.id, bid.driver_id, bid.amount, 'active', 'pending']
        );

        await connection.query('UPDATE bids SET status = "accepted" WHERE id = ?', [bid.id]);
        await connection.query('UPDATE bids SET status = "rejected" WHERE project_id = ? AND id != ?', [project.id, bid.id]);
        await connection.query('UPDATE projects SET status = "completed" WHERE id = ?', [project.id]);

        await connection.commit();
        res.status(201).json({ success: true, contractId: result.insertId, message: 'Szerződés létrejött!' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Hiba: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Saját szerződések lekérése
router.get('/', authMiddleware, async (req, res) => {
    try {
        const isCustomer = req.user.role === 'customer';
        const query = `
            SELECT c.*, p.title as projectTitle, p.description, u.name as otherPartyName, u.rating as otherPartyRating 
            FROM contracts c 
            JOIN projects p ON c.project_id = p.id 
            JOIN users u ON (isCustomer = true AND c.driver_id = u.id) OR (isCustomer = false AND c.customer_id = u.id)
            WHERE (isCustomer = true AND c.customer_id = ?) OR (isCustomer = false AND c.driver_id = ?)
            ORDER BY c.created_at DESC
        `.replace(/isCustomer = true/g, isCustomer ? '1=1' : '1=0')
         .replace(/isCustomer = false/g, !isCustomer ? '1=1' : '1=0');

        const [contracts] = await pool.query(query, [req.user.id, req.user.id]);
        res.json({ success: true, contracts });
    } catch (error) {
        res.status(500).json({ message: 'Hiba: ' + error.message });
    }
});

module.exports = router;