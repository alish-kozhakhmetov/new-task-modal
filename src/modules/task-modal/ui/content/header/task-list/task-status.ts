/**
 * Where a task of the lesson stands, from the backend `result` field.
 *
 * Draft for the task list (Alisher, 05.10): the lesson order is strict —
 * only solved tasks and the current one open; tasks ahead stay locked.
 */
export type TaskStatus = 'correct' | 'error' | 'shown' | 'current' | 'ahead'

export const taskStatus = (
  result: string | undefined,
  isCurrent: boolean,
): TaskStatus => {
  if (isCurrent) return 'current'
  switch (result) {
    case 'correct':
    case 'answered':
      return 'correct'
    case 'error':
      return 'error'
    case 'solution_shown':
    case 'video_explanation_shown':
      return 'shown'
    default:
      return 'ahead'
  }
}

/** Solved tasks and the current one open; the rest wait their turn. */
export const isOpenable = (status: TaskStatus) => status !== 'ahead'

export const STATUS_LABEL: Record<TaskStatus, string> = {
  correct: 'Решена верно',
  error: 'Решена с ошибкой',
  shown: 'Ответ показан',
  current: 'Сейчас решаешь',
  ahead: 'Впереди',
}
