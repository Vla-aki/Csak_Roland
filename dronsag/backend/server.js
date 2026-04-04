// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects'); // ÚJ SOR: Importáljuk a projektek végpontjait
const bidRoutes = require('./src/routes/bids');
const contractRoutes = require('./src/routes/contracts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // ÚJ SOR: Bekötjük az URL-t a projektekhez
app.use('/api/bids', bidRoutes);
app.use('/api/contracts', contractRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'HoverHire API is working!',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
