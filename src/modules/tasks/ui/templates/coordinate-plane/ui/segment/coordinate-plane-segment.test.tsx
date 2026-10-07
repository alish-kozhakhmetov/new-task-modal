import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  fromPointToDot,
  planeLength,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import {
  labelPlace,
  nodeLabel,
  planeOptions,
  toggleSegmentNode,
  toPlaneWireAnswer,
} from '../../lib/plane-answer'
import type { CoordinatePlaneTask } from '../../lib/types.task'

import fixtures from './data/tasks.json'

import { CoordinatePlaneSegment as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)

type End = { x: number; y: number }
type Fixture = CoordinatePlaneTask & {
  _expected: { point1: End; point2: End }
}
const { tasks } = fixtures as unknown as { tasks: Fixture[] }

const stubRect = (el: Element, size: number) => {
  el.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: size, height: size }) as DOMRect
}

/** Two taps a little off the reference ends, as a pupil taps inside a cell. */
const drawExpected = (t: Fixture) => {
  const options = planeOptions(t.description.figure ?? {})
  let answer = ''
  const onChange = (value: string) => {
    answer = value
  }
  const props = {
    task: { ...t, solution: null },
    deps: makeTaskModalDeps(),
    onChange,
    mathInput: { current: new Map() },
  }
  const { rerender } = render(<Template {...props} answer={answer} />)
  for (const end of [t._expected.point1, t._expected.point2]) {
    const board = screen.getByTestId('plane-board')
    stubRect(board, planeLength(options))
    const dot = fromPointToDot(options, end.x, end.y)
    fireEvent.pointerDown(board, { clientX: dot.x + 5, clientY: dot.y - 4 })
    rerender(<Template {...props} answer={answer} />)
  }
  return answer
}

const same = (a: End[], b: End[]) =>
  JSON.stringify([...a].sort((p, q) => p.x - q.x || p.y - q.y)) ===
  JSON.stringify([...b].sort((p, q) => p.x - q.x || p.y - q.y))

describe('coordinatePlane.segment', () => {
  it.each(tasks.map((t) => [t.id, t] as const))(
    '%s: два нажатия у эталонных концов → на бэк { figures: [{ type: 30, points }] } эталона',
    (_id, t) => {
      const answer = drawExpected(t)
      const wire = toPlaneWireAnswer(answer, 30) as {
        figures: { type: number; points: End[]; dashed: boolean }[]
      }
      expect(wire.figures).toHaveLength(1)
      expect(wire.figures[0].type).toBe(30)
      expect(wire.figures[0].dashed).toBe(false)
      const { point1, point2 } = t._expected
      expect(
        same(wire.figures[0].points, [
          { x: point1.x, y: point1.y },
          { x: point2.x, y: point2.y },
        ]),
      ).toBe(true)
      expect(screen.getByTestId('plane-segment')).toBeInTheDocument()
    },
  )

  it('третье нажатие переносит второй конец, нажатие на конец снимает его', () => {
    const a = { x: 0, y: 0 }
    const b = { x: 2, y: 1 }
    const c = { x: -1, y: 3 }
    expect(toggleSegmentNode([], a)).toEqual([a])
    expect(toggleSegmentNode([a], b)).toEqual([a, b])
    expect(toggleSegmentNode([a, b], c)).toEqual([a, c])
    expect(toggleSegmentNode([a, b], a)).toEqual([b])
  })

  it('один конец — линии нет', () => {
    const t = tasks[0]
    render(
      <Template
        task={{ ...t, solution: null }}
        deps={makeTaskModalDeps()}
        answer={`(${t._expected.point1.x};${t._expected.point1.y})`}
        onChange={() => undefined}
        mathInput={{ current: new Map() }}
      />,
    )
    expect(screen.queryByTestId('plane-segment')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('plane-picked')).toHaveLength(1)
  })

  it('подпись конца — справа сверху, пока ничего не мешает', () => {
    expect(
      labelPlace({
        at: { x: 100, y: 100 },
        text: '(1; 2)',
        axes: null,
        size: 400,
      }),
    ).toEqual({ dx: 10, dy: -10, anchor: 'start' })
  })

  it('6_6_19_1: подписи концов уходят с оси Y и с самого отрезка', () => {
    const t = tasks.find((x) => x.id === '6_6_19_1')!
    const options = planeOptions(t.description.figure ?? {})
    const size = planeLength(options)
    const axes = fromPointToDot(options, 0, 0)
    const a = { x: -1, y: 4 }
    const b = { x: -4, y: 1 }
    const pa = fromPointToDot(options, a.x, a.y)
    const pb = fromPointToDot(options, b.x, b.y)
    const NE = { dx: 10, dy: -10, anchor: 'start' }
    // (−1; 4) one cell left of the Y axis: top-right would sit on «4»
    expect(
      labelPlace({ at: pa, text: nodeLabel(a), segmentTo: [pb], axes, size }),
    ).not.toEqual(NE)
    // (−4; 1): the segment goes up-right — top-right would sit on it
    expect(
      labelPlace({ at: pb, text: nodeLabel(b), segmentTo: [pa], axes, size }),
    ).not.toEqual(NE)
  })
})
