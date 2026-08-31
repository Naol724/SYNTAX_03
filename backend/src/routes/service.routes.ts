import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, uuidParam } from '../middleware/validate.middleware';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator';

const router = Router();

// Public
router.get('/services', serviceController.publicGetAll);
router.get('/services/:id', validateParams(uuidParam), serviceController.getById);

// Admin (protected)
router.post('/admin/services',     authenticate, validateBody(createServiceSchema),  serviceController.create);
router.get('/admin/services',      authenticate,                                     serviceController.adminGetAll);
router.get('/admin/services/:id',  authenticate, validateParams(uuidParam),          serviceController.getById);
router.put('/admin/services/:id',  authenticate, validateParams(uuidParam), validateBody(updateServiceSchema), serviceController.update);
router.delete('/admin/services/:id', authenticate, validateParams(uuidParam),        serviceController.delete);

export default router;
