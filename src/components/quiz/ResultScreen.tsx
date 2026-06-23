// src/components/quiz/ResultScreen.tsx
import { useEffect, useRef, useState } from 'react';

type ResultProps = {
  name: string;
  email: string;
  whatsapp: string;
  code: string;
  mensaje?: string;
  comiteSugerido?: string;
};

type Props = {
  result: ResultProps;
};

const CONFETTI_COLORS = ['#FFA300', '#00B5E2', '#FFFFFF', '#FFB733'];

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
      const dot = document.createElement('i');
      dot.style.left = Math.random() * 100 + '%';
      dot.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      dot.style.animationDelay = (Math.random() * 3) + 's';
      dot.style.animationDuration = (3 + Math.random() * 2) + 's';
      container.appendChild(dot);
    }
  }, []);

  const firstName = result.name.trim().split(' ')[0];

  return (
    <>
      <div className="result-hero">
        <div className="confetti" ref={confettiRef}></div>
        <div className="badge-success checky">✓</div>
        <h1>¡Listo, {firstName}! Recibimos tu postulación.</h1>
        <p className="lede">
          {result.mensaje ? <TypewriterText text={result.mensaje} /> : 'Analizando tu perfil...'}
        </p>
        <div className="result-stamp">
          <img src="/assets/logo-stacked-white.png" alt="IEEE CS UTP" />
          <span className="stamp-label">Sello oficial · 2026</span>
        </div>
      </div>

      <div className="next-steps">
        <h2>Qué sigue, <span>{firstName || 'postulante'}</span>:</h2>
        <div className="next-card">
          <div className="ico">1</div>
          <div>
            <h4>Revisa tu correo</h4>
            <p>Te enviamos la confirmación de postulación a <strong>{result.email}</strong>.</p>
          </div>
        </div>
        <div className="next-card">
          <div className="ico">2</div>
          <div>
            <h4>{result.comiteSugerido ? `Comité sugerido: ${result.comiteSugerido}` : 'Resultado en 5 días'}</h4>
            <p>El equipo evaluará tu postulación y te contactará por WhatsApp.</p>
          </div>
        </div>
        <div className="next-card muted">
          <div className="ico">3</div>
          <div>
            <h4>Entrevista grupal</h4>
            <p>Si pasas a la siguiente fase, participarás en una dinámica grupal virtual.</p>
          </div>
        </div>
        <div className="summary-strip">
          <strong>Tu postulación:</strong> código <strong>{result.code || '—'}</strong>. Guárdalo para seguimiento.
        </div>
      </div>

      <div className="footer-note">© 2026 IEEE CS UTP · Capítulo Estudiantil · Lima, Perú</div>
    </>
  );
}
