/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import { render, screen } from '@testing-library/react'
import type { ComponentType } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { TEMPLATE_MAP } from '@/modules/tasks/model/template-map'
import type { TaskComponentProps } from '@/modules/tasks/model/types'

import { makeTemplateProps } from '../../lib/testing/test-utils'
import type { ComplexTask } from '../../lib/types.task'
import { ComplexDescription } from '../complex-description'

import fixtures from './data/figure-parts.fixtures.json'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../text/lib/testing/mocks/math-formula'),
)

/**
 * Parts of the condition the package did not draw before (inventory 26.11,
 * `fig:*`): every generator of the list, on its real payload from
 * `variants.json` (monolith run 02.08). Not invented shapes — the data the
 * backend sends.
 */
type Fixture = {
  id: string
  code: string
  template: string
  grade: number
  task: ComplexTask
}
const all = (fixtures as unknown as { tasks: Fixture[] }).tasks
const byId = (id: string) => {
  const found = all.find((f) => f.id === id)
  if (!found) throw new Error(`no fixture ${id}`)
  return found
}

const FIGURE_OF: Record<string, string> = {
  'fig:30': '30',
  'fig:40': '40',
  'fig:60': '60',
  'fig:70': '70',
  'fig:130': '130',
  'fig:190': '190',
  'fig:200': '200',
  'fig:210': '210',
}

const drawDescription = (id: string) => {
  const { task } = byId(id)
  return render(
    <ComplexDescription
      description={task.description}
      deps={makeTemplateProps(task).deps}
    />,
  )
}

const texts = (root: Element, selector = 'text') =>
  [...root.querySelectorAll(selector)].map((t) => t.textContent ?? '')

describe('figure parts of the condition (fig:*)', () => {
  it('the list is the inventory’s: 53 generators, 8 part types', () => {
    expect(all).toHaveLength(53)
    expect(new Set(all.map((f) => f.code))).toEqual(
      new Set(Object.keys(FIGURE_OF)),
    )
  })

  it.each(all.map((f) => [f.id, f] as const))(
    '%s draws in its template, nothing unsupported',
    async (_id, fixture) => {
      const loader = TEMPLATE_MAP[fixture.template as keyof typeof TEMPLATE_MAP]
      expect(loader).toBeTypeOf('function')
      const Template = (await loader()).default as unknown as ComponentType<
        TaskComponentProps<ComplexTask>
      >
      const { container } = render(
        <Template {...makeTemplateProps(fixture.task)} />,
      )
      expect(container).not.toHaveTextContent(/Unsupported figure type/)
      expect(
        container.querySelector(
          `[data-figure-type="${FIGURE_OF[fixture.code]}"]`,
        ),
      ).not.toBeNull()
      expect(screen.getAllByTestId('math-input').length).toBeGreaterThan(0)
    },
  )
})

describe('interval on a number line (40)', () => {
  it('6_5_27_2 [−8; 1) ∪ (1; 10]: ends filled or hollow, each number once', () => {
    const { container } = drawDescription('Task_6_5_27_2')
    const dots = [...container.querySelectorAll('circle')].map((c) =>
      c.getAttribute('data-inclusive'),
    )
    expect(dots).toEqual(['true', 'false', 'false', 'true'])
    const labels = texts(container).filter((t) => !t.includes('∞') && t !== 'x')
    expect(labels.sort()).toEqual(['10', '1', '−8'].sort())
    expect(texts(container)).toEqual(expect.arrayContaining(['−∞', '+∞', 'x']))
  })

  it('6_5_21_1 (−∞; 8]: no dot at infinity, hatch up to 8', () => {
    const { container } = drawDescription('Task_6_5_21_1')
    expect(container.querySelectorAll('circle')).toHaveLength(1)
    expect(container.querySelector('[data-layer="hatch"]')?.children.length)
      // from −2 (the field's start) to 8: a stroke every half step, the
      // Matheducator loop `from + 0.5 … < to − 0.5`
      .toBe(18)
  })

  it('a mixed-number label is a whole part and a two-tier fraction', () => {
    const withMixed = all.find(
      (f) =>
        f.code === 'fig:40' &&
        JSON.stringify(f.task.description).includes('\\frac'),
    )
    expect(withMixed).toBeDefined()
    const { container } = drawDescription(withMixed!.id)
    expect(container.querySelector('[data-label="mixed"]')).not.toBeNull()
    expect(container).not.toHaveTextContent(/frac/)
  })
})

