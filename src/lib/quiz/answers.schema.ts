import { z } from 'zod';

export const ContactAnswerSchema = z.object({
  email: z.string().email(),
  whatsapp: z.string().regex(/^9\d{8}$/, 'Must be 9 digits starting with 9'),
});

export const FollowUpSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type FollowUpInput = z.infer<typeof FollowUpSchema>;

export const QuizAnswersSchema = z
  .object({
    name: z.string().min(1),
    applicantType: z.enum(['estudiante', 'docente']),
    career: z.enum([
      'sistemas',
      'software',
      'data',
      'electronica',
      'industrial',
      'mecatronica',
      'psicologia',
      'comunicaciones',
      'administracion',
      'otra',
    ]),
    cycle: z.enum(['1-3', '4-6', '7-9', '10+']).optional(),
    careerOther: z.string().optional(),
    papers: z.enum(['0', '1', '2', '3', '4', '5+', 'pendiente']).optional(),
    interest: z.enum(['web', 'ai', 'cyber', 'cloud', 'game', 'iot', 'explore', 'design', 'marketing', 'ops', 'people']),
    motivation: z.string().min(1),
    availability: z.enum(['2-4', '5-8', '9-12', '13+']),
    contact: ContactAnswerSchema,
    followUp: FollowUpSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.applicantType === 'estudiante') return data.cycle !== undefined;
      return true;
    },
    { message: 'cycle is required for estudiante', path: ['cycle'] },
  )
  .refine(
    (data) => {
      if (data.career === 'otra') return typeof data.careerOther === 'string' && data.careerOther.trim().length > 0;
      return true;
    },
    { message: 'careerOther is required when career is otra', path: ['careerOther'] },
  );

export type QuizAnswersInput = z.input<typeof QuizAnswersSchema>;
