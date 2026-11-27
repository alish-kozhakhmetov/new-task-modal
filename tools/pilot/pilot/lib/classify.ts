/**
 * A task payload → the package's classifier id (before any fallback), by
 * `description.type`. The same classifiers the chapter maps of grade 4 were
 * built with (scripts/generate-grade4-full-maps-from-snapshot.ts).
 */
import { classifyAnswerCellTemplate } from '../../../../src/modules/tasks/ui/templates/answer-cell/lib/classify-answer-cell-template'
import { classifyColumnOperationTemplate } from '../../../../src/modules/tasks/ui/templates/column-operation/lib/classify-column-operation-template'
import { classifyComparisonTemplate } from '../../../../src/modules/tasks/ui/templates/comparison/lib/classify-comparison-template'
import { classifyComplexTemplate } from '../../../../src/modules/tasks/ui/templates/complex/lib/classify-complex-template'
import { classifyEquationTemplate } from '../../../../src/modules/tasks/ui/templates/equation/shared/lib/classify-equation-template'
import { classifyFormulaTemplate } from '../../../../src/modules/tasks/ui/templates/formula/lib/classify-formula-template'
import { classifyTableTemplate } from '../../../../src/modules/tasks/ui/templates/table/lib/classify-table-template'
import { classifyTestTemplate } from '../../../../src/modules/tasks/ui/templates/test/lib/classify-test-template'
import { classifyTextTemplate } from '../../../../src/modules/tasks/ui/templates/text/lib/classify-text-template'

export type AnyTask = {
  type?: string
  description?: Record<string, unknown> & { type?: string }
  answerInput?: unknown
  fields?: Record<string, unknown>
  title?: unknown
}

export const FAMILIES = [
  'text',
  'test',
  'answerCell',
  'table',
  'comparison',
  'formula',
  'complex',
  'columnOperation',
  'equation',
] as const

export const classify = (task: AnyTask): string | null => {
  const t = task.description?.type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const x = task as any
  switch (t) {
    case 'text':
      return classifyTextTemplate(x)
    case 'test':
      return classifyTestTemplate(x)
    case 'answerCell':
      return classifyAnswerCellTemplate(x)
    case 'table':
      return classifyTableTemplate(x)
    case 'comparison':
      return classifyComparisonTemplate(x)
    case 'formula':
      return classifyFormulaTemplate(x)
    case 'complex':
      return classifyComplexTemplate(x)
    case 'columnOperation':
      return classifyColumnOperationTemplate(x)
    case 'equation':
      return classifyEquationTemplate(x)
    default:
      return null
  }
}

/** `Elixir.Task_5_3_2_4` → { grade: 5, chapter: 3, id: '2_4' } */
export const parseType = (type: string | undefined) => {
  const m = /^Elixir\.Task_(\d+)_(\d+)_(\d+(?:_\d+)*)$/.exec(type ?? '')
  if (!m) return null
  return { grade: Number(m[1]), chapter: Number(m[2]), id: m[3] }
}
