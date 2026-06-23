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
    <div className="min-h-screen bg-[#f7f8fa] font-['Open_Sans',system-ui,sans-serif]">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-[#002855] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo-horizontal.svg" alt="IEEE CS UTP" className="h-8" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#00B5E2] font-medium">Cierra en:</span>
            <span className="font-mono font-bold text-white">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#001530] via-[#002855] to-[#00629B] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#00B5E2]/20 border border-[#00B5E2]/30 rounded-full px-4 py-1 text-sm text-[#00B5E2] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#00B5E2] animate-pulse" />
            Convocatoria 2026-I — Plazas limitadas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat',system-ui,sans-serif] leading-tight">
            Construye el futuro<br />
            <span className="text-[#FFA300]">con los mejores de UTP</span>
          </h1>
          <p className="text-lg text-[#C8F1FB] max-w-xl mx-auto">
            IEEE Computer Society UTP es el capítulo estudiantil donde ingenieros apasionados por la tecnología construyen proyectos reales, se conectan con la industria y dejan huella.
          </p>

          {/* Meta cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold text-[#FFA300]">
                {timeLeft.days}d {timeLeft.hours}h
              </div>
              <div className="text-xs text-[#C8F1FB]">para el cierre</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold text-[#FFA300]">7 min</div>
              <div className="text-xs text-[#C8F1FB]">para completar</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold text-[#FFA300]">IA</div>
              <div className="text-xs text-[#C8F1FB]">evaluación en tiempo real</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-6 inline-block bg-[#FFA300] hover:bg-[#cc8200] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-['Montserrat',system-ui,sans-serif]"
          >
            Quiero unirme — Empezar postulación →
          </button>
          <p className="text-sm text-[#C8F1FB]">Sin costo · Resultado en 48h · 7 preguntas</p>
        </div>
      </section>

      {/* ¿Qué es IEEE? */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-[#002855] font-['Montserrat',system-ui,sans-serif] mb-10">
            ¿Qué es IEEE Computer Society?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '🏆', title: 'Proyectos reales', desc: 'Construye con impacto — no solo cursos. Hackathones, competencias y productos que usará gente real.' },
              { emoji: '🌐', title: 'Red global', desc: 'Conecta con +400,000 profesionales de IEEE en 190 países. Mentores, becas y oportunidades internacionales.' },
              { emoji: '🚀', title: 'Lanzadera de carrera', desc: 'Alumni nuestros trabajan en Google, Microsoft, startups unicornio y organismos de gobierno tech.' },
            ].map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-[#eef0f3] p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{pillar.emoji}</div>
                <h3 className="font-bold text-[#002855] mb-2 font-['Montserrat',system-ui,sans-serif]">{pillar.title}</h3>
                <p className="text-sm text-[#4a5058]">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="py-16 px-4 bg-[#f7f8fa]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-[#002855] font-['Montserrat',system-ui,sans-serif] mb-10">
            ¿Cómo funciona el proceso?
          </h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Completas el formulario', desc: 'Responde 7 preguntas honestas — toma menos de 7 minutos.' },
              { step: '02', title: 'Sara IA evalúa tu perfil', desc: 'Nuestra IA analiza autenticidad, pasión técnica y compatibilidad de horario en segundos.' },
              { step: '03', title: 'RRHH te contacta', desc: 'Si pasas el filtro IA, recibes un WhatsApp en menos de 48h para una breve llamada.' },
              { step: '04', title: 'Bienvenido al equipo', desc: 'Onboarding, proyectos y comunidad. Tu historia en IEEE empieza aquí.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFA300] text-white flex items-center justify-center font-bold text-sm font-['Montserrat',system-ui,sans-serif]">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-[#002855] font-['Montserrat',system-ui,sans-serif]">{item.title}</h3>
                  <p className="text-sm text-[#4a5058]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="py-16 px-4 bg-[#002855] text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold font-['Montserrat',system-ui,sans-serif]">
            ¿Listo para dejar tu huella?
          </h2>
          <p className="text-[#C8F1FB]">La convocatoria cierra pronto. No dejes para mañana lo que hoy puede cambiar tu carrera.</p>
          <button
            type="button"
            onClick={onStart}
            className="inline-block bg-[#FFA300] hover:bg-[#cc8200] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-['Montserrat',system-ui,sans-serif]"
          >
            Empezar ahora →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-[#4a5058] bg-[#f7f8fa] border-t border-[#eef0f3]">
        <p>© 2026 IEEE Computer Society — Capítulo Estudiantil UTP · Lima, Perú</p>
        <p className="mt-1 text-xs">Este formulario recopila datos exclusivamente para el proceso de selección.</p>
      </footer>
    </div>
  );
}
