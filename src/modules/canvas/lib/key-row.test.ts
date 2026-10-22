import { afterEach, describe, expect, it } from 'vitest'

import { draftGridFromSearch } from '@/modules/task-modal/model/lib/draft-grid-param'

import { equalCells, measureKeyRow, type KeyRow } from './key-row'

const rect = (left: number, top: number, width: number, height: number) =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect

const stubRect = (el: Element, box: DOMRect) => {
  el.getBoundingClientRect = () => box
  el.getClientRects = () => [box] as unknown as DOMRectList
}

/** A page of `cols` × `rows` keys of 60 × 50 with a gap of 4, from (16, 100). */
const page = (mode: string, cols: number, rows: number, inert = false) => {
  const slide = document.createElement('div')
  if (inert) slide.setAttribute('inert', '')
  const el = document.createElement('div')
  el.dataset.calcPage = mode
  stubRect(el, rect(0, 100, 400, rows * 54))
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const key = document.createElement('button')
      key.setAttribute('data-calc', '')
      stubRect(key, rect(16 + c * 64, 100 + r * 54, 60, 50))
      el.append(key)
    }
  }
  slide.append(el)
  return slide
}

const board = () => {
  const el = document.createElement('div')
  stubRect(el, rect(0, 0, 400, 800))
  return el
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('measureKeyRow', () => {
  it('takes the bottom row of the page on screen, not the inert one', () => {
    const root = document.createElement('div')
    root.setAttribute('data-ntm-root', '')
    const sheet = board()
    root.append(page('letters', 6, 6, true), page('main', 5, 5), sheet)
    document.body.append(root)

    const row = measureKeyRow(sheet)

    expect(row?.page).toBe('main')
    expect(row?.box).toEqual({ left: 16, top: 316, width: 316, height: 50 })
    expect(row?.keys.map((key) => key.left)).toEqual([0, 64, 128, 192, 256])
  })

  it('gives null when the keyboard is folded away', () => {
    const sheet = board()
    document.body.append(sheet)
    expect(measureKeyRow(sheet)).toBeNull()
  })
})

describe('equalCells', () => {
  const row: KeyRow = {
    box: { left: 16, top: 0, width: 356.75, height: 64 },
    keys: [
      { left: 0, width: 68.15 },
      { left: 72.15, width: 68.15 },
    ],
    page: 'main',
  }

  it('spans the row edge to edge with the keys’ gap', () => {
    const cells = equalCells(row)
    const last = cells[cells.length - 1]

    expect(cells).toHaveLength(6)
    expect(cells[0].left).toBe(0)
    expect(last.left + last.width).toBe(row.box.width)
    for (let i = 1; i < cells.length; i += 1) {
      const gap = cells[i].left - (cells[i - 1].left + cells[i - 1].width)
      expect(gap).toBeCloseTo(4, 1)
    }
  })

  it('puts every edge on a 1/64 px layout unit', () => {
    for (const cell of equalCells(row)) {
      expect(Number.isInteger(cell.left * 64)).toBe(true)
      expect(Number.isInteger((cell.left + cell.width) * 64)).toBe(true)
    }
  })
})

describe('draftGridFromSearch', () => {
  it('reads В1 and В2, ignores anything else', () => {
    expect(draftGridFromSearch('?draftGrid=keys')).toBe('keys')
    expect(draftGridFromSearch('?a=1&draftGrid=equal')).toBe('equal')
    expect(draftGridFromSearch('?draftGrid=round')).toBeUndefined()
    expect(draftGridFromSearch(undefined)).toBeUndefined()
  })
})
