// src/components/quiz/ResultScreen.tsx
import { useEffect, useRef, useState } from 'react';

type ResultProps = {
  name: string;
  email: string;
  whatsapp: string;
  code: string;
  score: number;
  mensaje?: string;
  comiteSugerido?: string;
};

type Props = {
  result: ResultProps;
};

const CONFETTI_COLORS = ['#FFA300', '#00B5E2', '#FFFFFF', '#FFB733'];
const CIRCUMFERENCE = 2 * Math.PI * 60; // ~377

function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}

export function ResultScreen({ result }: Props) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = confettiRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const dot = document.createElement('div');
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      dot.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${color};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 40}%;
        animation: confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards;
        animation-delay: ${Math.random() * 0.8}s;
        opacity: 0;
      `;
      container.appendChild(dot);
    }
  }, []);

  const strokeDashoffset = CIRCUMFERENCE - (result.score / 100) * CIRCUMFERENCE;

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col items-center justify-center px-4 py-12">
      {/* Confetti layer */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none overflow-hidden z-50" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#eef0f3] p-8 space-y-6 text-center">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#FFA300] uppercase tracking-widest">Resultado</p>
          <h2 className="text-2xl font-bold text-[#002855] font-['Montserrat',system-ui,sans-serif]">
            ¡Postulación recibida, {result.name.split(' ')[0]}!
          </h2>
        </div>

        {/* AI mensaje with typewriter */}
        {result.mensaje && (
          <div className="bg-[#f0f7ff] rounded-xl p-4 text-left">
            <p className="text-sm text-[#002855] leading-relaxed">
              <TypewriterText text={result.mensaje} />
            </p>
          </div>
        )}

        {/* Comité sugerido */}
        {result.comiteSugerido && (
          <div className="bg-[#fff8e6] rounded-xl px-4 py-3">
            <p className="text-xs text-[#4a5058] mb-1">Comité sugerido para ti</p>
            <p className="font-bold text-[#cc8200] text-sm">{result.comiteSugerido}</p>
          </div>
        )}

        {/* Score ring */}
        {/* TODO(M4): remove fake gatekeeping score */}
        <div className="flex flex-col items-center gap-2">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70" cy="70" r="60"
              fill="none"
              stroke="#eef0f3"
              strokeWidth="12"
            />
            <circle
              cx="70" cy="70" r="60"
              fill="none"
              stroke="#FFA300"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 1.2s ease' }}
            />
          </svg>
          <div className="absolute">
            <div className="flex flex-col items-center" style={{ marginTop: '-80px' }}>
              <span className="text-3xl font-bold text-[#002855] font-['Montserrat',system-ui,sans-serif]">
                {result.score}
              </span>
              <span className="text-xs text-[#4a5058]">Score Sara IA</span>
            </div>
          </div>
        </div>

        {/* Code */}
        <div className="bg-[#eef0f3] rounded-xl px-4 py-3">
          <p className="text-xs text-[#4a5058] mb-1">Tu código de postulación</p>
          <p className="font-mono font-bold text-[#002855] tracking-widest">{result.code}</p>
        </div>

        {/* Contact info */}
        <div className="text-sm text-[#4a5058] space-y-1">
          <p>📧 <span className="font-medium text-[#1f242b]">{result.email}</span></p>
          <p>📱 <span className="font-medium text-[#1f242b]">+51 {result.whatsapp}</span></p>
        </div>

        {/* Next steps */}
        <div className="bg-[#ECFAFD] rounded-xl p-4 text-left space-y-2">
          <p className="font-bold text-[#00629B] text-sm font-['Montserrat',system-ui,sans-serif]">¿Qué sigue?</p>
          <ul className="text-sm text-[#1f242b] space-y-1">
            <li>✅ Guarda tu código de postulación</li>
            <li>📱 RRHH te escribirá por WhatsApp en menos de 48h</li>
            <li>📧 Revisa tu correo por si hay novedades</li>
          </ul>
        </div>

        <p className="text-xs text-[#b8bcc2]">
          IEEE Computer Society UTP · Convocatoria 2026-I
        </p>
      </div>
    </div>
  );
}
