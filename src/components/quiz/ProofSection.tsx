// src/components/quiz/ProofSection.tsx
type Props = {
  onStart: () => void;
};

type ProofItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  variant: 'photo' | 'poster';
  tag: string;
  caption: string;
};

// Real chapter photography — the section exists to make the CTA believable, so
// nothing here links out: the only action on the page is starting the postulación.
export const PROOF_ITEMS: ProofItem[] = [
  {
    src: '/assets/contecih-equipo.webp',
    alt: 'Voluntarios de IEEE Computer Society UTP sosteniendo el banner del capítulo en el cierre de CONTECIH',
    width: 900,
    height: 675,
    variant: 'photo',
    tag: 'CONTECIH V · Diciembre 2025',
    caption:
      'Cerramos la quinta edición del Congreso de Tecnología, Innovación y Habilidades para el Futuro junto a ponentes, aliados y voluntarios.',
  },
  {
    src: '/assets/csweek-peru-2026.webp',
    alt: 'Afiche de CS WEEK Perú 2026 con IEEE Computer Society UTP como capítulo confirmado',
    width: 800,
    height: 1000,
    variant: 'poster',
    tag: 'CS WEEK Perú 2026 · 10–15 de agosto',
    caption:
      'Capítulo confirmado. Participamos junto a capítulos IEEE Computer Society de universidades de todo el país.',
  },
  {
    src: '/assets/contecih-comunidad.webp',
    alt: 'Estudiantes conversando durante un evento de IEEE Computer Society UTP en la universidad',
    width: 900,
    height: 675,
    variant: 'photo',
    tag: 'Comunidad',
    caption:
      'Detrás de cada evento hay un equipo que se conoce, se organiza y crece junto. Eso es lo que estás por integrar.',
  },
];

export function ProofSection({ onStart }: Props) {
  return (
    <div className="section proof">
      <h2>Esto ya lo hicimos</h2>
      <p className="lede">
        No es teoría ni promesas. Es un capítulo que organiza congresos, representa a la UTP a nivel nacional
        y funciona porque hay voluntarios detrás.
      </p>

      <div className="proof-grid">
        {PROOF_ITEMS.map((item) => (
          <figure className={`proof-card proof-card--${item.variant}`} key={item.src}>
            <img
              className="proof-media"
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span className="proof-tag">{item.tag}</span>
              <p>{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="proof-close">
        La VI edición de CONTECIH la construimos este año — y la construimos con todos los voluntarios que se sumen.
      </p>

      <button className="btn btn-primary proof-cta" onClick={onStart}>
        Quiero ser parte · Iniciar mi postulación
        <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
