const request = require('supertest');
const express = require('express');

// 1. ADATBÁZIS MOCKOLÁSA
const mockConnection = {
    query: jest.fn(),
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn()
};

const mockPool = {
    query: jest.fn(),
    getConnection: jest.fn().mockResolvedValue(mockConnection)
};

jest.mock('mysql2/promise', () => ({
    createPool: jest.fn().mockReturnValue(mockPool)
}));

// 2. AUTH MIDDLEWARE MOCKOLÁSA
let mockUser = { id: 1, role: 'customer' };
jest.mock('../../src/middleware/authMiddleware', () => {
    return (req, res, next) => {
        if (!mockUser) return res.status(401).json({ message: 'Hiányzó token' });
        req.user = mockUser;
        next();
    };
});

// 3. EXPRESS APP FELÉPÍTÉSE
const projectsRouter = require('../../src/routes/projects');
const app = express();
app.use(express.json());
app.use('/api/projects', projectsRouter);

describe('Projektek Útvonalak (Nyilvános API)', () => {
  
    beforeEach(() => {
        jest.clearAllMocks();
        mockUser = { id: 1, role: 'customer' };
    });

    describe('POST /api/projects (Új projekt)', () => {
        it('403-as hibát kell adnia, ha nem megbízó próbál projektet feladni', async () => {
            mockUser = { id: 2, role: 'driver' };
            const res = await request(app).post('/api/projects').send({});
            expect(res.statusCode).toBe(403);
        });

        it('400-as hibát kell adnia, ha hiányoznak a kötelező mezők', async () => {
            const res = await request(app).post('/api/projects').send({ title: 'Csak Cím' });
            expect(res.statusCode).toBe(400);
        });

        it('Sikeresen létre kell hoznia a projektet és a készségeket (Commit)', async () => {
            mockConnection.query.mockResolvedValueOnce([{ insertId: 99 }]); // Projekt insert
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 2 }]); // Készségek insert

            const res = await request(app).post('/api/projects').send({
                title: 'Esküvő fotózás', description: 'Szép felvételek', category: 'photography',
                location: 'Budapest', budget_type: 'fix', budget: 100000, deadline: '2026-10-10',
                skills: ['drón', 'utómunka']
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.projectId).toBe(99);
            expect(mockConnection.commit).toHaveBeenCalled();
        });
    });

    describe('GET /api/projects (Nyilvános listák)', () => {
        it('Sikeresen vissza kell adnia az aktív projekteket', async () => {
            const fakeProjects = [{ id: 1, title: 'Projekt 1', status: 'active', customer_name: 'Teszt' }];
            mockPool.query.mockResolvedValueOnce([fakeProjects]); // Projektek
            mockPool.query.mockResolvedValueOnce([[{ skill: 'drón' }]]); // Skills

            const res = await request(app).get('/api/projects');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.projects[0].skills_required).toEqual(['drón']);
        });

        it('Sikeresen vissza kell adnia a rendszer statisztikákat', async () => {
            mockPool.query
                .mockResolvedValueOnce([[{ count: 10 }]]) // total_projects
                .mockResolvedValueOnce([[{ count: 5 }]])  // total_pilots
                .mockResolvedValueOnce([[{ count: 3 }]])  // total_completed
                .mockResolvedValueOnce([[{ sum: 50000 }]]); // total_earnings

            const res = await request(app).get('/api/projects/system-stats');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.stats.jobs).toBe(10);
            expect(res.body.stats.earnings).toBe(50000);
        });
    });

    describe('GET /api/projects/my-projects (Saját projektek)', () => {
        it('Sikeresen le kell kérnie a bejelentkezett megbízó projektjeit', async () => {
            mockPool.query.mockResolvedValueOnce([[{ id: 1, title: 'Saját' }]]);
            const res = await request(app).get('/api/projects/my-projects');
            expect(res.statusCode).toBe(200);
        });
    });

    describe('Módosítás és Törlés', () => {
        it('Sikeresen törölnie kell a saját projektjét', async () => {
            mockPool.query.mockResolvedValueOnce([[{ user_id: 1 }]]); // Tulajdonos ellenőrzés
            mockPool.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Törlés

            const res = await request(app).delete('/api/projects/1');
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/törölve/i);
        });

        it('403-as hibát kell adnia, ha más projektjét próbálja módosítani', async () => {
            mockPool.query.mockResolvedValueOnce([[{ user_id: 2 }]]); // A projekt a 2-es useré!
            const res = await request(app).put('/api/projects/1').send({ title: 'Hack' });
            expect(res.statusCode).toBe(403);
        });
    });

    describe('Ajánlattétel (Bids)', () => {
        it('Sikeresen fogadnia kell a pilóta ajánlatát', async () => {
            mockUser = { id: 5, role: 'driver' };
            mockPool.query.mockResolvedValueOnce([[]]); // Még nem adott le ajánlatot
            mockPool.query.mockResolvedValueOnce([{ insertId: 1 }]); // Ajánlat mentése
            mockPool.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Projekt proposal_count növelése

            const res = await request(app).post('/api/projects/1/bids').send({ amount: 10000 });
            expect(res.statusCode).toBe(201);
        });

        it('400-as hibát kell adnia, ha a pilóta már tett ajánlatot a projektre', async () => {
            mockUser = { id: 5, role: 'driver' };
            mockPool.query.mockResolvedValueOnce([[{ id: 99 }]]); // Már van ilyen ajánlat az adatbázisban

            const res = await request(app).post('/api/projects/1/bids').send({ amount: 10000 });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/Már tettél ajánlatot/i);
        });
    });
});