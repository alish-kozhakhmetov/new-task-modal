import { describe, expect, it } from 'vitest'

import { leadColon } from './lead-colon'

describe('leadColon', () => {
  it('turns the closing period of a one-sentence instruction into a colon', () => {
    expect(leadColon('Решите уравнение.')).toBe('Решите уравнение:')
    expect(leadColon('Сравните буквенные выражения.')).toBe(
      'Сравните буквенные выражения:',
    )
    expect(leadColon('Теңдеуді шешіңіз.')).toBe('Теңдеуді шешіңіз:')
  })

  it('leaves colons, questions, ellipses and prose alone', () => {
    expect(leadColon('Вычислите:')).toBe('Вычислите:')
    expect(leadColon('Сколько стоит альбом?')).toBe('Сколько стоит альбом?')
    expect(leadColon('Продолжите ряд...')).toBe('Продолжите ряд...')
    const prose = 'У Асана 5 яблок. Сколько яблок у Асана.'
    expect(leadColon(prose)).toBe(prose)
  })
})
