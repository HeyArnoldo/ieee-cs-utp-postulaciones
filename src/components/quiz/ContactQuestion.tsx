// src/components/quiz/ContactQuestion.tsx
import type { QuestionConfig } from '@/lib/quiz/questions';
import type { ContactAnswer } from '@/lib/quiz/schema';

type Props = {
  question: QuestionConfig;
  value: ContactAnswer;
  onChange: (v: ContactAnswer) => void;
};

export function ContactQuestion({ question, value, onChange }: Props) {
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, email: e.target.value });
  }

  function handleWhatsappChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    onChange({ ...value, whatsapp: digits });
  }

  return (
    <div className="question">
      <div className="qn">{question.qn}</div>
      <h2>{question.title}</h2>
      {question.hint && <p className="hint">{question.hint}</p>}
      <div className="contact-fields">
        <label className="contact-field">
          <span className="contact-label">
            <span className="contact-ico">✉️</span>
            Correo electrónico
          </span>
          <input
            className="field"
            type="email"
            value={value.email}
            onChange={handleEmailChange}
            placeholder="tu@email.com"
          />
        </label>
        <label className="contact-field">
          <span className="contact-label">
            <span className="contact-ico">📱</span>
            WhatsApp
            <small>(número peruano)</small>
          </span>
          <div className="wa-input">
            <span className="wa-prefix" aria-hidden="true">+51</span>
            <input
              className="field"
              type="tel"
              value={value.whatsapp}
              onChange={handleWhatsappChange}
              placeholder="987 654 321"
            />
          </div>
        </label>
        <p className="contact-note">📌 Solo usamos tus datos para notificarte el resultado de tu postulación. No spam, nunca.</p>
      </div>
    </div>
  );
}
