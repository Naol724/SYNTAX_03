import { z } from 'zod';

export const createPortfolioSchema = z.object({
  project_name: z.string().min(2).max(150),
  portfolio_type: z.string().min(2).max(50),
  description: z.string().min(10),
  short_description: z.string().max(255).optional(),
  language_used: z.array(z.string().max(50)).optional(),
  project_link: z.string().url().optional().or(z.literal('')),
  github_link: z.string().url().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  client_name: z.string().max(100).optional(),
  completion_date: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  is_featured: z.boolean().optional().default(false),
  is_published: z.boolean().optional().default(true),
  display_order: z.number().int().min(0).optional().default(0),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
