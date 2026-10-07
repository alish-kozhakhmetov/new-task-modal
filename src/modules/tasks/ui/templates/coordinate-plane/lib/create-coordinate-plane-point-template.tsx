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
  DRAW_SEGMENT,
  encodeNodes,
  planeOptions,
  toggleNode,
  toggleSegmentNode,
} from './plane-answer'
import type { CoordinatePlaneTask } from './types.task'

/**
 * «Отметьте точку»: the pupil taps the plane, the tap snaps to a grid node,
 * the answer is «(x;y)» — several points joined by the separator when
 * `drawingFigure` is 15. With 30 the two taps are the ends of a segment,
 * drawn between them. No keyboard: coordinatePlane is in the no-calc list.
 * The store keeps the string; `toWireAnswer` turns points and segments into
 * the objects the backend reads (issue #23).
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
    const segment = figure.drawingFigure === DRAW_SEGMENT
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
          segment={segment}
          translate={translate}
          label={text || 'Координатная плоскость'}
          onPick={(node) =>
            onChange(
              encodeNodes(
                segment
                  ? toggleSegmentNode(selected, node)
                  : toggleNode(selected, node, multiple),
                separator,
              ),
            )
          }
        />
      </div>
    )
  }

  Template.displayName = id

  return Template
}
