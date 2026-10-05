import { describe, expect, it } from 'vitest'

import { INK, paint } from './figure-paint'

describe('paint', () => {
  it('moves grade-4 payload colours onto the palette, step 500', () => {
    expect(paint('#fff200', INK)).toBe('#fed702')
    expect(paint('#ff7f27', INK)).toBe('#ff752c')
    expect(paint('#8484ff', INK)).toBe('#8b2cff')
    expect(paint('green', INK)).toBe('#00b53f')
    expect(paint('#0045bc', INK)).toBe('#0066fe')
    expect(paint('dodgerblue', INK)).toBe('#0066fe')
    expect(paint('#F75E6B', INK)).toBe('#ff4a4a')
  })

  it('keeps none and transparent, themes black and greys', () => {
    expect(paint('transparent', INK)).toBe('transparent')
    expect(paint('none', INK)).toBe('none')
    expect(paint('black', 'x')).toBe(INK)
    expect(paint('#000000', 'x')).toBe(INK)
    expect(paint('lightgrey', 'x')).toBe('var(--border-default)')
  })

  it('falls back on missing or unreadable colours', () => {
    expect(paint(undefined, INK)).toBe(INK)
    expect(paint('', INK)).toBe(INK)
    expect(paint('not-a-colour', INK)).toBe(INK)
  })
})
