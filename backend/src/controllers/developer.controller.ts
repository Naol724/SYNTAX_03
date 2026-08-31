/**
 * Developer Controller
 */

import { Request, Response } from 'express';
import { developerService } from '../services/developer.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated, sendNoContent, parsePaginationParams, buildPaginationMeta } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const developerController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const dev = await developerService.create(req.admin!.admin_id, req.body);
    sendCreated(res, dev, 'Developer profile created');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const dev = await developerService.update(req.params.id, req.body);
    sendSuccess(res, dev, 200, 'Developer profile updated');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await developerService.delete(req.params.id);
    sendNoContent(res);
  }),

  adminGetAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query);
    const result = await developerService.getAll(pagination, req.query.search as string);
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const dev = await developerService.getById(req.params.id);
    sendSuccess(res, dev, 200);
  }),

  publicGetAll: asyncHandler(async (_req: Request, res: Response) => {
    const devs = await developerService.getAllActive();
    sendSuccess(res, devs, 200);
  }),
};
