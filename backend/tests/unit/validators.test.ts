/**
 * Unit Tests — Zod Validation Schemas
 */

import { loginSchema } from '../../src/validators/auth.validator';
import { createServiceSchema } from '../../src/validators/service.validator';
import { createBlogSchema } from '../../src/validators/blog.validator';
import { createMessageSchema } from '../../src/validators/message.validator';
import { createTestimonialSchema } from '../../src/validators/testimonial.validator';
import { createDeveloperSchema } from '../../src/validators/developer.validator';

// ─── Auth Validators ──────────────────────────────────────────────────────────
describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'admin@syntax.com', password: 'pass123' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'notanemail', password: 'pass' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'admin@syntax.com', password: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─── Service Validators ────────────────────────────────────────────────────────
describe('createServiceSchema', () => {
  const valid = {
    name: 'Web Development',
    type: 'web-development',
    description: 'Build modern web applications with cutting-edge technology.',
  };

  it('accepts valid service data', () => {
    expect(createServiceSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts optional fields', () => {
    const withOptionals = { ...valid, language: ['React', 'Node.js'], is_active: false, display_order: 2 };
    expect(createServiceSchema.safeParse(withOptionals).success).toBe(true);
  });

  it('rejects name too short', () => {
    expect(createServiceSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
  });

  it('rejects description too short', () => {
    expect(createServiceSchema.safeParse({ ...valid, description: 'short' }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    expect(createServiceSchema.safeParse({ name: 'Test' }).success).toBe(false);
  });

  it('defaults is_active to true', () => {
    const result = createServiceSchema.safeParse(valid);
    expect(result.success && result.data.is_active).toBe(true);
  });
});

// ─── Blog Validators ────────────────────────────────────────────────────────
describe('createBlogSchema', () => {
  const valid = {
    title: 'Getting Started with Next.js 15',
    content: 'Next.js 15 brings many improvements including better server components and performance optimizations.',
    category: 'Technology',
  };

  it('accepts valid blog data', () => {
    expect(createBlogSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects title too short', () => {
    expect(createBlogSchema.safeParse({ ...valid, title: 'Hi' }).success).toBe(false);
  });

  it('rejects content too short', () => {
    expect(createBlogSchema.safeParse({ ...valid, content: 'short' }).success).toBe(false);
  });

  it('rejects invalid slug characters', () => {
    const result = createBlogSchema.safeParse({ ...valid, slug: 'Invalid Slug!' });
    expect(result.success).toBe(false);
  });

  it('accepts valid slug', () => {
    const result = createBlogSchema.safeParse({ ...valid, slug: 'valid-slug-123' });
    expect(result.success).toBe(true);
  });

  it('accepts tags array', () => {
    const result = createBlogSchema.safeParse({ ...valid, tags: ['nextjs', 'react'] });
    expect(result.success).toBe(true);
  });

  it('defaults is_published to false', () => {
    const result = createBlogSchema.safeParse(valid);
    expect(result.success && result.data.is_published).toBe(false);
  });
});

// ─── Message Validators ──────────────────────────────────────────────────────
describe('createMessageSchema', () => {
  const valid = {
    sender_name: 'John Doe',
    sender_email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'I would like to discuss a new project with your team.',
  };

  it('accepts valid message', () => {
    expect(createMessageSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects short sender_name', () => {
    expect(createMessageSchema.safeParse({ ...valid, sender_name: 'J' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(createMessageSchema.safeParse({ ...valid, sender_email: 'bad' }).success).toBe(false);
  });

  it('rejects short subject', () => {
    expect(createMessageSchema.safeParse({ ...valid, subject: 'Hi' }).success).toBe(false);
  });

  it('rejects short message', () => {
    expect(createMessageSchema.safeParse({ ...valid, message: 'Hey' }).success).toBe(false);
  });

  it('accepts optional phone number', () => {
    const result = createMessageSchema.safeParse({ ...valid, sender_phone: '+251945455141' });
    expect(result.success).toBe(true);
  });

  it('defaults message_type to inquiry', () => {
    const result = createMessageSchema.safeParse(valid);
    expect(result.success && result.data.message_type).toBe('inquiry');
  });
});

// ─── Testimonial Validators ──────────────────────────────────────────────────
describe('createTestimonialSchema', () => {
  const valid = {
    client_name: 'Jane Smith',
    feedback: 'Excellent work! The team delivered beyond our expectations.',
    rating: 5,
  };

  it('accepts valid testimonial', () => {
    expect(createTestimonialSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects rating above 5', () => {
    expect(createTestimonialSchema.safeParse({ ...valid, rating: 6 }).success).toBe(false);
  });

  it('rejects rating below 0', () => {
    expect(createTestimonialSchema.safeParse({ ...valid, rating: -1 }).success).toBe(false);
  });

  it('accepts decimal ratings in 0.5 increments', () => {
    expect(createTestimonialSchema.safeParse({ ...valid, rating: 4.5 }).success).toBe(true);
  });

  it('rejects invalid decimal ratings', () => {
    expect(createTestimonialSchema.safeParse({ ...valid, rating: 4.3 }).success).toBe(false);
  });

  it('rejects short feedback', () => {
    expect(createTestimonialSchema.safeParse({ ...valid, feedback: 'Good' }).success).toBe(false);
  });
});

// ─── Developer Validators ────────────────────────────────────────────────────
describe('createDeveloperSchema', () => {
  const valid = {
    full_name: 'Alice Johnson',
    skill: ['React', 'TypeScript', 'Node.js'],
    position: 'Senior Full Stack Developer',
  };

  it('accepts valid developer data', () => {
    expect(createDeveloperSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty skills array', () => {
    expect(createDeveloperSchema.safeParse({ ...valid, skill: [] }).success).toBe(false);
  });

  it('rejects short name', () => {
    expect(createDeveloperSchema.safeParse({ ...valid, full_name: 'A' }).success).toBe(false);
  });

  it('rejects negative years_of_experience', () => {
    expect(createDeveloperSchema.safeParse({ ...valid, years_of_experience: -1 }).success).toBe(false);
  });

  it('accepts valid social links', () => {
    const result = createDeveloperSchema.safeParse({
      ...valid,
      social_media_links: { linkedin: 'https://linkedin.com/in/alice', github: 'https://github.com/alice' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid social link URL', () => {
    const result = createDeveloperSchema.safeParse({
      ...valid,
      social_media_links: { linkedin: 'not-a-url' },
    });
    expect(result.success).toBe(false);
  });

  it('defaults is_active to true', () => {
    const result = createDeveloperSchema.safeParse(valid);
    expect(result.success && result.data.is_active).toBe(true);
  });
});
