/**
 * Authentication Middleware
 * JWT verification and role-based access control.
 * Applied to all protected admin routes.
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthPayload } from '../types';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import config from '../config/environment';

// =====================================================
// JWT VERIFICATION MIDDLEWARE
// =====================================================

/**
 * Verifies JWT access token from Authorization header.
 * Attaches decoded payload to req.admin on success.
 */
export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authorization token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No authorization token provided');
    }

    const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
    req.admin = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Access token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid access token'));
    } else {
      next(error);
    }
  }
}

// =====================================================
// ROLE-BASED ACCESS CONTROL
// =====================================================

/**
 * Require super_admin role.
 * Must be used after authenticate middleware.
 */
export function requireSuperAdmin(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  if (!req.admin) {
    return next(new UnauthorizedError());
  }

  if (req.admin.role !== 'super_admin') {
    return next(new ForbiddenError('Super admin access required'));
  }

  next();
}

/**
 * Require admin or super_admin role.
 * Must be used after authenticate middleware.
 */
export function requireAdmin(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  if (!req.admin) {
    return next(new UnauthorizedError());
  }

  const allowedRoles = ['admin', 'super_admin'];
  if (!allowedRoles.includes(req.admin.role)) {
    return next(new ForbiddenError('Admin access required'));
  }

  next();
}

/**
 * Optional auth - attaches payload if token present but doesn't fail if absent.
 * Useful for routes that behave differently for authenticated users.
 */
export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
        req.admin = payload;
      }
    }
  } catch {
    // Ignore auth errors in optional auth
  }
  next();
}
