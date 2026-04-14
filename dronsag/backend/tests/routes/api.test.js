const request = require('supertest');
const app = require('../../server'); // Itt már kettőt kell visszaugrani a mappák miatt!

describe('API Alap Tesztek', () => {
  it('GET /api/test - Vissza kell adnia, hogy működik az API', async () => {
    const res = await request(app).get('/api/test');
    
    // Elvárjuk, hogy a státuszkód 200 (OK) legyen
    expect(res.statusCode).toBe(200);
    
    // Elvárjuk, hogy a válasz tartalmazza a megfelelő üzenetet
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('HoverHire API is working!');
  });
});