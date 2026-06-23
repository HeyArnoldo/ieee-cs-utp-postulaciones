import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';
import { QuizAnswersSchema } from '../src/lib/quiz/answers.schema';
import { mapAnswersToNotionPage } from '../src/lib/notion/mapAnswers';

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
  const params = mapAnswersToNotionPage(parsed.data, databaseId);

  try {
    const page = await notion.pages.create(params);
    res.status(200).json({ ok: true, pageId: (page as { id: string }).id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(502).json({ ok: false, error: message });
  }
}
