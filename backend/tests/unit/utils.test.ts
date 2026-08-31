/**
 * Unit Tests — Utility Functions
 * Tests all helper functions in isolation
 */

import {
  generateSlug,
  generateUniqueSlug,
  truncate,
  calculateReadTime,
  capitalize,
  generateRandomToken,
  hashToken,
  addDays,
  addSeconds,
  isExpired,
  expiryToSeconds,
  removeNullish,
  pick,
  omit,
  isValidUUID,
  isValidEmail,
  uniqueArray,
  chunkArray,
} from '../../src/utils/helpers';

// ─── Slug Generation ────────────────────────────────────────────────────────
describe('generateSlug', () => {
  it('converts a normal title to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(generateSlug('Next.js 15! What\'s New?')).toBe('nextjs-15-whats-new');
  });

  it('collapses multiple spaces and hyphens', () => {
    expect(generateSlug('foo   bar---baz')).toBe('foo-bar-baz');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('  hello world  ')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('');
  });

  it('handles string with only special chars', () => {
    expect(generateSlug('!@#$%^')).toBe('');
  });
});

describe('generateUniqueSlug', () => {
  it('appends suffix to base slug', () => {
    const slug = generateUniqueSlug('hello world', 42);
    expect(slug).toBe('hello-world-42');
  });

  it('returns base slug without suffix', () => {
    expect(generateUniqueSlug('hello world')).toBe('hello-world');
  });
});

// ─── String Utilities ────────────────────────────────────────────────────────
describe('truncate', () => {
  it('returns string unchanged if under limit', () => {
    expect(truncate('short', 100)).toBe('short');
  });

  it('truncates long string and adds ellipsis', () => {
    const result = truncate('a'.repeat(110), 100);
    expect(result).toHaveLength(100);
    expect(result).toEndWith('...');
  });

  it('uses default length of 100', () => {
    const result = truncate('x'.repeat(200));
    expect(result).toHaveLength(100);
  });
});

describe('calculateReadTime', () => {
  it('returns at least 1 minute', () => {
    expect(calculateReadTime('short text')).toBeGreaterThanOrEqual(1);
  });

  it('calculates time proportionally', () => {
    const text = 'word '.repeat(400); // 400 words
    expect(calculateReadTime(text)).toBe(2); // 400 / 200 wpm
  });

  it('rounds up fractional minutes', () => {
    const text = 'word '.repeat(201); // 201 words
    expect(calculateReadTime(text)).toBe(2); // ceil(201/200)
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('lowercases rest of string', () => {
    expect(capitalize('hELLO WORLD')).toBe('Hello world');
  });
});

// ─── Security Utilities ──────────────────────────────────────────────────────
describe('generateRandomToken', () => {
  it('generates a hex string', () => {
    const token = generateRandomToken();
    expect(token).toMatch(/^[a-f0-9]+$/);
  });

  it('generates correct length (32 bytes = 64 hex chars)', () => {
    expect(generateRandomToken(32)).toHaveLength(64);
  });

  it('generates unique tokens', () => {
    const t1 = generateRandomToken();
    const t2 = generateRandomToken();
    expect(t1).not.toBe(t2);
  });
});

describe('hashToken', () => {
  it('produces consistent hash for same input', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hashToken('abc')).not.toBe(hashToken('xyz'));
  });

  it('returns 64-char hex string (SHA-256)', () => {
    expect(hashToken('test')).toHaveLength(64);
    expect(hashToken('test')).toMatch(/^[a-f0-9]+$/);
  });
});

// ─── Date Utilities ──────────────────────────────────────────────────────────
describe('addDays', () => {
  it('adds days correctly', () => {
    const base = new Date('2026-01-01');
    const result = addDays(base, 7);
    expect(result.toISOString().slice(0, 10)).toBe('2026-01-08');
  });

  it('does not mutate original date', () => {
    const base = new Date('2026-01-01');
    addDays(base, 7);
    expect(base.toISOString().slice(0, 10)).toBe('2026-01-01');
  });
});

describe('addSeconds', () => {
  it('adds seconds correctly', () => {
    const base = new Date('2026-01-01T00:00:00Z');
    const result = addSeconds(base, 3600);
    expect(result.toISOString()).toBe('2026-01-01T01:00:00.000Z');
  });
});

describe('isExpired', () => {
  it('returns true for past date', () => {
    expect(isExpired(new Date('2020-01-01'))).toBe(true);
  });

  it('returns false for future date', () => {
    expect(isExpired(addDays(new Date(), 1))).toBe(false);
  });
});

describe('expiryToSeconds', () => {
  it('converts hours', () => {
    expect(expiryToSeconds('24h')).toBe(86400);
  });

  it('converts days', () => {
    expect(expiryToSeconds('7d')).toBe(604800);
  });

  it('converts minutes', () => {
    expect(expiryToSeconds('30m')).toBe(1800);
  });

  it('converts seconds', () => {
    expect(expiryToSeconds('60s')).toBe(60);
  });

  it('returns 86400 for invalid format', () => {
    expect(expiryToSeconds('invalid')).toBe(86400);
  });
});

// ─── Object Utilities ────────────────────────────────────────────────────────
describe('removeNullish', () => {
  it('removes null and undefined values', () => {
    const result = removeNullish({ a: 1, b: null, c: undefined, d: 'keep' });
    expect(result).toEqual({ a: 1, d: 'keep' });
  });

  it('keeps falsy but defined values', () => {
    const result = removeNullish({ a: 0, b: false, c: '' });
    expect(result).toEqual({ a: 0, b: false, c: '' });
  });
});

describe('pick', () => {
  it('picks specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
});

describe('omit', () => {
  it('omits specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

// ─── Validation Utilities ────────────────────────────────────────────────────
describe('isValidUUID', () => {
  it('validates correct UUID v4', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('rejects invalid UUIDs', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false);
    expect(isValidUUID('550e8400-e29b-41d4')).toBe(false);
    expect(isValidUUID('')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('validates correct emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('admin@syntax.io')).toBe(true);
    expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

// ─── Array Utilities ─────────────────────────────────────────────────────────
describe('uniqueArray', () => {
  it('removes duplicates', () => {
    expect(uniqueArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it('handles empty array', () => {
    expect(uniqueArray([])).toEqual([]);
  });
});

describe('chunkArray', () => {
  it('splits array into chunks of given size', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns single chunk if array smaller than size', () => {
    expect(chunkArray([1, 2], 10)).toEqual([[1, 2]]);
  });

  it('handles empty array', () => {
    expect(chunkArray([], 3)).toEqual([]);
  });
});
