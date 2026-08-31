import { render, cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProofSection, PROOF_ITEMS } from './ProofSection'

afterEach(cleanup)

describe('ProofSection', () => {
  it('renders one figure per proof item', () => {
    render(<ProofSection onStart={() => {}} />)

    expect(screen.getAllByRole('img')).toHaveLength(PROOF_ITEMS.length)
  })

  it('gives every image descriptive alt text', () => {
    render(<ProofSection onStart={() => {}} />)

    for (const img of screen.getAllByRole('img')) {
      expect(img.getAttribute('alt')?.length ?? 0).toBeGreaterThan(10)
    }
  })

  it('defers image loading and reserves layout space to avoid CLS', () => {
    render(<ProofSection onStart={() => {}} />)

    for (const img of screen.getAllByRole('img')) {
      expect(img).toHaveAttribute('loading', 'lazy')
      expect(img).toHaveAttribute('decoding', 'async')
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
    }
  })

  it('points every image at an asset served from /assets', () => {
    render(<ProofSection onStart={() => {}} />)

    for (const img of screen.getAllByRole('img')) {
      expect(img.getAttribute('src')).toMatch(/^\/assets\/[\w.-]+\.(webp|png|jpg|svg)$/)
    }
  })

  it('closes the section with the postulación CTA, not an external link', () => {
    const onStart = vi.fn()
    render(<ProofSection onStart={onStart} />)

    const cta = screen.getByRole('button', { name: /postulación/i })
    cta.click()

    expect(onStart).toHaveBeenCalledOnce()
    expect(document.querySelector('.proof a[href^="http"]')).toBeNull()
  })
})
