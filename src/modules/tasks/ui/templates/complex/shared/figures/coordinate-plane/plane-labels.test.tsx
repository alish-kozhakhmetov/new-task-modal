/* eslint-disable testing-library/no-container, testing-library/no-node-access -- labels are SVG <text>: no roles to query by */
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { resolveWordForms } from '@/modules/task-modal/model/lib/resolve-word-forms'
import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'
import type { ComplexCoordinatePlanePart } from '@/modules/tasks/ui/templates/complex/lib/types.task'
import { makeDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { CoordinatePlanePart } from '../coordinate-plane-part'

import fixtures from './plane-labels.fixtures.json'
import { labelRuns } from './svg-math-label'

/**
 * Planes of real tasks (local backend, 27.11 — `_source` in the fixture) that
 * CX and FIG found broken on 26.11. Rendered by the part the window uses,
 * with the host's translate wrapped in word forms as `withWordForms` does.
 */
type Row = { id: string; path: string; plane: ComplexCoordinatePlanePart }
const planes = (fixtures as unknown as { planes: Row[] }).planes
const planeOf = (id: string) => planes.find((p) => p.id === id)!.plane

const hostDeps = () => {
  const deps = makeDeps()
  deps.global.translateTasks = (value: unknown, language?: string) =>
    resolveWordForms(pickTranslationText(value), language ?? 'rus')
  return deps
}

const draw = (plane: ComplexCoordinatePlanePart) =>
  render(<CoordinatePlanePart part={plane} deps={hostDeps()} />)

describe('plane labels from the backend', () => {
  it('the corpus is the one the neighbours named', () => {
    expect(planes.map((p) => p.id)).toEqual([
      'Task_5_2_11_4',
      'Task_5_2_11_5',
      'Task_1_6_11',
      'Task_1_6_12',
      'Task_1_6_13',
      'Task_10_6_4_1',
      'Task_10_6_4_2',
      'Task_10_6_4_3',
      'Task_5_5_4_9',
      'Task_5_7_10_1',
      'Task_10_2_7_1',
    ])
  })

  it('Task_5_2_11_4: a Translation of numbers draws its number (the window was empty)', () => {
    const { container } = draw(planeOf('Task_5_2_11_4'))
    const texts = [...container.querySelectorAll('text')].map(
      (t) => t.textContent,
    )
    expect(texts).toContain('30')
    expect(texts).toContain('3')
  })

  it.each(planes.map((p) => [p.id, p.plane] as const))(
    '%s: no TeX delimiter reaches the pupil',
    (_, plane) => {
      const { container } = draw(plane)
      const text = container.textContent ?? ''
      expect(text).not.toMatch(/\\[()[\]]|\\[a-z]+/)
      expect(text).not.toContain('^')
    },
  )

  it('Task_10_6_4_1: the exponent is raised, the minus is U+2212', () => {
    const { container } = draw(planeOf('Task_10_6_4_1'))
    const label = [...container.querySelectorAll('text')].find(
      (t) => t.textContent === 'x2 + 9x − 9',
    )
    expect(label, 'x² + 9x − 9').toBeTruthy()
    const sup = label!.querySelector('tspan[baseline-shift="super"]')
    expect(sup?.textContent).toBe('2')
  })

  it('Task_1_6_11: a lone «-» between the cells is a minus', () => {
    const { container } = draw(planeOf('Task_1_6_11'))
    const texts = [...container.querySelectorAll('text')].map(
      (t) => t.textContent,
    )
    expect(texts).toContain('−')
    expect(texts).not.toContain('-')
  })

  it('Task_5_7_10_1: the ellipse of the variant is drawn (type 70)', () => {
    const { container } = draw(planeOf('Task_5_7_10_1'))
    const ellipse = container.querySelector('ellipse')
    expect(ellipse).toBeTruthy()
    const stepSize = planeOf('Task_5_7_10_1').stepSize ?? 20
    expect(Number(ellipse!.getAttribute('rx'))).toBe(2 * stepSize)
    expect(Number(ellipse!.getAttribute('ry'))).toBe(1 * stepSize)
  })
})

describe('a drawing to read on the trigonometric axes', () => {
  it('Task_10_2_7_1: y = sin x is drawn on the axes with π (it was an empty −5…5 grid)', () => {
    const { container } = draw(planeOf('Task_10_2_7_1'))
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('data-plane-axes')).toBe('trig')
    const curve = container.querySelectorAll('path[data-trig-curve="190"]')
    expect(curve.length).toBeGreaterThan(0)
    const texts = [...container.querySelectorAll('text')].map(
      (t) => t.textContent,
    )
    expect(texts).toContain('π')
    expect(texts).toContain('2π')
    // the peak of sin x at π/2: 3 cells right, 2 cells (1 unit) up
    const d = [...curve].map((p) => p.getAttribute('d')).join(' ')
    const xs = [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((m) => ({
      x: Number(m[1]),
      y: Number(m[2]),
    }))
    const top = xs.reduce((a, b) => (b.y < a.y ? b : a))
    const origin = xs.find((p) => Math.abs(p.x - 12 * 20 - 20) < 1e-6)
    expect(origin, 'the curve passes x = 0').toBeTruthy()
    expect(origin!.y - top.y).toBeCloseTo(2 * 20, 0)
  })
})

describe('labelRuns', () => {
  it('keeps a word hyphen, turns a sign into a minus', () => {
    expect(labelRuns('Нур-Султан')).toEqual([{ text: 'Нур-Султан' }])
    expect(labelRuns('-29')).toEqual([{ text: '−29' }])
  })

  it('reads ^{…}, \\cdot and \\frac', () => {
    expect(labelRuns('\\(3x^{3} \\cdot 2\\)')).toEqual([
      { text: '3x' },
      { text: '3', sup: true },
      { text: ' × 2' },
    ])
    expect(labelRuns('\\(\\frac{1}{2}\\)')).toEqual([{ text: '1/2' }])
  })
})
