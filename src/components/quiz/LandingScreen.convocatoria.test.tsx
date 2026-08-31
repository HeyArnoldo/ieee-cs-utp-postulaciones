import { render, cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DEADLINE, LandingScreen } from './LandingScreen'

afterEach(cleanup)

describe('convocatoria window', () => {
  // Regression: the previous deadline silently expired and the countdown froze at 0d 0h 0m.
  it('closes on 2026-09-30 at 23:59:59 Peru time', () => {
    expect(DEADLINE.toISOString()).toBe(new Date('2026-09-30T23:59:59-05:00').toISOString())
  })
})

describe('open volunteer intake', () => {
  it('does not cap the cohort with a seat count', () => {
    render(<LandingScreen onStart={() => {}} />)

    expect(document.body.textContent).not.toMatch(/Cupos limitados/i)
    expect(document.body.textContent).not.toMatch(/Solo \d+ seleccionados/i)
  })

  it('states the call is open to every volunteer', () => {
    render(<LandingScreen onStart={() => {}} />)

    expect(screen.getAllByText(/Convocatoria abierta/i).length).toBeGreaterThan(0)
  })
})
