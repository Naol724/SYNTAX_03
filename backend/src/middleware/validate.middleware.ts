/**
 * Request Validation Middleware
 * Zod schema-based validation for request body, params, and query.
 * Returns detailed field-level errors on validation failure.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

// =====================================================
// VALIDATION TARGETS
// =====================================================
type ValidationTarget = 'body' | 'params' | 'query';

// =====================================================
// GENERIC VALIDATOR FACTORY
// =====================================================
function createValidator(target: ValidationTarget) {
  return function <T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const data = schema.parse(req[target]);
        // Mutate the request object with parsed/coerced data
        (req as any)[target] = data;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const details = error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          }));
          sendError(res, 422, 'VALIDATION_ERROR', 'Validation failed', details);
        } else {
          next(error);
        }
      }
    };
  };
}

// =====================================================
// EXPORTED VALIDATORS
// =====================================================

/** Validate req.body */
export const validateBody = createValidator('body');

/** Validate req.params */
export const validateParams = createValidator('params');

/** Validate req.query */
export const validateQuery = createValidator('query');

// =====================================================
// COMMON PARAM SCHEMAS
// =====================================================
import { z } from 'zod';

export const uuidParam = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const slugParam = z.object({
  slug: z.string().min(1, 'Slug is required').max(250),
});

export const paginationQuery = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});
