// src/components/quiz/TextareaQuestion.tsx
import type { QuestionConfig } from '@/lib/quiz/questions';

type Props = {
  question: QuestionConfig;
  value: string;
  onChange: (v: string) => void;
};

export function TextareaQuestion({ question, value, onChange }: Props) {
  return (
    <div className="question">
      <div className="qn">{question.qn}</div>
      <h2>{question.title}</h2>
      {question.hint && <p className="hint">{question.hint}</p>}
      <textarea
        className="field"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={question.placeholder || ''}
        autoFocus
      />
    </div>
  );
}
