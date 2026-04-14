const request = require('supertest');
const app = require('../../server');

describe('Üzenetek (Messages) Útvonalak - Biztonság', () => {
  
  it('GET /api/messages/chats - Meg kell tagadnia a hozzáférést token nélkül (401)', async () => {
    const res = await request(app).get('/api/messages/chats');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/messages - Nem engedheti az üzenetküldést bejelentkezés nélkül', async () => {
    const res = await request(app).post('/api/messages').send({ receiverId: 1, message: 'Hello' });
    expect(res.statusCode).toBe(401);
  });
});