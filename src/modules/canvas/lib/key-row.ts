/**
 * The draft's panel lies over the keyboard's bottom row, cell for cell
 * (Alisher, 23.10, 01:06: «кнопки черновика — в тех же ячейках, что и кнопки
 * клавиатуры, те же размеры… пиксель в пиксель»).
 *
 * The keyboard's grid is not repeated here: its sizes scale with the window
 * (`to-vw`), its pages differ (digits — 5 columns of 62/375 vw, letters — 6
 * of 50/375 vw, centred 3/375 vw higher), and the host decides where it sits.
 * The panel takes the keys' own boxes from the page instead, so it cannot
 * drift from them.
 */

/** Which layout the panel's six actions take over the bottom row. */
export type DraftGrid =
  /** В1: the keys' cells; on 5 columns undo and redo share one cell. */
  | 'keys'
  /** В2: six equal cells across the row, the keys' height, gap and edges. */
  | 'equal'

export const DRAFT_GRIDS: readonly DraftGrid[] = ['keys', 'equal']

/** A box in the board's coordinates (its padding box), in CSS px. */
export interface Box {
  left: number
  top: number
  width: number
  height: number
}

export interface KeyRow {
  /** First key's left edge to the last key's right edge, the keys' height. */
  box: Box
  /** Every key of the row, left to right; `left` from the row's left edge. */
  keys: { left: number; width: number }[]
  /** The keyboard page under the board: `main` (digits) or `letters`. */
  page: string
}

/** Keys whose tops differ by less than this stand in one row. */
const ROW_TOLERANCE_PX = 0.5

/**
 * The bottom row of the keyboard page on screen, in the board's coordinates.
 * `null` when no keyboard is shown: the field is not active, or the condition
 * is long and the calculator is folded away.
 */
export const measureKeyRow = (board: HTMLElement): KeyRow | null => {
  const scope: ParentNode =
    board.closest('[data-ntm-root]') ?? board.ownerDocument
  // Both pages are in the DOM; the slider marks the ones off screen inert.
  const page = [
    ...scope.querySelectorAll<HTMLElement>('[data-calc-page]'),
  ].find((el) => !el.closest('[inert]') && el.getClientRects().length > 0)
  if (!page) return null

  const rects = [...page.querySelectorAll<HTMLElement>('[data-calc]')]
    .map((key) => key.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0)
  if (rects.length === 0) return null

  const bottomTop = Math.max(...rects.map((rect) => rect.top))
  const row = rects
    .filter((rect) => bottomTop - rect.top < ROW_TOLERANCE_PX)
    .sort((a, b) => a.left - b.left)

  const frame = board.getBoundingClientRect()
  const originX = frame.left + board.clientLeft
  const originY = frame.top + board.clientTop
  const first = row[0]
  const last = row[row.length - 1]

  return {
    box: {
      left: first.left - originX,
      top: first.top - originY,
      width: last.right - first.left,
      height: first.height,
    },
    keys: row.map((rect) => ({
      left: rect.left - first.left,
      width: rect.width,
    })),
    page: page.dataset.calcPage ?? '',
  }
}

/** One cell of the panel: its left edge from the row's and its width. */
export interface Cell {
  left: number
  width: number
}

/**
 * Layout works in 1/64 px: the edges are rounded to it, so a cell's left and
 * width given inline land exactly where they were counted.
 */
const toLayoutUnit = (px: number) => Math.round(px * 64) / 64

/**
 * В2: six equal cells over the row — the keys' outer edges and their gap,
 * a width of their own. The last cell ends at the last key's right edge.
 */
export const equalCells = (row: KeyRow, count = 6): Cell[] => {
  const [a, b] = row.keys
  const gap = b ? b.left - (a.left + a.width) : 0
  const width = (row.box.width - gap * (count - 1)) / count
  return Array.from({ length: count }, (_, i) => {
    const left = toLayoutUnit(i * (width + gap))
    const right =
      i === count - 1 ? row.box.width : toLayoutUnit(i * (width + gap) + width)
    return { left, width: right - left }
  })
}
