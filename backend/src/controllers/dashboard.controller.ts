/**
 * Dashboard Controller
 */

import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const dashboardController = {
  /** GET /api/v1/admin/dashboard */
  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    sendSuccess(res, stats, 200);
  }),
};
