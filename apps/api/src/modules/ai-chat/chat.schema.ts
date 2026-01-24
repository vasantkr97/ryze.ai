import { z } from 'zod';

export const sendMessageSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
});

export const createSessionSchema = z.object({
  title: z.string().max(100).optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
