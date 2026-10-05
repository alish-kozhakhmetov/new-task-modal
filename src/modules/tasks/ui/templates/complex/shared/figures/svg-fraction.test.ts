import { describe, expect, it } from 'vitest'

import { parseFraction } from './svg-fraction'

describe('parseFraction', () => {
  it('reads a plain fraction label in any of the generator spellings', () => {
    expect(parseFraction('\\frac{2}{7}')).toEqual({ num: '2', den: '7' })
    expect(parseFraction('\\dfrac{4}{7}')).toEqual({ num: '4', den: '7' })
    expect(parseFraction('\\(\\frac{1}{7}\\)')).toEqual({ num: '1', den: '7' })
    expect(parseFraction('\\frac{-3}{5}')).toEqual({ num: '-3', den: '5' })
  })

  it('leaves everything else as text', () => {
    expect(parseFraction('A')).toBeNull()
    expect(parseFraction('2/7')).toBeNull()
    expect(parseFraction('\\frac{2}{7} см')).toBeNull()
  })
})
