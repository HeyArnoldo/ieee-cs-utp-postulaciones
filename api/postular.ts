import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';
import OpenAI from 'openai';
import { QuizAnswersSchema } from '../src/lib/quiz/answers.schema.js';
import { mapAnswersToNotionPage } from '../src/lib/notion/mapAnswers.js';
import {
  buildEvaluationPrompt,
  parseEvaluationResponse,
  FALLBACK_EVALUATION,
} from '../src/lib/ai/prompts.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  const parsed = QuizAnswersSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, issues: parsed.error.issues });
    return;
  }

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    res.status(500).json({ ok: false, error: 'Server config error: missing Notion credentials' });
    return;
  }

  const notion = new Client({ auth: token });

  // STEP 1: Save to Notion — this is sacred, never skip
  let pageId: string;
  try {
    const params = mapAnswersToNotionPage(parsed.data, databaseId);
    const page = await notion.pages.create(params);
    pageId = (page as { id: string }).id;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(502).json({ ok: false, error: message });
    return;
  }

  // STEP 2: AI enrichment — best-effort, never blocks the response
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_TOKEN });
    const messages = buildEvaluationPrompt({
      name: parsed.data.name,
      motivation: parsed.data.motivation,
      interest: parsed.data.interest,
      career: parsed.data.career,
      availability: parsed.data.availability,
      followUp: parsed.data.followUp ?? { question: '', answer: '' },
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 400,
      temperature: 0.5,
    });
    const raw = completion.choices[0]?.message?.content ?? '';
    const aiResult = parseEvaluationResponse(raw);

    // Append AI analysis blocks to Notion page (best-effort)
    try {
      const aiBlocks = buildAiAnalysisBlocks(aiResult);
      if (aiBlocks.length > 0) {
        await notion.blocks.children.append({
          block_id: pageId,
          children: aiBlocks as Parameters<typeof notion.blocks.children.append>[0]['children'],
        });
      }
    } catch {
      // Non-fatal: AI content didn't append, but the page is saved
    }

    res.status(200).json({
      ok: true,
      pageId,
      mensaje: aiResult.mensaje,
      comiteSugerido: aiResult.comiteSugerido,
      lineaSugerida: aiResult.lineaSugerida,
    });
  } catch {
    res.status(200).json({
      ok: true,
      pageId,
      mensaje: FALLBACK_EVALUATION.mensaje,
      fallback: true,
    });
  }
}

function buildAiAnalysisBlocks(aiResult: {
  mensaje: string;
  comiteSugerido: string | undefined;
  lineaSugerida: string[];
  resumenRRHH: string;
}) {
  const blocks = [];

  if (aiResult.resumenRRHH) {
    blocks.push({
      object: 'block' as const,
      type: 'heading_2' as const,
      heading_2: {
        rich_text: [{ type: 'text' as const, text: { content: 'Análisis IA' } }],
      },
    });
    blocks.push({
      object: 'block' as const,
      type: 'paragraph' as const,
      paragraph: {
        rich_text: [{ type: 'text' as const, text: { content: aiResult.resumenRRHH } }],
      },
    });
  }

  if (aiResult.comiteSugerido) {
    blocks.push({
      object: 'block' as const,
      type: 'paragraph' as const,
      paragraph: {
        rich_text: [
          {
            type: 'text' as const,
            text: { content: `Comité sugerido: ${aiResult.comiteSugerido}` },
          },
        ],
      },
    });
  }

  if (aiResult.lineaSugerida.length > 0) {
    blocks.push({
      object: 'block' as const,
      type: 'paragraph' as const,
      paragraph: {
        rich_text: [
          {
            type: 'text' as const,
            text: { content: `Líneas sugeridas: ${aiResult.lineaSugerida.join(', ')}` },
          },
        ],
      },
    });
  }

  return blocks;
}
