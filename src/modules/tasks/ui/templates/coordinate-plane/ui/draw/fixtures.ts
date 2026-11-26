import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import { checkPlaneAnswer } from '../../lib/check-plane-answer'
import { toWireAnswer } from '../../lib/plane-answer'
import type { CoordinatePlaneTask } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'

/**
 * A real task of the backend with its answer: `_backend` names the generator,
 * the seed it ran with and answer/1 — what the stories check against.
 * Built by scripts/coordinate-plane/build-fixtures.ts from the compiled
 * backend (matheducator master 21.10).
 */
export type PlaneFixture = CoordinatePlaneTask & {
  _backend: { id: string; seed: number; answer: unknown; answerType: string }
}

export const ALL_PLANE_TASKS = allTasksJson as unknown as PlaneFixture[]

export const planeTask = (generator: string): PlaneFixture => {
  const task = ALL_PLANE_TASKS.find((t) => t._backend.id === generator)
  if (!task) throw new Error(`no fixture for ${generator}`)
  return task
}

/** The Storybook verdict: the backend checker's port on the wire answer. */
export const isCorrectFor = (task: PlaneFixture) => (answer: unknown) =>
  checkPlaneAnswer(
    task._backend.answer,
    toWireAnswer(typeof answer === 'string' ? answer : ''),
  )

/** The trainer shell is typed for text tasks; the plane task rides in it. */
export const asTrainerTask = (task: PlaneFixture) => task as unknown as TextTask

/** Grade of a generator id: Task_8_3_6_1 → 8, GeoTask_9_1_10 → 9. */
export const gradeOf = (generator: string) =>
  Number(/Task_(\d+)_/.exec(generator)?.[1] ?? NaN)
