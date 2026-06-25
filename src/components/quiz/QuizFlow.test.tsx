// src/components/quiz/QuizFlow.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizFlow } from './QuizFlow';

beforeEach(() => {
  // DynamicQuestion fetches /api/repregunta — stub fetch to prevent noise
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ ok: true, question: '¿Qué proyecto resolverías?' }),
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('QuizFlow', () => {
  it('calls onExit when "Volver" is clicked on the first step', async () => {
    const onExit = vi.fn();
    const user = userEvent.setup();

    render(<QuizFlow onSubmit={async () => {}} onExit={onExit} />);

    const volverButton = screen.getByRole('button', { name: /volver/i });
    await user.click(volverButton);

    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onExit when "Volver" is clicked on a non-first step — goes back instead', async () => {
    const onExit = vi.fn();
    const user = userEvent.setup();

    render(<QuizFlow onSubmit={async () => {}} onExit={onExit} />);

    // Fill in name so we can advance to step 1
    const nameInput = screen.getByRole('textbox');
    await user.type(nameInput, 'Ana Pérez');

    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    await user.click(nextButton);

    // Now we're at step 1 — click Volver
    const volverButton = screen.getByRole('button', { name: /volver/i });
    await user.click(volverButton);

    // Should return to step 0 (name input visible again) without calling onExit
    expect(onExit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
