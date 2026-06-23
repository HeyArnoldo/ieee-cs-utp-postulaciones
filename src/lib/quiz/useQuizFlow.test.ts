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

  it('isLastStep is true only at step 7', () => {
    const { result } = renderHook(() => useQuizFlow());
    expect(result.current.isLastStep).toBe(false);
    // advance through all steps: name→career→cycle→interest→motivation→followUp→availability→contact
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ career: 'software' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ cycle: '4-6' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ interest: 'web' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ motivation: 'a'.repeat(60) }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ followUp: { question: '¿Pregunta?', answer: 'a'.repeat(20) } }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ availability: '5-8' }));
    act(() => result.current.next());
    expect(result.current.step).toBe(7);
    expect(result.current.isLastStep).toBe(true);
  });

  it('progress at step 0 is 0', () => {
    const { result } = renderHook(() => useQuizFlow());
    expect(result.current.progress).toBeCloseTo(0);
  });

  it('progress at step 1 is 1/8', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    expect(result.current.progress).toBeCloseTo(1 / 8);
  });

  it('progress at step 6 is 6/8', () => {
    const { result } = renderHook(() => useQuizFlow());
    act(() => result.current.setAnswer({ name: 'Ana Pérez' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ career: 'software' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ cycle: '4-6' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ interest: 'web' }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ motivation: 'a'.repeat(60) }));
    act(() => result.current.next());
    act(() => result.current.setAnswer({ followUp: { question: '¿Pregunta?', answer: 'a'.repeat(20) } }));
    act(() => result.current.next());
    expect(result.current.progress).toBeCloseTo(6 / 8);
  });
});
