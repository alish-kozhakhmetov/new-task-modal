import { describe, expect, it } from 'vitest'

import { TaskDescriptionType } from '../constants'

import { toWireAnswer } from './to-wire-answer'

const item = (id: unknown) => ({ id, image: '<svg/>' })
const description = {
  type: 'calculateByImage',
  items: [item('ruler')],
  selectableItems: [item('ruler'), item('coin200')],
}

const wire = (desc: { type?: unknown }, answer: unknown) =>
  toWireAnswer({
    description: desc,
    answer,
    calculateByImageType: TaskDescriptionType.CalculateByImage,
  })

describe('toWireAnswer', () => {
  it('calculateByImage: номера каталога → { list: [{ image: '', id }] } с повторами', () => {
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
})
