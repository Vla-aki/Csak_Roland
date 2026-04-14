const request = require('supertest');
const app = require('../../server');

describe('Adminisztrációs Útvonalak - Biztonság', () => {
  
  it('GET /api/admin/stats - Nem engedheti be az illetékteleneket (401)', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/admin/users - Nem adhatja ki a felhasználókat hitelesítés nélkül', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.statusCode).toBe(401);
  });
});