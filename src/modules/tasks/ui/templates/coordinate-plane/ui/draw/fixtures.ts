import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import { checkPlaneAnswer } from '../../lib/check-plane-answer'
import { toWireAnswer } from '../../lib/plane-answer'
import type { CoordinatePlaneTask } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import seedTasksJson from './data/seed-tasks.json'

/**
 * A real task of the backend with its answer: `_backend` names the generator,
 * the seed it ran with and answer/1 — what the stories check against.
 * Built by scripts/coordinate-plane/build-fixtures.ts from the compiled
 * backend: grades 5–11 — origin/master as production runs it (build
 * master-2611, 27.11; the corpus of 26.11 came from the test branch and
 * differed in 92 generators), grades 1–4 — G3's build (no master build of
 * primary school yet).
 */
export type PlaneFixture = CoordinatePlaneTask & {
  _backend: { id: string; seed: number; answer: unknown; answerType: string }
}

/** Seed 1 of every task, with its solution: what the stories show. */
export const ALL_PLANE_TASKS = allTasksJson as unknown as PlaneFixture[]

/** Seeds 1–3 of every task, without the solution: what the test solves. */
export const SEED_PLANE_TASKS = seedTasksJson as unknown as PlaneFixture[]

/** Key of a task of the corpus and of its verdicts: generator and seed. */
export const keyOf = (r: { id: string; seed: number }) => `${r.id}#${r.seed}`

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
