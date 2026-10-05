import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { PlanePoint } from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import styles from '../shared/coordinate-plane.module.scss'
import { PointBoard } from '../shared/point-board'

import {
  decodeNodes,
  DRAW_POINTS,
  encodeNodes,
  planeOptions,
  toggleNode,
} from './plane-answer'
import type { CoordinatePlaneTask } from './types.task'

/**
 * «Отметьте точку»: the pupil taps the plane, the tap snaps to a grid node,
 * the answer is «(x;y)» — several points joined by the separator when
 * `drawingFigure` is 15. No keyboard: coordinatePlane is in the no-calc list.
 */
export const createCoordinatePlanePointTemplate = ({ id }: { id: string }) => {
  const Template = ({
    task,
    deps,
    answer,
    onChange,
  }: TaskComponentProps<CoordinatePlaneTask>) => {
    const translate = (value: unknown) =>
      deps.global.translateTasks(value as Translation | string)
    const figure = task.description.figure ?? {}
    const options = planeOptions(figure)
    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const multiple = figure.drawingFigure === DRAW_POINTS
    const content = task.description.content
    const text = isTranslation(content)
      ? translate(content)
      : typeof content === 'string'
        ? content
        : ''
    const figures = Array.isArray(figure.figures) ? figure.figures : []
    const points = (Array.isArray(figure.points) ? figure.points : []).filter(
      (p): p is PlanePoint =>
        typeof p?.x === 'number' && typeof p?.y === 'number',
    )

    if (isActiveSolution(task.solution)) {
      return (
        <div className={styles.root} data-template-id={id}>
          <TaskTitle title={task.title} deps={deps} />
          {text ? <MathText className={styles.text}>{text}</MathText> : null}
          <SharedSolutionBody solution={task.solution} deps={deps} />
        </div>
      )
    }

    const selected = decodeNodes(answer, separator)

    return (
      <div className={styles.root} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        {text ? <MathText className={styles.text}>{text}</MathText> : null}
        <PointBoard
          options={options}
          figures={figures}
          points={points}
          selected={selected}
          translate={translate}
          label={text || 'Координатная плоскость'}
          onPick={(node) =>
            onChange(
              encodeNodes(toggleNode(selected, node, multiple), separator),
            )
          }
        />
      </div>
    )
  }

  Template.displayName = id

  return Template
}
