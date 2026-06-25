import { describe, it, expect } from 'vitest'
import { heroSubtitle } from './LandingScreen'

describe('heroSubtitle', () => {
  it('returns engineer-focused copy for junta mode', () => {
    expect(heroSubtitle('junta')).toBe(
      'El capítulo estudiantil de IEEE más activo del Perú busca ingenieros apasionados por la tecnología, el liderazgo y el impacto real.'
    )
  })

  it('returns inclusive copy for general mode', () => {
    expect(heroSubtitle('general')).toBe(
      'El capítulo estudiantil de IEEE más activo del Perú busca personas apasionadas por la tecnología, el liderazgo y el impacto real — de ingeniería y de otras carreras que quieran aportar desde lo suyo.'
    )
  })

  it('general mode contains otras carreras', () => {
    expect(heroSubtitle('general')).toContain('otras carreras')
  })

  it('general mode does not contain busca ingenieros', () => {
    expect(heroSubtitle('general')).not.toContain('busca ingenieros')
  })
})
