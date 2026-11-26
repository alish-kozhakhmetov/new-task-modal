import type { Translation } from '@/types/api/task'

export interface EquationInputEntry {
  /** `input1`, `input2`, … — also the field id, so answers keep their slot. */
  key: string
  before: string
  after: string
}

const inputNumber = (key: string) => Number(/(\d+)$/.exec(key)?.[1] ?? NaN)

/**
 * `answerInput.input1..N` of an `equation.multi.*` task, in field order.
 *
 * Not `getInlineInputEntries`: that one hands `before.rus` to the translator,
 * so a label in words («Стандартный вид одночлена:», `Task_7_2_1_1`) would
 * stay Russian in every language. Here the whole Translation goes to
 * `translateTasks`. Sorted by number, not by string: `input10` after `input9`.
 */
export const getEquationInputEntries = (
  answerInput: unknown,
  translate: (value: Translation | string) => string,
): EquationInputEntry[] => {
  if (answerInput == null || typeof answerInput !== 'object') return []

  const label = (value: unknown) =>
    typeof value === 'string' ||
    (typeof value === 'object' && value !== null && 'module_name' in value)
      ? translate(value as Translation | string)
      : ''

  return Object.entries(answerInput as Record<string, unknown>)
    .filter(([key]) => /^input\d+$/.test(key))
    .sort(([a], [b]) => inputNumber(a) - inputNumber(b))
    .map(([key, raw]) => {
      const config = (raw ?? {}) as { before?: unknown; after?: unknown }
      return { key, before: label(config.before), after: label(config.after) }
    })
}
