import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import { buildFollowUpPrompt, parseFollowUpResponse, FALLBACK_FOLLOW_UP_QUESTION } from '../src/lib/ai/prompts.js'

const FALLBACK = FALLBACK_FOLLOW_UP_QUESTION

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { motivation, interest, career, applicantType, careerLabel } = (req.body ?? {}) as {
    motivation?: string
    interest?: string
    career?: string
    applicantType?: string
    careerLabel?: string
  }

  if (!motivation || !interest || !career) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_TOKEN })
    const messages = buildFollowUpPrompt({
      motivation,
      interest,
      career,
      applicantType: (applicantType === 'docente' ? 'docente' : 'estudiante'),
      careerLabel,
    })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 100,
      temperature: 0.7,
    })
    const raw = completion.choices[0]?.message?.content ?? ''
    const question = parseFollowUpResponse(raw)
    return res.status(200).json({ ok: true, question })
  } catch {
    return res.status(200).json({ ok: true, question: FALLBACK, fallback: true })
  }
}
