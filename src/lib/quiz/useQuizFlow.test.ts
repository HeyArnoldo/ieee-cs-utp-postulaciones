// src/lib/quiz/useQuizFlow.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizFlow } from './useQuizFlow';

describe('useQuizFlow', () => {
  it('starts at step 0 with canAdvance false', () => {
    const { result } = renderHook(() => useQuizFlow());
    expect(result.current.step).toBe(0);
    expect(result.current.canAdvance).toBe(false);
  });

  it('invalid answer keeps canAdvance false', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ name: 'Ana' }));
    expect(result.current.canAdvance).toBe(false);
  });

  it('valid name makes canAdvance true', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    expect(result.current.canAdvance).toBe(true);
  });

  it('next() advances step when canAdvance', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
  });

  it('back() at step 0 stays at 0', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.back());
    expect(result.current.step).toBe(0);
  });

  it('back() at step 1 goes to step 0', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    act(() => result.current.back());
    expect(result.current.step).toBe(0);
  });

  it('ESTUDIANTE path: isLastStep is true at step 8 (9 active questions)', () => {
    const { result } = renderHook(() => useQuizFlow());
    expect(result.current.isLastStep).toBe(false);
    // name
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    // applicantType = estudiante
    act(() => result.current.setAnswer({ applicantType: 'estudiante' }));
    act(() => result.current.next());
    // career
    act(() => result.current.setAnswer({ career: 'software' }));
    act(() => result.current.next());
    // cycle (shown for estudiante)
    act(() => result.current.setAnswer({ cycle: '4-6' }));
    act(() => result.current.next());
    // interest
    act(() => result.current.setAnswer({ interest: 'web' }));
    act(() => result.current.next());
    // motivation
    act(() => result.current.setAnswer({ motivation: 'a'.repeat(60) }));
    act(() => result.current.next());
    // followUp
    act(() => result.current.setAnswer({ followUp: { question: '¿Pregunta?', answer: 'a'.repeat(20) } }));
    act(() => result.current.next());
    // availability
    act(() => result.current.setAnswer({ availability: '5-8' }));
    act(() => result.current.next());
    // now at contact (step 8), which is the last
    expect(result.current.step).toBe(8);
    expect(result.current.isLastStep).toBe(true);
  });

  it('DOCENTE path: cycle step is skipped — 8 active questions, isLastStep at step 7', () => {
    const { result } = renderHook(() => useQuizFlow());
    // name
    act(() => result.current.setAnswer({ name: 'Carlos Ríos' }));
    act(() => result.current.next());
    // applicantType = docente
    act(() => result.current.setAnswer({ applicantType: 'docente' }));
    act(() => result.current.next());
    // career
    act(() => result.current.setAnswer({ career: 'sistemas' }));
    act(() => result.current.next());
    // cycle is SKIPPED — next is interest
    act(() => result.current.setAnswer({ interest: 'ai' }));
    act(() => result.current.next());
    // motivation
    act(() => result.current.setAnswer({ motivation: 'a'.repeat(60) }));
    act(() => result.current.next());
    // followUp
    act(() => result.current.setAnswer({ followUp: { question: '¿Pregunta?', answer: 'a'.repeat(20) } }));
    act(() => result.current.next());
    // availability
    act(() => result.current.setAnswer({ availability: '5-8' }));
    act(() => result.current.next());
    // now at contact (step 7), which is the last
    expect(result.current.step).toBe(7);
    expect(result.current.isLastStep).toBe(true);
    // Verify active question count
    expect(result.current.activeQuestions.length).toBe(8);
  });

  it('DOCENTE path: activeQuestions excludes cycle', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ applicantType: 'docente' }));
    const ids = result.current.activeQuestions.map((q) => q.id);
    expect(ids).not.toContain('cycle');
  });

  it('ESTUDIANTE path: activeQuestions includes cycle', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ applicantType: 'estudiante' }));
    const ids = result.current.activeQuestions.map((q) => q.id);
    expect(ids).toContain('cycle');
  });

  it('career=otra blocks canAdvance until careerOther is non-empty', () => {
    const { result } = renderHook(() => useQuizFlow());
    // advance to career step (step 2)
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ applicantType: 'estudiante' }));
    act(() => result.current.next());
    // now at career step
    act(() => result.current.setAnswer({ career: 'otra' }));
    expect(result.current.canAdvance).toBe(false);
    act(() => result.current.setAnswer({ careerOther: 'Matemáticas' }));
    expect(result.current.canAdvance).toBe(true);
  });

  it('progress at step 0 is 0', () => {
    const { result } = renderHook(() => useQuizFlow());
    expect(result.current.progress).toBeCloseTo(0);
  });

  it('progress at step 1 is 1/N where N is active question count', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    const n = result.current.activeQuestions.length;
    expect(result.current.progress).toBeCloseTo(1 / n);
  });
});
