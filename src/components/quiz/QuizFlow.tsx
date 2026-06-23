// src/components/quiz/QuizFlow.tsx
import type { QuizAnswers, ContactAnswer } from '@/lib/quiz/schema';
import { useQuizFlow } from '@/lib/quiz/useQuizFlow';
import { ProgressBar } from './ProgressBar';
import { ChoiceQuestion } from './ChoiceQuestion';
import { TextQuestion } from './TextQuestion';
import { TextareaQuestion } from './TextareaQuestion';
import { ContactQuestion } from './ContactQuestion';
import { DynamicQuestion } from './DynamicQuestion';
import { CareerQuestion } from './CareerQuestion';

type Props = {
  onSubmit: (answers: QuizAnswers) => Promise<void>;
  submitting?: boolean;
};

export function QuizFlow({ onSubmit, submitting = false }: Props) {
  const { step, answers, activeQuestions, setAnswer, next, back, canAdvance, isLastStep } = useQuizFlow();
  const question = activeQuestions[step];
  const isFirst = step === 0;
  const isDynamicStep = question.id === 'followUp';

  function handleNext() {
    if (isLastStep) {
      void onSubmit(answers as QuizAnswers);
    } else {
      next();
    }
  }

  const currentValue = answers[question.id as keyof typeof answers];

  return (
    <>
      <div className="flow-header">
        <button className="flow-back" onClick={back} disabled={isFirst}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 13 5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>
        <ProgressBar current={step + 1} total={activeQuestions.length} />
        <div className="ai-status">
          <span className="ai-dot"><i></i><i></i><i></i></span>
          <span>{step === 0 ? 'Sara IA está lista para evaluar…' : question.aiLine}</span>
        </div>
      </div>
      <div id="question-host">
        {question.id === 'career' && (
          <CareerQuestion
            question={question}
            answer={(answers.career as string) ?? ''}
            careerOther={answers.careerOther ?? ''}
            onAnswer={(v) => setAnswer({ career: v as QuizAnswers['career'] })}
            onCareerOther={(text) => setAnswer({ careerOther: text })}
          />
        )}
        {question.kind === 'choice' && question.id !== 'career' && (
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
        {question.kind === 'textarea' && !isDynamicStep && (
          <TextareaQuestion
            question={question}
            value={(currentValue as string) ?? ''}
            onChange={(v) => setAnswer({ [question.id]: v } as Partial<QuizAnswers>)}
          />
        )}
        {isDynamicStep && (
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
        <div className="qfoot">
          <button className="btn btn-secondary" onClick={back} disabled={isFirst}>←</button>
          <button className="btn btn-primary" onClick={handleNext} disabled={!canAdvance || (isLastStep && submitting)}>
            {isLastStep && submitting ? 'Enviando…' : isLastStep ? 'Ver mi resultado' : 'Siguiente'}
            {!isLastStep && (
              <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
