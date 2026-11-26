import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import { stripEmptyMathIslands } from '@/modules/tasks/ui/templates/text/lib/strip-empty-math-islands'
import type { Translation } from '@/types/api/task'

import { normalizeAnswerCellDescription } from './normalize-answer-cell-description'
import { splitLeadingSeparators } from './split-leading-separators'
import type { AnswerCellTaskDescription } from './types.task'

const TOKEN = 'answercell'

/**
 * How many cells the content draws, the way AnswerCellRow splits it: the
 * backend's answer has that many parts, not as many as answerInput lists.
 * Task_1_1_10_16 declares input1…input4 and writes «4 = answercell +
 * answercell», answer «2;;2»: a group of four slots left two of them empty,
 * the check button never woke up (stream CX, 26.11, local backend).
 */
export const countContentCells = (
  description: unknown,
  translate: (value: Translation | string) => string,
): number => {
  const desc = normalizeAnswerCellDescription(
    (description ?? {}) as Record<string, unknown>,
  ) as unknown as AnswerCellTaskDescription
  const raw = desc.content
  const content =
    typeof raw === 'string' ? raw : isTranslation(raw) ? translate(raw) : ''
  const { parts } = splitLeadingSeparators(
    stripEmptyMathIslands(content).split(TOKEN),
  )
  return Math.max(0, parts.length - 1)
}
