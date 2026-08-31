/**
 * Portfolio Controller
 */

import { Request, Response } from 'express';
import { portfolioService } from '../services/portfolio.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated, sendNoContent, parsePaginationParams, buildPaginationMeta } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const portfolioController = {
  /** POST /api/v1/admin/portfolio */
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const portfolio = await portfolioService.create(req.admin!.admin_id, req.body);
    sendCreated(res, portfolio, 'Portfolio item created');
  }),

  /** PUT /api/v1/admin/portfolio/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const portfolio = await portfolioService.update(req.params.id, req.body);
    sendSuccess(res, portfolio, 200, 'Portfolio item updated');
  }),

  /** DELETE /api/v1/admin/portfolio/:id */
  delete: asyncHandler(async (req: Request, res: Response) => {
    await portfolioService.delete(req.params.id);
    sendNoContent(res);
  }),

  /** GET /api/v1/admin/portfolio */
  adminGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await portfolioService.getAll(pagination, req.query.search as string);
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  /** GET /api/v1/admin/portfolio/:id */
  getById: asyncHandler(async (req: Request, res: Response) => {
    const portfolio = await portfolioService.getById(req.params.id);
    sendSuccess(res, portfolio, 200);
  }),

  /** GET /api/v1/portfolio  (public) */
  publicGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await portfolioService.getPublished(pagination, {
      type: req.query.type as string,
      language: req.query.language as string,
    });
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  /** GET /api/v1/portfolio/featured  (public) */
  publicGetFeatured: asyncHandler(async (_req: Request, res: Response) => {
    const items = await portfolioService.getFeatured();
    sendSuccess(res, items, 200);
  }),
};
