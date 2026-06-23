// src/components/quiz/ChoiceQuestion.tsx
import type { QuestionConfig } from '@/lib/quiz/questions';

type Props = {
  question: QuestionConfig;
  selected: string;
  onSelect: (v: string) => void;
};

export function ChoiceQuestion({ question, selected, onSelect }: Props) {
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
            aria-pressed={selected === opt.v}
            onClick={() => onSelect(opt.v)}
          >
            <span className="radio"></span>
            {opt.emoji && <span className="emoji">{opt.emoji}</span>}
            <span className="label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
