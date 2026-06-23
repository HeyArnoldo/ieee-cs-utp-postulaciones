// src/components/quiz/ChoiceQuestion.tsx
import { cn } from '@/lib/utils';
import type { QuestionConfig } from '@/lib/quiz/questions';

type Props = {
  question: QuestionConfig;
  selected: string;
  onSelect: (v: string) => void;
};

export function ChoiceQuestion({ question, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {question.options?.map((opt) => (
        <button
          key={opt.v}
          type="button"
          aria-pressed={selected === opt.v}
          onClick={() => onSelect(opt.v)}
          className={cn(
            'flex items-center gap-3 w-full rounded-xl border-2 px-4 py-3 text-left transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            selected === opt.v
              ? 'border-[#FFA300] bg-[#fff1d6] text-[#0a0d10]'
              : 'border-[#d8dbe0] bg-white text-[#1f242b] hover:border-[#FFA300] hover:bg-[#fff1d6]',
          )}
        >
          <span className="text-xl">{opt.emoji}</span>
          <span className="text-sm font-medium">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
