import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  type: z.string().min(2).max(50),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  short_description: z.string().max(255).optional(),
  language: z.array(z.string().max(50)).optional(),
  property: z.record(z.any()).optional(),
  icon_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().optional().default(true),
  display_order: z.number().int().min(0).optional().default(0),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
