/**
 * Unit Tests — Custom Error Classes
 */

import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  InvalidCredentialsError,
  TokenExpiredError,
  InvalidTokenError,
  DuplicateEntryError,
  FileSizeError,
  InvalidFileTypeError,
  isAppError,
  isOperationalError,
} from '../../src/utils/errors';

describe('AppError (base)', () => {
  it('creates error with all properties', () => {
    const err = new AppError('test message', 400, 'TEST_CODE', { detail: 1 });
    expect(err.message).toBe('test message');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST_CODE');
    expect(err.details).toEqual({ detail: 1 });
    expect(err.isOperational).toBe(true);
  });

  it('has correct name', () => {
    const err = new AppError('msg', 500, 'CODE');
    expect(err.name).toBe('AppError');
  });

  it('is instanceof Error', () => {
    expect(new AppError('msg', 500, 'CODE')).toBeInstanceOf(Error);
  });

  it('has a stack trace', () => {
    const err = new AppError('msg', 500, 'CODE');
    expect(err.stack).toBeDefined();
  });
});

describe('HTTP Error Classes', () => {
  const cases = [
    { cls: BadRequestError, status: 400, code: 'BAD_REQUEST' },
    { cls: UnauthorizedError, status: 401, code: 'UNAUTHORIZED' },
    { cls: ForbiddenError, status: 403, code: 'FORBIDDEN' },
    { cls: ConflictError, status: 409, code: 'CONFLICT' },
    { cls: ValidationError, status: 422, code: 'VALIDATION_ERROR' },
    { cls: RateLimitError, status: 429, code: 'RATE_LIMIT_EXCEEDED' },
  ] as const;

  test.each(cases)('$cls.name has correct status and code', ({ cls, status, code }) => {
    const err = new (cls as any)('test');
    expect(err.statusCode).toBe(status);
    expect(err.code).toBe(code);
    expect(err).toBeInstanceOf(AppError);
  });

  it('NotFoundError includes resource name', () => {
    const err = new NotFoundError('Blog post');
    expect(err.message).toBe('Blog post not found');
    expect(err.statusCode).toBe(404);
  });

  it('InternalServerError is non-operational', () => {
    const err = new InternalServerError();
    expect(err.isOperational).toBe(false);
    expect(err.statusCode).toBe(500);
  });
});

describe('Domain Error Classes', () => {
  it('InvalidCredentialsError has 401 status', () => {
    const err = new InvalidCredentialsError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('INVALID_CREDENTIALS');
  });

  it('TokenExpiredError has 401 status', () => {
    const err = new TokenExpiredError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('TOKEN_EXPIRED');
  });

  it('InvalidTokenError has 401 status', () => {
    const err = new InvalidTokenError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('INVALID_TOKEN');
  });

  it('DuplicateEntryError includes field name', () => {
    const err = new DuplicateEntryError('email');
    expect(err.message).toBe('email already exists');
    expect(err.statusCode).toBe(409);
  });

  it('FileSizeError includes max size', () => {
    const err = new FileSizeError(5);
    expect(err.message).toContain('5MB');
    expect(err.statusCode).toBe(413);
  });

  it('InvalidFileTypeError includes allowed types', () => {
    const err = new InvalidFileTypeError(['image/jpeg', 'image/png']);
    expect(err.message).toContain('image/jpeg');
    expect(err.statusCode).toBe(415);
  });
});

describe('Error Type Guards', () => {
  it('isAppError returns true for AppError instances', () => {
    expect(isAppError(new AppError('msg', 500, 'CODE'))).toBe(true);
    expect(isAppError(new BadRequestError('bad'))).toBe(true);
    expect(isAppError(new NotFoundError('Resource'))).toBe(true);
  });

  it('isAppError returns false for regular errors', () => {
    expect(isAppError(new Error('regular'))).toBe(false);
    expect(isAppError('string')).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
  });

  it('isOperationalError returns true for operational errors', () => {
    expect(isOperationalError(new BadRequestError('bad'))).toBe(true);
    expect(isOperationalError(new NotFoundError('X'))).toBe(true);
  });

  it('isOperationalError returns false for non-operational errors', () => {
    expect(isOperationalError(new InternalServerError())).toBe(false);
    expect(isOperationalError(new Error('plain'))).toBe(false);
  });
});
