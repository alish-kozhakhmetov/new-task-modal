import { pupilText, TASK_TEXT } from '@/lib/helpers/pupil-text'
import {
  canOpenInOldWindow,
  openInOldWindow,
} from '@/modules/task-modal/model/lib/task-unavailable'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { Button, ButtonColor } from '@/ui/button/button'

import s from './task-unavailable.module.scss'

interface Props {
  props: TaskModalProps
}

/**
 * A task without a template in the package: a plain word and a way on,
 * instead of an empty area and a check that never unlocks. The old window
 * draws every task — the pupil solves it there.
 */
export const TaskUnavailable = ({ props }: Props) => {
  const { global } = props.deps
  const canOpenOld = canOpenInOldWindow(props)

  return (
    <div className={s.root} role="status" data-testid="task-unavailable">
      <p className={s.text}>{pupilText(global, TASK_TEXT.taskUnavailable)}</p>
      <div className={s.actions}>
        {canOpenOld && (
          <Button onClick={() => openInOldWindow(props)}>
            {pupilText(global, TASK_TEXT.openInOldWindow)}
          </Button>
        )}
        <Button
          color={canOpenOld ? ButtonColor.Gray : ButtonColor.Blue}
          onClick={props.closeModal}
        >
          {pupilText(global, TASK_TEXT.close)}
        </Button>
      </div>
    </div>
  )
}
