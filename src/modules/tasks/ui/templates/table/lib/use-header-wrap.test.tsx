/* eslint-disable testing-library/no-node-access -- the switch is an attribute on the table's scroll box */
import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TableGrid } from '../ui/grid'
import gridTasks from '../ui/grid/data/all-tasks.json'
import { TableMultiRow } from '../ui/multi-row'
import fixture from '../ui/multi-row/data/task.json'

import { makeSolution, renderTemplate } from './testing/test-utils'
import type { TableTask } from './types.task'
import { HEADER_WRAP_ATTRIBUTE } from './use-header-wrap'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../text/lib/testing/mocks/math-formula'),
)

/*
 * Widths measured in the task window (grade 4, master, 27.11): the scroll
 * box of 4_10_9_9 is 641px wide with its header on one line (2.5.9) and 465
 * wrapped; the column is 292/332/362 on a 320/360/390 phone, 592 at 1280.
 * jsdom lays nothing out, so the box reports these numbers.
 */
const ONE_LINE = 641
const WRAPPED = 465
const WRAPPED_1280 = 592

const layOut = ({
  column,
  wrapped = WRAPPED,
}: {
  column: number
  wrapped?: number
}) => {
  // the scroll box is the table's parent, in the window and in the solution
  const isBox = (el: Element) =>
    el.firstElementChild?.getAttribute('data-testid') === 'task-table'
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(
    function (this: Element) {
      return isBox(this) ? column : 0
    },
  )
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(
    function (this: Element) {
      if (!isBox(this)) return 0
      return this.hasAttribute(HEADER_WRAP_ATTRIBUTE) ? wrapped : ONE_LINE
    },
  )
}

const task4_10_9_9 = { ...(fixture as unknown as TableTask), solution: null }
const box = () => screen.getByTestId('task-table').parentElement!

afterEach(() => {
  vi.restoreAllMocks()
})

describe('the header wraps only where the table then fits its column', () => {
  it.each([
    [320, 292],
    [360, 332],
    [390, 362],
  ])(
    'on a %ipx phone 4_10_9_9 keeps its header on one line, as in 2.5.9',
    (_, column) => {
      layOut({ column })
      renderTemplate(TableMultiRow, task4_10_9_9)
      expect(box()).not.toHaveAttribute(HEADER_WRAP_ATTRIBUTE)
    },
  )

  it('at 1280 4_10_9_9 wraps its header: wrapped, it fits the column', () => {
    layOut({ column: 592, wrapped: WRAPPED_1280 })
    renderTemplate(TableMultiRow, task4_10_9_9)
    expect(box()).toHaveAttribute(HEADER_WRAP_ATTRIBUTE)
  })

  it('a table that fits on one line keeps it', () => {
    layOut({ column: 700, wrapped: 600 })
    renderTemplate(TableMultiRow, task4_10_9_9)
    expect(box()).not.toHaveAttribute(HEADER_WRAP_ATTRIBUTE)
  })

  it('a table with no header line of several words is never switched', () => {
    layOut({ column: 592, wrapped: WRAPPED_1280 })
    // 4_1_56: «сот.» over «6-й», one word a line
    const { task } = (
      gridTasks as unknown as {
        byGrade: Record<string, { id: string; task: unknown }[]>
      }
    ).byGrade['4'].find(({ id }) => id === '4_1_56')!
    renderTemplate(TableGrid, { ...(task as TableTask), solution: null })
    expect(box()).not.toHaveAttribute(HEADER_WRAP_ATTRIBUTE)
  })

  it('the solution table follows the same rule', () => {
    const solved = {
      ...(fixture as unknown as TableTask),
      solution: makeSolution('1500 ; 2 ; 30'),
    }
    layOut({ column: 362 })
    const view = renderTemplate(TableMultiRow, solved)
    expect(box().closest('[data-mode]')).toHaveAttribute(
      'data-mode',
      'solution',
    )
    expect(box()).not.toHaveAttribute(HEADER_WRAP_ATTRIBUTE)
    view.unmount()
    vi.restoreAllMocks()

    layOut({ column: 592, wrapped: WRAPPED_1280 })
    renderTemplate(TableMultiRow, solved)
    expect(box()).toHaveAttribute(HEADER_WRAP_ATTRIBUTE)
  })
})
