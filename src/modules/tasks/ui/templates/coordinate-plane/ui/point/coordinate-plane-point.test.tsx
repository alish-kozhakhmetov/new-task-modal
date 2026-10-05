import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  fromPointToDot,
  planeLength,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import {
  decodeNodes,
  encodeNodes,
  nearestNode,
  planeOptions,
  toggleNode,
} from '../../lib/plane-answer'
import type { CoordinatePlaneTask } from '../../lib/types.task'

import fixtures from './data/tasks.json'

import { CoordinatePlanePoint as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)

type Fixture = CoordinatePlaneTask & { _expected: unknown }
const { tasks } = fixtures as unknown as { tasks: Fixture[] }
const task = (id: string) => {
  const found = tasks.find((t) => t.id === id)
  if (!found) throw new Error(`no fixture ${id}`)
  return { ...found, solution: null }
}

/** jsdom has no layout: give the board its natural size. */
const stubRect = (el: Element, size: number) => {
  el.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: size, height: size }) as DOMRect
}

const tapExpected = (id: string) => {
  const t = task(id)
  const onChange = vi.fn()
  render(
    <Template
      task={t}
      deps={makeTaskModalDeps()}
      answer=""
      onChange={onChange}
      mathInput={{ current: new Map() }}
    />,
  )
  const options = planeOptions(t.description.figure ?? {})
  const board = screen.getByTestId('plane-board')
  stubRect(board, planeLength(options))
  const expected = t._expected as { x: number; y: number }
  const dot = fromPointToDot(options, expected.x, expected.y)
  // a little off the node: a tap inside the cell still counts
  fireEvent.pointerDown(board, { clientX: dot.x + 6, clientY: dot.y - 5 })
  return { onChange, expected }
}

describe('coordinatePlane.point', () => {
  it.each([
    '2_18_6_7',
    '3_3_8_19',
    '6_6_18_1',
    '6_6_20_2',
    '6_6_20_4',
    '6_6_20_5',
  ])('%s: нажатие у эталонной точки даёт «(x;y)» эталона', (id) => {
    const { onChange, expected } = tapExpected(id)
    expect(onChange).toHaveBeenCalledWith(`(${expected.x};${expected.y})`)
  })

  it('ближайший узел и границы поля', () => {
    const options = planeOptions({ minPosition: -3, maxPosition: 3 })
    expect(nearestNode(options, 0, 0)).toEqual({ x: -3, y: 3 })
    expect(nearestNode(options, 10_000, 10_000)).toEqual({ x: 3, y: -3 })
  })

  it('одна точка переставляется, повтор снимает; несколько — по возрастанию', () => {
    const a = { x: 2, y: 1 }
    const b = { x: -1, y: 0 }
    expect(toggleNode([a], b, false)).toEqual([b])
    expect(toggleNode([a], a, false)).toEqual([])
    expect(encodeNodes(toggleNode([a], b, true), ';;')).toBe('(-1;0);;(2;1)')
    expect(decodeNodes('(-1;0);;(2;1)', ';;')).toEqual([b, a])
  })
})
