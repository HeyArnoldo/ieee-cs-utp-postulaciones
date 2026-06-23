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

  return (
    <div className="stage">
      <section id="screen-landing" className={`screen${screen === 'landing' ? ' active' : ''}`}>
        <LandingScreen onStart={() => setScreen('flow')} />
      </section>
      <section id="screen-flow" className={`screen${screen === 'flow' ? ' active' : ''}`}>
        {submitError && (
          <div role="alert" style={{ background: '#dc2626', color: '#fff', fontSize: '14px', textAlign: 'center', padding: '8px 16px' }}>
            {submitError}
          </div>
        )}
        <QuizFlow onSubmit={handleSubmit} />
      </section>
      <section id="screen-evaluating" className={`screen${screen === 'evaluating' ? ' active' : ''}`}>
        <EvaluatingScreen onDone={isSubmitting ? () => undefined : handleEvaluatingDone} />
      </section>
      <section id="screen-result" className={`screen${screen === 'result' ? ' active' : ''}`}>
        {resultData && <ResultScreen result={resultData} />}
      </section>
    </div>
  );
}

export default App;
