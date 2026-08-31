import { Router } from 'express';
import { developerController } from '../controllers/developer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, uuidParam } from '../middleware/validate.middleware';
import { createDeveloperSchema, updateDeveloperSchema } from '../validators/developer.validator';

const router = Router();

// Public
router.get('/developers',     developerController.publicGetAll);
router.get('/developers/:id', validateParams(uuidParam), developerController.getById);

// Admin
router.post('/admin/developers',       authenticate, validateBody(createDeveloperSchema),  developerController.create);
router.get('/admin/developers',        authenticate,                                         developerController.adminGetAll);
router.get('/admin/developers/:id',    authenticate, validateParams(uuidParam),              developerController.getById);
router.put('/admin/developers/:id',    authenticate, validateParams(uuidParam), validateBody(updateDeveloperSchema), developerController.update);
router.delete('/admin/developers/:id', authenticate, validateParams(uuidParam),              developerController.delete);

export default router;
