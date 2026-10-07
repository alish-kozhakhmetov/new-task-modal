import { describe, expect, it } from 'vitest'

import { hasLabelColumn, isWordLabel } from './label-column'

describe('isWordLabel', () => {
  it('takes a row name', () => {
    expect(isWordLabel('Значение частного: ')).toBe(true)
    expect(isWordLabel('Альбом:')).toBe(true)
  })

  it('rejects expressions', () => {
    expect(isWordLabel('x =')).toBe(false)
    expect(isWordLabel('(46 + 76) × x =')).toBe(false)
    expect(isWordLabel('\\frac{1}{2}')).toBe(false)
  })
})

describe('hasLabelColumn', () => {
  const names = ['Значение частного: ', 'Значение остатка: ']

  it('shares the column for named rows in a stack', () => {
    expect(hasLabelColumn('stack', true, names)).toBe(true)
    expect(hasLabelColumn('stack', true, [names[0], undefined])).toBe(true)
  })

  it('keeps own widths otherwise', () => {
    expect(hasLabelColumn('inline', true, names)).toBe(false)
    expect(hasLabelColumn('stack', false, names)).toBe(false)
    expect(hasLabelColumn('stack', true, [undefined, ''])).toBe(false)
    expect(hasLabelColumn('stack', true, ['Альбом:', 'x ='])).toBe(false)
  })
})
