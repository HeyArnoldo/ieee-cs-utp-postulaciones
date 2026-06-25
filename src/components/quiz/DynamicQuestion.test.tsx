// src/components/quiz/DynamicQuestion.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DynamicQuestion } from './DynamicQuestion';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('DynamicQuestion', () => {
  it('restores previously typed answer and does NOT fetch when followUp is already stored', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(
      <DynamicQuestion
        answers={{
          followUp: { question: 'Pregunta guardada', answer: 'mi respuesta previa' },
        }}
        onAnswer={() => {}}
      />
    );

    // Should not be in loading state — no fetch call needed
    expect(fetchMock).not.toHaveBeenCalled();

    // The stored answer must be visible in the textarea
    const textarea = await screen.findByRole('textbox');
    expect(textarea).toHaveValue('mi respuesta previa');
  });

  it('fetches AI question on first render when no followUp is stored', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ok: true, question: '¿Qué proyecto resolverías?' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <DynamicQuestion
        answers={{ motivation: 'aprender', interest: 'web', career: 'software', applicantType: 'estudiante' }}
        onAnswer={() => {}}
      />
    );

    // Should show loading initially
    expect(screen.getByText('Sara IA está leyendo…')).toBeInTheDocument();

    // After fetch resolves, show the question
    await waitFor(() => {
      expect(screen.getByText('¿Qué proyecto resolverías?')).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/repregunta', expect.objectContaining({ method: 'POST' }));
  });
});
