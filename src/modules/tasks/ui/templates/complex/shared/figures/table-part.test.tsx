import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { makeDeps } from '../../lib/testing/test-utils'
import type { ComplexTablePart } from '../../lib/types.task'

import { TablePart } from './table-part'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../text/lib/testing/mocks/math-formula'),
)

// Task_5_6_2_20 of the local backend (stream CX, 27.11): a question of 70
// letters in a cell of one line made the table 637 px wide on a 390 px phone,
// the answercell 247 px past the edge.
const question: ComplexTablePart = {
  type: 120,
  removeBorders: true,
  rows: [
    {
      cells: [
        'Если общая длина дороги 45 км, то сколько километров осталось отремонтировать?',
        'answercell',
        'км',
      ],
      colspan_list: [],
      rowspan_list: [],
    },
    { cells: ['', '', ''], colspan_list: [], rowspan_list: [] },
  ],
}

// jsdom lays nothing out: give the room and the table their widths
const layout = (room: number, table: number) => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(room)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
    function (this: HTMLElement) {
      return this.tagName === 'TABLE' ? table : 0
    },
  )
}

afterEach(() => vi.restoreAllMocks())

describe('TablePart: a table wider than its room', () => {
  it('переносит текст ячеек, когда таблица шире места (5_6_2_20 на 390)', () => {
    layout(358, 637)
    render(<TablePart part={question} deps={makeDeps()} />)

    expect(screen.getByTestId('task-table')).toHaveAttribute('data-wrap-text')
  })

  it('таблица, что помещается, остаётся как была', () => {
    layout(1180, 637)
    render(<TablePart part={question} deps={makeDeps()} />)

    expect(screen.getByTestId('task-table')).not.toHaveAttribute(
      'data-wrap-text',
    )
  })
})

// Task_5_6_3_5 (stream CX, 27.11): the rule over the chain of fields is one
// cell with the row's own `colspan: 6`, the list empty (TaskTable.jsx reads it)
describe("TablePart: the row's own colspan", () => {
  const chain: ComplexTablePart = {
    type: 120,
    removeBorders: true,
    removePadding: true,
    rows: [
      {
        cells: ['При нахождении числа по проценту нужно…'],
        colspan: 6,
        colspan_at: 0,
        colspan_list: [],
        rowspan_list: [],
      },
      {
        cells: ['answercell', ': 90% =', 'answercell', '=', 'answercell', '60'],
        colspan: 1,
        colspan_list: [],
        rowspan_list: [],
      },
    ],
  }

  it('ячейка без списка занимает colspan строки (5_6_3_5)', () => {
    render(<TablePart part={chain} deps={makeDeps()} />)

    const [rule, ...rest] = screen.getAllByRole('cell')
    expect(rule).toHaveAttribute('colspan', '6')
    expect(rest.every((c) => c.getAttribute('colspan') === '1')).toBe(true)
  })

  it('colspan_at — на свою ячейку, список главнее', () => {
    const part: ComplexTablePart = {
      type: 120,
      rows: [
        { cells: ['a', 'b', 'c'], colspan: 2, colspan_at: 1 },
        { cells: ['a', 'b'], colspan: 3, colspan_list: [2, 1] },
      ],
    }
    render(<TablePart part={part} deps={makeDeps()} />)

    expect(
      screen.getAllByRole('cell').map((c) => c.getAttribute('colspan')),
    ).toEqual(['1', '2', '1', '2', '1'])
  })
})
