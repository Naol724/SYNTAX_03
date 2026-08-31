/**
 * Testimonial Controller
 */

import { Request, Response } from 'express';
import { testimonialService } from '../services/testimonial.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated, sendNoContent, parsePaginationParams, buildPaginationMeta } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const testimonialController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const t = await testimonialService.create(req.admin!.admin_id, req.body);
    sendCreated(res, t, 'Testimonial created');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const t = await testimonialService.update(req.params.id, req.body);
    sendSuccess(res, t, 200, 'Testimonial updated');
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    const t = await testimonialService.approve(req.params.id);
    sendSuccess(res, t, 200, 'Testimonial approved');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await testimonialService.delete(req.params.id);
    sendNoContent(res);
  }),

  adminGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await testimonialService.getAll(pagination);
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  publicGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await testimonialService.getApproved(pagination);
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  publicGetFeatured: asyncHandler(async (_req: Request, res: Response) => {
    const items = await testimonialService.getFeatured();
    sendSuccess(res, items, 200);
  }),
};
