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
    })
    expect(msgs).toHaveLength(2)
    expect(msgs[0].role).toBe('system')
    expect(msgs[1].role).toBe('user')
  })

  it('includes motivation text in user message', () => {
    const motivation = 'Me apasiona la inteligencia artificial desde que vi AlphaGo.'
    const msgs = buildFollowUpPrompt({ motivation, interest: 'ai', career: 'sistemas' })
    expect(msgs[1].content).toContain(motivation)
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
    // Should fall back to a valid comité or null/undefined — not the invalid one
    // The parser drops invalid comiteSugerido, returning undefined/null
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
