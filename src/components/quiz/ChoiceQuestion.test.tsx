// src/components/quiz/ChoiceQuestion.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChoiceQuestion } from './ChoiceQuestion';
import type { QuestionConfig } from '@/lib/quiz/questions';
import type { QuizAnswers } from '@/lib/quiz/schema';

const careerQuestion: QuestionConfig = {
  id: 'career',
  kind: 'choice',
  qn: '02 · Tu carrera',
  title: '¿Qué estudias en la UTP?',
  hint: 'Cualquiera de estas funciona.',
  options: [
    { v: 'sistemas', label: 'Ing. de Sistemas e Informática', emoji: '💻' },
    { v: 'software', label: 'Ing. de Software', emoji: '⚙️' },
    { v: 'otra', label: 'Otra carrera', emoji: '✨' },
  ],
  aiLine: 'Sara IA considera tu carrera.',
  validate: (answers: Partial<QuizAnswers>) => {
    const v = answers.career;
    return typeof v === 'string' && v.length > 0;
  },
};

describe('ChoiceQuestion', () => {
  it('renders all options', () => {
    render(<ChoiceQuestion question={careerQuestion} selected="" onSelect={() => {}} />);
    expect(screen.getByText('Ing. de Sistemas e Informática')).toBeInTheDocument();
    expect(screen.getByText('Ing. de Software')).toBeInTheDocument();
    expect(screen.getByText('Otra carrera')).toBeInTheDocument();
  });

  it('calls onSelect with correct value on click', async () => {
    const onSelect = vi.fn();
    render(<ChoiceQuestion question={careerQuestion} selected="" onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Ing. de Software'));
    expect(onSelect).toHaveBeenCalledWith('software');
  });

  it('selected option has aria-pressed="true"', () => {
    render(<ChoiceQuestion question={careerQuestion} selected="software" onSelect={() => {}} />);
    const buttons = screen.getAllByRole('button');
    const softwareButton = buttons.find((btn) => btn.textContent?.includes('Ing. de Software'));
    expect(softwareButton).toHaveAttribute('aria-pressed', 'true');
    const sistemasButton = buttons.find((btn) => btn.textContent?.includes('Ing. de Sistemas'));
    expect(sistemasButton).toHaveAttribute('aria-pressed', 'false');
  });
});
