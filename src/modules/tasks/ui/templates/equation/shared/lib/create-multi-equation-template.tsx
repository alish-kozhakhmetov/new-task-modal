import clsx from 'clsx'

import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { MathInput } from '@/ui/math-input/math-input'

import { TextAdornment } from '../../../text/shared/text-adornment'
import styles from '../../../text/shared/text-template.module.scss'
import { EquationContent } from '../equation-content'
import { EquationMultiSolution } from '../equation-multi-solution'
import gridStyles from '../equation-multi.module.scss'

import { getEquationInputEntries } from './equation-input-entries'
import type { EquationTask } from './types.task'

export interface MultiEquationTemplateConfig {
  /** templateId, e.g. `equation.multi.stack.n2.beforeAfter`. */
  id: string
  /** `stack` — a field per row; `inline` — all fields in one row. */
  layout: 'stack' | 'inline'
  /** Documented field count (`input1..N`); rendering follows the data. */
  inputCount: number
  withBefore?: boolean
  withAfter?: boolean
}

/**
 * Equation with several answer fields: title + equation (`description.content`)
 * + `input1..N`, each with its own before/after (`x_1 =` ▢ `, k∈Z`).
 *
 * `stack` puts every row on one grid (`equation-multi.module.scss`): fields
 * under each other and one width (rules 16, 20), a long label wraps by words.
 * `inline` is the text family's row: pairs «field + sign» wrap whole. Sign and
 * field are 8 apart either way. The answer is the fields joined with the
 * backend's separator in `input` order — the order `MultipleTaskAnswer`
 * checks them in.
 */
export const createMultiEquationTemplate = ({
  id,
  layout,
  inputCount,
  withBefore = false,
  withAfter = false,
}: MultiEquationTemplateConfig) => {
  const MultiEquationTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<EquationTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <EquationMultiSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          layout={layout}
          withBefore={withBefore}
          withAfter={withAfter}
        />
      )
    }

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const entries = getEquationInputEntries(task.answerInput, (value) =>
      deps.global.translateTasks(value),
    )
    const { bindRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
      // Every slot on the wire even while one is empty: `a;;` keeps `a` first.
      inputCount: entries.length || inputCount,
    })
    const answerValues = splitMultiAnswer(answer, separator)
    const grid = layout === 'stack'

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <EquationContent description={task.description} deps={deps} />

        <div
          data-testid="equation-inputs"
          data-layout={layout}
          className={grid ? gridStyles.stackGrid : styles.inline}
        >
          {entries.map(({ key, before, after }, index) => (
            <div
              key={key}
              className={clsx(styles.inputRow, grid && gridStyles.row)}
            >
              {withBefore && before ? (
                <TextAdornment
                  data-testid="equation-before"
                  className={clsx(styles.fieldLabel, grid && gridStyles.label)}
                  value={before}
                />
              ) : (
                // keeps the label column for a row without one
                grid && <span aria-hidden />
              )}
              <MathInput
                id={key}
                ref={bindRef(key)}
                formula={answerValues[index] ?? ''}
                onMathFieldChanged={handleChange}
                className={clsx(styles.input, grid && gridStyles.field)}
              />
              {withAfter && after ? (
                <TextAdornment
                  data-testid="equation-after"
                  className={styles.suffix}
                  value={after}
                />
              ) : (
                grid && <span aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  MultiEquationTemplate.displayName = id

  return MultiEquationTemplate
}
