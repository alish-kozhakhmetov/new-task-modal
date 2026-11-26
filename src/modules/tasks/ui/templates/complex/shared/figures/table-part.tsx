import clsx from 'clsx'
import { useLayoutEffect, useRef } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { TableStaticCellContent } from '@/modules/tasks/ui/templates/table/lib/render-table-cell-content'
import tableStyles from '@/modules/tasks/ui/templates/table/shared/table.module.scss'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import type { MathInputRef } from '@/ui/math-input/types'
import { MathText } from '@/ui/math-text/math-text'

import type { ComplexTablePart } from '../../lib/types.task'
import complexStyles from '../complex.module.scss'

/**
 * A cell's span as the old window reads it (TaskTable.jsx): the row's list,
 * else the row's own `colspan` on the cell `colspan_at` (the first when 0 or
 * absent). 5_6_3_5 «При нахождении числа по проценту…» is one cell over the
 * row of six below it (`colspan: 6`, the list empty); without the span it
 * took the first column and pushed the fields 64 px past a 390 px phone.
 */
const spanOf = (
  list: number[] | undefined,
  span: number | undefined,
  at: number | undefined,
  cellIndex: number,
): number => {
  if (list?.length) return list[cellIndex] || 1
  return (at ? cellIndex === at : cellIndex === 0) ? Number(span) || 1 : 1
}

/**
 * A table of the condition wider than its room. Its cells keep one line
 * (`white-space: nowrap`, table.module.scss) and stand at 1% width: a question
 * of 60–90 letters, a header «Животные без рогов», made the table 470–1100 px
 * wide on a 390 px phone and its answercell sat past the edge — the pupil
 * did not see the field (5_6_2_20 «Если общая длина дороги… [ ] км»,
 * 5_6_3_4, 5_8_7_15, 2_13_1_1; stream CX, 27.11). Such a table lets its text
 * cells wrap by words and share the width; a table that fits keeps
 * the layout it had. Measured with the cells on one line, again whenever the
 * room changes width or the table grows (MathJax typesets after mount).
 */
const useWrapTextWhenTooWide = (part: ComplexTablePart) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const table = wrapper?.querySelector('table')
    if (!wrapper || !table) return
    let room = -1
    const fit = (force: boolean) => {
      if (!force && room === wrapper.clientWidth) {
        // the room is the same: only a table that grew may need wrapping
        if (table.offsetWidth > wrapper.clientWidth + 1)
          table.dataset.wrapText = ''
        return
      }
      room = wrapper.clientWidth
      delete table.dataset.wrapText
      if (table.offsetWidth > room + 1) table.dataset.wrapText = ''
    }
    fit(true)
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => fit(false))
    observer.observe(wrapper)
    observer.observe(table)
    return () => observer.disconnect()
  }, [part])
  return wrapperRef
}

export interface ComplexTableAnswerBindings {
  answer: string
  separator: string
  bindRef: (id: string) => (ref: MathInputRef | null) => void
  handleChange: () => void
  /** Shared counter across all table parts in one description. */
  nextInputIndex: () => number
}

interface Props {
  part: ComplexTablePart
  deps: TaskModalDependencies
  /** When set, `answercell` cells become MathInputs (legacy TaskTable parity). */
  answerBindings?: ComplexTableAnswerBindings | null
  /** Solution mode: fill answercells with correct values (table-solution parity). */
  solutionAnswers?: string[] | null
  /** Shared counter across table parts in one description (solution mode). */
  nextSolutionIndex?: () => number
}

export const TablePart = ({
  part,
  deps,
  answerBindings,
  solutionAnswers,
  nextSolutionIndex,
}: Props) => {
  const rows = part.rows ?? []
  const answerValues = answerBindings
    ? splitMultiAnswer(answerBindings.answer, answerBindings.separator)
    : []
  // A borderless one-row table is a phrase, as in table.plain: sized by its
  // parts, the backend width ignored (.equationStretch).
  const phrase =
    Boolean(part.removeBorders) && !part.removePadding && rows.length === 1
  const tableWidth = phrase ? undefined : part.width || '100%'
  const wrapperRef = useWrapTextWhenTooWide(part)

  return (
    <div
      ref={wrapperRef}
      className={tableStyles.tableWrapper}
      data-figure-type="120"
      data-testid="complex-table-part"
    >
      <table
        className={clsx(
          tableStyles.table,
          part.removeBorders && tableStyles.tableRemoveBorders,
          part.removePadding && tableStyles.tableRemovePadding,
          phrase && tableStyles.equationStretch,
          complexStyles.tablePart,
        )}
        style={{ width: tableWidth }}
        data-testid="task-table"
      >
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {(row.cells ?? []).map((cell, cellIndex) => {
                const isInput = cell === 'answercell'
                const content =
                  typeof cell === 'string'
                    ? cell
                    : deps.global.translateTasks(cell as Translation)

                const currentInputIndex =
                  isInput && answerBindings
                    ? answerBindings.nextInputIndex()
                    : -1
                const inputId = `complex-table-input-${currentInputIndex}`

                const solutionIndex =
                  isInput && solutionAnswers && nextSolutionIndex
                    ? nextSolutionIndex()
                    : -1
                const solutionValue =
                  solutionIndex >= 0
                    ? (solutionAnswers?.[solutionIndex] ?? '')
                    : ''

                return (
                  <td
                    key={cellIndex}
                    className={clsx(
                      tableStyles.cell,
                      isInput && tableStyles.inputCell,
                      isInput && complexStyles.tableInputCell,
                    )}
                    colSpan={spanOf(
                      row.colspan_list,
                      row.colspan,
                      row.colspan_at,
                      cellIndex,
                    )}
                    rowSpan={spanOf(
                      row.rowspan_list,
                      row.rowspan,
                      row.rowspan_at,
                      cellIndex,
                    )}
                  >
                    {isInput && answerBindings && currentInputIndex >= 0 ? (
                      <MathInput
                        id={inputId}
                        ref={answerBindings.bindRef(inputId)}
                        formula={answerValues[currentInputIndex] ?? ''}
                        onMathFieldChanged={answerBindings.handleChange}
                        className={tableStyles.input}
                      />
                    ) : isInput && solutionAnswers ? (
                      <MathText className={tableStyles.input}>
                        {solutionValue}
                      </MathText>
                    ) : isInput ? (
                      <span data-testid="complex-table-answercell-empty" />
                    ) : (
                      <TableStaticCellContent content={content} />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** True when any complex part is a table that contains `answercell`. */
export const complexDescriptionHasTableAnswerCells = (
  parts:
    | Array<{ type?: number; rows?: Array<{ cells?: unknown[] }> }>
    | undefined,
): boolean => {
  if (!parts?.length) return false
  return parts.some((part) => {
    if (Number(part.type) !== 120) return false
    return (part.rows ?? []).some((row) =>
      (row.cells ?? []).some((cell) => cell === 'answercell'),
    )
  })
}
