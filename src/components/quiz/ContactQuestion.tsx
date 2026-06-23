// src/components/quiz/ContactQuestion.tsx
import type { QuestionConfig } from '@/lib/quiz/questions';
import type { ContactAnswer } from '@/lib/quiz/schema';

type Props = {
  question: QuestionConfig;
  value: ContactAnswer;
  onChange: (v: ContactAnswer) => void;
};

export function ContactQuestion({ question: _question, value, onChange }: Props) {
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, email: e.target.value });
  }

  function handleWhatsappChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    onChange({ ...value, whatsapp: digits });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[#1f242b]">Correo electrónico</label>
        <input
          type="email"
          value={value.email}
          onChange={handleEmailChange}
          placeholder="usuario@utp.edu.pe"
          className="w-full rounded-xl border-2 border-[#d8dbe0] bg-white px-4 py-3 text-[#0a0d10] placeholder:text-[#b8bcc2] focus:border-[#FFA300] focus:outline-none transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[#1f242b]">WhatsApp</label>
        <div className="flex rounded-xl border-2 border-[#d8dbe0] bg-white overflow-hidden focus-within:border-[#FFA300] transition-colors">
          <span className="flex items-center px-3 py-3 bg-[#eef0f3] text-[#4a5058] text-sm font-medium border-r border-[#d8dbe0]">
            +51
          </span>
          <input
            type="tel"
            value={value.whatsapp}
            onChange={handleWhatsappChange}
            placeholder="912345678"
            maxLength={9}
            className="flex-1 px-3 py-3 text-[#0a0d10] placeholder:text-[#b8bcc2] focus:outline-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
