/* eslint-disable testing-library/no-node-access */
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderTemplate } from '../lib/testing/test-utils'
import type { TestTask } from '../lib/types.task'
import { TestPlain as Template } from '../ui/plain'

import fixtures from './data/test-figures.fixtures.json'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../text/lib/testing/mocks/math-formula'),
)
vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../text/lib/testing/mocks/math-input'),
)

/**
 * Tests with a drawing the test template did not draw before 26.11 (pilot
 * of grade 5, scan by G5): a figure of the condition other than text, image
 * and angle list, the test's `table`, a variant that is a figure. Every
 * example of `variants.json` (monolith run 02.08) — the backend's data.
 */
type Fixture = {
  id: string
  grade: number
  figures: number[]
  variantFigures: number[]
  table: boolean
  task: TestTask
}
const all = (fixtures as unknown as { tasks: Fixture[] }).tasks

/** Matheducator test draws these too; the package does not yet. */
const NOT_DRAWN = new Set([80, 100, 170])
const drawable = all.filter((f) => !f.figures.some((t) => NOT_DRAWN.has(t)))

describe('figures inside a test', () => {
  it('the list: 178 examples, 44 of them grade 5 with a figure', () => {
    expect(all).toHaveLength(178)
    expect(
      all.filter((f) => f.grade === 5 && f.figures.length > 0),
    ).toHaveLength(44)
    expect(drawable).toHaveLength(169)
  })

  it.each(drawable.map((f) => [f.id, f] as const))(
    '%s draws every figure, nothing unsupported',
    (_id, fixture) => {
      const { container } = renderTemplate(Template, fixture.task)
      expect(container).not.toHaveTextContent(/Unsupported figure type/)
      const figures = screen.queryByTestId('test-figures')
      const missing = fixture.figures.filter(
        (type) =>
          !figures?.querySelector(`[data-figure-type="${type}"], table`),
      )
      expect(missing).toEqual([])
    },
  )

  it.each(drawable.filter((f) => f.table).map((f) => [f.id, f.task] as const))(
    '%s draws the test table',
    (_id, task) => {
      renderTemplate(Template, task)
      expect(
        screen.getByTestId('test-table').querySelector('table'),
      ).not.toBeNull()
    },
  )

  it.each(
    drawable
      .filter((f) => f.variantFigures.length > 0)
      .map((f) => [f.id, f.task] as const),
  )('%s draws a figure in every variant', (_id, task) => {
    renderTemplate(Template, task)
    const labels = [
      ...screen.getByTestId('test-options').querySelectorAll('label'),
    ]
    expect(labels).toHaveLength(task.description.variants.length)
    const empty = labels.filter(
      (label) => !label.querySelector('[data-figure-type]'),
    )
    expect(empty).toEqual([])
  })
})
