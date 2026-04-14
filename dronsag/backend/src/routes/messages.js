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

// Partnerek lekérése
router.get('/chats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const query = `
            SELECT 
                u.id as otherUserId, 
                u.name, 
                u.role, 
                u.profile_image as image, 
                u.verified,
                (SELECT message FROM messages m2 WHERE (m2.sender_id = ? AND m2.receiver_id = u.id) OR (m2.sender_id = u.id AND m2.receiver_id = ?) ORDER BY created_at DESC LIMIT 1) as lastMessage,
                (SELECT created_at FROM messages m2 WHERE (m2.sender_id = ? AND m2.receiver_id = u.id) OR (m2.sender_id = u.id AND m2.receiver_id = ?) ORDER BY created_at DESC LIMIT 1) as lastMessageTime,
                (SELECT COUNT(*) FROM messages m3 WHERE m3.sender_id = u.id AND m3.receiver_id = ? AND m3.is_read = 0) as unread
            FROM users u
            WHERE u.id IN (
                SELECT sender_id FROM messages WHERE receiver_id = ?
                UNION
                SELECT receiver_id FROM messages WHERE sender_id = ?
            )
            ORDER BY lastMessageTime DESC
        `;
        
        const [chats] = await pool.query(query, [userId, userId, userId, userId, userId, userId, userId]);
        
        const formattedChats = chats.map(c => ({
            id: c.otherUserId,
            name: c.name,
            role: c.role === 'customer' ? 'Megbízó' : 'Pilóta',
            image: c.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=2563eb&color=fff`,
            lastMessage: c.lastMessage,
            lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'}) : '',
            unread: c.unread,
            online: false,
            verified: c.verified === 1,
            project: ''
        }));

        res.json({ success: true, chats: formattedChats });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba a chatek lekérésekor.' });
    }
});

// Üzenetek lekérése
router.get('/:otherUserId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.otherUserId;
        await pool.query('UPDATE messages SET is_read = 1, read_at = NOW() WHERE sender_id = ? AND receiver_id = ? AND is_read = 0', [otherUserId, userId]);
        const [messages] = await pool.query(
            'SELECT id, sender_id, message as text, created_at as time, is_read FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC',
            [userId, otherUserId, otherUserId, userId]
        );
        const formattedMessages = messages.map(m => ({
            id: m.id, senderId: m.sender_id === userId ? 'me' : m.sender_id, text: m.text,
            time: new Date(m.time).toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'}), status: m.is_read ? 'read' : 'delivered'
        }));
        res.json({ success: true, messages: formattedMessages });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba az üzenetek lekérésekor.' });
    }
});

// Üzenet küldése
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const [result] = await pool.query('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)', [req.user.id, receiverId, message]);
        
        // Értesítés a fogadónak
        const [unreadMsgs] = await pool.query('SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND receiver_id = ? AND is_read = 0', [req.user.id, receiverId]);
        const unreadCount = unreadMsgs[0].count;

        const [sender] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        const senderName = sender[0]?.name || 'Egy felhasználó';

        const notifMessage = unreadCount > 1 
            ? `${senderName} küldött ${unreadCount} új üzenetet!` 
            : `${senderName} üzent neked!`;

        // Előző olvasatlan értesítések törlése ettől a feladótól, hogy ne spameljük tele
        await pool.query(
            "DELETE FROM notifications WHERE user_id = ? AND type = 'message' AND is_read = 0 AND message LIKE ?",
            [receiverId, `${senderName}%`]
        );

        await pool.query(
            'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
            [receiverId, 'message', 'Új üzenet', notifMessage, '/messages']
        );

        res.status(201).json({ success: true, message: {
            id: result.insertId, senderId: 'me', text: message,
            time: new Date().toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'}), status: 'delivered'
        }});
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba az üzenet küldésekor.' });
    }
});

// Szerződés üzenetei
router.get('/contract/:contractId', authMiddleware, async (req, res) => {
    try {
        const [messages] = await pool.query(
            'SELECT id, sender_id, message as text, created_at as time FROM messages WHERE contract_id = ? ORDER BY created_at ASC',
            [req.params.contractId]
        );
        const formattedMessages = messages.map(m => ({
            id: m.id, senderId: m.sender_id === req.user.id ? 'me' : m.sender_id, text: m.text,
            time: new Date(m.time).toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'})
        }));
        res.json({ success: true, messages: formattedMessages });
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba az üzenetek lekérésekor.' });
    }
});

// Szerződés üzenetküldés
router.post('/contract/:contractId', authMiddleware, async (req, res) => {
    try {
        // Jogosultság ellenőrzés
        const [contracts] = await pool.query('SELECT customer_id, driver_id FROM contracts WHERE id = ? AND (customer_id = ? OR driver_id = ?)', [req.params.contractId, req.user.id, req.user.id]);
        if (contracts.length === 0) return res.status(403).json({ message: 'Nincs jogosultságod ehhez a beszélgetéshez!' });
        
        const contract = contracts[0];
        const receiverId = req.user.id === contract.customer_id ? contract.driver_id : contract.customer_id;

        const [result] = await pool.query('INSERT INTO messages (sender_id, receiver_id, contract_id, message) VALUES (?, ?, ?, ?)', [req.user.id, receiverId, req.params.contractId, req.body.message]);
        
        // Értesítés a fogadónak a szerződéses chatből is (csoportosítva)
        const [unreadMsgs] = await pool.query('SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND receiver_id = ? AND is_read = 0', [req.user.id, receiverId]);
        const unreadCount = unreadMsgs[0].count;

        const [sender] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        const senderName = sender[0]?.name || 'Egy felhasználó';

        const notifMessage = unreadCount > 1 
            ? `${senderName} küldött ${unreadCount} új üzenetet a szerződésnél!` 
            : `${senderName} üzent a szerződésnél!`;

        await pool.query("DELETE FROM notifications WHERE user_id = ? AND type = 'message' AND is_read = 0 AND message LIKE ?", [receiverId, `${senderName}%`]);

        await pool.query('INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)', [receiverId, 'message', 'Szerződés üzenet', notifMessage, `/contract/${req.params.contractId}`]);

        res.status(201).json({ success: true, message: {
            id: result.insertId, senderId: 'me', text: req.body.message,
            time: new Date().toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'})
        }});
    } catch (error) {
        res.status(500).json({ message: 'Szerver hiba az üzenet küldésekor.' });
    }
});

module.exports = router;
