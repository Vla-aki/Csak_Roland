const request = require('supertest');
const express = require('express');

// 1. ADATBÁZIS MOCKOLÁSA (Szimuláljuk a MySQL-t és a tranzakciókat)
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

// 2. AUTH MIDDLEWARE MOCKOLÁSA (Dinamikus szerepkörökkel)
let mockUser = { id: 1, role: 'customer' }; // Alapból megbízóként vagyunk "belépve"
jest.mock('../../src/middleware/authMiddleware', () => {
    return (req, res, next) => {
        if (!mockUser) return res.status(401).json({ message: 'Hiányzó token' });
        req.user = mockUser;
        next();
    };
});

// 3. EXPRESS APP FELÉPÍTÉSE (Csak ezt a route-ot teszteljük izoláltan)
const contractsRouter = require('../../src/routes/contracts');
const app = express();
app.use(express.json());
app.use('/api/contracts', contractsRouter);

describe('Szerződések (Contracts) Útvonalak - Részletes Tesztek', () => {
    
    // Minden teszt előtt lenullázzuk a szimulátorokat
    beforeEach(() => {
        jest.clearAllMocks();
        mockUser = { id: 1, role: 'customer' }; 
    });

    describe('Biztonság és Jogosultságok', () => {
        it('Meg kell tagadnia a hozzáférést token nélkül (401)', async () => {
            mockUser = null; // Szimuláljuk, hogy nincs token
            const res = await request(app).get('/api/contracts');
            expect(res.statusCode).toBe(401);
        });

        it('403-as hibát kell adnia, ha pilóta próbál szerződést létrehozni', async () => {
            mockUser = { id: 3, role: 'driver' }; // Pilóta fiók szimulálása
            const res = await request(app).post('/api/contracts').send({ bidId: 10 });
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toMatch(/Csak megbízók/i);
        });

        it('403-as hibát kell adnia, ha pilóta próbál munkát lezárni', async () => {
            mockUser = { id: 3, role: 'driver' };
            const res = await request(app).put('/api/contracts/1/complete');
            expect(res.statusCode).toBe(403);
        });
    });

    describe('GET /api/contracts', () => {
        it('Sikeresen le kell kérnie a saját szerződéseket', async () => {
            const fakeContracts = [{ id: 1, projectTitle: 'Esküvői videó' }, { id: 2, projectTitle: 'Ház fotózás' }];
            mockPool.query.mockResolvedValueOnce([fakeContracts]); // Adatbázis válaszának meghamisítása

            const res = await request(app).get('/api/contracts');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.contracts).toEqual(fakeContracts);
        });
    });

    describe('GET /api/contracts/:id', () => {
        it('Sikeresen vissza kell adnia egy létező szerződés részleteit', async () => {
            const fakeContract = { id: 5, amount: 50000, status: 'active' };
            mockPool.query.mockResolvedValueOnce([[fakeContract]]);

            const res = await request(app).get('/api/contracts/5');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.contract).toEqual(fakeContract);
        });

        it('404-es hibát kell dobnia, ha a szerződés nem létezik vagy nem a miénk', async () => {
            mockPool.query.mockResolvedValueOnce([[]]); // Üres válasz a DB-ből

            const res = await request(app).get('/api/contracts/999');
            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /api/contracts (Szerződéskötés)', () => {
        it('Sikeresen létre kell hoznia egy szerződést és tranzakciót (Commit)', async () => {
            // 1. Ajánlat (bid) lekérése
            mockConnection.query.mockResolvedValueOnce([[{ id: 10, project_id: 2, driver_id: 3, amount: 15000 }]]);
            // 2. Projekt lekérése (user_id egyezik a mockUser id-val!)
            mockConnection.query.mockResolvedValueOnce([[{ id: 2, user_id: 1, title: 'Drónozás' }]]);
            // 3. Szerződés beszúrása
            mockConnection.query.mockResolvedValueOnce([{ insertId: 42 }]);
            // 4, 5, 6, 7... Státuszok frissítése és értesítések
            mockConnection.query.mockResolvedValue([[]]); 

            const res = await request(app).post('/api/contracts').send({ bidId: 10 });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.contractId).toBe(42);
            expect(mockConnection.commit).toHaveBeenCalled(); // Ellenőrizzük, hogy mentette-e az adatbázist!
        });

        it('500-as hibát (Rollback) kell adnia, ha a projekt nem a megbízóhoz tartozik', async () => {
            mockConnection.query.mockResolvedValueOnce([[{ id: 10, project_id: 2, driver_id: 3, amount: 15000 }]]);
            // Másik user (99) a projekt tulajdonosa!
            mockConnection.query.mockResolvedValueOnce([[{ id: 2, user_id: 99, title: 'Drónozás' }]]);

            const res = await request(app).post('/api/contracts').send({ bidId: 10 });
            
            expect(res.statusCode).toBe(500);
            expect(mockConnection.rollback).toHaveBeenCalled(); // Ellenőrizzük, hogy visszavonta-e a folyamatot!
        });
    });

    describe('PUT /api/contracts/:id/complete (Munka lezárása)', () => {
        it('Sikeresen le kell zárnia a projektet, értékelnie és fizetnie', async () => {
            mockConnection.query.mockResolvedValueOnce([[{ id: 1, customer_id: 1, driver_id: 3, status: 'active' }]]); // Szerződés OK
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Szerződés update OK
            mockConnection.query.mockResolvedValueOnce([{ insertId: 1 }]); // Értékelés beszúrása OK
            mockConnection.query.mockResolvedValueOnce([[{ avg_rating: 4.8, count: 5 }]]); // Átlag lekérése
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Pilóta update OK

            const res = await request(app).put('/api/contracts/1/complete').send({ rating: 5, comment: 'Kiváló pilóta!' });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/sikeresen lezárva/i);
            expect(mockConnection.commit).toHaveBeenCalled();
        });

        it('500-as hibát kell adnia, ha a munka már korábban le lett zárva', async () => {
            mockConnection.query.mockResolvedValueOnce([[{ id: 1, customer_id: 1, driver_id: 3, status: 'completed' }]]); // Már lezárva!

            const res = await request(app).put('/api/contracts/1/complete').send({ rating: 5 });
            
            expect(res.statusCode).toBe(500);
            expect(mockConnection.rollback).toHaveBeenCalled(); // Nem menthet az adatbázisba!
        });
    });
});