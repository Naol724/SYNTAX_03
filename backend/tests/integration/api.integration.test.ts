/**
 * Integration Tests — Core API Modules
 * Tests Services, Portfolio, Blog, Messages, Testimonials, Developers
 */

import supertest from 'supertest';
import { createApp } from '../../src/app';
import { closePool } from '../../src/config/database';

const app = createApp();
const request = supertest(app);

let token = '';
let serviceId = '';
let portfolioId = '';
let blogId = '';
let blogSlug = '';
let testimonialId = '';
let developerId = '';
let messageId = '';

// ─── Setup — get admin token ─────────────────────────────────────────────────
beforeAll(async () => {
  const res = await request
    .post('/api/v1/admin/login')
    .send({ email: 'admin@syntax.com', password: 'Admin@Syntax2026!' });
  token = res.body.data.accessToken;
});

afterAll(async () => { await closePool(); });

const auth = () => ({ Authorization: `Bearer ${token}` });

// ─── Services ─────────────────────────────────────────────────────────────────
describe('Services API', () => {
  it('POST /admin/services creates a service', async () => {
    const res = await request
      .post('/api/v1/admin/services')
      .set(auth())
      .send({ name: 'Test Service', type: 'test', description: 'A test service for automated testing purposes.', is_active: true });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test Service');
    serviceId = res.body.data.service_id;
  });

  it('GET /services returns public active services', async () => {
    const res = await request.get('/api/v1/services');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /admin/services returns all services (admin)', async () => {
    const res = await request.get('/api/v1/admin/services').set(auth());
    expect(res.status).toBe(200);
  });

  it('PUT /admin/services/:id updates the service', async () => {
    const res = await request
      .put(`/api/v1/admin/services/${serviceId}`)
      .set(auth())
      .send({ short_description: 'Updated description' });

    expect(res.status).toBe(200);
    expect(res.body.data.short_description).toBe('Updated description');
  });

  it('GET /admin/services requires auth', async () => {
    const res = await request.get('/api/v1/admin/services');
    expect(res.status).toBe(401);
  });

  it('DELETE /admin/services/:id deletes service', async () => {
    const res = await request.delete(`/api/v1/admin/services/${serviceId}`).set(auth());
    expect(res.status).toBe(204);
  });

  it('GET /admin/services/:id returns 404 after delete', async () => {
    const res = await request.get(`/api/v1/admin/services/${serviceId}`).set(auth());
    expect(res.status).toBe(404);
  });
});

