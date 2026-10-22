import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PlaneAxes, PlaneFigure } from './plane-figures'
import { fromPointToDot, type PlaneOptions } from './plane-math'

const base: PlaneOptions = {
  minPosition: -5,
  maxPosition: 5,
  tickStep: 1,
  stepSize: 30,
  showAxis: true,
  showCells: true,
  tickStepXMultiply: 1,
  tickStepYMultiply: 1,
  xAxisLabel: 'x',
  yAxisLabel: 'y',
}

const drawAxes = (options: PlaneOptions) => {
  const { container } = render(
    <svg>
      <PlaneAxes options={options} />
    </svg>,
  )
  const layer = (name: string) =>
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    container.querySelector(`[data-plane-layer="${name}"]`)
  const lines = (name: string) =>
    // eslint-disable-next-line testing-library/no-node-access
    [...(layer(name)?.querySelectorAll('line') ?? [])].map((line) => ({
      x1: Number(line.getAttribute('x1')),
      y1: Number(line.getAttribute('y1')),
      x2: Number(line.getAttribute('x2')),
      y2: Number(line.getAttribute('y2')),
    }))
  return { lines }
}

const xOf = (o: PlaneOptions, v: number) => fromPointToDot(o, v, 0).x
const yOf = (o: PlaneOptions, v: number) => fromPointToDot(o, 0, v).y

describe('PlaneAxes', () => {
  it('горизонтальные линии сетки — на каждом y(i), во всю ширину поля', () => {
    const grid = drawAxes(base).lines('grid')
    const horizontal = grid.filter((l) => l.y1 === l.y2)
    expect(horizontal.map((l) => l.y1)).toEqual(
      [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((i) => yOf(base, i)),
    )
    for (const line of horizontal) {
      expect(line.x1).toBe(xOf(base, -5))
      expect(line.x2).toBe(xOf(base, 5))
    }
  })

  it('вертикальные линии сетки — на каждом x(i), во всю высоту поля', () => {
    const vertical = drawAxes(base)
      .lines('grid')
      .filter((l) => l.x1 === l.x2)
    expect(vertical).toHaveLength(11)
    for (const line of vertical) {
      expect(line.y1).toBe(yOf(base, 5))
      expect(line.y2).toBe(yOf(base, -5))
    }
  })

  it('несимметричное поле: оси проходят через ноль, а не через середину холста', () => {
    const asym = { ...base, minPosition: -2, maxPosition: 8 }
    const { lines } = drawAxes(asym)
    const xAxis = lines('x-axis')[0]
    const yAxis = lines('y-axis')[0]
    expect(xAxis.y1).toBe(yOf(asym, 0))
    expect(yAxis.x1).toBe(xOf(asym, 0))
    // the canvas middle is elsewhere — the old placement would fail here
    expect(yOf(asym, 0)).not.toBe(
      (asym.maxPosition - asym.minPosition + 2) * 15,
    )
  })

  it('ноль вне поля — ось на ближайшем крае', () => {
    const positive = { ...base, minPosition: 2, maxPosition: 8 }
    expect(drawAxes(positive).lines('y-axis')[0].x1).toBe(xOf(positive, 2))
  })

  it('без showCells сетки нет, без showAxis осей нет', () => {
    expect(drawAxes({ ...base, showCells: false }).lines('grid')).toHaveLength(
      0,
    )
    expect(drawAxes({ ...base, showAxis: false }).lines('x-axis')).toHaveLength(
      0,
    )
  })
})

const drawFigure = (figure: Record<string, unknown>) => {
  const { container } = render(
    <svg>
      <PlaneFigure options={base} figure={figure} translate={String} />
    </svg>,
  )
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  return container.querySelector('circle')!
}

describe('PlaneFigure — circle', () => {
  const circle = {
    type: 60,
    radius: 2,
    centerPoint: { x: 0, y: 0 },
    strokeColor: '#0045bc',
  }

  it('a shaded circle is the fill alone, without the payload ring (4_11_4_1)', () => {
    const shaded = drawFigure({ ...circle, innerColor: '#8484ff' })
    expect(shaded).toHaveAttribute('fill', '#8b2cff')
    expect(shaded).toHaveAttribute('stroke', 'none')
  })

  it('an empty circle keeps its line (4_11_4_2)', () => {
    const empty = drawFigure({ ...circle, innerColor: 'transparent' })
    expect(empty).toHaveAttribute('fill', 'transparent')
    expect(empty).toHaveAttribute('stroke', '#0066fe')
  })
})

describe('PlaneFigure — text label', () => {
  const label = (extra: Record<string, unknown>, options = base) => {
    const { container } = render(
      <svg>
        <PlaneFigure
          options={options}
          figure={{ type: 100, x: 0, y: 0, text: '7см', ...extra }}
          translate={String}
        />
      </svg>,
    )
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    return container.querySelector('text')!
  }

  it('is set in the condition size, not the payload one (4_11_10_4 sent 13)', () => {
    expect(label({ fontSize: 13 })).toHaveAttribute('font-size', '18')
  })

  it('grows in viewBox units by the plane scale, to keep 18px on screen', () => {
    expect(label({}, { ...base, labelScale: 1.25 })).toHaveAttribute(
      'font-size',
      '22.5',
    )
  })
})
