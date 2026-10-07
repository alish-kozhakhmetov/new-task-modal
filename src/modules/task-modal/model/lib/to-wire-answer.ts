import { toCalculateByImageApiAnswer } from '@/modules/tasks/ui/templates/calculate-by-image/lib/parse-calculate-by-image'
import type { CalculateByImageDescription } from '@/modules/tasks/ui/templates/calculate-by-image/lib/types.task'
import { toPlaneWireAnswer } from '@/modules/tasks/ui/templates/coordinate-plane/lib/plane-answer'

interface Args {
  description:
    | { type?: unknown; figure?: { drawingFigure?: number } }
    | null
    | undefined
  answer: unknown
  /** `TaskDescriptionType.CalculateByImage` from host enums. */
  calculateByImageType: string
  /** `TaskDescriptionType.CoordinatePlane` from host enums. */
  coordinatePlaneType?: string
}

/**
 * Last step before `api.checkAnswer`: the only type whose answer is not a
 * string. calculateByImage goes out as `{ list: [{ image: '', id }] }` — the backend
 * rejects every string form (qalan-assets, trainer-rebuild-context.md, «Ответ
 * не всегда строка»). The template keeps catalog indexes in the store; ids
 * are resolved here from the task description. Every other type passes
 * through untouched.
 */
export const toWireAnswer = ({
  description,
  answer,
  calculateByImageType,
  coordinatePlaneType,
}: Args): unknown => {
  if (typeof answer !== 'string') return answer
  // Points and segments go out as objects (issue #23); one point stays «(x;y)».
  if (coordinatePlaneType && description?.type === coordinatePlaneType)
    return toPlaneWireAnswer(answer, description.figure?.drawingFigure)
  if (description?.type !== calculateByImageType) return answer
  return (
    toCalculateByImageApiAnswer(
      answer,
      description as CalculateByImageDescription,
    ) ?? answer
  )
}
