import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import type { QuizAnswers, CareerValue, InterestValue, PapersValue, CycleValue, AvailabilityValue } from '@/lib/quiz/schema';

// Human-readable labels for each career value
export const CAREER_LABELS: Record<CareerValue, string> = {
  sistemas: 'Ing. de Sistemas e Informática',
  software: 'Ing. de Software',
  data: 'Ing. en Ciencia de Datos',
  electronica: 'Ing. Electrónica / Telecomunicaciones',
  industrial: 'Ing. Industrial',
  mecatronica: 'Ing. Mecatrónica',
  psicologia: 'Psicología',
  comunicaciones: 'Comunicaciones',
  administracion: 'Administración de Empresas',
  otra: 'Otra',
};

// Notion SELECT values (must match existing Notion options)
const CAREER_NOTION: Record<CareerValue, string> = {
  sistemas: 'Ing. de Sistemas e Informática',
  software: 'Ing. de Software',
  data: 'Ciencias de la Computación',
  electronica: 'Ing. Electrónica',
  industrial: 'Ing. Industrial',
  mecatronica: 'Ing. Mecatrónica',
  psicologia: 'Otra',
  comunicaciones: 'Otra',
  administracion: 'Otra',
  otra: 'Otra',
};

export const INTEREST_LABELS: Record<InterestValue, string> = {
  web: 'Desarrollo Web',
  ai: 'Inteligencia Artificial',
  cyber: 'Ciberseguridad',
  cloud: 'Computación en la Nube',
  game: 'Videojuegos',
  iot: 'Internet de las Cosas (IoT)',
  explore: 'Explorando opciones',
  design: 'UX / UI / Diseño de producto',
  marketing: 'Marketing / Contenido / Redes',
  ops: 'Organización y planificación',
  people: 'Gestión de personas / Cultura',
};

export const PAPERS_LABELS: Record<PapersValue, string> = {
  '0': '0 publicados',
  '1': '1 publicado',
  '2': '2 publicados',
  '3': '3 publicados',
  '4': '4 publicados',
  '5+': '5 o más',
  'pendiente': 'Culminado, sin publicar',
};

export const AVAILABILITY_LABELS: Record<AvailabilityValue, string> = {
  '2-4': '2-4',
  '5-8': '5-8',
  '9-12': '9-12',
  '13+': '13+',
};

const CYCLE_NUMBER: Record<CycleValue, number> = {
  '1-3': 1,
  '4-6': 4,
  '7-9': 7,
  '10+': 10,
};

// interest → Notion multi_select names (empty = ambiguous, M3 AI will suggest)
const INTEREST_NOTION: Record<InterestValue, string[]> = {
  web: ['Programación'],
  ai: ['IA'],
  cyber: ['Ciberseguridad'],
  game: ['Videojuegos'],
  cloud: [],      // ambiguous — leave for M3 AI
  iot: [],        // ambiguous — leave for M3 AI
  explore: [],    // ambiguous — leave for M3 AI
  design: [],     // cross-functional — leave for M3 AI
  marketing: [],  // cross-functional — leave for M3 AI
  ops: [],        // cross-functional — leave for M3 AI
  people: [],     // cross-functional — leave for M3 AI
};

