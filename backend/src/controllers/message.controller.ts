/**
 * Message Controller
 */

import { Request, Response } from 'express';
import { messageService } from '../services/message.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated, sendNoContent, parsePaginationParams, buildPaginationMeta } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const messageController = {
  /** POST /api/v1/messages  — public, no auth required */
  create: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.create(req.body);
    sendCreated(res, { message_id: message.message_id }, 'Message sent successfully');
  }),

  /** GET /api/v1/admin/messages */
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePaginationParams(req.query, 20);
    const result = await messageService.getAll(pagination, {
      status: req.query.status as string,
      priority: req.query.priority as string,
      message_type: req.query.message_type as string,
      search: req.query.search as string,
    });
    sendSuccess(res, result.data, 200, undefined, buildPaginationMeta(result.page, result.limit, result.total));
  }),

  /** GET /api/v1/admin/messages/stats */
  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await messageService.getStats();
    sendSuccess(res, stats, 200);
  }),

  /** GET /api/v1/admin/messages/:id */
  getById: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.getById(req.params.id);
    sendSuccess(res, message, 200);
  }),

  /** PATCH /api/v1/admin/messages/:id */
  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const message = await messageService.update(req.params.id, req.body, req.admin!.admin_id);
    sendSuccess(res, message, 200, 'Message updated');
  }),

  /** PATCH /api/v1/admin/messages/:id/archive */
  archive: asyncHandler(async (req: AuthRequest, res: Response) => {
    const message = await messageService.archive(req.params.id, req.admin!.admin_id);
    sendSuccess(res, message, 200, 'Message archived');
  }),

  /** DELETE /api/v1/admin/messages/:id */
  delete: asyncHandler(async (req: Request, res: Response) => {
    await messageService.delete(req.params.id);
    sendNoContent(res);
  }),
};
