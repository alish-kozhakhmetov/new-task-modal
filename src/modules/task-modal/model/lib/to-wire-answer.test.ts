import { describe, expect, it } from 'vitest'

import { TaskDescriptionType } from '../constants'

import { toWireAnswer } from './to-wire-answer'

const item = (id: unknown) => ({ id, image: '<svg/>' })
const description = {
  type: 'calculateByImage',
  items: [item('ruler')],
  selectableItems: [item('ruler'), item('coin200')],
}

const wire = (
  desc: { type?: unknown; figure?: { drawingFigure?: number } },
  answer: unknown,
) =>
  toWireAnswer({
    description: desc,
    answer,
    calculateByImageType: TaskDescriptionType.CalculateByImage,
    coordinatePlaneType: TaskDescriptionType.CoordinatePlane,
  })

describe('toWireAnswer', () => {
  it('calculateByImage: номера каталога → { list: [{ image, id }] } с повторами', () => {
    // catalog: 0 = preplaced ruler, 1 = row ruler, 2 = coin200
    expect(wire(description, '[0,2,2]')).toEqual({
      list: [
        { image: '', id: 'ruler' },
        { image: '', id: 'coin200' },
        { image: '', id: 'coin200' },
      ],
    })
  })

  it('calculateByImage: id-перевод уходит объектом как есть', () => {
    const mm = { rus: 'мм', module_name: 'Elixir.Helpers.Translation' }
    expect(
      wire({ type: 'calculateByImage', selectableItems: [item(mm)] }, '[0]'),
    ).toEqual({ list: [{ image: '', id: mm }] })
  })

  it('calculateByImage старым путём: JSON объекта из legacy-task-root не тронут', () => {
    const legacy = JSON.stringify({ list: [{ image: '', id: 'coin200' }] })
    expect(wire(description, legacy)).toBe(legacy)
  })

  it('calculateByImage: нечитаемая строка не превращается', () => {
    expect(wire(description, 'coin200')).toBe('coin200')
  })

  it.each([
    'text',
    'test',
    'formula',
    'table',
    'calculateByImageWithCell',
    'cubeCalculator',
  ])('%s: ответ не тронут', (type) => {
    // same catalog as calculateByImage: only the type keeps it a string
    expect(wire({ ...description, type }, '[0,2,2]')).toBe('[0,2,2]')
    expect(wire({ ...description, type }, '5')).toBe('5')
  })

  it('без описания — не тронут', () => {
    expect(
      toWireAnswer({
        description: undefined,
        answer: '5',
        calculateByImageType: TaskDescriptionType.CalculateByImage,
      }),
    ).toBe('5')
  })

  // issue #23, Abduali 07.10
  it('coordinatePlane, одна точка: строка «(x;y)» как есть', () => {
    const plane = { type: 'coordinatePlane', figure: { drawingFigure: 10 } }
    expect(wire(plane, '(2;1)')).toBe('(2;1)')
  })

  it('coordinatePlane, точки списком: { points: [{ x, y }] }', () => {
    const plane = { type: 'coordinatePlane', figure: { drawingFigure: 15 } }
    expect(wire(plane, '(-1;5);;(3;-3)')).toEqual({
      points: [
        { x: -1, y: 5 },
        { x: 3, y: -3 },
      ],
    })
  })

  it('coordinatePlane, отрезок: { figures: [{ type: 30, points, dashed }] }', () => {
    const plane = { type: 'coordinatePlane', figure: { drawingFigure: 30 } }
    expect(wire(plane, '(-1;0);;(1;0)')).toEqual({
      figures: [
        {
          type: 30,
          points: [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
          ],
          dashed: false,
        },
      ],
    })
  })
})
