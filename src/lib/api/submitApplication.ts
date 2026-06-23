import type { QuizAnswers } from '@/lib/quiz/schema';

export type SubmitResult =
  | {
      ok: true;
      pageId: string;
      mensaje?: string;
      comiteSugerido?: string;
      lineaSugerida?: string[];
      fallback?: boolean;
    }
  | { ok: false; error: string };

export async function submitApplication(answers: QuizAnswers): Promise<SubmitResult> {
  const res = await fetch('/api/postular', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string; issues?: unknown };
    return { ok: false, error: data.error ?? `HTTP ${res.status}` };
  }

  return (await res.json()) as SubmitResult;
}
