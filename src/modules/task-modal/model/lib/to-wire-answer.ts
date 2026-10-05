import { toCalculateByImageApiAnswer } from '@/modules/tasks/ui/templates/calculate-by-image/lib/parse-calculate-by-image'
import type { CalculateByImageDescription } from '@/modules/tasks/ui/templates/calculate-by-image/lib/types.task'

interface Args {
  description: { type?: unknown } | null | undefined
  answer: unknown
  /** `TaskDescriptionType.CalculateByImage` from host enums. */
  calculateByImageType: string
}

/**
 * Last step before `api.checkAnswer`: the only type whose answer is not a
 * string. calculateByImage goes out as `{ list: [{ id }] }` — the backend
 * rejects every string form (qalan-assets, trainer-rebuild-context.md, «Ответ
 * не всегда строка»). The template keeps catalog indexes in the store; ids
 * are resolved here from the task description. Every other type passes
 * through untouched.
 */
export const toWireAnswer = ({
  description,
  answer,
  calculateByImageType,
}: Args): unknown => {
  if (description?.type !== calculateByImageType) return answer
  if (typeof answer !== 'string') return answer
  return (
    toCalculateByImageApiAnswer(
      answer,
      description as CalculateByImageDescription,
    ) ?? answer
  )
}
