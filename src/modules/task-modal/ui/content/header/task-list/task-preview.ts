import { applyTaskFields } from '@/modules/tasks/lib/apply-task-fields'
import type { Task, Translation } from '@/types/api/task'

import { hasCondition } from './task-status'

type Translate = (value: Translation | string) => string

/** The text field of a condition, by its type (as getDescriptionTranslation). */
const conditionText = (description: Record<string, unknown>): unknown => {
  switch (description.type) {
    case 'test':
      return description.question
    case 'answerCell':
      return description.textBefore ?? description.text_before
    case 'comparison':
      return description.text_before
    default:
      return description.content
  }
}

const asText = (value: unknown, translate: Translate): string => {
  if (value == null || value === '') return ''
  if (typeof value === 'number') return String(value)
  if (typeof value !== 'string' && typeof value !== 'object') return ''
  return translate(value as Translation | string)
}

/** Unclosed `\(` left by the cut: drop from it, or MathJax shows raw TeX. */
const closeInlineMath = (text: string) => {
  const open = text.lastIndexOf('\\(')
  return open > text.lastIndexOf('\\)') ? text.slice(0, open) : text
}

/**
 * One line of a row in the task list: the task's title and the prose of its
 * condition, with numbers from `fields`. Display blocks — column arithmetic,
 * arrays, tables — are cut off: the row names the task, the task shows
 * itself. Inline math stays for MathText. Empty for a task without a
 * condition (solved on an earlier visit).
 */
export const taskPreview = (task: Task, translate: Translate): string => {
  if (!hasCondition(task)) return ''

  const title = asText(task.title, translate)
  const body = asText(
    conditionText(task.description as unknown as Record<string, unknown>),
    translate,
  )
  const text = applyTaskFields(
    [title, body].filter((part) => part.trim()).join(' '),
    task.fields,
  )

  const prose = closeInlineMath(text.split(/\\begin\{|\\\[|\$\$/)[0])

  return prose
    .replace(/<[^>]*>/g, ' ')
    .replace(/answercell/gi, '…')
    .replace(/⁠/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