export function mapAnswersToNotionPage(
  answers: QuizAnswers,
  databaseId: string,
  aiAnalysis?: {
    mensaje?: string
    comiteSugerido?: string
    lineaSugerida?: string[]
    resumenRRHH?: string
  }
): CreatePageParameters {
  const isUtp = answers.contact.email.toLowerCase().endsWith('utp.edu.pe');
  const isDocente = answers.applicantType === 'docente';

  // Compute the real human-readable career label
  const careerLabel = answers.career === 'otra'
    ? (answers.careerOther ?? 'Otra')
    : CAREER_LABELS[answers.career];

  const properties: CreatePageParameters['properties'] = {
    'Nombres y Apellidos': {
      title: [{ text: { content: answers.name } }],
    },
    Carrera: {
      select: { name: CAREER_NOTION[answers.career] },
    },
    WhatsApp: {
      phone_number: `+51 ${answers.contact.whatsapp}`,
    },
    'Línea / Departamento': {
      multi_select: INTEREST_NOTION[answers.interest].map((name) => ({ name })),
    },
  };

  // Ciclo: only for estudiantes
  if (!isDocente && answers.cycle !== undefined) {
    properties['Ciclo'] = { number: CYCLE_NUMBER[answers.cycle] };
  }

  if (isUtp) {
    properties['Correo institucional UTP'] = { email: answers.contact.email };
  } else {
    properties['Correo personal'] = { email: answers.contact.email };
  }

  // Prominent lines near the top of the body
  const tipoLine = `Tipo de postulante: ${isDocente ? 'Docente' : 'Estudiante'}`;

  const children: CreatePageParameters['children'] = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: tipoLine } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: `Carrera declarada: ${careerLabel}` } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: `Motivación: ${answers.motivation}` } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `Disponibilidad declarada: ${AVAILABILITY_LABELS[answers.availability]} horas/semana`,
            },
          },
        ],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: `Interés declarado: ${INTEREST_LABELS[answers.interest]}` },
          },
        ],
      },
    },
    ...(isDocente && answers.papers !== undefined
      ? [
          {
            object: 'block' as const,
            type: 'paragraph' as const,
            paragraph: {
              rich_text: [
                {
                  type: 'text' as const,
                  text: { content: `Papers publicados: ${PAPERS_LABELS[answers.papers]}` },
                },
              ],
            },
          },
        ]
      : []),
    ...(answers.followUp
      ? [
          {
            object: 'block' as const,
            type: 'heading_2' as const,
            heading_2: {
              rich_text: [{ type: 'text' as const, text: { content: 'Pregunta personalizada' } }],
            },
          },
          {
            object: 'block' as const,
            type: 'paragraph' as const,
            paragraph: {
              rich_text: [
                { type: 'text' as const, text: { content: `P: ${answers.followUp.question}` } },
              ],
            },
          },
          {
            object: 'block' as const,
            type: 'paragraph' as const,
            paragraph: {
              rich_text: [
                { type: 'text' as const, text: { content: `R: ${answers.followUp.answer}` } },
              ],
            },
          },
        ]
      : []),
    ...(aiAnalysis
      ? [
          {
            object: 'block' as const,
            type: 'heading_2' as const,
            heading_2: {
              rich_text: [{ type: 'text' as const, text: { content: 'Análisis IA' } }],
            },
          },
          ...(aiAnalysis.resumenRRHH
            ? [
                {
                  object: 'block' as const,
                  type: 'paragraph' as const,
                  paragraph: {
                    rich_text: [
                      { type: 'text' as const, text: { content: aiAnalysis.resumenRRHH } },
                    ],
                  },
                },
              ]
            : []),
          ...(aiAnalysis.comiteSugerido
            ? [
                {
                  object: 'block' as const,
                  type: 'paragraph' as const,
                  paragraph: {
                    rich_text: [
                      {
                        type: 'text' as const,
                        text: {
                          content: `Comité sugerido: ${aiAnalysis.comiteSugerido}`,
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
          ...((aiAnalysis.lineaSugerida ?? []).length > 0
            ? [
                {
                  object: 'block' as const,
                  type: 'paragraph' as const,
                  paragraph: {
                    rich_text: [
                      {
                        type: 'text' as const,
                        text: {
                          content: `Líneas sugeridas: ${aiAnalysis.lineaSugerida!.join(', ')}`,
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
        ]
      : [
          {
            object: 'block' as const,
            type: 'heading_2' as const,
            heading_2: {
              rich_text: [
                { type: 'text' as const, text: { content: 'Análisis IA (pendiente)' } },
              ],
            },
          },
        ]),
  ];

  return {
    parent: { database_id: databaseId },
    properties,
    children,
  };
}
