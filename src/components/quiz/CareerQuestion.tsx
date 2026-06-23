// src/components/quiz/CareerQuestion.tsx
import type { QuestionConfig } from '@/lib/quiz/questions';

type Props = {
  question: QuestionConfig;
  answer: string;
  careerOther: string;
  onAnswer: (career: string) => void;
  onCareerOther: (text: string) => void;
};

export function CareerQuestion({ question, answer, careerOther, onAnswer, onCareerOther }: Props) {
  return (
    <div className="question">
      <div className="qn">{question.qn}</div>
      <h2>{question.title}</h2>
      {question.hint && <p className="hint">{question.hint}</p>}
      <div className="opts">
        {question.options?.map((opt) => (
          <button
            key={opt.v}
            className="opt"
            aria-pressed={answer === opt.v}
            onClick={() => onAnswer(opt.v)}
          >
            <span className="radio"></span>
            {opt.emoji && <span className="emoji">{opt.emoji}</span>}
            <span className="label">{opt.label}</span>
          </button>
        ))}
      </div>
      {answer === 'otra' && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            className="field"
            placeholder="Escribe tu carrera o área"
            value={careerOther}
            onChange={(e) => onCareerOther(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
