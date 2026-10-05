import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskDescription } from '@/modules/tasks/ui/common/task-description/ui/task-description'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { TableSolution } from '../shared/table-solution'
import styles from '../shared/table.module.scss'

import {
  getCellClassName,
  getInputClassName,
  getTableClassName,
} from './get-table-classnames'
import { TableStaticCellContent } from './render-table-cell-content'
import type { TableTask } from './types.task'
import { useAlignedWrap } from './use-aligned-wrap'
import { useHiddenRight } from './use-hidden-right'

/** Flex rows that wrap on a phone; a field stays glued to the cell after it. */
const GLUED_ROW_IDS = new Set(['table.inline', 'table.mixed'])

interface TableTemplateConfig {
  /** templateId, e.g. `table.plain`. */
  id: string
}

/** Table grid with dynamic `answercell` MathInputs. */
export const createTableTemplate = ({ id }: TableTemplateConfig) => {
  const TableTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<TableTask>) => {
    // Called before the early returns below: hook order must not depend on
    // whether the task is in solution mode or has a table.
    const { ref: wrapperRef, hiddenRight } = useHiddenRight<HTMLDivElement>()
    const tableRef = useAlignedWrap<HTMLTableElement>(GLUED_ROW_IDS.has(id))

    if (isActiveSolution(task.solution)) {
      return (
        <TableSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          templateId={id}
        />
      )
    }

    const table = task.description.table
    if (!table) {
      return (
        <div
          className={styles.container}
          data-template-id={id}
          data-mode="input"
        >
          <TaskTitle title={task.title} deps={deps} />
          <TaskDescription
            task={task as unknown as Task<'table'>}
            deps={deps}
          />
        </div>
      )
    }

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { bindRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })

    const answerValues = splitMultiAnswer(answer, separator)
    let inputIndex = 0

    return (
      <div className={styles.container} data-template-id={id} data-mode="input">
        <TaskTitle title={task.title} deps={deps} />
        <TaskDescription task={task as unknown as Task<'table'>} deps={deps} />

        <div
          className={styles.tableFrame}
          data-hidden-right={hiddenRight || undefined}
        >
          <div ref={wrapperRef} className={styles.tableWrapper}>
            <table
              ref={tableRef}
              className={getTableClassName({
                id,
                mode: 'input',
                removeBorders: table.removeBorders,
                removePadding: table.removePadding,
              })}
              style={{
                width:
                  id === 'table.list' ||
                  id === 'table.mixed' ||
                  id === 'table.inline'
                    ? '100%'
                    : table.width,
              }}
              data-testid="task-table"
            >
              <tbody>
                {table.rows.map((row, rowIndex) => {
                  const isHeaderRow =
                    id === 'table.grid'
                      ? rowIndex < table.rows.length - 1
                      : id === 'table.multiRow' || id === 'table.multiRowSvg'
                        ? rowIndex === 0
                        : false

                  const cellClass = (
                    cellIndex: number,
                    isInput: boolean,
                    content?: string,
                  ) =>
                    getCellClassName({
                      content,
                      id,
                      mode: 'input',
                      isInput,
                      isFirstCell: cellIndex === 0,
                      isLastCell: cellIndex === row.cells.length - 1,
                      isHeaderRow,
                      isLastRow: rowIndex === table.rows.length - 1,
                    })

                  const renderInput = () => {
                    const currentInputIndex = inputIndex++
                    return (
                      <MathInput
                        id={`table-input-${currentInputIndex}`}
                        ref={bindRef(`table-input-${currentInputIndex}`)}
                        formula={answerValues[currentInputIndex] ?? ''}
                        onMathFieldChanged={handleChange}
                        className={getInputClassName({ id, mode: 'input' })}
                      />
                    )
                  }

                  const contentOf = (cell: (typeof row.cells)[number]) =>
                    typeof cell === 'string'
                      ? cell
                      : deps.global.translateTasks(cell)

                  const cells: React.ReactNode[] = []
                  const glued = GLUED_ROW_IDS.has(id)
                  const firstInput = row.cells.indexOf('answercell')

                  /*
                   * The lead of an answer row — «796441 =», «9020 г =» — is one
                   * unit. When the row switches to columns it takes a line of
                   * its own (see useAlignedWrap).
                   */
                  let startIndex = 0
                  if (glued && firstInput > 0) {
                    cells.push(
                      <td key="lead" className={styles.cellLead}>
                        {row.cells.slice(0, firstInput).map((cell, i) => (
                          <span key={i} className={cellClass(i, false)}>
                            <TableStaticCellContent content={contentOf(cell)} />
                          </span>
                        ))}
                      </td>,
                    )
                    startIndex = firstInput
                  }

                  for (
                    let cellIndex = startIndex;
                    cellIndex < row.cells.length;
                    cellIndex++
                  ) {
                    const cell = row.cells[cellIndex]
                    const isInput = cell === 'answercell'
                    const next = row.cells[cellIndex + 1]

                    /*
                     * In the flex rows (inline, mixed) a field and the cell right
                     * after it wrap as one unit: «▢ кг», «▢ шар :», «▢ +». Rows
                     * wrap on a phone, and without this the unit of a field
                     * landed alone on the next line — «9020 г = ▢ кг ▢» / «г».
                     */
                    if (
                      isInput &&
                      GLUED_ROW_IDS.has(id) &&
                      next !== undefined &&
                      next !== 'answercell'
                    ) {
                      cells.push(
                        <td
                          key={cellIndex}
                          className={styles.cellGlued}
                          data-group="glued"
                        >
                          <span className={cellClass(cellIndex, true)}>
                            {renderInput()}
                          </span>
                          <span className={cellClass(cellIndex + 1, false)}>
                            <TableStaticCellContent content={contentOf(next)} />
                          </span>
                        </td>,
                      )
                      cellIndex++
                      continue
                    }

                    cells.push(
                      <td
                        key={cellIndex}
                        className={cellClass(
                          cellIndex,
                          isInput,
                          isInput ? undefined : contentOf(cell),
                        )}
                        colSpan={row.colspan_list?.[cellIndex] || 1}
                        rowSpan={row.rowspan_list?.[cellIndex] || 1}
                        data-group={glued && isInput ? '' : undefined}
                      >
                        {isInput ? (
                          renderInput()
                        ) : (
                          <TableStaticCellContent content={contentOf(cell)} />
                        )}
                      </td>,
                    )
                  }

                  return <tr key={rowIndex}>{cells}</tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  TableTemplate.displayName = id

  return TableTemplate
}
