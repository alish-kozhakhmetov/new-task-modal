import { describe, expect, it } from 'vitest'

import { unwrapMath } from './math-formula'

describe('unwrapMath', () => {
  it('drops one outer \\( \\) pair (alish-kozhakhmetov/qalan#20)', () => {
    expect(unwrapMath('\\(64 \\approx\\)')).toBe('64 \\approx')
    expect(unwrapMath('  \\(20000 + 50000 = \\) ')).toBe('20000 + 50000 = ')
  })

  it('leaves a bare formula alone', () => {
    expect(unwrapMath('8 · 10 = ')).toBe('8 · 10 = ')
  })

  it('does not merge two islands into one', () => {
    expect(unwrapMath('\\(a\\) + \\(b\\)')).toBe('\\(a\\) + \\(b\\)')
  })
})
