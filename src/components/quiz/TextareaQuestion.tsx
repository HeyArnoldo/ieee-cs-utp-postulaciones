// src/components/quiz/TextareaQuestion.tsx
import type { QuestionConfig } from '@/lib/quiz/questions';

type Props = {
  question: QuestionConfig;
  value: string;
  onChange: (v: string) => void;
};

export function TextareaQuestion({ question, value, onChange }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      rows={5}
      className="w-full rounded-xl border-2 border-[#d8dbe0] bg-white px-4 py-3 text-[#0a0d10] placeholder:text-[#b8bcc2] focus:border-[#FFA300] focus:outline-none transition-colors resize-none"
    />
  );
}
