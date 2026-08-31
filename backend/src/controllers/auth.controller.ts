/**
 * Auth Controller
 * Handles HTTP requests for authentication endpoints.
 */

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const authController = {
  /** POST /api/v1/admin/login */
  login: asyncHandler(async (req: Request, res: Response) => {
    const auth = await authService.adminLogin(
      req.body,
      req.headers['user-agent'],
      req.ip
    );
    sendSuccess(res, auth, 200, 'Login successful');
  }),

  /** POST /api/v1/admin/logout */
  logout: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (refreshToken) await authService.adminLogout(refreshToken);
    sendSuccess(res, null, 200, 'Logged out successfully');
  }),

  /** POST /api/v1/admin/refresh */
  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, result, 200, 'Token refreshed');
  }),

  /** POST /api/v1/users/register */
  registerUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.registerUser(req.body);
    sendCreated(res, user, 'Registration successful');
  }),

  /** GET /api/v1/admin/me */
  me: asyncHandler(async (req: AuthRequest, res: Response) => {
    sendSuccess(res, req.admin, 200);
  }),

  /** PATCH /api/v1/admin/change-password */
  changePassword: asyncHandler(async (req: AuthRequest, res: Response) => {
    await authService.changePassword(
      req.admin!.admin_id,
      req.body.currentPassword,
      req.body.newPassword
    );
    sendNoContent(res);
  }),
};
