import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  loginSchema,
  refreshTokenSchema,
  registerUserSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Admin auth
router.post('/admin/login',   validateBody(loginSchema),        authController.login);
router.post('/admin/logout',  validateBody(refreshTokenSchema), authController.logout);
router.post('/admin/refresh', validateBody(refreshTokenSchema), authController.refresh);
router.get('/admin/me',       authenticate,                     authController.me);
router.patch('/admin/change-password', authenticate, validateBody(changePasswordSchema), authController.changePassword);

// User registration
router.post('/users/register', validateBody(registerUserSchema), authController.registerUser);

export default router;
