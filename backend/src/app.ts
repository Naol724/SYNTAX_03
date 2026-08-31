/**
 * Express Application
 * Configures all middleware, routes, and error handlers.
 * Separated from server.ts to enable clean testing.
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import config from './config/environment';
import { registerRoutes } from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { httpLogStream } from './utils/logger';
import { sendSuccess } from './utils/response';
import type { HealthStatus } from './types';

export function createApp(): Express {
  const app = express();

  // ===================================================
  // SECURITY MIDDLEWARE
  // ===================================================
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: config.server.isProduction,
    })
  );

  // ===================================================
  // CORS
  // ===================================================
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // ===================================================
  // RATE LIMITING
  // ===================================================
  const globalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests, please try again later' },
    },
  });

  // Stricter limit for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many login attempts' },
    },
  });

  app.use('/api/', globalLimiter);
  app.use('/api/v1/admin/login', authLimiter);
  app.use('/api/v1/users/register', authLimiter);

  // ===================================================
  // BODY PARSING
  // ===================================================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ===================================================
  // COMPRESSION
  // ===================================================
  app.use(compression());

  // ===================================================
  // HTTP LOGGING
  // ===================================================
  const morganFormat = config.server.isDevelopment ? 'dev' : 'combined';
  app.use(morgan(morganFormat, { stream: httpLogStream }));

  // ===================================================
  // HEALTH CHECK (no rate limit, no auth)
  // ===================================================
  app.get('/health', (_req: Request, res: Response) => {
    const status: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: { database: 'up', api: 'up' },
      version: process.env.npm_package_version ?? '1.0.0',
    };
    sendSuccess(res, status, 200);
  });

  // ===================================================
  // API ROUTES
  // ===================================================
  registerRoutes(app, `/api/${config.server.apiVersion}`);

  // ===================================================
  // 404 + GLOBAL ERROR HANDLER (must be last)
  // ===================================================
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
