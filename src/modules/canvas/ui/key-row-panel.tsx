import clsx from 'clsx'
import type { ComponentType, CSSProperties, SVGProps } from 'react'

import {
  equalCells,
  type Cell,
  type DraftGrid,
  type KeyRow,
} from '../lib/key-row'

import styles from './key-row-panel.module.scss'

export interface DraftAction {
  id: 'draw' | 'erase' | 'undo' | 'redo' | 'clear' | 'close'
  title: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  onClick: () => void
  /** A tool in use: the pen or the eraser. */
  pressed?: boolean
  disabled?: boolean
}

interface Props {
  grid: DraftGrid
  /** The keyboard's bottom row; `null` — the keyboard is folded away. */
  row: KeyRow | null
  /** Six actions: pen, eraser, undo, redo, clear, close. */
  actions: DraftAction[]
}

/**
 * The draft's panel in the cells of the keyboard's bottom row (Alisher,
 * 23.10). Over a shown keyboard every cell takes a key's box from the page —
 * В1 the keys' own, В2 six equal ones over the same row. A solid strip of the
 * dimmed page lies under the cells, so the keys below show through neither
 * the gaps nor the rounded corners. With the keyboard folded the panel stands
 * where its bottom row would be, in the digits page's grid (styles).
 */
export const KeyRowPanel = ({ grid, row, actions }: Props) => {
  const groups = groupActions(grid, row, actions)
  const cells = row ? placeCells(grid, row, groups.length) : null

  return (
    <div
      className={clsx(styles.row, !row && styles.folded, styles[grid])}
      style={row ? boxStyle(row) : undefined}
      data-draft-grid={grid}
    >
      {groups.map((group, i) => (
        <div
          key={group.map((action) => action.id).join('-')}
          className={clsx(styles.cell, group.length > 1 && styles.segmented)}
          style={cells ? cellStyle(cells[i]) : undefined}
          data-draft-cell={i}
        >
          {group.map((action) => (
            <button
              key={action.id}
              type="button"
              className={clsx(styles.button, action.pressed && styles.active)}
              onClick={action.onClick}
              disabled={action.disabled}
              aria-pressed={action.pressed}
              title={action.title}
            >
              <action.Icon />
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * В1 on the digits page has five cells for six actions: undo and redo share
 * the middle one as two segments. Everywhere else — one action per cell.
 */
const groupActions = (
  grid: DraftGrid,
  row: KeyRow | null,
  actions: DraftAction[],
): DraftAction[][] => {
  const columns = grid === 'keys' ? (row?.keys.length ?? DIGIT_COLUMNS) : 6
  if (columns >= actions.length) return actions.map((action) => [action])

  const undo = actions.findIndex((action) => action.id === 'undo')
  return [
    ...actions.slice(0, undo).map((action) => [action]),
    actions.slice(undo, undo + 2),
    ...actions.slice(undo + 2).map((action) => [action]),
  ]
}

/** The digits page — the one a task opens on — has five columns. */
const DIGIT_COLUMNS = 5

const placeCells = (grid: DraftGrid, row: KeyRow, count: number): Cell[] =>
  grid === 'keys' && row.keys.length >= count
    ? row.keys.slice(0, count)
    : equalCells(row, count)

const px = (value: number) => `${value}px`

const boxStyle = ({ box }: KeyRow): CSSProperties => ({
  left: px(box.left),
  top: px(box.top),
  width: px(box.width),
  height: px(box.height),
})

const cellStyle = (cell: Cell): CSSProperties => ({
  left: px(cell.left),
  width: px(cell.width),
})
