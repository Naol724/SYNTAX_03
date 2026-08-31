import { z } from 'zod';

const socialMediaSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
}).optional();

export const createDeveloperSchema = z.object({
  full_name: z.string().min(2).max(100),
  skill: z.array(z.string().max(50)).min(1, 'At least one skill is required'),
  position: z.string().min(2).max(100),
  bio: z.string().max(1000).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone_number: z.string().max(20).optional(),
  social_media_links: socialMediaSchema,
  years_of_experience: z.number().int().min(0).max(50).optional(),
  is_active: z.boolean().optional().default(true),
  display_order: z.number().int().min(0).optional().default(0),
});

export const updateDeveloperSchema = createDeveloperSchema.partial();

export type CreateDeveloperInput = z.infer<typeof createDeveloperSchema>;
export type UpdateDeveloperInput = z.infer<typeof updateDeveloperSchema>;
