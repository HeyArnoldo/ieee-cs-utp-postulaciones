// src/components/quiz/CareerQuestion.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CareerQuestion } from './CareerQuestion';
import type { QuestionConfig } from '@/lib/quiz/questions';
import type { QuizAnswers } from '@/lib/quiz/schema';

const careerQuestion: QuestionConfig = {
  id: 'career',
  kind: 'choice',
  qn: '03 · Tu carrera',
  title: '¿Cuál es tu carrera?',
  hint: 'Tu carrera o área académica.',
  options: [
    { v: 'sistemas', label: 'Ing. de Sistemas e Informática', emoji: '💻' },
    { v: 'software', label: 'Ing. de Software', emoji: '⚙️' },
    { v: 'industrial', label: 'Ing. Industrial', emoji: '🏭' },
    { v: 'otra', label: 'Otra', emoji: '✨' },
  ],
  aiLine: 'Sara IA considera tu carrera.',
  validate: (answers: Partial<QuizAnswers>) => {
    const v = answers.career;
    if (typeof v !== 'string' || v.length === 0) return false;
    if (v === 'otra') return typeof answers.careerOther === 'string' && answers.careerOther.trim().length > 0;
    return true;
  },
};

describe('CareerQuestion', () => {
  it('renders all career options', () => {
    render(
      <CareerQuestion
        question={careerQuestion}
        answer=""
        careerOther=""
        onAnswer={() => {}}
        onCareerOther={() => {}}
      />
    );
    expect(screen.getByText('Ing. de Sistemas e Informática')).toBeInTheDocument();
    expect(screen.getByText('Ing. de Software')).toBeInTheDocument();
    expect(screen.getByText('Ing. Industrial')).toBeInTheDocument();
    expect(screen.getByText('Otra')).toBeInTheDocument();
  });

  it('does NOT show text input when no option selected', () => {
    render(
      <CareerQuestion
        question={careerQuestion}
        answer=""
        careerOther=""
        onAnswer={() => {}}
        onCareerOther={() => {}}
      />
    );
    expect(screen.queryByPlaceholderText('Escribe tu carrera o área')).not.toBeInTheDocument();
  });

  it('does NOT show text input when non-otra option is selected', () => {
    render(
      <CareerQuestion
        question={careerQuestion}
        answer="sistemas"
        careerOther=""
        onAnswer={() => {}}
        onCareerOther={() => {}}
      />
    );
    expect(screen.queryByPlaceholderText('Escribe tu carrera o área')).not.toBeInTheDocument();
  });

  it('shows text input when "Otra" is selected', () => {
    render(
      <CareerQuestion
        question={careerQuestion}
        answer="otra"
        careerOther=""
        onAnswer={() => {}}
        onCareerOther={() => {}}
      />
    );
    expect(screen.getByPlaceholderText('Escribe tu carrera o área')).toBeInTheDocument();
  });

  it('text input displays careerOther value', () => {
    render(
      <CareerQuestion
        question={careerQuestion}
        answer="otra"
        careerOther="Matemáticas"
        onAnswer={() => {}}
        onCareerOther={() => {}}
      />
    );
    expect(screen.getByDisplayValue('Matemáticas')).toBeInTheDocument();
  });

  it('calls onAnswer with correct value on option click', async () => {
    const onAnswer = vi.fn();
    render(
      <CareerQuestion
        question={careerQuestion}
        answer=""
        careerOther=""
        onAnswer={onAnswer}
        onCareerOther={() => {}}
      />
    );
    await userEvent.click(screen.getByText('Ing. de Software'));
    expect(onAnswer).toHaveBeenCalledWith('software');
  });

  it('calls onCareerOther when typing in text input', async () => {
    const onCareerOther = vi.fn();
    render(
      <CareerQuestion
        question={careerQuestion}
        answer="otra"
        careerOther=""
        onAnswer={() => {}}
        onCareerOther={onCareerOther}
      />
    );
    const input = screen.getByPlaceholderText('Escribe tu carrera o área');
    await userEvent.type(input, 'M');
    expect(onCareerOther).toHaveBeenCalledWith('M');
  });

  it('selected option has aria-pressed="true"', () => {
    render(
      <CareerQuestion
        question={careerQuestion}
        answer="software"
        careerOther=""
        onAnswer={() => {}}
        onCareerOther={() => {}}
      />
    );
    const buttons = screen.getAllByRole('button');
    const softwareButton = buttons.find((btn) => btn.textContent?.includes('Ing. de Software'));
    expect(softwareButton).toHaveAttribute('aria-pressed', 'true');
    const sistemasButton = buttons.find((btn) => btn.textContent?.includes('Ing. de Sistemas'));
    expect(sistemasButton).toHaveAttribute('aria-pressed', 'false');
  });
});
