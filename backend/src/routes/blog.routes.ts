import { Router } from 'express';
import { blogController } from '../controllers/blog.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, uuidParam, slugParam } from '../middleware/validate.middleware';
import { createBlogSchema, updateBlogSchema } from '../validators/blog.validator';

const router = Router();

// Public — order matters: specific before parameterized
router.get('/blog/featured',         blogController.publicGetFeatured);
router.get('/blog/categories',       blogController.getCategories);
router.get('/blog',                  blogController.publicGetAll);
router.get('/blog/:slug',            validateParams(slugParam), blogController.publicGetBySlug);

// Admin (protected)
router.post('/admin/blog',                    authenticate, validateBody(createBlogSchema),  blogController.create);
router.get('/admin/blog',                     authenticate,                                   blogController.adminGetAll);
router.get('/admin/blog/:id',                 authenticate, validateParams(uuidParam),        blogController.adminGetById);
router.put('/admin/blog/:id',                 authenticate, validateParams(uuidParam), validateBody(updateBlogSchema), blogController.update);
router.patch('/admin/blog/:id/publish',       authenticate, validateParams(uuidParam),        blogController.publish);
router.patch('/admin/blog/:id/unpublish',     authenticate, validateParams(uuidParam),        blogController.unpublish);
router.delete('/admin/blog/:id',              authenticate, validateParams(uuidParam),        blogController.delete);

export default router;
