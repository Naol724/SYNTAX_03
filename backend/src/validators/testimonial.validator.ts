import { z } from 'zod';

export const createTestimonialSchema = z.object({
  client_name: z.string().min(2).max(100),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
  rating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating cannot exceed 5')
    .multipleOf(0.5, 'Rating must be in 0.5 increments'),
  portfolio_id: z.string().uuid().optional(),
  project_type: z.string().max(50).optional(),
  position_work: z.string().max(100).optional(),
  company_name: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean().optional().default(false),
  is_approved: z.boolean().optional().default(false),
  display_order: z.number().int().min(0).optional().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
