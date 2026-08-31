/**
 * Unit Tests — API Response Helpers
 */

import { buildPaginationMeta, parsePaginationParams } from '../../src/utils/response';

describe('buildPaginationMeta', () => {
  it('calculates totalPages correctly', () => {
    const meta = buildPaginationMeta(1, 10, 25);
    expect(meta.totalPages).toBe(3);
  });

  it('sets hasNext correctly', () => {
    expect(buildPaginationMeta(1, 10, 25).hasNext).toBe(true);
    expect(buildPaginationMeta(3, 10, 25).hasNext).toBe(false);
  });

  it('sets hasPrev correctly', () => {
    expect(buildPaginationMeta(1, 10, 25).hasPrev).toBe(false);
    expect(buildPaginationMeta(2, 10, 25).hasPrev).toBe(true);
  });

  it('handles exact division', () => {
    const meta = buildPaginationMeta(2, 10, 20);
    expect(meta.totalPages).toBe(2);
    expect(meta.hasNext).toBe(false);
  });

  it('handles single page', () => {
    const meta = buildPaginationMeta(1, 10, 5);
    expect(meta.totalPages).toBe(1);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(false);
  });

  it('returns all fields', () => {
    const meta = buildPaginationMeta(2, 10, 30);
    expect(meta).toMatchObject({ page: 2, limit: 10, total: 30, totalPages: 3, hasNext: true, hasPrev: true });
  });
});

describe('parsePaginationParams', () => {
  it('parses valid page and limit', () => {
    const result = parsePaginationParams({ page: '2', limit: '20' });
    expect(result).toEqual({ page: 2, limit: 20, offset: 20 });
  });

  it('defaults page to 1', () => {
    const result = parsePaginationParams({});
    expect(result.page).toBe(1);
  });

  it('defaults limit to 10', () => {
    const result = parsePaginationParams({});
    expect(result.limit).toBe(10);
  });

  it('enforces minimum page of 1', () => {
    const result = parsePaginationParams({ page: '0' });
    expect(result.page).toBe(1);
  });

  it('enforces maximum limit', () => {
    const result = parsePaginationParams({ limit: '9999' });
    expect(result.limit).toBeLessThanOrEqual(100);
  });

  it('calculates offset correctly', () => {
    const result = parsePaginationParams({ page: '3', limit: '15' });
    expect(result.offset).toBe(30);
  });

  it('handles non-numeric values gracefully', () => {
    const result = parsePaginationParams({ page: 'abc', limit: 'xyz' });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