describe('positive quarter plane (130)', () => {
  it('6_9_3_1: ticks × multiplier, axis names translated, one graph', () => {
    const { container } = drawDescription('Task_6_9_3_1')
    const labels = texts(container, '[data-plane-layer="labels"] text')
    expect(labels).toEqual(
      expect.arrayContaining(['1', '4', '14', '56', 't (час)', 'S(км)']),
    )
    expect(
      container.querySelectorAll('[data-plane-figure="segment"]'),
    ).toHaveLength(1)
  })

  it('7_4_2_10: custom ticks win over ticksQuantity, dots on the polygon', () => {
    const { container } = drawDescription('Task_7_4_2_10')
    const labels = texts(container, '[data-plane-layer="labels"] text')
    expect(labels).toEqual(expect.arrayContaining(['5%', '40%', '5']))
    expect(labels).not.toContain('6')
    expect(
      container.querySelectorAll('[data-plane-figure] circle'),
    ).toHaveLength(6)
  })
})

describe('frequency charts (190, 200)', () => {
  it('8_4_3_6: bars with x1 > x2 still have a width', () => {
    const { container } = drawDescription('Task_8_4_3_6')
    const bars = [
      ...container.querySelectorAll('[data-plane-layer="bars"] rect'),
    ]
    expect(bars).toHaveLength(6)
    for (const bar of bars)
      expect(Number(bar.getAttribute('width'))).toBeGreaterThan(0)
  })

  it('5_8_7_10: text ticks under the bars', () => {
    const { container } = drawDescription('Task_5_8_7_10')
    expect(texts(container)).toEqual(
      expect.arrayContaining(['Собака', 'Корова', 'Количество животных']),
    )
  })

  it('11_2_3_8: ticks 10…22 by 2, six points on the line', () => {
    const { container } = drawDescription('Task_11_2_3_8')
    const labels = texts(container, '[data-plane-layer="labels"] text')
    expect(labels).toEqual(expect.arrayContaining(['10', '16', '22']))
    expect(
      container.querySelectorAll('[data-plane-layer="points"] circle'),
    ).toHaveLength(6)
  })
})

describe('Euler circles, rectangle, hexagon, row of parts', () => {
  it('5_5_55_1: three sets with their names and elements', () => {
    const { container } = drawDescription('Task_5_5_55_1')
    const sets = [...container.querySelectorAll('[data-euler="set"]')]
    expect(sets.map((s) => s.getAttribute('data-name'))).toEqual([
      'A',
      'B',
      'C',
    ])
    expect(container.querySelectorAll('[data-euler="dot"]')).toHaveLength(15)
  })

  it('6_6_7_1 and 6_6_7_4: letters at the vertices', () => {
    expect(texts(drawDescription('Task_6_6_7_1').container)).toEqual(
      expect.arrayContaining(['A', 'M', 'E', 'F']),
    )
    expect(texts(drawDescription('Task_6_6_7_4').container)).toEqual(
      expect.arrayContaining(['B', 'F', 'G', 'K', 'L', 'M']),
    )
  })

  it('5_3_10_1: the row holds its pictures, drawn as planes', () => {
    const { container } = drawDescription('Task_5_3_10_1')
    const row = screen.getByTestId('complex-items-flex-part')
    const planes = row.querySelectorAll('[data-figure-type="110"]')
    const declared = (
      byId('Task_5_3_10_1').task.description.parts.find(
        (p) => Number(p.type) === 210,
      ) as { content: unknown[] }
    ).content.length
    expect(planes).toHaveLength(declared)
    expect(container).not.toHaveTextContent(/Unsupported/)
  })
})
