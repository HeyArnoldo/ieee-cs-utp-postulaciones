// src/components/quiz/EvaluatingScreen.tsx
import { useEffect, useState } from 'react';

type Props = {
  onDone: () => void;
};

const checks = [
  'Verificando datos básicos',
  'Analizando motivación y fit cultural',
  'Evaluando habilidades técnicas',
  'Consultando perfil de liderazgo',
  'Generando recomendación personalizada',
];

const lines = [
  'Cruzando tus respuestas con el perfil del capítulo…',
  'Comparando con 247 postulaciones anteriores…',
  'Analizando coherencia entre motivación y disponibilidad…',
  'Calculando match técnico con áreas activas del capítulo…',
  'Listo. Preparando tu resultado…',
];

export function EvaluatingScreen({ onDone }: Props) {
  const [shownChecks, setShownChecks] = useState<number[]>([]);
  const [doneChecks, setDoneChecks] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState(lines[0]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    checks.forEach((_, i) => {
      timers.push(setTimeout(() => setShownChecks(prev => [...prev, i]), 200 + i * 100));
      timers.push(setTimeout(() => setDoneChecks(prev => [...prev, i]), 700 + i * 700));
    });

    lines.forEach((line, i) => {
      timers.push(setTimeout(() => setCurrentLine(line), 200 + i * 800));
    });

    timers.push(setTimeout(onDone, 4800));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="evaluating">
      <div className="ai-orb"></div>
      <div className="eval-status">Sara IA · Evaluando</div>
      <div className="eval-line">{currentLine}</div>
      <div className="eval-checks">
        {checks.map((check, i) => (
          <div
            key={i}
            className={`eval-check${shownChecks.includes(i) ? ' shown' : ''}${doneChecks.includes(i) ? ' done' : ''}`}
          >
            <span className="ico"></span>
            <span>{check}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
