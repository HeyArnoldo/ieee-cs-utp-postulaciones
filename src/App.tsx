// src/App.tsx
import { useState } from 'react';
import type { QuizAnswers } from '@/lib/quiz/schema';
import { submitApplication } from '@/lib/api/submitApplication';
import { LandingScreen } from '@/components/quiz/LandingScreen';
import { QuizFlow } from '@/components/quiz/QuizFlow';
import { EvaluatingScreen } from '@/components/quiz/EvaluatingScreen';
import { ResultScreen } from '@/components/quiz/ResultScreen';

type Screen = 'landing' | 'flow' | 'evaluating' | 'result';

type ResultData = {
  name: string;
  email: string;
  whatsapp: string;
  code: string;
  score: number;
  mensaje?: string;
  comiteSugerido?: string;
};

function generateCode(): string {
  return 'IEEE-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(answers: QuizAnswers): Promise<void> {
    setIsSubmitting(true);
    setSubmitError(null);
    setScreen('evaluating');

    const result = await submitApplication(answers);

    if (!result.ok) {
      setSubmitError(result.error);
      setScreen('flow'); // return to form so user can retry
      setIsSubmitting(false);
      return;
    }

    setResultData({
      name: answers.name,
      email: answers.contact.email,
      whatsapp: answers.contact.whatsapp,
      code: generateCode(),
      score: 87, // TODO(M4): replace with real score
      mensaje: result.mensaje,
      comiteSugerido: result.comiteSugerido,
    });
    setIsSubmitting(false);
  }

  function handleEvaluatingDone() {
    setScreen('result');
  }

  if (screen === 'landing') {
    return <LandingScreen onStart={() => setScreen('flow')} />;
  }

  if (screen === 'flow') {
    return (
      <>
        {submitError && (
          <div role="alert" className="fixed top-0 inset-x-0 z-50 bg-red-600 text-white text-sm text-center px-4 py-2">
            {submitError}
          </div>
        )}
        <QuizFlow onSubmit={handleSubmit} />
      </>
    );
  }

  if (screen === 'evaluating') {
    // isSubmitting guards against the animation finishing before the API responds
    return <EvaluatingScreen onDone={isSubmitting ? () => undefined : handleEvaluatingDone} />;
  }

  if (screen === 'result' && resultData) {
    return <ResultScreen result={resultData} />;
  }

  return null;
}

export default App;
