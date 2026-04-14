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

// Szerződéskötés
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

        // Értesítés a nyertes pilótának
        await connection.query(
            'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
            [bid.driver_id, 'bid', 'Ajánlat elfogadva!', `Gratulálunk! A(z) "${project.title}" projektre tett ajánlatodat elfogadták.`, `/contract/${result.insertId}`]
        );

        // Értesítés a többi (elutasított) pilótának
        const [rejectedBids] = await connection.query('SELECT driver_id FROM bids WHERE project_id = ? AND id != ?', [project.id, bid.id]);
        if (rejectedBids.length > 0) {
            const notifValues = rejectedBids.map(rb => [rb.driver_id, 'bid', 'Ajánlat elutasítva', `Sajnos a(z) "${project.title}" projektre tett ajánlatodat elutasították, mert a megbízó mást választott.`, '/find-work']);
            await connection.query('INSERT INTO notifications (user_id, type, title, message, link) VALUES ?', [notifValues]);
        }

        await connection.commit();
        res.status(201).json({ success: true, contractId: result.insertId, message: 'Szerződés létrejött!' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Hiba: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Saját szerződések
router.get('/', authMiddleware, async (req, res) => {
    try {
        const isCustomer = req.user.role === 'customer';
        const query = `
            SELECT c.*, p.title as projectTitle, p.description, 
                   u.id as otherPartyId, u.name as otherPartyName, u.rating as otherPartyRating, u.profile_image as otherPartyImage, u.verified as otherPartyVerified
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

// Szerződés részletei
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const query = `
            SELECT c.*, 
                   p.title as projectTitle, p.description as projectDescription, p.location as projectLocation, p.deadline as projectDeadline,
                   u_cust.name as customerName, u_cust.profile_image as customerImage,
                   u_drv.name as pilotName, u_drv.profile_image as pilotImage
            FROM contracts c
            JOIN projects p ON c.project_id = p.id
            JOIN users u_cust ON c.customer_id = u_cust.id
            JOIN users u_drv ON c.driver_id = u_drv.id
            WHERE c.id = ? AND (c.customer_id = ? OR c.driver_id = ?)
        `;
        const [contracts] = await pool.query(query, [req.params.id, req.user.id, req.user.id]);
        if (contracts.length === 0) return res.status(404).json({ message: 'Szerződés nem található, vagy nincs jogosultságod.' });
        
        res.json({ success: true, contract: contracts[0] });
    } catch (error) {
        res.status(500).json({ message: 'Hiba a lekérés során: ' + error.message });
    }
});

// Szerződés lezárása
router.put('/:id/complete', authMiddleware, async (req, res) => {
    if (req.user.role !== 'customer') return res.status(403).json({ message: 'Csak megbízó zárhatja le a munkát!' });
    
    const contractId = req.params.id;
    const { rating, comment } = req.body;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [contracts] = await connection.query('SELECT * FROM contracts WHERE id = ?', [contractId]);
        if (contracts.length === 0) throw new Error('Szerződés nem található!');
        const contract = contracts[0];

        if (contract.customer_id !== req.user.id) throw new Error('Nincs jogosultságod ehhez a szerződéshez!');
        if (contract.status === 'completed') throw new Error('A munka már le van zárva!');

        // Státusz frissítése
        await connection.query('UPDATE contracts SET status = "completed", payment_status = "paid", completed_at = NOW() WHERE id = ?', [contractId]);

        // Értékelés mentése
        if (rating) {
            await connection.query('INSERT INTO reviews (contract_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)', 
                [contractId, req.user.id, contract.driver_id, rating, comment || null]);
            
            // Statisztikák frissítése
            const [pilotReviews] = await connection.query('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE reviewee_id = ?', [contract.driver_id]);
            await connection.query('UPDATE users SET rating = ?, reviews_count = ?, completed_jobs = completed_jobs + 1 WHERE id = ?', 
                [pilotReviews[0].avg_rating || rating, pilotReviews[0].count || 1, contract.driver_id]);
        }

        await connection.commit();
        res.json({ success: true, message: 'Munka sikeresen lezárva és kifizetve!' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
