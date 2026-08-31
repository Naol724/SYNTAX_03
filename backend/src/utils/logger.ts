/**
 * Logger Utility
 * Winston-based structured logging with file rotation and console output.
 * Outputs JSON in production, colorized text in development.
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Logs always go inside backend/logs regardless of cwd
const backendRoot = path.resolve(__dirname, '../../');
const logDir = process.env.LOG_FILE_PATH
  ? path.resolve(backendRoot, process.env.LOG_FILE_PATH)
  : path.join(backendRoot, 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// =====================================================
// CUSTOM LOG FORMATS
// =====================================================
const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Development format: colorized, readable
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ''}${metaStr}`;
  })
);

// Production format: structured JSON
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// =====================================================
// TRANSPORTS
// =====================================================
const transports: winston.transport[] = [];

// Console transport (always on)
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  })
);

// File transports (always on)
transports.push(
  // Error log
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: combine(timestamp(), json()),
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  }),

  // Combined log
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: combine(timestamp(), json()),
    maxsize: 20 * 1024 * 1024, // 20MB
    maxFiles: 10,
  })
);

// =====================================================
// LOGGER INSTANCE
// =====================================================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  defaultMeta: {
    service: 'syntax-api',
    version: process.env.npm_package_version ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
  },
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      format: combine(timestamp(), json()),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      format: combine(timestamp(), json()),
    }),
  ],
  exitOnError: false,
});

// =====================================================
// HTTP REQUEST LOGGING STREAM (for Morgan)
// =====================================================
export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// =====================================================
// CHILD LOGGER FACTORY
// =====================================================
export function createChildLogger(module: string): winston.Logger {
  return logger.child({ module });
}

// =====================================================
// HELPER METHODS
// =====================================================
export function logRequest(req: {
  method: string;
  url: string;
  ip?: string;
  body?: any;
}): void {
  logger.http('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: req.body,
  });
}

export function logError(error: Error, context?: Record<string, any>): void {
  logger.error(error.message, {
    stack: error.stack,
    ...context,
  });
}

export default logger;
