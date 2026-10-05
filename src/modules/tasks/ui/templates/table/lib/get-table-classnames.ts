import clsx from 'clsx'

import styles from '../shared/table.module.scss'

export type TableMode = 'input' | 'solution'

const ROUNDED_IDS = new Set([
  'table.grid',
  'table.multiRow',
  'table.multiRowSvg',
])
const LABEL_COLUMN_IDS = ROUNDED_IDS
const INPUT_WIDTH_AUTO_IDS = new Set([
  'table.mixed',
  'table.list',
  'table.plain',
])
const FLEX_SIZED_IDS = new Set(['table.inline', 'table.list', 'table.mixed'])

export function getTableClassName(params: {
  id: string
  mode: TableMode
  removeBorders?: boolean
  removePadding?: boolean
}): string {
  const { id, mode, removeBorders, removePadding } = params

  return clsx(
    styles.table,
    removeBorders && styles.tableRemoveBorders,
    removePadding && styles.tableRemovePadding,
    id === 'table.plain' &&
      removeBorders &&
      !removePadding &&
      styles.equationStretch,
    ROUNDED_IDS.has(id) && styles.tableRounded,
    id === 'table.inline' && mode === 'input' && styles.tableFlexInlineInput,
    id === 'table.mixed' &&
      mode === 'solution' &&
      styles.tableFlexMixedSolution,
    id === 'table.mixed' && mode === 'input' && styles.tableFlexMixedInput,
    id === 'table.list' && mode === 'input' && styles.tableFlexListInput,
    id === 'table.list' && mode === 'solution' && styles.tableFlexListSolution,
  )
}

// Strip latex wrappers and commands so «\\(12\\,500\\)» reads as a number.
const plainOf = (content?: string) =>
  (content ?? '')
    .replace(/\\[,;:! ]/g, '')
    .replace(/\\[()[\]]|\\[a-zA-Z]+|[{}$]/g, ' ')
    .trim()

/** A row label made of words («Масса», «Первое слагаемое»), not a number. */
const isWordLabel = (content?: string) => /\p{L}{2,}/u.test(plainOf(content))

/** Digits with grouping, sign and unit marks only: «12 500», «−3», «0,5». */
const isNumberCell = (content?: string) => {
  const t = plainOf(content)
  return t !== '' && /^[−+-]?[\d\s.,]+(?:\s*[₸%])?$/u.test(t)
}

export function getCellClassName(params: {
  id: string
  mode: TableMode
  isInput: boolean
  isFirstCell: boolean
  isLastCell: boolean
  isHeaderRow: boolean
  isLastRow: boolean
  /** Visible text of the cell; drives label weight and number alignment. */
  content?: string
}): string {
  const {
    id,
    mode,
    isInput,
    isFirstCell,
    isLastCell,
    isHeaderRow,
    isLastRow,
    content,
  } = params

  return clsx(
    styles.cell,
    isInput && styles.inputCell,
    isInput && !FLEX_SIZED_IDS.has(id) && styles.inputCellDefaultWidth,
    isHeaderRow && styles.cellHeader,
    ROUNDED_IDS.has(id) && isLastRow && styles.cellNoBottomBorder,
    // Row labels are bold only when they are words (rule 58): a first column
    // of numbers is data, not an axis.
    // The corner cell belongs to the header, never bold.
    LABEL_COLUMN_IDS.has(id) &&
      isFirstCell &&
      !isInput &&
      !isHeaderRow &&
      (content === undefined || isWordLabel(content)) &&
      styles.cellFirstColLabel,
    // Numbers align right so places line up down a column (rule 59). Only in
    // the bordered data tables; the flex rows (inline/list/mixed) are
    // sentences, not columns.
    ROUNDED_IDS.has(id) &&
      id !== 'table.grid' &&
      !isHeaderRow &&
      !isInput &&
      isNumberCell(content) &&
      styles.cellNum,
    id === 'table.inline' && mode === 'solution' && styles.cellInlineSolution,
    id === 'table.inline' && mode === 'input' && styles.cellInlineInput,
    id === 'table.inline' &&
      mode === 'input' &&
      isInput &&
      styles.inputCellInlineInput,
    id === 'table.mixed' && mode === 'solution' && styles.cellMixedSolution,
    id === 'table.mixed' && mode === 'input' && styles.cellMixedInput,
    id === 'table.list' &&
      mode === 'input' &&
      isLastCell &&
      styles.cellListLastInput,
    id === 'table.list' &&
      mode === 'solution' &&
      isLastCell &&
      styles.cellListLastSolution,
    id === 'table.list' &&
      mode === 'input' &&
      isInput &&
      styles.inputCellListInput,
    id === 'table.list' &&
      mode === 'solution' &&
      isInput &&
      styles.inputCellListSolution,
    id === 'table.plain' &&
      mode === 'solution' &&
      isInput &&
      styles.inputCellPlainSolution,
  )
}

export function getInputClassName(params: {
  id: string
  mode: TableMode
}): string {
  const { id, mode } = params

  return clsx(
    styles.input,
    mode === 'solution' &&
      INPUT_WIDTH_AUTO_IDS.has(id) &&
      styles.inputWidthAuto,
  )
}
