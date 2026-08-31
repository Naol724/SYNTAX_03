/**
 * API Response Helpers
 * Standardized response format for all API endpoints.
 * Ensures consistent structure across the entire API.
 */

import { Response } from 'express';

// =====================================================
// RESPONSE TYPES
// =====================================================
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: ResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  timestamp: string;
  version: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// =====================================================
// RESPONSE HELPERS
// =====================================================

/**
 * Send a success response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
  pagination?: PaginationMeta
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION ?? 'v1',
      ...(pagination && { pagination }),
    },
  };

  return res.status(statusCode).json(response);
}

/**
 * Send a created response (201)
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Created successfully'
): Response {
  return sendSuccess(res, data, 201, message);
}

/**
 * Send a no content response (204)
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Send an error response
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: any
): Response {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION ?? 'v1',
    },
  };

  return res.status(statusCode).json(response);
}

/**
 * Build pagination meta from query results
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Parse and validate pagination query params
 */
export function parsePaginationParams(
  query: Record<string, any>,
  defaultLimit: number = 10,
  maxLimit: number = 100
): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit as string) || defaultLimit)
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
