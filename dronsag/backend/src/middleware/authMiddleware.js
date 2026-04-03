// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Nincs jogosultságod ehhez a művelethez! Hiányzó token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Ellenőrizzük a tokent és dekódoljuk a payload-ot
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titkos_kulcs');
        
        // Hozzáadjuk a felhasználó adatait a request objektumhoz
        req.user = decoded; 
        next(); // Továbbengedjük a kérést a következő middleware-re/route handlerre
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'A munkameneted lejárt. Kérlek jelentkezz be újra!' });
        }
        return res.status(401).json({ message: 'Érvénytelen vagy hiányzó token!' });
    }
};

module.exports = authMiddleware;