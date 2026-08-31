/**
 * General Utility Helpers
 * Reusable utility functions used across the application.
 */

import crypto from 'crypto';

// =====================================================
// STRING UTILITIES
// =====================================================

/**
 * Generate a URL-friendly slug from a string
 * e.g., "Hello World!" -> "hello-world"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-')     // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

/**
 * Ensure slug is unique by appending a counter or random suffix
 */
export function generateUniqueSlug(base: string, suffix?: string | number): string {
  const baseSlug = generateSlug(base);
  if (!suffix) return baseSlug;
  return `${baseSlug}-${suffix}`;
}

/**
 * Truncate string to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Calculate estimated reading time in minutes
 */
export function calculateReadTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// =====================================================
// SECURITY UTILITIES
// =====================================================

/**
 * Generate a cryptographically secure random string
 */
export function generateRandomToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hash a token for secure storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a secure random integer between min and max (inclusive)
 */
export function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValue = Math.pow(256, bytesNeeded);
  let value: number;

  do {
    value = parseInt(crypto.randomBytes(bytesNeeded).toString('hex'), 16);
  } while (value >= maxValue - (maxValue % range));

  return min + (value % range);
}

// =====================================================
// DATE UTILITIES
// =====================================================

/**
 * Get date X days from now
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get date X seconds from now
 */
export function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}

/**
 * Check if a date is in the past
 */
export function isExpired(date: Date): boolean {
  return date < new Date();
}

/**
 * Format a date for display
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Convert JWT expiry string (e.g. "24h", "7d") to seconds
 */
export function expiryToSeconds(expiry: string): number {
  const match = expiry.match(/^(\d+)(s|m|h|d|w)$/);
  if (!match) return 86400; // default 24h

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };

  return value * (multipliers[unit] ?? 86400);
}

// =====================================================
// OBJECT UTILITIES
// =====================================================

/**
 * Remove undefined/null keys from an object (for PATCH updates)
 */
export function removeNullish<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>;
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
}

// =====================================================
// VALIDATION UTILITIES
// =====================================================

/**
 * Check if string is a valid UUID v4
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Check if string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

// =====================================================
// ARRAY UTILITIES
// =====================================================

/**
 * Remove duplicates from an array
 */
export function uniqueArray<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Chunk array into smaller arrays of given size
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

// =====================================================
// ASYNC UTILITIES
// =====================================================

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async function up to maxRetries times
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await sleep(delayMs * attempt);
      }
    }
  }

  throw lastError;
}
