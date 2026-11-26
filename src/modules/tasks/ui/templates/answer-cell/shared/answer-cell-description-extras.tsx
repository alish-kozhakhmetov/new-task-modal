import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { ComplexTablePart } from '@/modules/tasks/ui/templates/complex/lib/types.task'
import { TablePart } from '@/modules/tasks/ui/templates/complex/shared/figures/table-part'
import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import { normalizeAnswerCellDescription } from '../lib/normalize-answer-cell-description'
import type { AnswerCellTaskDescription } from '../lib/types.task'

import styles from './answer-cell.module.scss'

interface Props {
  description: AnswerCellTaskDescription
  deps: TaskModalDependencies
}

const translateOptional = (
  value: Translation | string | null | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null || value === '') return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

/**
 * `tableBefore`: a table 120 drawn above the cells — in the answerCell tasks
 * of grades 0–2 it is the picture the condition talks about («Запишите
 * выражение, соответствующее рисунку», Task_1_1_10_16; 10 generators of
 * stream CX, none in grade 4). Without it the task cannot be solved.
 */
const tableOf = (value: unknown): ComplexTablePart | null =>
  value &&
  typeof value === 'object' &&
  Number((value as { type?: unknown }).type) === 120 &&
  Array.isArray((value as { rows?: unknown }).rows)
    ? (value as ComplexTablePart)
    : null

/**
 * Optional textBefore / tableBefore / imageBefore / textAfter above the
 * answer-cell row, in the old window's order (TaskDescriptionAndAnswerInput,
 * AnswerCell).
 */
export const AnswerCellDescriptionExtras = ({ description, deps }: Props) => {
  const desc = normalizeAnswerCellDescription(
    description as unknown as Record<string, unknown>,
  ) as AnswerCellTaskDescription

  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const textBefore = translateOptional(desc.textBefore, translate)
  const textAfter = translateOptional(desc.textAfter, translate)
  const tableBefore = tableOf(desc.tableBefore)
  const imageBefore =
    typeof desc.imageBefore === 'string' && desc.imageBefore.trim()
      ? desc.imageBefore
      : ''

  return (
    <>
      {textBefore ? (
        <MathText className={styles.textBefore}>{textBefore}</MathText>
      ) : null}
      {tableBefore ? <TablePart part={tableBefore} deps={deps} /> : null}
      {imageBefore ? (
        <div
          className={styles.imageBefore}
          dangerouslySetInnerHTML={{ __html: imageBefore }}
        />
      ) : null}
      {textAfter ? (
        <MathText className={styles.textAfter}>{textAfter}</MathText>
      ) : null}
    </>
  )
}
