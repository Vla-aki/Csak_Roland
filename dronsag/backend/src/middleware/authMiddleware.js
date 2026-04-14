// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Nincs jogosultságod ehhez a művelethez! Hiányzó token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Token ellenőrzés
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titkos_kulcs');
        
        // User beállítása
        req.user = decoded; 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'A munkameneted lejárt. Kérlek jelentkezz be újra!' });
        }
        return res.status(401).json({ message: 'Érvénytelen vagy hiányzó token!' });
    }
};

module.exports = authMiddleware;
