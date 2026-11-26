import { useState } from 'react'

import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { Button, ButtonColor } from '@/ui/button/button'

import styles from '../shared/coordinate-plane.module.scss'
import { InteractivePlane } from '../shared/interactive-plane'

import { planeModeOf } from './drawing-figure'
import { fromAnswerString, toAnswerString, type Pt } from './plane-answer'
import type { CoordinatePlaneTask } from './types.task'

interface Config {
  /** templateId, e.g. `coordinatePlane.draw`. */
  id: string
}

/** Words of the window that the host dictionary does not carry yet. */
const CLEAR = { rus: 'Стереть', kaz: 'Өшіру', eng: 'Clear' }

/**
 * A task answered on the coordinate plane: the condition's text, the plane,
 * and «Clear». The answer is what the pupil put on the plane — one point,
 * several points or a figure by two points (lib/drawing-figure.ts); there is
 * no text field and no calculator (TASK_DESCRIPTIONS_WITHOUT_CALC).
 */
export const createCoordinatePlaneTemplate = ({ id }: Config) => {
  const CoordinatePlaneTemplate = ({
    task,
    deps,
    answer,
    onChange,
  }: TaskComponentProps<CoordinatePlaneTask>) => {
    const figure = task.description.figure
    const mode = planeModeOf(figure)
    // Half a figure (one click of two) is not an answer: it stays here, and
    // the store's answer stays empty — «Check» is off until the figure is.
    const [pending, setPending] = useState<Pt[] | null>(null)
    const draft = answer
      ? fromAnswerString(answer, mode)
      : { points: pending ?? [] }
    const text = deps.global.translateTasks(task.description.content)
    const solved = isActiveSolution(task.solution)
    const clearLabel = deps.global.translateTasks(CLEAR)

    return (
      <div className={styles.root} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <TaskTitle title={task.description.content} deps={deps} />
        <div className={styles.planeWrap}>
          <InteractivePlane
            figure={figure}
            mode={mode}
            draft={draft}
            deps={deps}
            readOnly={solved}
            label={text}
            onDraftChange={(next) => {
              const value = toAnswerString(mode, next)
              setPending(value ? null : next.points)
              onChange(value)
            }}
          />
        </div>
        {!solved && mode.kind !== 'unsupported' ? (
          <div className={styles.tools}>
            <Button
              color={ButtonColor.Gray}
              disabled={!draft.points.length}
              onClick={() => {
                setPending(null)
                onChange('')
              }}
              data-testid="coordinate-plane-clear"
            >
              {clearLabel}
            </Button>
          </div>
        ) : null}
        {solved ? (
          <SolutionExplanation solution={task.solution} deps={deps} />
        ) : null}
      </div>
    )
  }

  CoordinatePlaneTemplate.displayName = id
  return CoordinatePlaneTemplate
}
