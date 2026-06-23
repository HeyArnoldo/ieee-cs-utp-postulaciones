// src/App.tsx
import { useState } from 'react';
import type { QuizAnswers } from '@/lib/quiz/schema';
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
};

function generateCode(): string {
  return 'IEEE-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [resultData, setResultData] = useState<ResultData | null>(null);

  async function handleSubmit(answers: QuizAnswers): Promise<void> {
    // TODO(M2): POST /api/postular
    // TODO(M3): AI evaluation hook
    console.info('[M1] Postulación recibida:', answers);

    setResultData({
      name: answers.name,
      email: answers.contact.email,
      whatsapp: answers.contact.whatsapp,
      code: generateCode(),
      score: 87,
    });
    setScreen('evaluating');
  }

  function handleEvaluatingDone() {
    setScreen('result');
  }

  if (screen === 'landing') {
    return <LandingScreen onStart={() => setScreen('flow')} />;
  }

  if (screen === 'flow') {
    return <QuizFlow onSubmit={handleSubmit} />;
  }

  if (screen === 'evaluating') {
    return <EvaluatingScreen onDone={handleEvaluatingDone} />;
  }

  if (screen === 'result' && resultData) {
    return <ResultScreen result={resultData} />;
  }

  return null;
}

export default App;
