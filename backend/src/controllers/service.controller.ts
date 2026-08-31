/**
 * Service Controller
 */

import { Request, Response } from 'express';
import { serviceService } from '../services/service.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated, sendNoContent, parsePaginationParams, buildPaginationMeta } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const serviceController = {
  /** POST /api/v1/admin/services */
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const service = await serviceService.create(req.admin!.admin_id, req.body);
    sendCreated(res, service, 'Service created');
  }),

  /** PUT /api/v1/admin/services/:id */
  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const service = await serviceService.update(req.params.id, req.body);
    sendSuccess(res, service, 200, 'Service updated');
  }),

  /** DELETE /api/v1/admin/services/:id */
  delete: asyncHandler(async (_req: Request, res: Response) => {
    await serviceService.delete(_req.params.id);
    sendNoContent(res);
  }),

  /** GET /api/v1/admin/services */
  adminGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await serviceService.getAll(pagination, req.query.search as string);
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  /** GET /api/v1/admin/services/:id */
  getById: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.getById(req.params.id);
    sendSuccess(res, service, 200);
  }),

  /** GET /api/v1/services  (public) */
  publicGetAll: asyncHandler(async (_req: Request, res: Response) => {
    const services = await serviceService.getAllActive();
    sendSuccess(res, services, 200);
  }),
};
