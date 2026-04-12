// backend/src/routes/projects.js
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

// Projekt létrehozása
router.post('/', authMiddleware, async (req, res) => {
    console.log('📝 Projekt létrehozási kérés:', req.body);
    const { id: customerId, role } = req.user; // Az authMiddleware adja hozzá az ID-t és a szerepkört

    // Jogosultság ellenőrzése
    if (role !== 'customer') {
        return res.status(403).json({ message: 'Csak megbízók hozhatnak létre projektet!' });
    }

    const { title, description, category, location, budget_type, budget, deadline, skills } = req.body;

    // Validáció
    if (!title || !description || !category || !location || !budget_type || !budget || !deadline) {
        return res.status(400).json({ message: 'Hiányzó kötelező projekt adatok!' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Projekt beszúrása
        const insertProjectQuery = `
            INSERT INTO projects (user_id, title, description, category, location, budget_type, budget, deadline)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [projectResult] = await connection.query(insertProjectQuery, [
            customerId, title, description, category, location, budget_type, budget, deadline
        ]);

        const projectId = projectResult.insertId;

        // Szakterületek mentése
        if (skills && Array.isArray(skills) && skills.length > 0) {
            const skillValues = skills.map(skill => [projectId, skill]);
            await connection.query('INSERT INTO project_skills (project_id, skill) VALUES ?', [skillValues]);
        }

        await connection.commit();
        console.log('✅ Projekt sikeresen létrehozva, ID:', projectId);

        res.status(201).json({
            success: true,
            message: 'Projekt sikeresen létrehozva!',
            projectId: projectId
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('❌ Projekt létrehozási hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a projekt létrehozásakor: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Aktív projektek
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.title, p.description, p.category, p.location, p.budget_type, p.budget, p.deadline, 
                   p.proposals_count, p.created_at, p.user_id as customer_id, u.name as customer_name, u.profile_image as customer_image
            FROM projects p
            JOIN users u ON p.user_id = u.id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
        `;
        const [projects] = await pool.query(query);

        // Szakterületek lekérése
        for (let project of projects) {
            const [skills] = await pool.query('SELECT skill FROM project_skills WHERE project_id = ?', [project.id]);
            project.skills_required = skills.map(s => s.skill);
            // Profilkép pótlása
            if (!project.customer_image) {
                project.customer_image = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.customer_name)}&background=2563eb&color=fff`;
            }
        }

        res.json({ success: true, projects });
    } catch (error) {
        console.error('❌ Projektek lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a projektek lekérésekor: ' + error.message });
    }
});

// Saját projektek
router.get('/my-projects', authMiddleware, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Csak megbízók kérhetik le a saját projektjeiket!' });
    }
    try {
        const query = `
            SELECT p.*,
                   (SELECT COUNT(*) FROM bids b WHERE b.project_id = p.id) as proposals_count
            FROM projects p
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `;
        const [projects] = await pool.query(query, [req.user.id]);
        res.json({ success: true, projects });
    } catch (error) {
        console.error('❌ Saját projektek lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

// Projekt szerkesztése (Megbízónak)
router.put('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Csak megbízók szerkeszthetnek projektet!' });
    }
    try {
        const projectId = req.params.id;
        const { title, category, description, location, budget_type, budget, deadline } = req.body;

        const [projects] = await pool.query('SELECT user_id FROM projects WHERE id = ?', [projectId]);
        if (projects.length === 0) return res.status(404).json({ message: 'Projekt nem található!' });
        if (projects[0].user_id !== req.user.id) return res.status(403).json({ message: 'Nincs jogosultságod ehhez a projekthez!' });

        await pool.query(
            'UPDATE projects SET title=?, category=?, description=?, location=?, budget_type=?, budget=?, deadline=? WHERE id=?',
            [title, category, description, location, budget_type, budget, deadline, projectId]
        );

        res.json({ success: true, message: 'Projekt sikeresen frissítve!', project: { ...req.body, id: projectId } });
    } catch (error) {
        console.error('❌ Projekt szerkesztési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a projekt szerkesztésekor.' });
    }
});

// Projekt törlése (Megbízónak)
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Csak megbízók törölhetnek projektet!' });
    }
    try {
        const [projects] = await pool.query('SELECT user_id FROM projects WHERE id = ?', [req.params.id]);
        if (projects.length === 0) return res.status(404).json({ message: 'Projekt nem található!' });
        if (projects[0].user_id !== req.user.id) return res.status(403).json({ message: 'Nincs jogosultságod ehhez a projekthez!' });

        await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Projekt sikeresen törölve!' });
    } catch (error) {
        console.error('❌ Projekt törlési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a projekt törlésekor.' });
    }
});

// Rendszer statisztikák
router.get('/system-stats', async (req, res) => {
    try {
        const [[total_projects]] = await pool.query("SELECT COUNT(*) as count FROM projects");
        const [[total_pilots]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'driver'");
        const [[total_completed]] = await pool.query("SELECT COUNT(*) as count FROM contracts WHERE status = 'completed'");
        const [[total_earnings]] = await pool.query("SELECT SUM(amount) as sum FROM contracts WHERE status = 'completed'");

        res.json({
            success: true,
            stats: {
                jobs: total_projects.count || 0,
                freelancers: total_pilots.count || 0,
                completed: total_completed.count || 0,
                earnings: total_earnings.sum || 0
            }
        });
    } catch (error) {
        console.error('❌ Statisztika lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a statisztikák lekérésekor.' });
    }
});

// Projekt részletei
router.get('/:id', async (req, res) => {
    try {
        const [projects] = await pool.query(`
            SELECT p.*, u.name as customer_name, u.profile_image as customer_image
            FROM projects p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (projects.length === 0) {
            return res.status(404).json({ message: 'Projekt nem található' });
        }
        
        const project = projects[0];
        const [skills] = await pool.query('SELECT skill FROM project_skills WHERE project_id = ?', [project.id]);
        project.skills_required = skills.map(s => s.skill);

        res.json({ success: true, project });
    } catch (error) {
        console.error('❌ Projekt lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

// Ajánlattétel
router.post('/:id/bids', authMiddleware, async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Csak pilóták tehetnek ajánlatot!' });
    }
    
    const { amount, message, estimated_days } = req.body;
    const projectId = req.params.id;
    const driverId = req.user.id;

    try {
        // Duplikáció ellenőrzése
        const [existing] = await pool.query('SELECT id FROM bids WHERE project_id = ? AND driver_id = ?', [projectId, driverId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Már tettél ajánlatot erre a projektre!' });
        }

        await pool.query(
            'INSERT INTO bids (project_id, driver_id, amount, message, estimated_days) VALUES (?, ?, ?, ?, ?)',
            [projectId, driverId, amount, message || null, estimated_days || null]
        );

        // Ajánlatszám frissítése
        await pool.query('UPDATE projects SET proposals_count = proposals_count + 1 WHERE id = ?', [projectId]);

        res.status(201).json({ success: true, message: 'Ajánlat sikeresen elküldve!' });
    } catch (error) {
        console.error('❌ Ajánlattételi hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

// Projekt ajánlatai
router.get('/:id/bids', authMiddleware, async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Jogosultság ellenőrzése
        const [projects] = await pool.query('SELECT user_id FROM projects WHERE id = ?', [projectId]);
        if (projects.length === 0) return res.status(404).json({ message: 'Projekt nem található' });
        if (projects[0].user_id !== req.user.id) return res.status(403).json({ message: 'Nincs jogosultságod ehhez a projekthez!' });

        const query = `
            SELECT b.id, b.amount, b.message, b.estimated_days, b.status, b.created_at as submittedDate,
                   u.id as pilotId, u.name as pilotName, u.profile_image as pilotImage, u.rating as pilotRating, u.reviews_count as pilotReviews, u.verified as pilotVerified
            FROM bids b
            JOIN users u ON b.driver_id = u.id
            WHERE b.project_id = ?
            ORDER BY b.created_at DESC
        `;
        const [bids] = await pool.query(query, [projectId]);

        for (let bid of bids) {
            const [skills] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [bid.pilotId]);
            bid.skills = skills.map(s => s.skill);
            if (!bid.pilotImage) {
                bid.pilotImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(bid.pilotName)}&background=2563eb&color=fff`;
            }
        }

        res.json({ success: true, bids });
    } catch (error) {
        console.error('❌ Ajánlatok lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

module.exports = router;