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
 * string. calculateByImage goes out as `{ list: [{ image: '', id }] }`, the
 * same item shape the old screen sends (`TaskModalActions.js`: description
 * items first, then the pupil's, `image` blanked). The backend reads only
 * `id` (`CalculateByImageTaskAnswer.correct?/2`). The template keeps catalog
 * indexes in the store; ids are resolved here from the task description.
 * Every other type passes through untouched.
 *
 * Other non-string answers (coordinate plane, issue #23) belong to their own
 * stream and are added next to this branch, not inside it.
 */
export const toWireAnswer = ({
  description,
  answer,
  calculateByImageType,
}: Args): unknown => {
  if (typeof answer !== 'string') return answer
  if (description?.type !== calculateByImageType) return answer
  return (
    toCalculateByImageApiAnswer(
      answer,
      description as CalculateByImageDescription,
    ) ?? answer
  )
}
