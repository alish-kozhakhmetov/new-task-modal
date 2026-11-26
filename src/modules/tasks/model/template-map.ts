import type { ComponentType } from 'react'

import { withTaskLoading } from '@/modules/tasks/lib/with-task-loading'
import { TemplateTypes } from '@/modules/tasks/model/template-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import type { AnswerCellTask } from '@/modules/tasks/ui/templates/answer-cell/lib/types.task'
import type { CalculateByImageTask } from '@/modules/tasks/ui/templates/calculate-by-image/lib/types.task'
import type { ColumnOperationTask } from '@/modules/tasks/ui/templates/column-operation/lib/types.task'
import type { ComparisonTask } from '@/modules/tasks/ui/templates/comparison/lib/types.task'
import type { ComplexTask } from '@/modules/tasks/ui/templates/complex/lib/types.task'
import type { EquationTask } from '@/modules/tasks/ui/templates/equation/shared/lib/types.task'
import type { FormulaTask } from '@/modules/tasks/ui/templates/formula/lib/types.task'
import type { TableTask } from '@/modules/tasks/ui/templates/table/lib/types.task'
import type { TestTask } from '@/modules/tasks/ui/templates/test/lib/types.task'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import type { ValueOf } from '@/types/utils'

type TextTemplateComponent = ComponentType<TaskComponentProps<TextTask>>
type ColumnOperationTemplateComponent = ComponentType<
  TaskComponentProps<ColumnOperationTask>
>
type TableTemplateComponent = ComponentType<TaskComponentProps<TableTask>>
type FormulaTemplateComponent = ComponentType<TaskComponentProps<FormulaTask>>
type ComplexTemplateComponent = ComponentType<TaskComponentProps<ComplexTask>>
type AnswerCellTemplateComponent = ComponentType<
  TaskComponentProps<AnswerCellTask>
>
type ComparisonTemplateComponent = ComponentType<
  TaskComponentProps<ComparisonTask>
>
type TestTemplateComponent = ComponentType<TaskComponentProps<TestTask>>
type EquationTemplateComponent = ComponentType<TaskComponentProps<EquationTask>>
type CalculateByImageTemplateComponent = ComponentType<
  TaskComponentProps<CalculateByImageTask>
>

