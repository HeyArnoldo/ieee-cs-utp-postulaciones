// src/components/quiz/LandingScreen.tsx
import { useEffect, useState } from 'react';

type Props = {
  onStart: () => void;
};

type TimeLeft = {
  days: number;
  hours: number;
  mins: number;
};

const DEADLINE = new Date('2026-06-15T23:59:59-05:00');

function getTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, DEADLINE.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, mins };
}

export function LandingScreen({ onStart }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="chrome">
        <a className="brand" href="https://ieeecsutp.org">
          <img className="lockup" src="/assets/logo-horizontal.svg" alt="IEEE CS UTP" />
          <span className="domain">ieeecsutp.org</span>
        </a>
        <div className="countdown">
          Cierra en {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m
        </div>
      </div>

      <div className="hero">
        <div className="hero-text">
          <span className="eyebrow"><span className="dot"></span>Convocatoria 2026 · Abierta</span>
          <h1>IEEE CS UTP<br /><em>te quiere</em> en su equipo</h1>
          <p className="sub">El capítulo estudiantil de IEEE más activo del Perú busca ingenieros apasionados por la tecnología, el liderazgo y el impacto real.</p>
        </div>
        <div className="hero-meta">
          <div className="meta-card urgent">
            <div className="k">Cierre en</div>
            <div className="v">{timeLeft.days}<small>días</small></div>
          </div>
          <div className="meta-card">
            <div className="k">Cupos disponibles</div>
            {/* TODO: cohort-size placeholder — confirm with chapter before each cycle */}
            <div className="v">30 <small>cupos</small></div>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <button className="btn btn-primary" onClick={onStart}>
          Iniciar mi postulación
          <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="scarcity">
          <span className="live"></span>
          <span>Cupos limitados · Solo 30 seleccionados</span>
        </div>
      </div>

      <div className="section">
        <h2>¿Qué es IEEE CS UTP?</h2>
        <p className="lede">El capítulo estudiantil de Computer Society en la Universidad Tecnológica del Perú — donde los mejores estudiantes de ingeniería convierten ideas en proyectos reales.</p>
        <div className="pillars">
          <div className="pillar">
            <div className="n">01 — RED</div>
            <h3>Comunidad élite</h3>
            <p>Accede a la red global de IEEE con +400 000 profesionales en 160 países. Contactos que abren puertas en empresas tech top.</p>
          </div>
          <div className="pillar">
            <div className="n">02 — SKILLS</div>
            <h3>Proyectos reales</h3>
            <p>Desarrolla habilidades técnicas y de liderazgo trabajando en proyectos con impacto real, no solo teoría de aula.</p>
          </div>
          <div className="pillar">
            <div className="n">03 — CARRERA</div>
            <h3>Ventaja diferencial</h3>
            <p>Agrega IEEE CS UTP a tu CV y destácate entre cientos de candidatos. Los reclutadores reconocen la marca IEEE.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Proceso de selección</h2>
        <p className="lede">Transparente, meritocrático y diseñado para encontrar a quienes realmente quieren construir algo grande.</p>
        <div className="timeline">
          <div className="step active">
            <h4>Postulación online</h4>
            <p>Completa el formulario inteligente (este). Sara IA analiza tu perfil en tiempo real.</p>
          </div>
          <div className="step">
            <h4>Evaluación de perfil</h4>
            <p>Revisamos tus respuestas, motivación y alineamiento con los valores del capítulo.</p>
          </div>
          <div className="step">
            <h4>Entrevista grupal</h4>
            <p>Los finalistas participan en una dinámica de equipo virtual. Evaluamos colaboración y liderazgo.</p>
          </div>
        </div>
      </div>

      <div className="cta-row" style={{ borderTop: '1px solid var(--ink-100)' }}>
        <button className="btn btn-primary" onClick={onStart}>
          Iniciar mi postulación
          <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="scarcity">
          <span className="live"></span>
          <span>Cupos limitados · Solo 30 seleccionados</span>
        </div>
      </div>

      <div className="footer-note">© 2026 IEEE CS UTP · Capítulo Estudiantil · Lima, Perú</div>
    </>
  );
}
