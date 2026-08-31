/**
 * Error Handling Middleware
 * Centralized error handler for all unhandled errors.
 * Converts errors to consistent API response format.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { isAppError } from '../utils/errors';
import { sendError } from '../utils/response';
import logger from '../utils/logger';

// =====================================================
// 404 HANDLER (must be registered before error handler)
// =====================================================
export function notFoundHandler(req: Request, res: Response): void {
  sendError(
    res,
    404,
    'NOT_FOUND',
    `Route ${req.method} ${req.originalUrl} not found`
  );
}

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logger.error('Error occurred', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
  });

  // Handle known Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    sendError(res, 422, 'VALIDATION_ERROR', 'Validation failed', details);
    return;
  }

  // Handle known application errors
  if (isAppError(error)) {
    sendError(
      res,
      error.statusCode,
      error.code,
      error.message,
      error.details
    );
    return;
  }

  // Handle PostgreSQL errors
  if ((error as any).code) {
    const pgError = error as any;
    
    // Unique constraint violation
    if (pgError.code === '23505') {
      const field = extractPgConstraintField(pgError.constraint ?? '');
      sendError(res, 409, 'DUPLICATE_ENTRY', `${field} already exists`);
      return;
    }

    // Foreign key constraint violation
    if (pgError.code === '23503') {
      sendError(res, 400, 'FOREIGN_KEY_VIOLATION', 'Referenced record does not exist');
      return;
    }

    // Not null constraint violation
    if (pgError.code === '23502') {
      sendError(res, 400, 'NULL_CONSTRAINT', `Field '${pgError.column}' cannot be null`);
      return;
    }

    // Connection error
    if (['ECONNREFUSED', '57P03', '08006'].includes(pgError.code)) {
      sendError(res, 503, 'DATABASE_UNAVAILABLE', 'Database is temporarily unavailable');
      return;
    }
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    sendError(res, 401, 'INVALID_TOKEN', 'Invalid token');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    sendError(res, 401, 'TOKEN_EXPIRED', 'Token has expired');
    return;
  }

  // Handle multer errors (file upload)
  if (error.name === 'MulterError') {
    const multerError = error as any;
    if (multerError.code === 'LIMIT_FILE_SIZE') {
      sendError(res, 413, 'FILE_TOO_LARGE', 'File size exceeds the limit');
      return;
    }
    sendError(res, 400, 'UPLOAD_ERROR', multerError.message);
    return;
  }

  // Unknown errors — don't leak details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  sendError(
    res,
    500,
    'INTERNAL_ERROR',
    isDevelopment ? error.message : 'An unexpected error occurred',
    isDevelopment ? { stack: error.stack } : undefined
  );
}

// =====================================================
// HELPERS
// =====================================================
function extractPgConstraintField(constraint: string): string {
  // Extract field name from constraint name like "users_email_key"
  const parts = constraint.split('_');
  if (parts.length >= 2) {
    return parts.slice(1, -1).join('_') || constraint;
  }
  return constraint;
}

// =====================================================
// ASYNC HANDLER WRAPPER
// Eliminates try/catch boilerplate in route handlers
// =====================================================
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
