import { parseMultiValue } from '@/ui/checkbox/checkbox-group'

interface MultipleAnswersFlag {
  hasMultipleAnswers?: unknown
  has_multiple_answers?: unknown
}

interface TaskWithFlag extends MultipleAnswersFlag {
  description?: unknown
}

/**
 * A test with several correct options. The backend sends the flag inside the
 * task's description — `description.hasMultipleAnswers` (UserTaskDto, the
 * generator's `has_multiple_answers`) — and the old window of the site reads
 * it there: `description.hasMultipleAnswers || description.has_multiple_answers`
 * (reactjs_client, TaskDescriptionAndAnswerInput.jsx). The task's top level is
 * only a fallback: lesson data from the backend do not carry the flag there,
 * so reading only it drew radios for every such test (grade 5, 27.11: 46
 * generators could not be answered).
 */
export const hasMultipleAnswers = (
  task: TaskWithFlag | null | undefined,
): boolean => {
  if (!task) return false
  const description = task.description
  if (typeof description === 'object' && description !== null) {
    const flag = description as MultipleAnswersFlag
    if (flag.hasMultipleAnswers === true || flag.has_multiple_answers === true)
      return true
  }
  return task.hasMultipleAnswers === true
}

const isTestDescription = (description: unknown): boolean =>
  typeof description === 'object' &&
  description !== null &&
  (description as { type?: unknown }).type === 'test'

/**
 * The pupil's picks for the backend's `TaskChecker`. With several correct
 * options it accepts only a list of letters — `["A", "D", "E"]`, and
 * `["D"]` when one option is correct — and rejects the same letters as one
 * string (`"A,D,E"`, `"A;;D;;E"`, `"D"`), as the old window sends them
 * (an array). Checked on the checker of origin/master for 46 generators of
 * grade 5 (27.11). The letters keep the order of the options, as the
 * checkbox group writes them; the store keeps its `;;` string.
 */
export const toCheckerTestAnswer = <T>(
  task: TaskWithFlag | null | undefined,
  answer: T,
): T | string[] => {
  if (typeof answer !== 'string') return answer
  if (
    !task ||
    !isTestDescription(task.description) ||
    !hasMultipleAnswers(task)
  )
    return answer
  return parseMultiValue(answer)
}
