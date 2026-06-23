// src/components/quiz/QuizFlow.tsx
import type { QuizAnswers, ContactAnswer } from '@/lib/quiz/schema';
import { useQuizFlow } from '@/lib/quiz/useQuizFlow';
import { QUESTIONS } from '@/lib/quiz/questions';
import { ProgressBar } from './ProgressBar';
import { ChoiceQuestion } from './ChoiceQuestion';
import { TextQuestion } from './TextQuestion';
import { TextareaQuestion } from './TextareaQuestion';
import { ContactQuestion } from './ContactQuestion';
import { DynamicQuestion } from './DynamicQuestion';

type Props = {
  onSubmit: (answers: QuizAnswers) => Promise<void>;
};

export function QuizFlow({ onSubmit }: Props) {
  const { step, answers, setAnswer, next, back, canAdvance, isLastStep, progress } = useQuizFlow();
  const question = QUESTIONS[step];

  function handleNext() {
    if (isLastStep) {
      void onSubmit(answers as QuizAnswers);
    } else {
      next();
    }
  }

  const currentValue = answers[question.id];

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#eef0f3] px-4 py-3">
        <div className="max-w-lg mx-auto space-y-2">
          <div className="flex items-center justify-between">
            <img src="/assets/logo-horizontal.svg" alt="IEEE CS UTP" className="h-6" />
            <span className="text-xs text-[#4a5058]">
              {step === 0 ? 'Sara IA está lista para evaluar…' : question.aiLine}
            </span>
          </div>
          <ProgressBar progress={progress} current={step + 1} total={QUESTIONS.length} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-[#eef0f3] p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#FFA300] uppercase tracking-widest">{question.qn}</p>
            {question.title && (
              <h2 className="text-xl font-bold text-[#0a0d10] font-['Montserrat',system-ui,sans-serif]">{question.title}</h2>
            )}
            <p className="text-sm text-[#4a5058]">{question.hint}</p>
          </div>

          {question.kind === 'choice' && (
            <ChoiceQuestion
              question={question}
              selected={(currentValue as string) ?? ''}
              onSelect={(v) => setAnswer({ [question.id]: v } as Partial<QuizAnswers>)}
            />
          )}
          {question.kind === 'text' && (
            <TextQuestion
              question={question}
              value={(currentValue as string) ?? ''}
              onChange={(v) => setAnswer({ [question.id]: v } as Partial<QuizAnswers>)}
            />
          )}
          {question.kind === 'textarea' && question.id !== 'followUp' && (
            <TextareaQuestion
              question={question}
              value={(currentValue as string) ?? ''}
              onChange={(v) => setAnswer({ [question.id]: v } as Partial<QuizAnswers>)}
            />
          )}
          {question.id === 'followUp' && (
            <DynamicQuestion
              answers={answers}
              onAnswer={(value, fetchedQuestion) => {
                setAnswer({ followUp: { question: fetchedQuestion, answer: value } });
              }}
            />
          )}
          {question.kind === 'contact' && (
            <ContactQuestion
              question={question}
              value={(currentValue as ContactAnswer) ?? { email: '', whatsapp: '' }}
              onChange={(v) => setAnswer({ contact: v })}
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="text-sm text-[#4a5058] hover:text-[#1f242b] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance}
              className="bg-[#FFA300] hover:bg-[#cc8200] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
            >
              {isLastStep ? 'Enviar postulación →' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur border-t border-[#eef0f3] px-4 py-2">
        <p className="text-center text-xs text-[#b8bcc2]">
          Sara IA · Evaluación en tiempo real · Resultado en 48h
        </p>
      </div>
    </div>
  );
}
