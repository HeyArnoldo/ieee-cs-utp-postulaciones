import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import type { QuizAnswers, CareerValue, InterestValue, CycleValue, AvailabilityValue } from '@/lib/quiz/schema';

export const CAREER_LABELS: Record<CareerValue, string> = {
  sistemas: 'Ing. de Sistemas e Informática',
  software: 'Ing. de Software',
  data: 'Ciencias de la Computación',
  electronica: 'Ing. Electrónica',
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
};

export const AVAILABILITY_LABELS: Record<AvailabilityValue, string> = {
  '2-4': '2-4',
  '5-8': '5-8',
  '9-12': '9-12',
  '13+': '13+',
};

const CAREER_NOTION: Record<CareerValue, string> = CAREER_LABELS;

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
  cloud: [],   // ambiguous — leave for M3 AI
  iot: [],     // ambiguous — leave for M3 AI
  explore: [], // ambiguous — leave for M3 AI
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

  const properties: CreatePageParameters['properties'] = {
    'Nombres y Apellidos': {
      title: [{ text: { content: answers.name } }],
    },
    Carrera: {
      select: { name: CAREER_NOTION[answers.career] },
    },
    Ciclo: {
      number: CYCLE_NUMBER[answers.cycle],
    },
    WhatsApp: {
      phone_number: `+51 ${answers.contact.whatsapp}`,
    },
    'Línea / Departamento': {
      multi_select: INTEREST_NOTION[answers.interest].map((name) => ({ name })),
    },
  };

  if (isUtp) {
    properties['Correo institucional UTP'] = { email: answers.contact.email };
  } else {
    properties['Correo personal'] = { email: answers.contact.email };
  }

  const children: CreatePageParameters['children'] = [
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
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: `Carrera declarada: ${CAREER_LABELS[answers.career]}` },
          },
        ],
      },
    },
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
