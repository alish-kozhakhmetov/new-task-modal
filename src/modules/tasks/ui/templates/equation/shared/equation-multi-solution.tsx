import { getCorrectMultiAnswerParts } from '@/modules/tasks/lib/get-correct-multi-answer-parts'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { TextAdornment } from '../../text/shared/text-adornment'
import styles from '../../text/shared/text-template.module.scss'

import { EquationContent } from './equation-content'
import { getEquationInputEntries } from './lib/equation-input-entries'
import type { EquationTask } from './lib/types.task'

type Props = TaskSolutionComponentProps<EquationTask> & {
  layout: 'stack' | 'inline'
  withBefore?: boolean
  withAfter?: boolean
}

/** Solution view of `equation.multi.*`: the same rows, answers in the fields. */
export const EquationMultiSolution = ({
  task,
  deps,
  answer,
  solution,
  layout,
  withBefore = false,
  withAfter = false,
}: Props) => {
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)

  const correctValues = getCorrectMultiAnswerParts(
    solution,
    separator,
    translate,
  )
  const userValues = splitMultiAnswer(answer, separator)
  const entries = getEquationInputEntries(task.answerInput, translate)

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <EquationContent description={task.description} deps={deps} />

      <SolutionAnswerPanel
        userAnswer={userValues.join(' ; ')}
        correctAnswer={joinMathAnswers(correctValues)}
        deps={deps}
      />

      <div
        data-testid="equation-inputs"
        data-layout={layout}
        className={layout === 'inline' ? styles.inline : styles.stack}
      >
        {entries.map(({ key, before, after }, index) => (
          <div key={key} className={`${styles.inputRow} ${styles.solutionRow}`}>
            {withBefore && before ? (
              <TextAdornment
                data-testid="equation-before"
                className={styles.fieldLabel}
                value={before}
              />
            ) : null}
            <MathFormula className={styles.answerFormula}>
              {correctValues[index] ?? ''}
            </MathFormula>
            {withAfter && after ? (
              <TextAdornment
                data-testid="equation-after"
                className={styles.suffix}
                value={after}
              />
            ) : null}
          </div>
        ))}
      </div>

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
