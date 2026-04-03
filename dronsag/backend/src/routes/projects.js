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

// Új projekt létrehozása
router.post('/', authMiddleware, async (req, res) => {
    console.log('📝 Projekt létrehozási kérés:', req.body);
    const { id: customerId, role } = req.user; // Az authMiddleware adja hozzá az ID-t és a szerepkört

    // Csak "customer" szerepkörű felhasználó hozhat létre projektet
    if (role !== 'customer') {
        return res.status(403).json({ message: 'Csak megbízók hozhatnak létre projektet!' });
    }

    const { title, description, category, location, budget_type, budget, deadline, skills } = req.body;

    // Alapvető validáció
    if (!title || !description || !category || !location || !budget_type || !budget || !deadline) {
        return res.status(400).json({ message: 'Hiányzó kötelező projekt adatok!' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction(); // Tranzakció indítása

        // Projekt beszúrása a projects táblába
        const insertProjectQuery = `
            INSERT INTO projects (user_id, title, description, category, location, budget_type, budget, deadline)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [projectResult] = await connection.query(insertProjectQuery, [
            customerId, title, description, category, location, budget_type, budget, deadline
        ]);

        const projectId = projectResult.insertId;

        // Szakterületek beszúrása a project_skills táblába
        if (skills && Array.isArray(skills) && skills.length > 0) {
            const skillValues = skills.map(skill => [projectId, skill]);
            await connection.query('INSERT INTO project_skills (project_id, skill) VALUES ?', [skillValues]);
        }

        await connection.commit(); // Tranzakció véglegesítése
        console.log('✅ Projekt sikeresen létrehozva, ID:', projectId);

        res.status(201).json({
            success: true,
            message: 'Projekt sikeresen létrehozva!',
            projectId: projectId
        });

    } catch (error) {
        if (connection) await connection.rollback(); // Hiba esetén visszagörgetés
        console.error('❌ Projekt létrehozási hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a projekt létrehozásakor: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Aktív projektek lekérdezése (ez fog megjelenni a "Munka keresése" oldalon)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.title, p.description, p.category, p.location, p.budget_type, p.budget, p.deadline, 
                   p.proposals_count, p.created_at, u.name as customer_name, u.profile_image as customer_image
            FROM projects p
            JOIN users u ON p.user_id = u.id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
        `;
        const [projects] = await pool.query(query);

        // Szakterületek lekérése minden projekthez
        for (let project of projects) {
            const [skills] = await pool.query('SELECT skill FROM project_skills WHERE project_id = ?', [project.id]);
            project.skills_required = skills.map(s => s.skill);
            // Alapértelmezett profilkép, ha nincs
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

// Saját projektek lekérése (Megbízóknak)
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

// Egy adott projekt részleteinek lekérése (későbbiekben szükség lesz rá)
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

// Ajánlattétel egy projektre (Pilótáknak)
router.post('/:id/bids', authMiddleware, async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Csak pilóták tehetnek ajánlatot!' });
    }
    
    const { amount, message, estimated_days } = req.body;
    const projectId = req.params.id;
    const driverId = req.user.id;

    try {
        // Ellenőrizzük, hogy tett-e már ajánlatot erre a projektre
        const [existing] = await pool.query('SELECT id FROM bids WHERE project_id = ? AND driver_id = ?', [projectId, driverId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Már tettél ajánlatot erre a projektre!' });
        }

        await pool.query(
            'INSERT INTO bids (project_id, driver_id, amount, message, estimated_days) VALUES (?, ?, ?, ?, ?)',
            [projectId, driverId, amount, message || null, estimated_days || null]
        );

        // Növeljük az ajánlatok számát a projektnél, hogy a megbízó lássa, hogy új ajánlat érkezett
        await pool.query('UPDATE projects SET proposals_count = proposals_count + 1 WHERE id = ?', [projectId]);

        res.status(201).json({ success: true, message: 'Ajánlat sikeresen elküldve!' });
    } catch (error) {
        console.error('❌ Ajánlattételi hiba:', error);
        res.status(500).json({ message: 'Szerver hiba: ' + error.message });
    }
});

// Egy projekt ajánlatainak lekérése (Megbízónak)
router.get('/:id/bids', authMiddleware, async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Ellenőrizzük, hogy a felhasználó a projekt gazdája-e
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