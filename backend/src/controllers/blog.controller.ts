/**
 * Blog Controller
 */

import { Request, Response } from 'express';
import { blogService } from '../services/blog.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated, sendNoContent, parsePaginationParams, buildPaginationMeta } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const blogController = {
  /** POST /api/v1/admin/blog */
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const blog = await blogService.create(req.admin!.admin_id, req.body);
    sendCreated(res, blog, 'Blog post created');
  }),

  /** PUT /api/v1/admin/blog/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.update(req.params.id, req.body);
    sendSuccess(res, blog, 200, 'Blog post updated');
  }),

  /** PATCH /api/v1/admin/blog/:id/publish */
  publish: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.publish(req.params.id);
    sendSuccess(res, blog, 200, 'Blog post published');
  }),

  /** PATCH /api/v1/admin/blog/:id/unpublish */
  unpublish: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.unpublish(req.params.id);
    sendSuccess(res, blog, 200, 'Blog post unpublished');
  }),

  /** DELETE /api/v1/admin/blog/:id */
  delete: asyncHandler(async (req: Request, res: Response) => {
    await blogService.delete(req.params.id);
    sendNoContent(res);
  }),

  /** GET /api/v1/admin/blog */
  adminGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await blogService.getAll(pagination, req.query.search as string);
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  /** GET /api/v1/admin/blog/:id */
  adminGetById: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.getById(req.params.id);
    sendSuccess(res, blog, 200);
  }),

  /** GET /api/v1/blog  (public) */
  publicGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await blogService.getPublished(pagination, {
      category: req.query.category as string,
      tag: req.query.tag as string,
      search: req.query.search as string,
    });
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  /** GET /api/v1/blog/:slug  (public) */
  publicGetBySlug: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogService.getBySlug(req.params.slug);
    sendSuccess(res, blog, 200);
  }),

  /** GET /api/v1/blog/featured  (public) */
  publicGetFeatured: asyncHandler(async (_req: Request, res: Response) => {
    const blogs = await blogService.getFeatured();
    sendSuccess(res, blogs, 200);
  }),

  /** GET /api/v1/blog/categories  (public) */
  getCategories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await blogService.getCategories();
    sendSuccess(res, categories, 200);
  }),
};
