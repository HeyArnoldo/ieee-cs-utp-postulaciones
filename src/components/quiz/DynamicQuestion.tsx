import { useEffect, useState } from 'react'
import type { QuizAnswers } from '@/lib/quiz/schema'
import { CAREER_LABELS } from '@/lib/notion/mapAnswers'

const FALLBACK_QUESTION = '¿Qué proyecto o problema te gustaría resolver dentro del capítulo este año?'

interface DynamicQuestionProps {
  answers: Partial<QuizAnswers>
  onAnswer: (value: string, question: string) => void
}

export function DynamicQuestion({ answers, onAnswer }: DynamicQuestionProps) {
  const [question, setQuestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentValue, setCurrentValue] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const careerLabel = answers.career === 'otra'
      ? (answers.careerOther ?? '')
      : (answers.career ? CAREER_LABELS[answers.career] : '')

    const fetchQuestion = async () => {
      try {
        const res = await fetch('/api/repregunta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            motivation: answers.motivation ?? '',
            interest: answers.interest ?? '',
            career: answers.career ?? '',
            applicantType: answers.applicantType ?? 'estudiante',
            careerLabel,
          }),
        })
        const data = (await res.json()) as { ok: boolean; question?: string }
        if (!cancelled) {
          setQuestion(data.question ?? FALLBACK_QUESTION)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setQuestion(FALLBACK_QUESTION)
          setLoading(false)
        }
      }
    }

    void fetchQuestion()
    return () => {
      cancelled = true
    }
  }, [answers.motivation, answers.interest, answers.career, answers.applicantType, answers.careerOther])

  if (loading) {
    return (
      <div className="question">
        <div className="qn">IA · Pregunta personalizada</div>
        <h2>Sara IA está leyendo…</h2>
        <div className="ai-status" style={{ marginTop: 0 }}>
          <span className="ai-dot"><i></i><i></i><i></i></span>
          <span>Analizando tus respuestas anteriores</span>
        </div>
      </div>
    )
  }

  const displayQuestion = question ?? FALLBACK_QUESTION

  return (
    <div className="question">
      <div className="qn">IA · Pregunta personalizada</div>
      <h2>{displayQuestion}</h2>
      <p className="hint">Cuéntanos con detalle (mínimo 20 caracteres)</p>
      <textarea
        className="field"
        value={currentValue}
        onChange={(e) => {
          setCurrentValue(e.target.value)
          onAnswer(e.target.value, displayQuestion)
        }}
        placeholder="Cuéntanos con detalle..."
        autoFocus
      />
    </div>
  )
}
