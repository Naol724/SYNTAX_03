import { z } from 'zod';

export const sendChatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message cannot exceed 2000 characters'),
  session_id: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export const chatFeedbackSchema = z.object({
  was_helpful: z.boolean(),
  feedback: z.string().max(500).optional(),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
export type ChatFeedbackInput = z.infer<typeof chatFeedbackSchema>;
