import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { sendChatMessageSchema, chatFeedbackSchema } from '../validators/chat.validator';

const router = Router();

// Chat — optional auth (logged-in users get history persistence)
router.post('/chat',                          optionalAuth, validateBody(sendChatMessageSchema), chatController.send);
router.post('/chat/stream',                   optionalAuth, validateBody(sendChatMessageSchema), chatController.stream);
router.get('/chat/history/:sessionId',        chatController.history);
router.delete('/chat/session/:sessionId',     chatController.clearSession);
router.patch('/chat/:chatId/feedback',        validateBody(chatFeedbackSchema), chatController.feedback);

export default router;
