import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, uuidParam } from '../middleware/validate.middleware';
import { createMessageSchema, updateMessageSchema } from '../validators/message.validator';

const router = Router();

// Public — anyone can send a message
router.post('/messages', validateBody(createMessageSchema), messageController.create);

// Admin
router.get('/admin/messages/stats',      authenticate,                                       messageController.getStats);
router.get('/admin/messages',            authenticate,                                       messageController.getAll);
router.get('/admin/messages/:id',        authenticate, validateParams(uuidParam),            messageController.getById);
router.patch('/admin/messages/:id',      authenticate, validateParams(uuidParam), validateBody(updateMessageSchema), messageController.update);
router.patch('/admin/messages/:id/archive', authenticate, validateParams(uuidParam),         messageController.archive);
router.delete('/admin/messages/:id',     authenticate, validateParams(uuidParam),            messageController.delete);

export default router;
