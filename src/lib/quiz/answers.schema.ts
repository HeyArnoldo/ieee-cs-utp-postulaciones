import { z } from 'zod';

export const ContactAnswerSchema = z.object({
  email: z.string().email(),
  whatsapp: z.string().regex(/^9\d{8}$/, 'Must be 9 digits starting with 9'),
});

export const QuizAnswersSchema = z.object({
  name: z.string().min(1),
  career: z.enum(['sistemas', 'software', 'data', 'electronica', 'otra']),
  cycle: z.enum(['1-3', '4-6', '7-9', '10+']),
  interest: z.enum(['web', 'ai', 'cyber', 'cloud', 'game', 'iot', 'explore']),
  motivation: z.string().min(1),
  availability: z.enum(['2-4', '5-8', '9-12', '13+']),
  contact: ContactAnswerSchema,
});

export type QuizAnswersInput = z.input<typeof QuizAnswersSchema>;
