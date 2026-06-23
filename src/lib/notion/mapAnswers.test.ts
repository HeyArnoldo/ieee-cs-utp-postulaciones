import { describe, it, expect } from 'vitest';
import { mapAnswersToNotionPage } from './mapAnswers';
import type { QuizAnswers } from '@/lib/quiz/schema';

const DB_ID = 'test-db-id';

const baseAnswers: QuizAnswers = {
  name: 'Ana Pérez López',
  career: 'sistemas',
  cycle: '4-6',
  interest: 'web',
  motivation: 'Quiero aprender y crecer en el mundo de la tecnología con IEEE.',
  availability: '5-8',
  contact: { email: 'ana@gmail.com', whatsapp: '912345678' },
};

describe('mapAnswersToNotionPage', () => {
  // --- career mapping ---
  it('maps sistemas → Ing. de Sistemas e Informática', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, career: 'sistemas' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. de Sistemas e Informática' } });
  });
  it('maps software → Ing. de Software', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, career: 'software' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. de Software' } });
  });
  it('maps data → Ciencias de la Computación', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, career: 'data' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ciencias de la Computación' } });
  });
  it('maps electronica → Ing. Electrónica', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, career: 'electronica' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. Electrónica' } });
  });
  it('maps otra → Otra', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, career: 'otra' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Otra' } });
  });

  // --- cycle → number (lower bound) ---
  it('maps cycle 1-3 → 1', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, cycle: '1-3' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 1 });
  });
  it('maps cycle 4-6 → 4', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, cycle: '4-6' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 4 });
  });
  it('maps cycle 7-9 → 7', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, cycle: '7-9' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 7 });
  });
  it('maps cycle 10+ → 10', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, cycle: '10+' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 10 });
  });

  // --- email routing ---
  it('routes utp.edu.pe email to Correo institucional UTP', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, contact: { email: 'ana@utp.edu.pe', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['Correo institucional UTP']).toEqual({ email: 'ana@utp.edu.pe' });
    expect(result.properties!['Correo personal']).toBeUndefined();
  });
  it('routes gmail to Correo personal', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, contact: { email: 'ana@gmail.com', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['Correo personal']).toEqual({ email: 'ana@gmail.com' });
    expect(result.properties!['Correo institucional UTP']).toBeUndefined();
  });
  it('routes UTP.EDU.PE (uppercase) to Correo institucional UTP (case-insensitive)', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, contact: { email: 'ana@UTP.EDU.PE', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['Correo institucional UTP']).toEqual({ email: 'ana@UTP.EDU.PE' });
    expect(result.properties!['Correo personal']).toBeUndefined();
  });

  // --- whatsapp formatting ---
  it('formats whatsapp with +51 prefix', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, contact: { email: 'ana@gmail.com', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['WhatsApp']).toEqual({ phone_number: '+51 912345678' });
  });

  // --- interest → multi_select ---
  it('maps web → ["Programación"]', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, interest: 'web' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'Programación' }] });
  });
  it('maps ai → ["IA"]', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, interest: 'ai' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'IA' }] });
  });
  it('maps cyber → ["Ciberseguridad"]', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, interest: 'cyber' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'Ciberseguridad' }] });
  });
  it('maps game → ["Videojuegos"]', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, interest: 'game' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'Videojuegos' }] });
  });
  it('maps cloud → [] (empty, for AI to suggest)', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, interest: 'cloud' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [] });
  });
  it('maps iot → [] (empty, for AI to suggest)', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, interest: 'iot' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [] });
  });
  it('maps explore → [] (empty, for AI to suggest)', () => {
    const result = mapAnswersToNotionPage({ ...baseAnswers, interest: 'explore' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [] });
  });

  // --- title ---
  it('sets Nombres y Apellidos title from name', () => {
    const result = mapAnswersToNotionPage(baseAnswers, DB_ID);
    expect(result.properties!['Nombres y Apellidos']).toEqual({
      title: [{ text: { content: 'Ana Pérez López' } }],
    });
  });

  // --- page body ---
  it('body includes motivation paragraph', () => {
    const result = mapAnswersToNotionPage(baseAnswers, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> }; heading_2?: unknown }>;
    const motivationBlock = children.find(
      (b) => b.paragraph?.rich_text[0]?.text?.content?.startsWith('Motivación:')
    );
    expect(motivationBlock).toBeDefined();
    expect(motivationBlock!.paragraph!.rich_text[0].text.content).toContain(baseAnswers.motivation);
  });
  it('body includes availability paragraph', () => {
    const result = mapAnswersToNotionPage(baseAnswers, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find(
      (b) => b.paragraph?.rich_text[0]?.text?.content?.startsWith('Disponibilidad declarada:')
    );
    expect(block).toBeDefined();
  });
  it('body includes AI analysis placeholder heading', () => {
    const result = mapAnswersToNotionPage(baseAnswers, DB_ID);
    const children = result.children as Array<{ heading_2?: { rich_text: Array<{ text: { content: string } }> } }>;
    const heading = children.find(
      (b) => b.heading_2?.rich_text[0]?.text?.content === 'Análisis IA (pendiente)'
    );
    expect(heading).toBeDefined();
  });

  // --- database_id ---
  it('sets database_id correctly', () => {
    const result = mapAnswersToNotionPage(baseAnswers, DB_ID);
    expect(result.parent).toEqual({ database_id: DB_ID });
  });
});
