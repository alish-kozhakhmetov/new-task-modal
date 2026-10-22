import type { Task } from '@/types/api/task'

/**
 * Where a task of the lesson stands, from the backend `result` field.
 *
 * The lesson order is strict (Alisher, 05.10): solved tasks open for review,
 * the current one opens (back to solving it), tasks ahead stay locked.
 */
export type TaskStatus = 'correct' | 'error' | 'shown' | 'current' | 'ahead'

export type SolvedStatus = Extract<TaskStatus, 'correct' | 'error' | 'shown'>

/** What the backend `result` says about a task, the current one aside. */
export const resultStatus = (
  result: string | undefined,
): SolvedStatus | null => {
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
      return null
  }
}

export const taskStatus = (
  result: string | undefined,
  isCurrent: boolean,
): TaskStatus => {
  if (isCurrent) return 'current'
  return resultStatus(result) ?? 'ahead'
}

export interface TaskListRow {
  task: Task
  /** 1-based number, as in «№N/M»: extra tasks take their place in it. */
  num: number
  status: TaskStatus
  /** Added after a mistake. */
  isPenalty: boolean
}

/**
 * The current task opens (back to it); a solved one opens for review if
 * there is something to show — a task solved on an earlier visit comes from
 * the backend without its condition, so its row only tells the status
 * (Alisher via the lead, 22.10: no dead-end screen). Tasks ahead wait.
 */
export const isOpenable = (row: TaskListRow) =>
  row.status === 'current' || (row.status !== 'ahead' && hasCondition(row.task))

export const taskListRows = (
  tasks: Task[],
  activeTaskId: string | undefined,
): TaskListRow[] =>
  tasks.map((task, index) => ({
    task,
    num: index + 1,
    status: taskStatus(task.result, task.id === activeTaskId),
    isPenalty: Boolean(task.isPenalty),
  }))

export interface TaskListSummary {
  correct: number
  errors: number
  shown: number
  solved: number
  total: number
}

/** By results, the current task included: one left on «Далее» is solved. */
export const taskListSummary = (tasks: Task[]): TaskListSummary => {
  const count = (status: SolvedStatus) =>
    tasks.filter((task) => resultStatus(task.result) === status).length
  const correct = count('correct')
  const errors = count('error')
  const shown = count('shown')
  return {
    correct,
    errors,
    shown,
    solved: correct + errors + shown,
    total: tasks.length,
  }
}

/**
 * The backend sends a task solved on an earlier visit empty — `description:
 * ""`, no `answerInput`, no `fields`, `solution: "-"` (backend-notes.md).
 * Only a task with a description object has a condition to show.
 */
export const hasCondition = (task: Task) =>
  typeof task.description === 'object' &&
  task.description !== null &&
  typeof (task.description as { type?: unknown }).type === 'string'
