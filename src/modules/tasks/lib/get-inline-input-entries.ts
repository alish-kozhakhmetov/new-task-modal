import type { Task, Translation } from '@/types/api/task'

export interface InlineInputConfig {
  key: string
  before?: string
  after?: string
}

/**
 * A field label as the host translates it: the whole Translation, not its
 * `rus` field — a label written only in Kazakh (grade 3: «Ең кіші сан:») was
 * dropped, and a Kazakh pupil saw the Russian one (stream CX, 26.11).
 */
const labelText = (
  value: unknown,
  translate: (text: string | Translation) => string,
): string => {
  if (typeof value === 'string') return translate(value)
  if (value && typeof value === 'object') return translate(value as Translation)
  return ''
}

/** answerInput с input1, input2, … для inline-задач (text / answerCell / columnOperation). */
export const getInlineInputEntries = (
  task: Task,
  translate: (text: string | Translation) => string,
): InlineInputConfig[] => {
  const answerInput = task.answerInput as Record<string, unknown> | undefined
  if (!answerInput) return []

  return Object.entries(answerInput)
    .filter(([key]) => key.startsWith('input'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, raw]) => {
      const config = raw as { before?: unknown; after?: unknown }

      return {
        key,
        before: labelText(config.before, translate),
        after: labelText(config.after, translate),
      }
    })
}

export const hasInlineAnswerInput = (task: Task): boolean => {
  const answerInput = task.answerInput as Record<string, unknown> | undefined
  return (
    Boolean(answerInput?.inline) ||
    getInlineInputEntries(task, () => '').length > 0
  )
}
