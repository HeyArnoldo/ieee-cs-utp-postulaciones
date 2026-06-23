import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const mockCreate = vi.fn()

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  })),
}))

function makeReq(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'POST',
    body: { motivation: 'Quiero aprender IA.', interest: 'ai', career: 'sistemas' },
    ...overrides,
  } as unknown as VercelRequest
}

function makeRes(): { res: VercelResponse; data: { status?: number; body?: unknown } } {
  const data: { status?: number; body?: unknown } = {}
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockImplementation((body: unknown) => {
      data.body = body
      return res
    }),
  } as unknown as VercelResponse
  return { res, data }
}

describe('POST /api/repregunta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 405 for non-POST', async () => {
    const { default: handler } = await import('./repregunta')
    const req = makeReq({ method: 'GET' })
    const { res, data } = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(data.body).toMatchObject({ ok: false })
  })

  it('returns a question on OpenAI success', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '¿Qué proyecto de IA te gustaría construir?' } }],
    })
    const { default: handler } = await import('./repregunta')
    const req = makeReq()
    const { res, data } = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(data.body).toMatchObject({ ok: true, question: expect.any(String) })
  })

  it('returns 200 with fallback question when OpenAI throws — flow is never blocked', async () => {
    mockCreate.mockRejectedValueOnce(new Error('OpenAI network error'))
    const { default: handler } = await import('./repregunta')
    const req = makeReq()
    const { res, data } = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(data.body).toMatchObject({ ok: true, question: expect.any(String), fallback: true })
  })
})
