import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z
    .string()
    .min(3)
    .max(250)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().max(500).optional(),
  category: z.string().min(2).max(50),
  tags: z.array(z.string().max(50)).optional(),
  featured_image_url: z.string().url().optional().or(z.literal('')),
  author_name: z.string().max(100).optional(),
  publish_date: z.string().datetime().optional(),
  is_published: z.boolean().optional().default(false),
  is_featured: z.boolean().optional().default(false),
  read_time_minutes: z.number().int().min(1).optional(),
  seo_title: z.string().max(200).optional(),
  seo_description: z.string().max(300).optional(),
  seo_keywords: z.array(z.string().max(50)).optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const publishBlogSchema = z.object({
  publish_date: z.string().datetime().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
