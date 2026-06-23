// src/components/quiz/EvaluatingScreen.tsx
import { useEffect, useState } from 'react';

type Props = {
  onDone: () => void;
};

const STEPS = [
  { label: 'Analizando autenticidad…', delay: 0 },
  { label: 'Evaluando perfil técnico…', delay: 900 },
  { label: 'Calculando compatibilidad…', delay: 1800 },
  { label: 'Revisando motivación…', delay: 2700 },
  { label: 'Generando resultado…', delay: 3600 },
];

export function EvaluatingScreen({ onDone }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((s, i) => {
      timers.push(setTimeout(() => setActiveStep(i), s.delay));
    });

    timers.push(setTimeout(onDone, 4800));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001530] via-[#002855] to-[#00629B] flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-sm w-full">
        {/* Orb */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-[#00B5E2]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#00B5E2]/30 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-[#00629B] flex items-center justify-center">
            <span className="text-3xl">🧠</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white font-['Montserrat',system-ui,sans-serif]">
            Sara IA está evaluando…
          </h2>
          <p className="text-[#C8F1FB] text-sm">Procesando tu postulación en tiempo real</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 transition-opacity duration-500 ${i <= activeStep ? 'opacity-100' : 'opacity-30'}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${i < activeStep ? 'bg-[#FFA300]' : i === activeStep ? 'bg-[#00B5E2] animate-pulse' : 'bg-white/20'}`}>
                {i < activeStep ? '✓' : ''}
              </div>
              <span className="text-sm text-white text-left">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