// ─── Portfolio ─────────────────────────────────────────────────────────────────
describe('Portfolio API', () => {
  it('POST /admin/portfolio creates a project', async () => {
    const res = await request
      .post('/api/v1/admin/portfolio')
      .set(auth())
      .send({ project_name: 'Test Project', portfolio_type: 'website', description: 'An automated test project for the test suite integration.', is_published: true });

    expect(res.status).toBe(201);
    expect(res.body.data.project_name).toBe('Test Project');
    portfolioId = res.body.data.portfolio_id;
  });

  it('GET /portfolio returns published projects', async () => {
    const res = await request.get('/api/v1/portfolio');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /portfolio/featured returns featured projects', async () => {
    const res = await request.get('/api/v1/portfolio/featured');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('DELETE /admin/portfolio/:id deletes project', async () => {
    const res = await request.delete(`/api/v1/admin/portfolio/${portfolioId}`).set(auth());
    expect(res.status).toBe(204);
  });
});

// ─── Blog ─────────────────────────────────────────────────────────────────────
describe('Blog API', () => {
  it('POST /admin/blog creates a blog post', async () => {
    const res = await request
      .post('/api/v1/admin/blog')
      .set(auth())
      .send({
        title: 'Integration Test Blog Post Title Here',
        content: 'This is the content of an automated integration test blog post for the SYNTAX API test suite.',
        category: 'Technology',
        tags: ['testing', 'jest'],
        is_published: true,
        publish_date: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Integration Test Blog Post Title Here');
    expect(res.body.data.slug).toBeTruthy();
    blogId = res.body.data.blog_id;
    blogSlug = res.body.data.slug;
  });

  it('GET /blog returns published posts', async () => {
    const res = await request.get('/api/v1/blog');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /blog/:slug returns post by slug', async () => {
    const res = await request.get(`/api/v1/blog/${blogSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe(blogSlug);
  });

  it('GET /blog/categories returns categories', async () => {
    const res = await request.get('/api/v1/blog/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('PATCH /admin/blog/:id/unpublish unpublishes post', async () => {
    const res = await request.patch(`/api/v1/admin/blog/${blogId}/unpublish`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body.data.is_published).toBe(false);
  });

  it('PATCH /admin/blog/:id/publish publishes post', async () => {
    const res = await request.patch(`/api/v1/admin/blog/${blogId}/publish`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body.data.is_published).toBe(true);
  });

  it('GET /blog returns 404 for unknown slug', async () => {
    const res = await request.get('/api/v1/blog/this-slug-does-not-exist-xyz123');
    expect(res.status).toBe(404);
  });

  it('DELETE /admin/blog/:id deletes post', async () => {
    const res = await request.delete(`/api/v1/admin/blog/${blogId}`).set(auth());
    expect(res.status).toBe(204);
  });
});

// ─── Messages ─────────────────────────────────────────────────────────────────
describe('Messages API', () => {
  it('POST /messages allows public message submission', async () => {
    const res = await request
      .post('/api/v1/messages')
      .send({
        sender_name: 'Test Sender',
        sender_email: 'testsender@example.com',
        subject: 'Integration Test Message',
        message: 'This is a test message from the integration test suite for SYNTAX API.',
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('message_id');
    messageId = res.body.data.message_id;
  });

  it('GET /admin/messages requires authentication', async () => {
    const res = await request.get('/api/v1/admin/messages');
    expect(res.status).toBe(401);
  });

  it('GET /admin/messages returns messages for admin', async () => {
    const res = await request.get('/api/v1/admin/messages').set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /admin/messages/stats returns stats', async () => {
    const res = await request.get('/api/v1/admin/messages/stats').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('unread_count');
    expect(res.body.data).toHaveProperty('today_count');
  });

  it('PATCH /admin/messages/:id updates status', async () => {
    const res = await request
      .patch(`/api/v1/admin/messages/${messageId}`)
      .set(auth())
      .send({ status: 'read', admin_notes: 'Reviewed in test' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('read');
  });

  it('POST /messages validates required fields', async () => {
    const res = await request.post('/api/v1/messages').send({ sender_name: 'Test' });
    expect(res.status).toBe(422);
  });

  it('DELETE /admin/messages/:id deletes message', async () => {
    const res = await request.delete(`/api/v1/admin/messages/${messageId}`).set(auth());
    expect(res.status).toBe(204);
  });
});

// ─── Testimonials ─────────────────────────────────────────────────────────────
describe('Testimonials API', () => {
  it('POST /admin/testimonials creates testimonial', async () => {
    const res = await request
      .post('/api/v1/admin/testimonials')
      .set(auth())
      .send({ client_name: 'Test Client', feedback: 'Amazing work by the Syntax team, highly recommended!', rating: 5, is_approved: true });

    expect(res.status).toBe(201);
    expect(res.body.data.client_name).toBe('Test Client');
    testimonialId = res.body.data.testimonial_id;
  });

  it('GET /testimonials returns approved testimonials', async () => {
    const res = await request.get('/api/v1/testimonials');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /testimonials/featured returns featured', async () => {
    const res = await request.get('/api/v1/testimonials/featured');
    expect(res.status).toBe(200);
  });

  it('DELETE /admin/testimonials/:id deletes testimonial', async () => {
    const res = await request.delete(`/api/v1/admin/testimonials/${testimonialId}`).set(auth());
    expect(res.status).toBe(204);
  });
});

// ─── Developers ───────────────────────────────────────────────────────────────
describe('Developers API', () => {
  it('POST /admin/developers creates developer', async () => {
    const res = await request
      .post('/api/v1/admin/developers')
      .set(auth())
      .send({ full_name: 'Test Developer', skill: ['React', 'TypeScript'], position: 'Test Engineer', is_active: true });

    expect(res.status).toBe(201);
    expect(res.body.data.full_name).toBe('Test Developer');
    developerId = res.body.data.developer_id;
  });

  it('GET /developers returns active developers', async () => {
    const res = await request.get('/api/v1/developers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('DELETE /admin/developers/:id deletes developer', async () => {
    const res = await request.delete(`/api/v1/admin/developers/${developerId}`).set(auth());
    expect(res.status).toBe(204);
  });
});

// ─── Dashboard ─────────────────────────────────────────────────────────────────
describe('Dashboard API', () => {
  it('GET /admin/dashboard returns stats', async () => {
    const res = await request.get('/api/v1/admin/dashboard').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalServices');
    expect(res.body.data).toHaveProperty('totalBlogs');
    expect(res.body.data).toHaveProperty('totalMessages');
    expect(res.body.data).toHaveProperty('unreadMessages');
    expect(res.body.data).toHaveProperty('recentActivity');
  });

  it('GET /admin/dashboard requires auth', async () => {
    const res = await request.get('/api/v1/admin/dashboard');
    expect(res.status).toBe(401);
  });
});

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
describe('Input Validation', () => {
  it('rejects request with invalid UUID param', async () => {
    const res = await request.get('/api/v1/admin/services/not-a-uuid').set(auth());
    expect(res.status).toBe(422);
  });

  it('rejects oversized JSON body gracefully', async () => {
    const largeBody = { name: 'x'.repeat(10000), type: 'test', description: 'test' };
    const res = await request.post('/api/v1/admin/services').set(auth()).send(largeBody);
    // Either 422 (validation) or 413 (payload too large) is acceptable
    expect([413, 422].includes(res.status)).toBe(true);
  });
});
