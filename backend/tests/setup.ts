/**
 * Global test setup
 * Runs before all test suites.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load test environment
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Set test defaults
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-min-32-characters-long!!';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-32-characters!!';
process.env.JWT_EXPIRY = '1h';
process.env.JWT_REFRESH_EXPIRY = '7d';
process.env.LOG_LEVEL = 'error'; // suppress logs in tests

// Global timeout
jest.setTimeout(30000);

// Suppress console output during tests (except errors)
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: console.error, // keep error visible
};
