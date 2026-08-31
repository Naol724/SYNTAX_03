import { z } from 'zod';

export const createMessageSchema = z.object({
  sender_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  sender_email: z.string().email('Invalid email address'),
  sender_phone: z.string().max(20).optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  message_type: z.enum(['inquiry', 'support', 'feedback']).optional().default('inquiry'),
});

export const updateMessageSchema = z.object({
  status: z.enum(['unread', 'read', 'archived', 'responded']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  admin_notes: z.string().max(2000).optional(),
});

export const messageFilterSchema = z.object({
  status: z.enum(['unread', 'read', 'archived', 'responded']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  message_type: z.enum(['inquiry', 'support', 'feedback']).optional(),
  page: z.string().optional().transform((v) => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v) : 20)),
  search: z.string().optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type MessageFilterInput = z.infer<typeof messageFilterSchema>;
