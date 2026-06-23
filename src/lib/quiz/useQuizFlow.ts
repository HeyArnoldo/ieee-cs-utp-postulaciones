// src/lib/quiz/useQuizFlow.ts
import { useReducer } from 'react';
import type { QuizAnswers } from './schema';
import { QUESTIONS } from './questions';

type State = {
  step: number;
  answers: Partial<QuizAnswers>;
};

type Action =
  | { type: 'SET_ANSWER'; payload: Partial<QuizAnswers> }
  | { type: 'NEXT' }
  | { type: 'BACK' };

function getActiveQuestions(answers: Partial<QuizAnswers>) {
  return QUESTIONS.filter((q) => q.showIf === undefined || q.showIf(answers));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ANSWER': {
      const newAnswers = { ...state.answers, ...action.payload };
      return { ...state, answers: newAnswers };
    }
    case 'NEXT': {
      const activeQuestions = getActiveQuestions(state.answers);
      const canAdvance = activeQuestions[state.step].validate(state.answers);
      const isLast = state.step === activeQuestions.length - 1;
      if (canAdvance && !isLast) {
        return { ...state, step: state.step + 1 };
      }
      return state;
    }
    case 'BACK':
      if (state.step > 0) return { ...state, step: state.step - 1 };
      return state;
    default:
      return state;
  }
}

export function useQuizFlow() {
  const [state, dispatch] = useReducer(reducer, { step: 0, answers: {} });

  const activeQuestions = getActiveQuestions(state.answers);
  const canAdvance = activeQuestions[state.step].validate(state.answers);
  const isLastStep = state.step === activeQuestions.length - 1;
  const progress = state.step / activeQuestions.length;

  function setAnswer(partial: Partial<QuizAnswers>) {
    dispatch({ type: 'SET_ANSWER', payload: partial });
  }

  function next() {
    dispatch({ type: 'NEXT' });
  }

  function back() {
    dispatch({ type: 'BACK' });
  }

  return {
    step: state.step,
    answers: state.answers,
    activeQuestions,
    setAnswer,
    next,
    back,
    canAdvance,
    isLastStep,
    progress,
  };
}
