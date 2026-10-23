import { useStore } from '../store/task-modal-store'
import type { TaskModalProps } from '../types/props'

/**
 * Hand the host the task the window has moved to (2.5.5).
 *
 * The site keeps the active task in the address, `?lessonId=…&taskIndex=…`
 * (TaskModalController.updateHistoryWithTaskIndex, flag `urlNavigation`), and
 * testers send links to tasks by it. The window moved from task to task in
 * its own store only: the host never learnt of it, and the address stayed on
 * the task the window had opened on.
 *
 * The host gets the task together with the window's list: the index is
 * counted in the list with the extra tasks after mistakes, and the site finds
 * it by the object (`tasks.indexOf(activeTask)`) — so the task handed is the
 * list's own object. The lock version and the progress go along, so the
 * host's state agrees with the window's. The host re-renders on this; the
 * controller keeps the open window as it is (controller.tsx).
 */
export const handActiveTaskToHost = (
  props: Pick<TaskModalProps, 'setState'>,
) => {
  const state = useStore.getState().state
  const tasks = state?.tasks
  const id = state?.activeTask?.id
  if (!state || !tasks || id == null) return

  const activeTask = tasks.find((task) => task.id === id)
  if (!activeTask) return

  props.setState({
    activeTask,
    tasks,
    lockVersion: state.lockVersion,
    userProgress: state.userProgress,
  })
}
