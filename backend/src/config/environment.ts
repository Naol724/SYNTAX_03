/**
 * Environment Configuration
 * Validates and exports all environment variables with type safety.
 * Fails fast on startup if required variables are missing.
 */

import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load env files in priority order.
// __dirname = backend/src/config  →  ../../ = backend/
// This works regardless of which directory npm is invoked from.
const backendRoot = path.resolve(__dirname, '../../');
dotenv.config({ path: path.join(backendRoot, '.env.local') });
dotenv.config({ path: path.join(backendRoot, '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

// =====================================================
// ENVIRONMENT SCHEMA VALIDATION
// =====================================================
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  API_VERSION: z.string().default('v1'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Supabase
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL').optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // JWT Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRY: z.string().default('24h'),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Grok AI API — optional, AI chat disabled when absent
  GROK_API_KEY: z.string().optional(),
  GROK_API_URL: z.string().url().default('https://api.x.ai/v1'),
  GROK_MODEL: z.string().default('grok-beta'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),

  // File Upload
  MAX_FILE_SIZE_MB: z.string().default('5').transform(Number),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_PATH: z.string().default('./logs'),

  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform((v) => (v ? Number(v) : undefined)),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

// Parse and validate
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(_env.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = _env.data;

// =====================================================
// DERIVED CONFIG
// =====================================================
export const config = {
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    apiVersion: env.API_VERSION,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },

  database: {
    url: env.DATABASE_URL,
    ssl: true, // Always true — Supabase requires SSL
    pool: {
      max: 10,
      idleTimeoutMillis: 20000,     // 20s — Supabase closes idle at 30s
      connectionTimeoutMillis: 10000,
    },
  },

  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiry: env.JWT_EXPIRY,
    refreshSecret: env.JWT_REFRESH_SECRET ?? env.JWT_SECRET,
    refreshExpiry: env.JWT_REFRESH_EXPIRY,
  },

  cors: {
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  },

  grok: {
    apiKey: env.GROK_API_KEY,
    apiUrl: env.GROK_API_URL,
    model: env.GROK_MODEL,
  },

  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },

  upload: {
    maxFileSizeBytes: env.MAX_FILE_SIZE_MB * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },

  logging: {
    level: env.LOG_LEVEL,
    filePath: env.LOG_FILE_PATH,
  },

  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.SMTP_FROM ?? 'SYNTAX <noreply@syntax.com>',
  },
} as const;

export default config;
