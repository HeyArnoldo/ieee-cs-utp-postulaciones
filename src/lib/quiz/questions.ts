// src/lib/quiz/questions.ts
import type { QuizAnswers } from './schema';
import { validateName, validateMotivation, validateContact } from './schema';

export type QuestionKind = 'text' | 'choice' | 'textarea' | 'contact';

export type ChoiceOption = {
  v: string;
  label: string;
  emoji: string;
};

export type QuestionConfig = {
  id: keyof QuizAnswers;
  kind: QuestionKind;
  qn: string;
  title: string;
  hint: string;
  placeholder?: string;
  options?: ChoiceOption[];
  aiLine: string;
  validate: (answers: Partial<QuizAnswers>) => boolean;
  showIf?: (answers: Partial<QuizAnswers>) => boolean;
};

export const QUESTIONS: readonly QuestionConfig[] = [
  {
    id: 'name',
    kind: 'text',
    qn: '01 · Empecemos suave',
    title: '¿Cómo te llamas?',
    hint: 'Tu nombre y apellido como aparecen en tu DNI o credencial UTP.',
    placeholder: 'Ej: Daniela Martínez Sánchez',
    aiLine: 'Sara IA analizará tu nombre para personalizar tu evaluación.',
    validate: (answers) => validateName(answers.name ?? ''),
  },
  {
    id: 'applicantType',
    kind: 'choice',
    qn: '02 · Tu perfil',
    title: '¿Cómo te postulas?',
    hint: 'El capítulo recibe tanto estudiantes como docentes.',
    options: [
      { v: 'estudiante', label: 'Estudiante', emoji: '🎓' },
      { v: 'docente', label: 'Docente', emoji: '👨‍🏫' },
    ] as ChoiceOption[],
    aiLine: 'Sara IA adapta la evaluación según tu perfil.',
    validate: (answers) => {
      const v = answers.applicantType;
      return typeof v === 'string' && v.length > 0;
    },
  },
  {
    id: 'career',
    kind: 'choice',
    qn: '03 · Tu carrera',
    title: '¿Cuál es tu carrera?',
    hint: 'Tu carrera o área académica.',
    options: [
      { v: 'sistemas', label: 'Ing. de Sistemas e Informática', emoji: '💻' },
      { v: 'software', label: 'Ing. de Software', emoji: '⚙️' },
      { v: 'data', label: 'Ing. en Ciencia de Datos', emoji: '📊' },
      { v: 'electronica', label: 'Ing. Electrónica / Telecomunicaciones', emoji: '📡' },
      { v: 'industrial', label: 'Ing. Industrial', emoji: '🏭' },
      { v: 'mecatronica', label: 'Ing. Mecatrónica', emoji: '🤖' },
      { v: 'psicologia', label: 'Psicología', emoji: '🧠' },
      { v: 'comunicaciones', label: 'Comunicaciones', emoji: '📢' },
      { v: 'otra', label: 'Otra', emoji: '✨' },
    ] as ChoiceOption[],
    aiLine: 'Sara IA considera tu carrera para mapear tu perfil técnico.',
    validate: (answers) => {
      const v = answers.career;
      if (typeof v !== 'string' || v.length === 0) return false;
      if (v === 'otra') return typeof answers.careerOther === 'string' && answers.careerOther.trim().length > 0;
      return true;
    },
  },
  {
    id: 'cycle',
    kind: 'choice',
    qn: '04 · Tu momento',
    title: '¿En qué ciclo estás?',
    hint: 'No hay ciclo "ideal" — buscamos curiosidad, no antigüedad.',
    options: [
      { v: '1-3', label: 'Ciclo 1 – 3 (recién empezando)', emoji: '🌱' },
      { v: '4-6', label: 'Ciclo 4 – 6 (en plena base)', emoji: '🚀' },
      { v: '7-9', label: 'Ciclo 7 – 9 (recta final)', emoji: '🔥' },
      { v: '10+', label: 'Ciclo 10+ / egresado reciente', emoji: '🎓' },
    ] as ChoiceOption[],
    aiLine: 'Sara IA calibra expectativas según tu ciclo actual.',
    showIf: (answers) => answers.applicantType === 'estudiante',
    validate: (answers) => {
      const v = answers.cycle;
      return typeof v === 'string' && v.length > 0;
    },
  },
  {
    id: 'interest',
    kind: 'choice',
    qn: '05 · Tu obsesión técnica',
    title: '¿Qué área te emociona más AHORA?',
    hint: 'No la que "deberías" querer — la que realmente te llama hoy.',
    options: [
      { v: 'web', label: 'Desarrollo Web / Mobile', emoji: '🌐' },
      { v: 'ai', label: 'IA / Machine Learning', emoji: '🧠' },
      { v: 'cyber', label: 'Ciberseguridad / Hacking ético', emoji: '🛡️' },
      { v: 'cloud', label: 'Cloud / DevOps / Infra', emoji: '☁️' },
      { v: 'game', label: 'Game dev / Gráficos', emoji: '🎮' },
      { v: 'iot', label: 'IoT / Robótica / Hardware', emoji: '🤖' },
      { v: 'explore', label: 'Aún no sé — quiero explorar', emoji: '🧭' },
    ] as ChoiceOption[],
    aiLine: 'Sara IA alinea tu perfil con proyectos activos del capítulo.',
    validate: (answers) => {
      const v = answers.interest;
      return typeof v === 'string' && v.length > 0;
    },
  },
  {
    id: 'motivation',
    kind: 'textarea',
    qn: '06 · La pregunta de oro',
    title: '¿Por qué quieres entrar al capítulo?',
    hint: 'Sé tú mismo. 2–3 oraciones bastan. No queremos respuestas de manual — queremos saber qué te mueve.',
    placeholder: 'Ej: Llevo un año intentando construir proyectos solo...',
    aiLine: 'Sara IA detecta autenticidad y motivación genuina en tu respuesta.',
    validate: (answers) => validateMotivation(answers.motivation ?? ''),
  },
  {
    id: 'followUp',
    kind: 'textarea' as const,
    qn: '07 · Pregunta personalizada',
    title: '',
    hint: 'Cuéntanos con detalle (mínimo 20 caracteres)',
    aiLine: 'Sara IA está leyendo tu respuesta…',
    validate: (answers: Partial<QuizAnswers>) =>
      !!(answers.followUp?.answer && answers.followUp.answer.trim().length >= 20),
  },
  {
    id: 'availability',
    kind: 'choice',
    qn: '08 · El compromiso',
    title: '¿Cuántas horas a la semana puedes dedicarle?',
    hint: 'Sé honesto. Preferimos 4h consistentes que 10h irregulares.',
    options: [
      { v: '2-4', label: '2 – 4 horas (lo justo y consistente)', emoji: '🌿' },
      { v: '5-8', label: '5 – 8 horas (involucrado de verdad)', emoji: '🌳' },
      { v: '9-12', label: '9 – 12 horas (full inmersión)', emoji: '🌲' },
      { v: '13+', label: '13+ horas (modo bestia)', emoji: '⚡' },
    ] as ChoiceOption[],
    aiLine: 'Sara IA evalúa compatibilidad con el ritmo del capítulo.',
    validate: (answers) => {
      const v = answers.availability;
      return typeof v === 'string' && v.length > 0;
    },
  },
  {
    id: 'contact',
    kind: 'contact',
    qn: '09 · Cómo te ubicamos',
    title: '¿Dónde te contacta RRHH?',
    hint: 'Si pasas el filtro, te escribimos en menos de 48h por WhatsApp...',
    aiLine: 'Sara IA verifica que tus datos de contacto estén completos.',
    validate: (answers) => {
      const v = answers.contact;
      if (!v) return false;
      return validateContact(v);
    },
  },
] as const;
