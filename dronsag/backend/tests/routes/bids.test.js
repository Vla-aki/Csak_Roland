const request = require('supertest');
const express = require('express');

const mockPool = {
    query: jest.fn()
};

jest.mock('mysql2/promise', () => ({
    createPool: jest.fn().mockReturnValue(mockPool)
}));

let mockUser = { id: 1, role: 'driver' };
jest.mock('../../src/middleware/authMiddleware', () => {
    return (req, res, next) => {
        if (!mockUser) return res.status(401).json({ message: 'Hiányzó token' });
        req.user = mockUser;
        next();
    };
});

const bidsRouter = require('../../src/routes/bids');
const app = express();
app.use(express.json());
app.use('/api/bids', bidsRouter);

describe('Ajánlatok (Bids) Útvonalak - Részletes Tesztek', () => {
  
    beforeEach(() => {
        jest.clearAllMocks();
        mockUser = { id: 1, role: 'driver' };
    });

    describe('GET /api/bids/my-bids', () => {
        it('403-as hibát kell adnia, ha nem pilóta próbálja lekérni', async () => {
            mockUser = { id: 2, role: 'customer' };
            const res = await request(app).get('/api/bids/my-bids');
            expect(res.statusCode).toBe(403);
        });

        it('Sikeresen le kell kérnie a pilóta saját ajánlatait', async () => {
            mockPool.query.mockResolvedValueOnce([[{ id: 1, bidAmount: 10000 }]]);
            const res = await request(app).get('/api/bids/my-bids');
            expect(res.statusCode).toBe(200);
        });
    });

    describe('PUT /api/bids/:id/status (Állapot módosítása)', () => {
        it('Sikeresen frissítenie kell az állapotot és elutasítás esetén értesítést küldeni', async () => {
            mockPool.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Update státusz
            mockPool.query.mockResolvedValueOnce([[{ driver_id: 1, title: 'Projekt' }]]); // Infó lekérése az értesítéshez
            mockPool.query.mockResolvedValueOnce([{ insertId: 5 }]); // Értesítés beszúrása

            const res = await request(app).put('/api/bids/1/status').send({ status: 'rejected' });
            expect(res.statusCode).toBe(200);
        });
    });

    describe('DELETE /api/bids/:id', () => {
        it('404-es hibát kell adnia, ha nem létezik az ajánlat', async () => {
            mockPool.query.mockResolvedValueOnce([[]]); // Nem találta meg az ajánlatot
            const res = await request(app).delete('/api/bids/999');
            expect(res.statusCode).toBe(404);
        });
    });
});