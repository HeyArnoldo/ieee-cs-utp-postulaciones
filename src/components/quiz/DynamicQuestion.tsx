import { useEffect, useState } from 'react'
import type { QuizAnswers } from '@/lib/quiz/schema'

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

    const fetchQuestion = async () => {
      try {
        const res = await fetch('/api/repregunta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            motivation: answers.motivation ?? '',
            interest: answers.interest ?? '',
            career: answers.career ?? '',
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
  }, [answers.motivation, answers.interest, answers.career])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-sm text-muted-foreground animate-pulse">
          Sara IA está leyendo tu respuesta…
        </div>
      </div>
    )
  }

  const displayQuestion = question ?? FALLBACK_QUESTION

  return (
    <div className="space-y-3">
      <p className="text-base font-medium text-[#0a0d10]">{displayQuestion}</p>
      <textarea
        value={currentValue}
        onChange={(e) => {
          setCurrentValue(e.target.value)
          onAnswer(e.target.value, displayQuestion)
        }}
        placeholder="Cuéntanos con detalle..."
        rows={5}
        className="w-full rounded-xl border-2 border-[#d8dbe0] bg-white px-4 py-3 text-[#0a0d10] placeholder:text-[#b8bcc2] focus:border-[#FFA300] focus:outline-none transition-colors resize-none"
      />
    </div>
  )
}
