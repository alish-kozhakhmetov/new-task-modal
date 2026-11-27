import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { makeSolution, renderTemplate } from '../lib/testing/test-utils'
import type { ComplexTask } from '../lib/types.task'
import { ComplexMultiStackN3BeforeAfter as Template } from '../ui/multi/stack-n3-before-after'
import allTasksJson from '../ui/multi/stack-n3-before-after/data/all-tasks.json'

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

type Entry = { id: string; task: ComplexTask }
const area = Object.values(
  (allTasksJson as unknown as { byGrade: Record<string, Entry[]> }).byGrade,
)
  .flat()
  .find((e) => e.id === '3_10_15_4')!.task

/**
 * jsdom lays nothing out: each unit reports a box `unitTop` px from the top,
 * each value one on the first line (0–23).
 */
const layOutRows = (unitTop: number) => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      if (this.dataset.testid === 'text-suffix')
        return new DOMRect(300, unitTop, 30, 23)
      if (this.dataset.testid === 'math-formula')
        return new DOMRect(260, 0, 30, 23)
      return new DOMRect(0, 0, 343, 23)
    },
  )
}

// A row has no role or test id of its own: its markup stays as in 2.5.8.
const solutionRows = () =>
  screen
    .getAllByTestId('text-suffix')
    // eslint-disable-next-line testing-library/no-node-access
    .map((unit) => unit.parentElement)

describe('the unit stays with its value in the solution (3_10_15_4)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('a unit fallen under its value takes the value down with it', () => {
    layOutRows(31)
    renderTemplate(Template, { ...area, solution: makeSolution('60;;20;;40') })

    const rows = solutionRows()
    expect(rows).toHaveLength(3)
    for (const row of rows) expect(row).toHaveAttribute('data-unit-down')
  })

  it('a row that fits is left as it was', () => {
    layOutRows(0)
    renderTemplate(Template, { ...area, solution: makeSolution('60;;20;;40') })

    for (const row of solutionRows())
      expect(row).not.toHaveAttribute('data-unit-down')
  })
})