const wrapText = (
  importFn: () => Promise<{ default: TextTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapColumnOperation = (
  importFn: () => Promise<{ default: ColumnOperationTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapTable = (
  importFn: () => Promise<{ default: TableTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapFormula = (
  importFn: () => Promise<{ default: FormulaTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapComplex = (
  importFn: () => Promise<{ default: ComplexTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapAnswerCell = (
  importFn: () => Promise<{ default: AnswerCellTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapComparison = (
  importFn: () => Promise<{ default: ComparisonTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapTest = (
  importFn: () => Promise<{ default: TestTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapEquation = (
  importFn: () => Promise<{ default: EquationTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapCalculateByImage = (
  importFn: () => Promise<{ default: CalculateByImageTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

/**
 * Live template loaders.
 * Fill as templates appear under `ui/templates/`.
 */
export const TEMPLATE_MAP = {
  [TemplateTypes.Text.Plain]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/plain').then((module) => ({
        default: module.TextPlain,
      })),
    ),
  [TemplateTypes.Text.Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/before').then((module) => ({
        default: module.TextBefore,
      })),
    ),
  [TemplateTypes.Text.After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/after').then((module) => ({
        default: module.TextAfter,
      })),
    ),
  [TemplateTypes.Text.BeforeAfter]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/before-after').then(
        (module) => ({ default: module.TextBeforeAfter }),
      ),
    ),
  [TemplateTypes.Text.AiTranslation]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/ai-translation').then(
        (module) => ({ default: module.TextAiTranslation }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N2Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before').then(
        (module) => ({ default: module.TextMultiStackN2Before }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N2After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n2-after').then(
        (module) => ({ default: module.TextMultiStackN2After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N2BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before-after'
      ).then((module) => ({ default: module.TextMultiStackN2BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N3Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before').then(
        (module) => ({ default: module.TextMultiStackN3Before }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N3BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before-after'
      ).then((module) => ({ default: module.TextMultiStackN3BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N4After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n4-after').then(
        (module) => ({ default: module.TextMultiStackN4After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N5After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n5-after').then(
        (module) => ({ default: module.TextMultiStackN5After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Inline.N2After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/inline-n2-after').then(
        (module) => ({ default: module.TextMultiInlineN2After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Inline.N3BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/inline-n3-before-after'
      ).then((module) => ({ default: module.TextMultiInlineN3BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Inline.N5After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/inline-n5-after').then(
        (module) => ({ default: module.TextMultiInlineN5After }),
      ),
    ),
  [TemplateTypes.ColumnOperation.Plain]: () =>
    wrapColumnOperation(() =>
      import('@/modules/tasks/ui/templates/column-operation/ui/plain').then(
        (module) => ({ default: module.ColumnOperationPlain }),
      ),
    ),
  [TemplateTypes.ColumnOperation.Multi.Stack.N2Before]: () =>
    wrapColumnOperation(() =>
      import(
        '@/modules/tasks/ui/templates/column-operation/ui/multi/stack-n2-before'
      ).then((module) => ({
        default: module.ColumnOperationMultiStackN2Before,
      })),
    ),
  [TemplateTypes.Table.Plain]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/plain').then((module) => ({
        default: module.TablePlain,
      })),
    ),
  [TemplateTypes.Table.Grid]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/grid').then((module) => ({
        default: module.TableGrid,
      })),
    ),
  [TemplateTypes.Table.Inline]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/inline').then((module) => ({
        default: module.TableInline,
      })),
    ),
  [TemplateTypes.Table.List]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/list').then((module) => ({
        default: module.TableList,
      })),
    ),
  [TemplateTypes.Table.Mixed]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/mixed').then((module) => ({
        default: module.TableMixed,
      })),
    ),
  [TemplateTypes.Table.MultiRow]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/multi-row').then(
        (module) => ({
          default: module.TableMultiRow,
        }),
      ),
    ),
  [TemplateTypes.Table.MultiRowSvg]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/multi-row-svg').then(
        (module) => ({ default: module.TableMultiRowSvg }),
      ),
    ),

  [TemplateTypes.Formula.Plain]: () =>
    wrapFormula(() =>
      import('@/modules/tasks/ui/templates/formula/ui/plain').then(
        (module) => ({ default: module.FormulaPlain }),
      ),
    ),
  [TemplateTypes.Formula.After]: () =>
    wrapFormula(() =>
      import('@/modules/tasks/ui/templates/formula/ui/after').then(
        (module) => ({ default: module.FormulaAfter }),
      ),
    ),
  [TemplateTypes.Formula.Multi.Stack.N2Before]: () =>
    wrapFormula(() =>
      import(
        '@/modules/tasks/ui/templates/formula/ui/multi/stack-n2-before'
      ).then((module) => ({ default: module.FormulaMultiStackN2Before })),
    ),
  [TemplateTypes.Complex.Plain]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/plain').then(
        (module) => ({ default: module.ComplexPlain }),
      ),
    ),
  [TemplateTypes.Complex.PlainCenter]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/plain-center').then(
        (module) => ({ default: module.ComplexPlainCenter }),
      ),
    ),
  [TemplateTypes.Complex.After]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/after').then(
        (module) => ({ default: module.ComplexAfter }),
      ),
    ),
  [TemplateTypes.Complex.AfterEquation]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/after-equation').then(
        (module) => ({ default: module.ComplexAfterEquation }),
      ),
    ),
  [TemplateTypes.Complex.BeforeAfter]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/before-after').then(
        (module) => ({ default: module.ComplexBeforeAfter }),
      ),
    ),
  [TemplateTypes.Complex.Multi.Stack.N2After]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-after'
      ).then((module) => ({ default: module.ComplexMultiStackN2After })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N2BeforeAfter]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-before-after'
      ).then((module) => ({
        default: module.ComplexMultiStackN2BeforeAfter,
      })),
    ),
  [TemplateTypes.AnswerCell.Plain]: () =>
    wrapAnswerCell(() =>
      import('@/modules/tasks/ui/templates/answer-cell/ui/plain').then(
        (module) => ({ default: module.AnswerCellPlain }),
      ),
    ),
  [TemplateTypes.AnswerCell.PlainCenter]: () =>
    wrapAnswerCell(() =>
      import('@/modules/tasks/ui/templates/answer-cell/ui/plain-center').then(
        (module) => ({ default: module.AnswerCellPlainCenter }),
      ),
    ),
  [TemplateTypes.AnswerCell.After]: () =>
    wrapAnswerCell(() =>
      import('@/modules/tasks/ui/templates/answer-cell/ui/after').then(
        (module) => ({ default: module.AnswerCellAfter }),
      ),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N2Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n2-plain'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN2Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N2Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-plain'
      ).then((module) => ({ default: module.AnswerCellMultiStackN2Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N2Sequence]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-sequence'
      ).then((module) => ({
        default: module.AnswerCellMultiStackN2Sequence,
      })),
    ),
  [TemplateTypes.Comparison.Plain]: () =>
    wrapComparison(() =>
      import('@/modules/tasks/ui/templates/comparison/ui/plain').then(
        (module) => ({ default: module.ComparisonPlain }),
      ),
    ),
  [TemplateTypes.Test.Plain]: () =>
    wrapTest(() =>
      import('@/modules/tasks/ui/templates/test/ui/plain').then((module) => ({
        default: module.TestPlain,
      })),
    ),
  [TemplateTypes.Equation.Before]: () =>
    wrapEquation(() =>
      import('@/modules/tasks/ui/templates/equation/ui/before').then(
        (module) => ({ default: module.EquationBefore }),
      ),
    ),
  [TemplateTypes.Equation.Plain]: () =>
    wrapEquation(() =>
      import('@/modules/tasks/ui/templates/equation/ui/plain').then(
        (module) => ({ default: module.EquationPlain }),
      ),
    ),
  [TemplateTypes.Equation.After]: () =>
    wrapEquation(() =>
      import('@/modules/tasks/ui/templates/equation/ui/after').then(
        (module) => ({ default: module.EquationAfter }),
      ),
    ),
  [TemplateTypes.Equation.BeforeAfter]: () =>
    wrapEquation(() =>
      import('@/modules/tasks/ui/templates/equation/ui/before-after').then(
        (module) => ({ default: module.EquationBeforeAfter }),
      ),
    ),
  [TemplateTypes.Equation.Multi.Stack.N2Before]: () =>
    wrapEquation(() =>
      import(
        '@/modules/tasks/ui/templates/equation/ui/multi/stack-n2-before'
      ).then((module) => ({ default: module.EquationMultiStackN2Before })),
    ),
  [TemplateTypes.Equation.Multi.Stack.N2BeforeAfter]: () =>
    wrapEquation(() =>
      import(
        '@/modules/tasks/ui/templates/equation/ui/multi/stack-n2-before-after'
      ).then((module) => ({ default: module.EquationMultiStackN2BeforeAfter })),
    ),
  [TemplateTypes.Equation.Multi.Stack.N3Before]: () =>
    wrapEquation(() =>
      import(
        '@/modules/tasks/ui/templates/equation/ui/multi/stack-n3-before'
      ).then((module) => ({ default: module.EquationMultiStackN3Before })),
    ),
  [TemplateTypes.Equation.Multi.Stack.N4Before]: () =>
    wrapEquation(() =>
      import(
        '@/modules/tasks/ui/templates/equation/ui/multi/stack-n4-before'
      ).then((module) => ({ default: module.EquationMultiStackN4Before })),
    ),
  [TemplateTypes.Equation.Multi.Stack.N4BeforeAfter]: () =>
    wrapEquation(() =>
      import(
        '@/modules/tasks/ui/templates/equation/ui/multi/stack-n4-before-after'
      ).then((module) => ({ default: module.EquationMultiStackN4BeforeAfter })),
    ),
  [TemplateTypes.Equation.Multi.Inline.N2BeforeAfter]: () =>
    wrapEquation(() =>
      import(
        '@/modules/tasks/ui/templates/equation/ui/multi/inline-n2-before-after'
      ).then((module) => ({
        default: module.EquationMultiInlineN2BeforeAfter,
      })),
    ),
  // Stream CX (wave 1): complex / answerCell / text layouts missing at 2.5.8.
  [TemplateTypes.Complex.Before]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/before').then(
        (module) => ({ default: module.ComplexBefore }),
      ),
    ),
  [TemplateTypes.Complex.Multi.Stack.N2Before]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-before'
      ).then((module) => ({ default: module.ComplexMultiStackN2Before })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N3BeforeAfter]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n3-before-after'
      ).then((module) => ({ default: module.ComplexMultiStackN3BeforeAfter })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N3Before]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n3-before'
      ).then((module) => ({ default: module.ComplexMultiStackN3Before })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N4BeforeAfter]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n4-before-after'
      ).then((module) => ({ default: module.ComplexMultiStackN4BeforeAfter })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N3Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n3-plain'
      ).then((module) => ({ default: module.AnswerCellMultiStackN3Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N2After]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n2-after'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN2After })),
    ),
  [TemplateTypes.Text.Multi.Inline.N2BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/inline-n2-before-after'
      ).then((module) => ({ default: module.TextMultiInlineN2BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N5BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/stack-n5-before-after'
      ).then((module) => ({ default: module.TextMultiStackN5BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N2Plain]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n2-plain').then(
        (module) => ({ default: module.TextMultiStackN2Plain }),
      ),
    ),
  [TemplateTypes.Complex.Multi.Stack.N4Before]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n4-before'
      ).then((module) => ({ default: module.ComplexMultiStackN4Before })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N2Plain]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-plain'
      ).then((module) => ({ default: module.ComplexMultiStackN2Plain })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N3After]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n3-after'
      ).then((module) => ({ default: module.ComplexMultiInlineN3After })),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N3Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n3-plain'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN3Plain })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N2After]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n2-after'
      ).then((module) => ({ default: module.ComplexMultiInlineN2After })),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N5Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n5-plain'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN5Plain })),
    ),
  [TemplateTypes.Text.Multi.Stack.N4Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n4-before').then(
        (module) => ({ default: module.TextMultiStackN4Before }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N3After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n3-after').then(
        (module) => ({ default: module.TextMultiStackN3After }),
      ),
    ),
  [TemplateTypes.Complex.Multi.Inline.N2BeforeAfter]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n2-before-after'
      ).then((module) => ({ default: module.ComplexMultiInlineN2BeforeAfter })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N3Plain]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n3-plain'
      ).then((module) => ({ default: module.ComplexMultiStackN3Plain })),
    ),
  [TemplateTypes.Text.Multi.Stack.N4Plain]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n4-plain').then(
        (module) => ({ default: module.TextMultiStackN4Plain }),
      ),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N3After]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n3-after'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN3After })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N4Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n4-plain'
      ).then((module) => ({ default: module.AnswerCellMultiStackN4Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N2After]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-after'
      ).then((module) => ({ default: module.AnswerCellMultiStackN2After })),
    ),
  [TemplateTypes.Text.Multi.Inline.N3After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/inline-n3-after').then(
        (module) => ({ default: module.TextMultiInlineN3After }),
      ),
    ),
  [TemplateTypes.Complex.Multi.Stack.N5Before]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n5-before'
      ).then((module) => ({ default: module.ComplexMultiStackN5Before })),
    ),
  [TemplateTypes.Text.Multi.Stack.N3Plain]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n3-plain').then(
        (module) => ({ default: module.TextMultiStackN3Plain }),
      ),
    ),
  [TemplateTypes.Text.Multi.Inline.N2Before]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/inline-n2-before'
      ).then((module) => ({ default: module.TextMultiInlineN2Before })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N3BeforeAfter]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n3-before-after'
      ).then((module) => ({ default: module.ComplexMultiInlineN3BeforeAfter })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N2Plain]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n2-plain'
      ).then((module) => ({ default: module.ComplexMultiInlineN2Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N4Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n4-plain'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN4Plain })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N4After]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n4-after'
      ).then((module) => ({ default: module.ComplexMultiInlineN4After })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N5BeforeAfter]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n5-before-after'
      ).then((module) => ({ default: module.ComplexMultiStackN5BeforeAfter })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N2Before]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n2-before'
      ).then((module) => ({ default: module.ComplexMultiInlineN2Before })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N3BeforeAfter]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n3-before-after'
      ).then((module) => ({
        default: module.AnswerCellMultiStackN3BeforeAfter,
      })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N3After]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n3-after'
      ).then((module) => ({ default: module.ComplexMultiStackN3After })),
    ),
  [TemplateTypes.Text.Multi.Inline.N4After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/inline-n4-after').then(
        (module) => ({ default: module.TextMultiInlineN4After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Inline.N4BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/inline-n4-before-after'
      ).then((module) => ({ default: module.TextMultiInlineN4BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N4BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/stack-n4-before-after'
      ).then((module) => ({ default: module.TextMultiStackN4BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N5Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n5-before').then(
        (module) => ({ default: module.TextMultiStackN5Before }),
      ),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N3After]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n3-after'
      ).then((module) => ({ default: module.AnswerCellMultiStackN3After })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N4Plain]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n4-plain'
      ).then((module) => ({ default: module.ComplexMultiStackN4Plain })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N3Before]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n3-before'
      ).then((module) => ({ default: module.ComplexMultiInlineN3Before })),
    ),
  [TemplateTypes.Complex.Multi.Inline.N5Plain]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/inline-n5-plain'
      ).then((module) => ({ default: module.ComplexMultiInlineN5Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N4After]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n4-after'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN4After })),
    ),
  // Stream IMG (wave 2): calculateByImage.
  [TemplateTypes.CalculateByImage.Plain]: () =>
    wrapCalculateByImage(() =>
      import('@/modules/tasks/ui/templates/calculate-by-image/ui/plain').then(
        (module) => ({ default: module.CalculateByImagePlain }),
      ),
    ),
  [TemplateTypes.CalculateByImage.WithCell]: () =>
    wrapCalculateByImage(() =>
      import(
        '@/modules/tasks/ui/templates/calculate-by-image/ui/with-cell'
      ).then((module) => ({ default: module.CalculateByImageWithCell })),
    ),
} satisfies Record<string, unknown>

export type TemplateType = Awaited<
  ReturnType<ValueOf<typeof TEMPLATE_MAP>>
>['default']
