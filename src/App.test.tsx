import { render, cleanup, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('App screen navigation', () => {
  it('stays on the landing and never jumps to an empty result screen after 5s of inactivity', () => {
    vi.useFakeTimers();
    render(<App />);

    // Regression: EvaluatingScreen used to be always-mounted and its 4.8s timer
    // navigated to the (empty) result screen on its own, white-screening the landing.
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    const landing = document.getElementById('screen-landing');
    const result = document.getElementById('screen-result');

    expect(landing?.className).toContain('active');
    expect(result?.className).not.toContain('active');
    // The result content must not render without a real submission.
    expect(document.querySelector('.result-hero')).toBeNull();
  });
});
