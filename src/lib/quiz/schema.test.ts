// src/lib/quiz/schema.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateMotivation,
  validateEmail,
  validateWhatsapp,
  validateContact,
} from './schema';

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
