import clsx from 'clsx'

import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { inputWidthHint } from '@/modules/tasks/lib/input-width-hint'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { MultiTextSolution } from '../shared/multi-text-solution'
import { TextAdornment } from '../shared/text-adornment'
import { TextTaskDescription } from '../shared/text-task-description'
import styles from '../shared/text-template.module.scss'

import { maybeNormalizeBareMath } from './normalize-bare-math'
import type { TextTask } from './types.task'

interface MultiTextTemplateConfig {
  /** templateId, e.g. `text.multi.stack.n2.beforeAfter`. */
  id: string
  /** `stack` — each input on its own row; `inline` — all inputs in one row. */
  layout: 'stack' | 'inline'
  /** Documented input count (`input1..N`); rendering follows actual data. */
  inputCount: number
  withBefore?: boolean
  /**
   * Size each input to the volume of the expected answer instead of the fixed
   * 120px. On by default since 2.1.0; pass `false` for the fixed width the
   * original visual baselines were recorded with.
   */
  widthFromTask?: boolean
  withAfter?: boolean
  /**
   * Wrap bare `unit^n` in description/adornments for MathJax.
   * Default off — enable only for templates that need it.
   */
  normalizeBareMath?: boolean
}

/**
 * Multi-input text template: title + description + `input1..N`
 * MathInputs, each with optional before/after labels. The combined answer
 * is joined with the multiple-answer separator.
 */
/** A row name: letters and punctuation, no digits, signs or math. */
const isWordLabel = (label: string) =>
  /\p{L}{2,}/u.test(label) && !/[\d=+×·*<>\\]/.test(label)

export const createMultiTextTemplate = ({
  id,
  layout,
  withBefore = false,
  withAfter = false,
  widthFromTask = true,
  normalizeBareMath: shouldNormalize = false,
}: MultiTextTemplateConfig) => {
  const MultiTextTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<TextTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <MultiTextSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          layout={layout}
          normalizeBareMath={shouldNormalize}
        />
      )
    }

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { bindRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })

    const answerValues = splitMultiAnswer(answer, separator)
    const inputEntries = getInlineInputEntries(
      task as unknown as Task<'text'>,
      (value) => deps.global.translateTasks(value),
    )

    /* One width for the whole group: neighbouring fields of different widths

       read as different in importance, not as a hint about the answer. */

    const widthPx = widthFromTask ? inputWidthHint(task, 24) : null
    // Shared label column only for named rows («Альбом:», «Краски:»). When a
    // label is an expression («(46 + 76) × x =» over «x =») the column takes
    // the widest one and pushes the short row's field and unit off the screen.
    const labels = inputEntries.map(({ before }) => before).filter(Boolean)
    const labelled =
      layout !== 'inline' &&
      withBefore &&
      labels.length > 0 &&
      labels.every((l) => isWordLabel(String(l)))

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <TextTaskDescription
          task={task as unknown as Task<'text'>}
          deps={deps}
          normalizeBareMath={shouldNormalize}
        />

        <div
          data-testid="text-inputs"
          data-layout={layout}
          className={
            layout === 'inline'
              ? styles.inline
              : clsx(styles.stack, labelled && styles.stackGrid)
          }
        >
          {inputEntries.map(({ key, before, after }, index) => (
            <div key={key} className={styles.inputRow}>
              {withBefore && before ? (
                <TextAdornment
                  data-testid="text-prefix"
                  className={styles.fieldLabel}
                  value={maybeNormalizeBareMath(before, shouldNormalize)}
                />
              ) : (
                // keeps the label column in the grid for a row without one
                labelled && <span aria-hidden />
              )}
              <MathInput
                id={key}
                ref={bindRef(key)}
                formula={answerValues[index] ?? ''}
                onMathFieldChanged={handleChange}
                className={styles.input}
                style={
                  widthPx
                    ? { flex: 'none', minWidth: `min(${widthPx}px, 100%)` }
                    : undefined
                }
              />
              {withAfter && after ? (
                <TextAdornment
                  data-testid="text-suffix"
                  className={styles.suffix}
                  value={maybeNormalizeBareMath(after, shouldNormalize)}
                />
              ) : (
                labelled && <span aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  MultiTextTemplate.displayName = id

  return MultiTextTemplate
}
