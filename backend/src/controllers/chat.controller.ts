/**
 * AI Chat Controller
 */

import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendNoContent } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const chatController = {
  /** POST /api/v1/chat  — non-streaming */
  send: asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await chatService.sendMessage(req.body, req.admin?.admin_id);
    sendSuccess(res, result, 200);
  }),

  /** POST /api/v1/chat/stream  — Server-Sent Events streaming */
  stream: asyncHandler(async (req: AuthRequest, res: Response) => {
    await chatService.sendMessageStream(req.body, res, req.admin?.admin_id);
  }),

  /** GET /api/v1/chat/history/:sessionId */
  history: asyncHandler(async (req: Request, res: Response) => {
    const history = await chatService.getSessionHistory(req.params.sessionId);
    sendSuccess(res, history, 200);
  }),

  /** DELETE /api/v1/chat/session/:sessionId */
  clearSession: asyncHandler(async (req: Request, res: Response) => {
    await chatService.clearSession(req.params.sessionId);
    sendNoContent(res);
  }),

  /** PATCH /api/v1/chat/:chatId/feedback */
  feedback: asyncHandler(async (req: Request, res: Response) => {
    const result = await chatService.submitFeedback(
      req.params.chatId,
      req.body.was_helpful,
      req.body.feedback
    );
    sendSuccess(res, result, 200, 'Feedback submitted');
  }),
};
