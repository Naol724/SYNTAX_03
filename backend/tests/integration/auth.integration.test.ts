/**
 * Integration Tests — Auth Endpoints
 * Tests against the real Express app with live DB
 */

import supertest from 'supertest';
import { createApp } from '../../src/app';
import { closePool } from '../../src/config/database';

const app = createApp();
const request = supertest(app);

let accessToken = '';
let refreshToken = '';

// ─── Login ────────────────────────────────────────────────────────────────────
describe('POST /api/v1/admin/login', () => {
  it('returns 200 with tokens on valid credentials', async () => {
    const res = await request
      .post('/api/v1/admin/login')
      .send({ email: 'admin@syntax.com', password: 'Admin@Syntax2026!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data).toHaveProperty('admin');
    expect(res.body.data.admin).not.toHaveProperty('password_hash');
    expect(res.body.data.admin.email).toBe('admin@syntax.com');

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('returns 401 on wrong password', async () => {
    const res = await request
      .post('/api/v1/admin/login')
      .send({ email: 'admin@syntax.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns 401 on non-existent email', async () => {
    const res = await request
      .post('/api/v1/admin/login')
      .send({ email: 'nobody@nowhere.com', password: 'anything' });

    expect(res.status).toBe(401);
  });

  it('returns 422 on invalid email format', async () => {
    const res = await request
      .post('/api/v1/admin/login')
      .send({ email: 'notanemail', password: 'pass' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 on missing fields', async () => {
    const res = await request.post('/api/v1/admin/login').send({});
    expect(res.status).toBe(422);
  });
});

// ─── Protected Route ─────────────────────────────────────────────────────────
describe('GET /api/v1/admin/me', () => {
  it('returns 200 with admin data when authenticated', async () => {
    const res = await request
      .get('/api/v1/admin/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('admin@syntax.com');
    expect(res.body.data.role).toBe('super_admin');
  });

  it('returns 401 without token', async () => {
    const res = await request.get('/api/v1/admin/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    const res = await request
      .get('/api/v1/admin/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });

  it('returns 401 with malformed Authorization header', async () => {
    const res = await request
      .get('/api/v1/admin/me')
      .set('Authorization', 'InvalidFormat');
    expect(res.status).toBe(401);
  });
});

// ─── Token Refresh ────────────────────────────────────────────────────────────
describe('POST /api/v1/admin/refresh', () => {
  it('returns new access token', async () => {
    const res = await request
      .post('/api/v1/admin/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.accessToken).not.toBe(accessToken);
  });

  it('returns 401 on invalid refresh token', async () => {
    const res = await request
      .post('/api/v1/admin/refresh')
      .send({ refreshToken: 'invalid-refresh-token' });
    expect(res.status).toBe(401);
  });

  it('returns 422 on missing refreshToken field', async () => {
    const res = await request.post('/api/v1/admin/refresh').send({});
    expect(res.status).toBe(422);
  });
});

// ─── User Registration ────────────────────────────────────────────────────────
describe('POST /api/v1/users/register', () => {
  const testEmail = `test_${Date.now()}@test.com`;

  it('registers a new user', async () => {
    const res = await request
      .post('/api/v1/users/register')
      .send({ email: testEmail, full_name: 'Test User', company_name: 'Test Corp' });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe(testEmail);
    expect(res.body.data.full_name).toBe('Test User');
    expect(res.body.data).toHaveProperty('user_id');
  });

  it('returns 409 on duplicate email', async () => {
    const res = await request
      .post('/api/v1/users/register')
      .send({ email: testEmail, full_name: 'Duplicate User' });
    expect(res.status).toBe(409);
  });

  it('returns 422 on invalid email', async () => {
    const res = await request
      .post('/api/v1/users/register')
      .send({ email: 'bad-email', full_name: 'Test' });
    expect(res.status).toBe(422);
  });

  it('returns 422 on short name', async () => {
    const res = await request
      .post('/api/v1/users/register')
      .send({ email: `new_${Date.now()}@test.com`, full_name: 'A' });
    expect(res.status).toBe(422);
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
describe('POST /api/v1/admin/logout', () => {
  it('returns 200 on valid logout', async () => {
    // Get a fresh token
    const loginRes = await request
      .post('/api/v1/admin/login')
      .send({ email: 'admin@syntax.com', password: 'Admin@Syntax2026!' });
    const rt = loginRes.body.data.refreshToken;

    const res = await request
      .post('/api/v1/admin/logout')
      .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
      .send({ refreshToken: rt });

    expect(res.status).toBe(200);

    // Verify token is now revoked
    const refreshRes = await request
      .post('/api/v1/admin/refresh')
      .send({ refreshToken: rt });
    expect(refreshRes.status).toBe(401);
  });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('returns healthy status', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.services.api).toBe('up');
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
describe('404 Handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request.get('/api/v1/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for unknown methods', async () => {
    const res = await request.patch('/api/v1/admin/login');
    expect(res.status).toBe(404);
  });
});

// ─── Teardown ─────────────────────────────────────────────────────────────────
afterAll(async () => {
  await closePool();
});
