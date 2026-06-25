export const FALLBACK_FOLLOW_UP_QUESTION =
  '¿Qué proyecto o problema te gustaría resolver dentro del capítulo este año?'

export const FALLBACK_EVALUATION = {
  mensaje:
    'Gracias por postularte. Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto con los próximos pasos.',
  comiteSugerido: undefined as string | undefined,
  lineaSugerida: [] as string[],
  resumenRRHH: '',
}

const VALID_COMITES = new Set([
  'Junta Directiva',
  'Comité de Planificación y Cumplimiento',
  'Comité de Gestión de Proyectos',
  'Comité de Talento y Membresía',
  'Comité de Marketing y Comunicaciones',
  'Comité de Relaciones Institucionales',
  'Comité de Finanzas',
  'Comité de Tecnología e Información (TI)',
  'Comité de Desarrollo Técnico',
  'Comité de Investigación',
])

const VALID_LINEAS = new Set([
  'IA',
  'Programación',
  'Ciberseguridad',
  'Videojuegos',
  'Redacción Científica',
  'Club de Lectura Técnica',
  'Revista Científica',
])

export interface FollowUpPromptInput {
  motivation: string
  interest: string
  career: string
  applicantType: 'estudiante' | 'docente'
  careerLabel?: string
}

export interface EvaluationPromptInput {
  name: string
  motivation: string
  interest: string
  career: string
  careerLabel: string
  availability: string
  applicantType: 'estudiante' | 'docente'
  papers?: string
  followUp: { question: string; answer: string }
}

export interface EvaluationResult {
  mensaje: string
  comiteSugerido: string | undefined
  lineaSugerida: string[]
  resumenRRHH: string
}

export function buildFollowUpPrompt(
  input: FollowUpPromptInput,
): Array<{ role: 'system' | 'user'; content: string }> {
  const isDocente = input.applicantType === 'docente';
  const systemContent = isDocente
    ? `Eres Sara, asistente de selección del IEEE Computer Society UTP (Perú).
Tu tarea es generar UNA sola pregunta corta (máximo 140 caracteres) y personalizada que profundice en la motivación y el encaje del docente postulante con el capítulo.
La pregunta debe ser cálida, directa y en español neutro peruano. Trata al postulante como profesional y mentor potencial — no hagas referencia a años académicos, materias o contexto estudiantil.
Responde SOLO con el texto de la pregunta. Sin explicaciones, sin comillas adicionales, sin meta-instrucciones.
Mantente estrictamente en el tema del capítulo IEEE y la formación técnica. No hagas preguntas off-topic.`
    : `Eres Sara, asistente de selección del IEEE Computer Society UTP (Perú).
Tu tarea es generar UNA sola pregunta corta (máximo 140 caracteres) y personalizada que profundice en la motivación y el encaje del postulante con el capítulo.
La pregunta debe ser cálida, directa y en español neutro peruano.
Responde SOLO con el texto de la pregunta. Sin explicaciones, sin comillas adicionales, sin meta-instrucciones.
Mantente estrictamente en el tema del capítulo IEEE y la formación técnica. No hagas preguntas off-topic.`;

  const careerDisplay = input.careerLabel ?? input.career;

  return [
    { role: 'system', content: systemContent },
    {
      role: 'user',
      content: `Tipo de postulante: ${isDocente ? 'Docente' : 'Estudiante'}
Interés principal: ${input.interest}
Carrera / Área: ${careerDisplay}
Motivación del postulante: "${input.motivation}"`,
    },
  ]
}

export function parseFollowUpResponse(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return FALLBACK_FOLLOW_UP_QUESTION
  return trimmed
}

export function buildEvaluationPrompt(
  input: EvaluationPromptInput,
): Array<{ role: 'system' | 'user'; content: string }> {
  const comitesList = [...VALID_COMITES].join(', ')
  const lineasList = [...VALID_LINEAS].join(', ')
  const isDocente = input.applicantType === 'docente';

  const tipoLabel = isDocente ? 'Docente' : 'Estudiante';

  return [
    {
      role: 'system',
      content: `Eres el sistema de evaluación del IEEE Computer Society UTP (Perú).
Analiza la postulación y responde SOLO con un objeto JSON válido con estos campos exactos:
- "mensaje": string — mensaje cálido y personalizado de cierre para el postulante (2-3 oraciones, español neutro, sin puntaje numérico, sin rechazo)
- "comiteSugerido": string — DEBE ser exactamente uno de: ${comitesList}
- "lineaSugerida": string[] — subconjunto de: ${lineasList}
- "resumenRRHH": string — resumen de 2 líneas para el comité de RRHH; incluir "Tipo: ${tipoLabel}"

No incluyas texto fuera del JSON. No uses markdown.`,
    },
    {
      role: 'user',
      content: `Nombre: ${input.name}
Tipo: ${tipoLabel}
Carrera: ${input.careerLabel}
Interés: ${input.interest}
Disponibilidad: ${input.availability}
Motivación: "${input.motivation}"${isDocente && input.papers !== undefined ? `\nPapers publicados: ${input.papers}` : ''}
Pregunta de seguimiento: "${input.followUp.question}"
Respuesta: "${input.followUp.answer}"`,
    },
  ]
}

export function parseEvaluationResponse(raw: string): EvaluationResult {
  try {
    const trimmed = raw.trim()
    if (!trimmed) return { ...FALLBACK_EVALUATION }
    const parsed = JSON.parse(trimmed) as Record<string, unknown>

    const mensaje =
      typeof parsed.mensaje === 'string' && parsed.mensaje.trim()
        ? parsed.mensaje
        : FALLBACK_EVALUATION.mensaje

    const comiteSugerido =
      typeof parsed.comiteSugerido === 'string' && VALID_COMITES.has(parsed.comiteSugerido)
        ? parsed.comiteSugerido
        : undefined

    const lineaSugerida = Array.isArray(parsed.lineaSugerida)
      ? (parsed.lineaSugerida as unknown[]).filter(
          (l): l is string => typeof l === 'string' && VALID_LINEAS.has(l),
        )
      : []

    const resumenRRHH =
      typeof parsed.resumenRRHH === 'string' ? parsed.resumenRRHH : ''

    return { mensaje, comiteSugerido, lineaSugerida, resumenRRHH }
  } catch {
    return { ...FALLBACK_EVALUATION }
  }
}
