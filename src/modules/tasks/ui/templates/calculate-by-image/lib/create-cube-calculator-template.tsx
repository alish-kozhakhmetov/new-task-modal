import clsx from 'clsx'
import { useState } from 'react'

import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { inputWidthHint } from '@/modules/tasks/lib/input-width-hint'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { TableTask } from '@/modules/tasks/ui/templates/table/lib/types.task'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import { MathText } from '@/ui/math-text/math-text'

import styles from '../shared/calculate-by-image.module.scss'

import type { SelectableItem } from './types.task'

/** Backend payload for `cubeCalculator` — as far as the template reads it. */
export interface CubeCalculatorTask {
  id: string
  type: string
  title: Translation | string | null
  description: {
    type: 'cubeCalculator'
    textBefore?: Translation | string | null
    textAfter?: Translation | string | null
    /** Filled cubes at start («Есть 7 кубиков»). */
    cubes1?: SelectableItem[]
    /** Empty places left in the frame. */
    cubes2?: SelectableItem[]
    /** Picture of an empty place. */
    constCube?: SelectableItem | null
    /** The cube the pupil adds. */
    selectableItems?: SelectableItem[]
    /** The equation row with `answercell`s — same shape as a table task. */
    table?: TableTask['description']['table']
    [key: string]: unknown
  }
  fields?: Record<string, unknown>
  answerInput?: unknown
  answer?: string | null
  solution?: unknown
}

const toText = (
  value: unknown,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null) return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

/**
 * «Есть 7 кубиков. Добавьте к ним 8» / «Дано 15. Уберите 8»: a frame of
 * twenty places in two rows of ten — the point is the step over ten. A tap
 * on the cube under the frame fills the next empty place, a tap on a filled
 * place empties it. The cubes are a counting aid; the answer is the two
 * fields of the equation (`7 + 8 = 10 + ▢ = ▢`).
 *
 * The equation is one line, not `table.inline`: that template puts the lead
 * «7 + 8 = 10 +» on a line of its own and keeps 120px fields, so the row
 * broke in two (rule 24). Fields are sized to the expected answer from
 * `fields` (rule 16, `inputWidthHint`) — the whole row fits 343px.
 */
export const createCubeCalculatorTemplate = ({ id }: { id: string }) => {
  const Template = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<CubeCalculatorTask>) => {
    const { description } = task
    const filledAtStart = description.cubes1?.length ?? 0
    const places = filledAtStart + (description.cubes2?.length ?? 0)
    const [filled, setFilled] = useState<boolean[]>(() =>
      Array.from({ length: places }, (_, i) => i < filledAtStart),
    )

    const translate = (value: Translation | string) =>
      deps.global.translateTasks(value)

    if (isActiveSolution(task.solution as never)) {
      return (
        <div className={styles.root} data-template-id={id}>
          <TaskTitle title={task.title} deps={deps} />
          <SharedSolutionBody solution={task.solution as never} deps={deps} />
        </div>
      )
    }

    const filledHtml = toText(
      description.cubes1?.[0]?.image ?? description.selectableItems?.[0]?.image,
      translate,
    )
    const emptyHtml = toText(
      description.constCube?.image ?? description.cubes2?.[0]?.image,
      translate,
    )
    const addHtml = toText(description.selectableItems?.[0]?.image, translate)
    const nextEmpty = filled.indexOf(false)
    const textBefore = toText(description.textBefore, translate)
    const textAfter = toText(description.textAfter, translate)

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { bindRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })
    const values = splitMultiAnswer(answer, separator)
    const widthPx = inputWidthHint(task, 18)
    const cells = description.table?.rows?.[0]?.cells ?? []
    let fieldIndex = 0

    return (
      <div className={styles.root} data-template-id={id}>
        <div className={styles.condition}>
          <TaskTitle title={task.title} deps={deps} />
          {textBefore ? (
            <MathText className={styles.text}>{textBefore}</MathText>
          ) : null}
        </div>

        <div className={styles.answer}>
          <div
            className={styles.cubeFrame}
            role="group"
            data-testid="cube-frame"
          >
            {filled.map((isFilled, index) => (
              <button
                key={index}
                type="button"
                className={clsx(
                  styles.cubePlace,
                  isFilled && index >= filledAtStart && styles.cubeAdded,
                )}
                aria-label={isFilled ? 'Убрать кубик' : 'Пустое место'}
                aria-pressed={isFilled}
                data-added={(isFilled && index >= filledAtStart) || undefined}
                disabled={!isFilled}
                data-testid={isFilled ? 'cube-filled' : 'cube-empty'}
                onClick={() =>
                  setFilled(filled.map((f, i) => (i === index ? false : f)))
                }
              >
                <span
                  className={styles.itemImage}
                  aria-hidden
                  dangerouslySetInnerHTML={{
                    __html: isFilled ? filledHtml : emptyHtml,
                  }}
                />
              </button>
            ))}
          </div>
          {addHtml ? (
            <div className={styles.pool}>
              <button
                type="button"
                className={styles.poolItem}
                aria-label="Добавить кубик"
                disabled={nextEmpty < 0}
                data-testid="cube-add"
                onClick={() =>
                  setFilled(filled.map((f, i) => (i === nextEmpty ? true : f)))
                }
              >
                <span
                  className={styles.itemImage}
                  aria-hidden
                  dangerouslySetInnerHTML={{ __html: addHtml }}
                />
              </button>
            </div>
          ) : null}
          {textAfter ? (
            <MathText className={styles.text}>{textAfter}</MathText>
          ) : null}
          {cells.length > 0 ? (
            <div className={styles.equation} data-testid="cube-equation">
              {cells.map((cell, index) => {
                if (cell === 'answercell') {
                  const slot = fieldIndex++
                  return (
                    <MathInput
                      key={index}
                      id={`cube-input-${slot}`}
                      ref={bindRef(`cube-input-${slot}`)}
                      formula={values[slot] ?? ''}
                      onMathFieldChanged={handleChange}
                      className={styles.equationInput}
                      style={
                        widthPx
                          ? { flex: 'none', width: `${widthPx}px` }
                          : undefined
                      }
                    />
                  )
                }
                const text = toText(cell, translate)
                return text ? (
                  <MathText key={index} inline className={styles.equationText}>
                    {text}
                  </MathText>
                ) : null
              })}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  Template.displayName = id

  return Template
}
