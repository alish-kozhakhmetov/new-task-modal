import type { LessonFixture } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-fixture'
import stackN2Tasks from '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-plain/data/all-tasks.json'
import complexAfterTasks from '@/modules/tasks/ui/templates/complex/ui/after/data/all-tasks.json'
import complexBeforeAfterTasks from '@/modules/tasks/ui/templates/complex/ui/before-after/data/all-tasks.json'
import complexStackN2BeforeAfterTasks from '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-before-after/data/all-tasks.json'
import textPlainTasks from '@/modules/tasks/ui/templates/text/ui/plain/data/all-tasks.json'
import type { Task } from '@/types/api/task'

interface FixtureFile {
  byGrade?: Record<string, { id: string; task: unknown }[]>
}

const FILES = [
  stackN2Tasks,
  complexAfterTasks,
  complexBeforeAfterTasks,
  complexStackN2BeforeAfterTasks,
  textPlainTasks,
] as unknown[]

/**
 * A task of the package fixtures by its generator id. Lesson 2340 of grade 4
 * gives 5_6_8 — the fixtures keep it under the grade of the lesson.
 */
export const liveFixture = (id: string): Task => {
  for (const file of FILES) {
    const grades = Object.values((file as FixtureFile).byGrade ?? {})
    const hit = grades.flat().find((t) => t.id === id)
    if (hit) return { ...(structuredClone(hit.task) as Task), solution: null }
  }
  throw new Error(`No fixture for ${id}`)
}

/** A lesson of the given tasks, the first one current, none solved yet. */
export const lessonOf = (...ids: string[]): LessonFixture => {
  // own ids: the check's mock counts wrong attempts by id
  const tasks = ids.map((id) => ({ ...liveFixture(id), id: `live-${id}` }))
  return { tasks, activeTask: tasks[0], initialTasksCount: tasks.length }
}
