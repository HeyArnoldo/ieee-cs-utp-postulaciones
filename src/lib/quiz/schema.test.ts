// src/lib/quiz/schema.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateMotivation,
  validateEmail,
  validateWhatsapp,
  validateContact,
} from './schema';
import { QuizAnswersSchema } from './answers.schema';

describe('validateName', () => {
  it('rejects empty string', () => expect(validateName('')).toBe(false));
  it('rejects single word', () => expect(validateName('Ana')).toBe(false));
  it('accepts two words', () => expect(validateName('Ana Pérez')).toBe(true));
  it('trims whitespace', () => expect(validateName('  Ana Pérez  ')).toBe(true));
});

describe('validateMotivation', () => {
  it('rejects empty', () => expect(validateMotivation('')).toBe(false));
  it('rejects 59 chars', () => expect(validateMotivation('a'.repeat(59))).toBe(false));
  it('accepts 60 chars', () => expect(validateMotivation('a'.repeat(60))).toBe(true));
});

describe('validateEmail', () => {
  it('rejects plain text', () => expect(validateEmail('notanemail')).toBe(false));
  it('rejects missing dot after @', () => expect(validateEmail('a@b')).toBe(false));
  it('accepts valid email', () => expect(validateEmail('user@utp.edu.pe')).toBe(true));
});

describe('validateWhatsapp', () => {
  it('rejects empty', () => expect(validateWhatsapp('')).toBe(false));
  it('rejects not starting with 9', () => expect(validateWhatsapp('812345678')).toBe(false));
  it('accepts valid 9-digit starting with 9', () => expect(validateWhatsapp('912345678')).toBe(true));
  it('rejects 8 digits', () => expect(validateWhatsapp('91234567')).toBe(false));
  it('rejects 10 digits', () => expect(validateWhatsapp('9123456789')).toBe(false));
});

describe('validateContact', () => {
  it('accepts valid combo', () =>
    expect(validateContact({ email: 'user@utp.edu.pe', whatsapp: '912345678' })).toBe(true));
  it('rejects bad email', () =>
    expect(validateContact({ email: 'notanemail', whatsapp: '912345678' })).toBe(false));
  it('rejects bad whatsapp', () =>
    expect(validateContact({ email: 'user@utp.edu.pe', whatsapp: '812345678' })).toBe(false));
});

describe('QuizAnswersSchema', () => {
  const baseEstudiante = {
    name: 'Ana Pérez López',
    applicantType: 'estudiante' as const,
    career: 'sistemas' as const,
    cycle: '4-6' as const,
    interest: 'web' as const,
    motivation: 'a'.repeat(61),
    availability: '5-8' as const,
    contact: { email: 'ana@gmail.com', whatsapp: '912345678' },
  };

  const baseDocente = {
    name: 'Carlos Ríos Torres',
    applicantType: 'docente' as const,
    career: 'sistemas' as const,
    interest: 'ai' as const,
    motivation: 'a'.repeat(61),
    availability: '2-4' as const,
    contact: { email: 'carlos@gmail.com', whatsapp: '987654321' },
  };

  it('accepts valid estudiante with cycle', () => {
    const result = QuizAnswersSchema.safeParse(baseEstudiante);
    expect(result.success).toBe(true);
  });

  it('rejects estudiante without cycle', () => {
    const data = { ...baseEstudiante };
    // @ts-expect-error testing runtime behavior
    delete data.cycle;
    const result = QuizAnswersSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepts valid docente without cycle', () => {
    const result = QuizAnswersSchema.safeParse(baseDocente);
    expect(result.success).toBe(true);
  });

  it('accepts docente even when cycle is undefined', () => {
    const result = QuizAnswersSchema.safeParse({ ...baseDocente, cycle: undefined });
    expect(result.success).toBe(true);
  });

  it('rejects invalid applicantType', () => {
    const result = QuizAnswersSchema.safeParse({ ...baseEstudiante, applicantType: 'alumno' });
    expect(result.success).toBe(false);
  });

  it('accepts applicantType=estudiante', () => {
    const result = QuizAnswersSchema.safeParse({ ...baseEstudiante, applicantType: 'estudiante' });
    expect(result.success).toBe(true);
  });

  it('accepts applicantType=docente', () => {
    const result = QuizAnswersSchema.safeParse(baseDocente);
    expect(result.success).toBe(true);
  });

  it('rejects career=otra without careerOther', () => {
    const result = QuizAnswersSchema.safeParse({ ...baseEstudiante, career: 'otra' });
    expect(result.success).toBe(false);
  });

  it('rejects career=otra with empty careerOther', () => {
    const result = QuizAnswersSchema.safeParse({ ...baseEstudiante, career: 'otra', careerOther: '  ' });
    expect(result.success).toBe(false);
  });

  it('accepts career=otra with non-empty careerOther', () => {
    const result = QuizAnswersSchema.safeParse({ ...baseEstudiante, career: 'otra', careerOther: 'Matemáticas' });
    expect(result.success).toBe(true);
  });

  it('accepts career!=otra without careerOther', () => {
    const result = QuizAnswersSchema.safeParse({ ...baseEstudiante, career: 'software' });
    expect(result.success).toBe(true);
  });

  it('accepts all new career values', () => {
    const careers = ['industrial', 'mecatronica', 'psicologia', 'comunicaciones'] as const;
    for (const career of careers) {
      const result = QuizAnswersSchema.safeParse({ ...baseEstudiante, career });
      expect(result.success).toBe(true);
    }
  });
});
