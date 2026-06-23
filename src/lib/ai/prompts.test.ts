import { describe, it, expect } from 'vitest'
import {
  buildFollowUpPrompt,
  parseFollowUpResponse,
  buildEvaluationPrompt,
  parseEvaluationResponse,
  FALLBACK_FOLLOW_UP_QUESTION,
  FALLBACK_EVALUATION,
} from './prompts'

const VALID_COMITES = [
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
]

describe('buildFollowUpPrompt', () => {
  it('returns system + user messages', () => {
    const msgs = buildFollowUpPrompt({
      motivation: 'Quiero aprender sobre redes neuronales y aplicar IA en proyectos reales.',
      interest: 'ai',
      career: 'sistemas',
      applicantType: 'estudiante',
    })
    expect(msgs).toHaveLength(2)
    expect(msgs[0].role).toBe('system')
    expect(msgs[1].role).toBe('user')
  })

  it('includes motivation text in user message', () => {
    const motivation = 'Me apasiona la inteligencia artificial desde que vi AlphaGo.'
    const msgs = buildFollowUpPrompt({ motivation, interest: 'ai', career: 'sistemas', applicantType: 'estudiante' })
    expect(msgs[1].content).toContain(motivation)
  })

  it('includes applicantType in user message', () => {
    const msgs = buildFollowUpPrompt({
      motivation: 'Motivo largo aquí.',
      interest: 'web',
      career: 'software',
      applicantType: 'docente',
    })
    expect(msgs[1].content).toContain('Docente')
  })

  it('docente prompt system message does NOT reference "ciclo"', () => {
    const msgs = buildFollowUpPrompt({
      motivation: 'Quiero contribuir al capítulo.',
      interest: 'ai',
      career: 'sistemas',
      applicantType: 'docente',
    })
    expect(msgs[0].content.toLowerCase()).not.toContain('ciclo')
  })

  it('docente prompt references profesional/mentor context', () => {
    const msgs = buildFollowUpPrompt({
      motivation: 'Quiero contribuir al capítulo.',
      interest: 'ai',
      career: 'sistemas',
      applicantType: 'docente',
    })
    // System prompt should distinguish docente context
    expect(msgs[0].content).toContain('docente')
  })
})

describe('parseFollowUpResponse', () => {
  it('extracts question from plain text', () => {
    const result = parseFollowUpResponse('¿Qué tipo de proyecto de IA te gustaría construir este año?')
    expect(result).toBe('¿Qué tipo de proyecto de IA te gustaría construir este año?')
  })

  it('trims whitespace', () => {
    const result = parseFollowUpResponse('  ¿Cuál sería tu primer proyecto?  ')
    expect(result).toBe('¿Cuál sería tu primer proyecto?')
  })

  it('returns fallback on empty string', () => {
    const result = parseFollowUpResponse('')
    expect(result).toBe(FALLBACK_FOLLOW_UP_QUESTION)
  })
})

describe('buildEvaluationPrompt', () => {
  it('returns system + user messages', () => {
    const msgs = buildEvaluationPrompt({
      name: 'Ana García',
      motivation: 'Quiero contribuir a la comunidad IEEE y aprender programación.',
      interest: 'programming',
      career: 'sistemas',
      careerLabel: 'Ing. de Sistemas e Informática',
      applicantType: 'estudiante',
      availability: 'full',
      followUp: {
        question: '¿Qué proyecto te gustaría liderar?',
        answer: 'Un taller de Python para principiantes.',
      },
    })
    expect(msgs).toHaveLength(2)
    expect(msgs[0].role).toBe('system')
    expect(msgs[1].role).toBe('user')
  })

  it('includes "Tipo: Docente" in system prompt for docente', () => {
    const msgs = buildEvaluationPrompt({
      name: 'Carlos Ríos',
      motivation: 'Quiero aportar como mentor.',
      interest: 'ai',
      career: 'sistemas',
      careerLabel: 'Ing. de Sistemas e Informática',
      applicantType: 'docente',
      availability: '2-4',
      followUp: { question: '¿Cómo mentorizarías?', answer: 'Con talleres prácticos.' },
    })
    expect(msgs[0].content).toContain('Tipo: Docente')
  })

  it('includes "Tipo: Estudiante" in system prompt for estudiante', () => {
    const msgs = buildEvaluationPrompt({
      name: 'Ana García',
      motivation: 'Quiero aprender.',
      interest: 'web',
      career: 'software',
      careerLabel: 'Ing. de Software',
      applicantType: 'estudiante',
      availability: '5-8',
      followUp: { question: '¿Qué proyecto?', answer: 'Una app web.' },
    })
    expect(msgs[0].content).toContain('Tipo: Estudiante')
  })

  it('docente: user message contains Tipo=Docente', () => {
    const msgs = buildEvaluationPrompt({
      name: 'Carlos Ríos',
      motivation: 'Quiero aportar como mentor.',
      interest: 'ai',
      career: 'sistemas',
      careerLabel: 'Ing. de Sistemas e Informática',
      applicantType: 'docente',
      availability: '2-4',
      followUp: { question: '¿Cómo mentorizarías?', answer: 'Con talleres prácticos.' },
    })
    expect(msgs[1].content).toContain('Docente')
  })
})

describe('parseEvaluationResponse', () => {
  it('parses a valid JSON response', () => {
    const raw = JSON.stringify({
      mensaje: 'Gracias por postular, Ana. Tu perfil es muy interesante.',
      comiteSugerido: 'Comité de Tecnología e Información (TI)',
      lineaSugerida: ['IA', 'Programación'],
      resumenRRHH: 'Candidata con fuerte motivación en IA.\nDisponibilidad completa.',
    })
    const result = parseEvaluationResponse(raw)
    expect(result.mensaje).toContain('Ana')
    expect(result.comiteSugerido).toBe('Comité de Tecnología e Información (TI)')
    expect(result.lineaSugerida).toContain('IA')
    expect(result.resumenRRHH).toBeTruthy()
  })

  it('drops invalid comiteSugerido and uses fallback', () => {
    const raw = JSON.stringify({
      mensaje: 'Mensaje válido aquí.',
      comiteSugerido: 'Comité Inventado',
      lineaSugerida: ['IA'],
      resumenRRHH: 'Resumen.',
    })
    const result = parseEvaluationResponse(raw)
    expect(VALID_COMITES).not.toContain(result.comiteSugerido)
    expect(result.comiteSugerido).toBeUndefined()
  })

  it('drops invalid lineaSugerida entries', () => {
    const raw = JSON.stringify({
      mensaje: 'Buen perfil.',
      comiteSugerido: 'Comité de Investigación',
      lineaSugerida: ['IA', 'BlockchainInvalido', 'Videojuegos'],
      resumenRRHH: 'Resumen aquí.',
    })
    const result = parseEvaluationResponse(raw)
    expect(result.lineaSugerida).toContain('IA')
    expect(result.lineaSugerida).toContain('Videojuegos')
    expect(result.lineaSugerida).not.toContain('BlockchainInvalido')
  })

  it('returns fallback on malformed/non-JSON output', () => {
    const result = parseEvaluationResponse('Esto no es JSON válido ##@!')
    expect(result.mensaje).toBe(FALLBACK_EVALUATION.mensaje)
    expect(result.comiteSugerido).toBeUndefined()
  })

  it('returns fallback on empty string', () => {
    const result = parseEvaluationResponse('')
    expect(result.mensaje).toBe(FALLBACK_EVALUATION.mensaje)
  })
})
