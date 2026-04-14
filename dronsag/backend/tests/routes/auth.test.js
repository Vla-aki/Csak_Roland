const request = require('supertest');
const app = require('../../server');

describe('Auth Útvonalak (Bejelentkezés / Regisztráció)', () => {
  
  describe('POST /api/auth/login', () => {
    it('Vissza kell utasítania a bejelentkezést nem létező fiókkal (401-es kód)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nemletezo.teszt@email.hu',
          password: 'rosszjelszo123'
        });
        
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Hibás email vagy jelszó!');
    });
  });
  
  describe('POST /api/auth/forgot-password', () => {
    it('404-es hibát kell adnia, ha az email nem létezik a rendszerben', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'sosemvolt.email@pelda.hu'
        });
        
      expect(res.statusCode).toBe(404);
    });
  });

});