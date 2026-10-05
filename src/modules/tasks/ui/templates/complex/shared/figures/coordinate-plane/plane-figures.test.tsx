import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PlaneAxes } from './plane-figures'
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
