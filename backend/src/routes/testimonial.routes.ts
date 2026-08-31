import { Router } from 'express';
import { testimonialController } from '../controllers/testimonial.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, uuidParam } from '../middleware/validate.middleware';
import { createTestimonialSchema, updateTestimonialSchema } from '../validators/testimonial.validator';

const router = Router();

// Public
router.get('/testimonials/featured', testimonialController.publicGetFeatured);
router.get('/testimonials',          testimonialController.publicGetAll);

// Admin
router.post('/admin/testimonials',            authenticate, validateBody(createTestimonialSchema), testimonialController.create);
router.get('/admin/testimonials',             authenticate,                                         testimonialController.adminGetAll);
router.put('/admin/testimonials/:id',         authenticate, validateParams(uuidParam), validateBody(updateTestimonialSchema), testimonialController.update);
router.patch('/admin/testimonials/:id/approve', authenticate, validateParams(uuidParam),            testimonialController.approve);
router.delete('/admin/testimonials/:id',      authenticate, validateParams(uuidParam),              testimonialController.delete);

export default router;
