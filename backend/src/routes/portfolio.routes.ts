import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, uuidParam } from '../middleware/validate.middleware';
import { createPortfolioSchema, updatePortfolioSchema } from '../validators/portfolio.validator';

const router = Router();

// Public
router.get('/portfolio/featured', portfolioController.publicGetFeatured);
router.get('/portfolio',          portfolioController.publicGetAll);
router.get('/portfolio/:id',      validateParams(uuidParam), portfolioController.getById);

// Admin (protected)
router.post('/admin/portfolio',        authenticate, validateBody(createPortfolioSchema),  portfolioController.create);
router.get('/admin/portfolio',         authenticate,                                        portfolioController.adminGetAll);
router.get('/admin/portfolio/:id',     authenticate, validateParams(uuidParam),             portfolioController.getById);
router.put('/admin/portfolio/:id',     authenticate, validateParams(uuidParam), validateBody(updatePortfolioSchema), portfolioController.update);
router.delete('/admin/portfolio/:id',  authenticate, validateParams(uuidParam),             portfolioController.delete);

export default router;
