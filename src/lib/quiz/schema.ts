// src/lib/quiz/schema.ts

export type ApplicantTypeValue = 'estudiante' | 'docente';
export type CareerValue = 'sistemas' | 'software' | 'data' | 'electronica' | 'industrial' | 'mecatronica' | 'psicologia' | 'comunicaciones' | 'administracion' | 'otra';
export type CycleValue = '1-3' | '4-6' | '7-9' | '10+';
export type InterestValue = 'web' | 'ai' | 'cyber' | 'cloud' | 'game' | 'iot' | 'explore' | 'design' | 'marketing' | 'ops' | 'people';
export type PapersValue = '0' | '1' | '2' | '3' | '4' | '5+' | 'pendiente';
export type AvailabilityValue = '2-4' | '5-8' | '9-12' | '13+';

export type ContactAnswer = {
  email: string;
  whatsapp: string;
};

export type QuizAnswers = {
  name: string;
  applicantType: ApplicantTypeValue;
  career: CareerValue;
  cycle?: CycleValue;
  careerOther?: string;
  papers?: PapersValue;
  interest: InterestValue;
  motivation: string;
  availability: AvailabilityValue;
  contact: ContactAnswer;
  followUp?: { question: string; answer: string };
};

export function validateName(v: string): boolean {
  const words = v.trim().split(/\s+/).filter(Boolean);
  return words.length >= 2;
}

export function validateMotivation(v: string): boolean {
  return v.trim().length >= 60;
}

export function validateEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validateWhatsapp(v: string): boolean {
  return /^9\d{8}$/.test(v);
}

export function validateContact(v: ContactAnswer): boolean {
  return validateEmail(v.email) && validateWhatsapp(v.whatsapp);
}
