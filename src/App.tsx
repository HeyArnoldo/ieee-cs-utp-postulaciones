// src/App.tsx
import { useEffect, useState } from 'react';
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [evaluationDone, setEvaluationDone] = useState(false);

  async function handleSubmit(answers: QuizAnswers): Promise<void> {
    setSubmitError(null);
    setResultData(null);
    setEvaluationDone(false);
    setScreen('evaluating');

    const result = await submitApplication(answers);

    if (!result.ok) {
      setSubmitError(result.error);
      setScreen('flow'); // return to form so user can retry
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
  }

  // Move to the result only once BOTH the evaluating animation has finished
  // and the application has been saved (handles either order, never blocks).
  useEffect(() => {
    if (screen === 'evaluating' && evaluationDone && resultData) {
      setScreen('result');
    }
  }, [screen, evaluationDone, resultData]);

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
        {/* Mount ONLY while active — its timer must not fire on the landing screen. */}
        {screen === 'evaluating' && <EvaluatingScreen onDone={() => setEvaluationDone(true)} />}
      </section>
      <section id="screen-result" className={`screen${screen === 'result' ? ' active' : ''}`}>
        {resultData && <ResultScreen result={resultData} />}
      </section>
    </div>
  );
}

export default App;
