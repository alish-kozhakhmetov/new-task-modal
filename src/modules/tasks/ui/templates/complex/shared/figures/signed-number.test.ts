import { describe, expect, it } from 'vitest'

import { signedNumber } from './signed-number'

describe('signedNumber', () => {
  it('puts a real minus before a number below zero', () => {
    expect(signedNumber(-3)).toBe('−3')
    expect(signedNumber(-0.5)).toBe('−0.5')
  })

  it('leaves zero and positive numbers as they are', () => {
    expect(signedNumber(0)).toBe('0')
    expect(signedNumber(12)).toBe('12')
  })
})
