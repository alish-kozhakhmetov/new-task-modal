import type { TaskSolutionValue } from '@/modules/tasks/lib/solution-types'
import type { Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'equation'` tasks.
 *
 * Grade 4: `content` is the equation (Translation); answer is `x = …`
 * via `answerInput.before` + MathInput.
 */

export interface EquationTaskDescription {
  type: 'equation'
  content: Translation | string
  with_audio?: boolean
}

export interface SimpleEquationAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

/**
 * `equation.multi.*` (grades 6–11): `input1..N`, each a `TaskAnswerInput`
 * with its own before/after (`x_1 =` … `, k∈Z`); `inline` puts them in one
 * row — `x ∈ ▢ ∪ ▢`, `(▢ ; ▢)`. Shape from `variants.json` (02.08):
 * `Task_10_4_1_10`, `Task_10_4_13_6`, `Task_7_2_1_1`.
 */
export interface MultiEquationAnswerInput {
  type: number
  inline?: boolean
  [input: `input${number}`]: SimpleEquationAnswerInput
}

export type EquationAnswerInput =
  | SimpleEquationAnswerInput
  | MultiEquationAnswerInput

export interface EquationTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_3_6_1`. */
  type: string
  title: Translation | string | null
  description: EquationTaskDescription
  fields?: Record<string, unknown>
  answerInput?: EquationAnswerInput
  difficulty?: string | null
  result?: string
  position?: number
  attemptsCount?: number | null
  hasVideoUrl?: boolean
  videoId?: string | null
  videoUrl?: string | null
  videoUrlAsTranslation?: unknown
  locatedCountry?: string | null
  /** Always null for grade-4 fixtures: no Elixir `def hint/2` content. */
  hint1?: string | null
  hint2?: string | null
  isPenalty?: boolean
  isPrimary?: boolean
  answer?: string | null
  /** What `isActiveSolution` and the solution views take. */
  solution?: TaskSolutionValue
}
