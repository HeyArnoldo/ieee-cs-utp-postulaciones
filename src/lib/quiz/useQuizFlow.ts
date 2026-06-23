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

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, ...action.payload } };
    case 'NEXT': {
      const canAdvance = QUESTIONS[state.step].validate(state.answers);
      const isLast = state.step === QUESTIONS.length - 1;
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

  const canAdvance = QUESTIONS[state.step].validate(state.answers);
  const isLastStep = state.step === QUESTIONS.length - 1;
  const progress = state.step / QUESTIONS.length;

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
    setAnswer,
    next,
    back,
    canAdvance,
    isLastStep,
    progress,
  };
}
