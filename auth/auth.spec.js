const request = require('supertest');

const server = require('../api/server');
const db = require('../database/dbConfig');

describe('test server enpoints for register and login', () => {
  beforeEach(async () => {
    await db('users').truncate();
    await request(server).post('/api/auth/register').send({
      username: 'markusa',
      password: 'secretpassword',
    });
  });

  describe('POST /register', () => {
    it('should post user to /register', async () => {
      await request(server).post('/api/auth/register').send({
        username: 'bogdanov',
        password: 'timbogdanov',
      });

      const users = await db('users');
      expect(users).toHaveLength(2);
    });

    it('should return a 200 OK upon POST /register', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'timbogdanov5',
          password: 'timbogdanov',
        });

      expect(res.status).toBe(201);
    });
  });

  describe('POST /login', () => {
    it('should return a 200 OK on POST /login', async () => {
      const res = await request(server).post('/api/auth/login').send({
        username: 'markusa',
        password: 'secretpassword',
      });

      expect(res.status).toBe(200);
    });

    it('should not return a 404 on POST /login with correct creds', async () => {
      const res = await request(server).post('/api/auth/login').send({
        username: 'markusa',
        password: 'secretpassword',
      });

      expect(res.status).not.toBe(404);
    });

    it('should  return a 404 on POST /login with wrong creds', async () => {
      const res = await request(server).post('/api/auth/login').send({
        username: 'markusa',
        password: 'secretpasswor',
      });

      expect(res.status).not.toBe(404);
    });
  });
});
