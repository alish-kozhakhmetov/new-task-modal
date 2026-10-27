import { hasTaskTemplate } from '@/modules/tasks/model/component/get-task-component'
import type { Task } from '@/types/api/task'

import type { TaskModalProps } from '../types/props'

/**
 * The window can't draw the task: the package has no template for it and the
 * host gave no old screen to mount inside (`renderLegacyTask`). The task area
 * stayed empty and the check waited for an answer no field could give
 * (2.5.8, lesson 2205 «Тенге»: Task_4_6_6_8…15, «calculateByImage»).
 */
export const isTaskUnavailable = (
  task: Task | null | undefined,
  props: Pick<TaskModalProps, 'renderLegacyTask'>,
) =>
  Boolean(task) && !props.renderLegacyTask && hasTaskTemplate(task!) === false

/**
 * The host's old window shows every task (`?old=true` in the address,
 * TaskModalController.shouldUseNewModal); it clears the flag on close.
 */
export const canOpenInOldWindow = (props: Pick<TaskModalProps, 'hostProps'>) =>
  typeof props.hostProps?.history?.replace === 'function' &&
  typeof props.hostProps.location?.search === 'string'

export const openInOldWindow = (props: Pick<TaskModalProps, 'hostProps'>) => {
  const { history, location } = props.hostProps
  const query = new URLSearchParams(location.search)
  query.set('old', 'true')
  history.replace({ search: query.toString() })
}
