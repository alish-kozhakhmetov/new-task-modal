import type { Task } from '@/types/api/task'

import {
  TASK_DESCRIPTIONS_WITHOUT_CALC,
  TaskDescriptionType,
} from '../constants'

/*
 * Types that need the on-screen calc only when a new template draws them.
 * The same task through the old screen (legacy-task-root) brings its own
 * host input, so the list in constants stays as is for that path.
 */
const CALC_ONLY_IN_NEW_TEMPLATE: string[] = [
  TaskDescriptionType.CalculateByImageWithCell,
]

export const isWithoutCalc = (
  task: Task,
  availableTasks: Record<string, boolean> | null,
): boolean => {
  const type = task.description.type as string
  const key = task.type.replace('Elixir.Task_', '')
  if (CALC_ONLY_IN_NEW_TEMPLATE.includes(type) && availableTasks?.[key]) {
    return false
  }
  return (TASK_DESCRIPTIONS_WITHOUT_CALC as string[]).includes(type)
}
