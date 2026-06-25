import { describe, it, expect } from 'vitest';
import { mapAnswersToNotionPage } from './mapAnswers';
import type { QuizAnswers } from '@/lib/quiz/schema';

const DB_ID = 'test-db-id';

const baseEstudiante: QuizAnswers = {
  name: 'Ana Pérez López',
  applicantType: 'estudiante',
  career: 'sistemas',
  cycle: '4-6',
  interest: 'web',
  motivation: 'Quiero aprender y crecer en el mundo de la tecnología con IEEE.',
  availability: '5-8',
  contact: { email: 'ana@gmail.com', whatsapp: '912345678' },
};

const baseDocente: QuizAnswers = {
  name: 'Carlos Ríos Torres',
  applicantType: 'docente',
  career: 'sistemas',
  interest: 'ai',
  motivation: 'Quiero contribuir a la formación de futuros ingenieros en el capítulo IEEE.',
  availability: '2-4',
  contact: { email: 'carlos@gmail.com', whatsapp: '987654321' },
};

describe('mapAnswersToNotionPage', () => {
  // --- career mapping (Notion SELECT) ---
  it('maps sistemas → Ing. de Sistemas e Informática', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'sistemas' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. de Sistemas e Informática' } });
  });
  it('maps software → Ing. de Software', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'software' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. de Software' } });
  });
  it('maps data → Ciencias de la Computación', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'data' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ciencias de la Computación' } });
  });
  it('maps electronica → Ing. Electrónica', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'electronica' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. Electrónica' } });
  });
  it('maps industrial → Ing. Industrial', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'industrial' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. Industrial' } });
  });
  it('maps mecatronica → Ing. Mecatrónica', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'mecatronica' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Ing. Mecatrónica' } });
  });
  it('maps psicologia → Otra', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'psicologia' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Otra' } });
  });
  it('maps comunicaciones → Otra', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'comunicaciones' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Otra' } });
  });
  it('maps otra → Otra', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'otra', careerOther: 'Matemáticas' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Otra' } });
  });

  // --- cycle → number (lower bound) ---
  it('maps cycle 1-3 → 1 for estudiante', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, cycle: '1-3' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 1 });
  });
  it('maps cycle 4-6 → 4 for estudiante', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, cycle: '4-6' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 4 });
  });
  it('maps cycle 7-9 → 7 for estudiante', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, cycle: '7-9' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 7 });
  });
  it('maps cycle 10+ → 10 for estudiante', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, cycle: '10+' }, DB_ID);
    expect(result.properties!['Ciclo']).toEqual({ number: 10 });
  });

  // --- docente: NO Ciclo property ---
  it('docente: does NOT set Ciclo property', () => {
    const result = mapAnswersToNotionPage(baseDocente, DB_ID);
    expect(result.properties!['Ciclo']).toBeUndefined();
  });

  // --- body: tipo de postulante ---
  it('estudiante: body contains "Tipo de postulante: Estudiante"', () => {
    const result = mapAnswersToNotionPage(baseEstudiante, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content === 'Tipo de postulante: Estudiante');
    expect(block).toBeDefined();
  });
  it('docente: body contains "Tipo de postulante: Docente"', () => {
    const result = mapAnswersToNotionPage(baseDocente, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content === 'Tipo de postulante: Docente');
    expect(block).toBeDefined();
  });

  // --- body: Carrera declarada ---
  it('psicologia → body contains "Carrera declarada: Psicología"', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'psicologia' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content === 'Carrera declarada: Psicología');
    expect(block).toBeDefined();
  });
  it('otra + careerOther → body contains "Carrera declarada: Matemáticas"', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'otra', careerOther: 'Matemáticas' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content === 'Carrera declarada: Matemáticas');
    expect(block).toBeDefined();
  });

  // --- email routing ---
  it('routes utp.edu.pe email to Correo institucional UTP', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, contact: { email: 'ana@utp.edu.pe', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['Correo institucional UTP']).toEqual({ email: 'ana@utp.edu.pe' });
    expect(result.properties!['Correo personal']).toBeUndefined();
  });
  it('routes gmail to Correo personal', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, contact: { email: 'ana@gmail.com', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['Correo personal']).toEqual({ email: 'ana@gmail.com' });
    expect(result.properties!['Correo institucional UTP']).toBeUndefined();
  });
  it('routes UTP.EDU.PE (uppercase) to Correo institucional UTP (case-insensitive)', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, contact: { email: 'ana@UTP.EDU.PE', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['Correo institucional UTP']).toEqual({ email: 'ana@UTP.EDU.PE' });
    expect(result.properties!['Correo personal']).toBeUndefined();
  });

  // --- whatsapp formatting ---
  it('formats whatsapp with +51 prefix', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, contact: { email: 'ana@gmail.com', whatsapp: '912345678' } }, DB_ID);
    expect(result.properties!['WhatsApp']).toEqual({ phone_number: '+51 912345678' });
  });

  // --- interest → multi_select ---
  it('maps web → ["Programación"]', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'web' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'Programación' }] });
  });
  it('maps ai → ["IA"]', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'ai' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'IA' }] });
  });
  it('maps cyber → ["Ciberseguridad"]', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'cyber' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'Ciberseguridad' }] });
  });
  it('maps game → ["Videojuegos"]', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'game' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [{ name: 'Videojuegos' }] });
  });
  it('maps cloud → [] (empty, for AI to suggest)', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'cloud' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [] });
  });
  it('maps iot → [] (empty, for AI to suggest)', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'iot' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [] });
  });
  it('maps explore → [] (empty, for AI to suggest)', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'explore' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [] });
  });

  // --- title ---
  it('sets Nombres y Apellidos title from name', () => {
    const result = mapAnswersToNotionPage(baseEstudiante, DB_ID);
    expect(result.properties!['Nombres y Apellidos']).toEqual({
      title: [{ text: { content: 'Ana Pérez López' } }],
    });
  });

  // --- page body ---
  it('body includes motivation paragraph', () => {
    const result = mapAnswersToNotionPage(baseEstudiante, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> }; heading_2?: unknown }>;
    const motivationBlock = children.find(
      (b) => b.paragraph?.rich_text[0]?.text?.content?.startsWith('Motivación:')
    );
    expect(motivationBlock).toBeDefined();
    expect(motivationBlock!.paragraph!.rich_text[0].text.content).toContain(baseEstudiante.motivation);
  });
  it('body includes availability paragraph', () => {
    const result = mapAnswersToNotionPage(baseEstudiante, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find(
      (b) => b.paragraph?.rich_text[0]?.text?.content?.startsWith('Disponibilidad declarada:')
    );
    expect(block).toBeDefined();
  });
  it('body includes AI analysis placeholder heading', () => {
    const result = mapAnswersToNotionPage(baseEstudiante, DB_ID);
    const children = result.children as Array<{ heading_2?: { rich_text: Array<{ text: { content: string } }> } }>;
    const heading = children.find(
      (b) => b.heading_2?.rich_text[0]?.text?.content === 'Análisis IA (pendiente)'
    );
    expect(heading).toBeDefined();
  });

  // --- database_id ---
  it('sets database_id correctly', () => {
    const result = mapAnswersToNotionPage(baseEstudiante, DB_ID);
    expect(result.parent).toEqual({ database_id: DB_ID });
  });

  // Feature 2: administracion career label
  it('maps administracion → Otra in Notion SELECT', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'administracion' }, DB_ID);
    expect(result.properties!['Carrera']).toEqual({ select: { name: 'Otra' } });
  });
  it('administracion → body contains "Carrera declarada: Administración de Empresas"', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, career: 'administracion' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content === 'Carrera declarada: Administración de Empresas');
    expect(block).toBeDefined();
  });

  // Feature 1: new interest labels in body
  it('body includes interest label for design', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'design' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.includes('UX'));
    expect(block).toBeDefined();
  });
  it('body includes interest label for marketing', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'marketing' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.includes('Marketing'));
    expect(block).toBeDefined();
  });
  it('body includes interest label for ops', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'ops' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.includes('Organización'));
    expect(block).toBeDefined();
  });
  it('body includes interest label for people', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'people' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.includes('Gestión de personas'));
    expect(block).toBeDefined();
  });
  it('maps design → [] (empty multi_select, for AI to suggest)', () => {
    const result = mapAnswersToNotionPage({ ...baseEstudiante, interest: 'design' }, DB_ID);
    expect(result.properties!['Línea / Departamento']).toEqual({ multi_select: [] });
  });

  // Feature 3: papers mapping
  it('docente with papers: body contains papers info', () => {
    const result = mapAnswersToNotionPage({ ...baseDocente, papers: '3' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.startsWith('Papers publicados:'));
    expect(block).toBeDefined();
  });
  it('docente with papers=pendiente: body shows human-readable label', () => {
    const result = mapAnswersToNotionPage({ ...baseDocente, papers: 'pendiente' }, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.includes('Culminado, sin publicar'));
    expect(block).toBeDefined();
  });
  it('estudiante without papers: body does NOT contain papers info', () => {
    const result = mapAnswersToNotionPage(baseEstudiante, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.startsWith('Papers publicados:'));
    expect(block).toBeUndefined();
  });

  it('estudiante with stale papers value: body does NOT emit papers block', () => {
    // A user who selected docente, answered papers, then switched to estudiante
    // leaves a stale papers value. The mapper must NOT emit it for an estudiante.
    const staleEstudiante: QuizAnswers = {
      ...baseEstudiante,
      papers: '2', // stale value that leaked from a prior docente selection
    };
    const result = mapAnswersToNotionPage(staleEstudiante, DB_ID);
    const children = result.children as Array<{ paragraph?: { rich_text: Array<{ text: { content: string } }> } }>;
    const block = children.find((b) => b.paragraph?.rich_text[0]?.text?.content?.startsWith('Papers publicados:'));
    expect(block).toBeUndefined();
  });
});
