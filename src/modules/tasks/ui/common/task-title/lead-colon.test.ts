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

  it('gives the colon to a one-sentence instruction without a final mark', () => {
    // 4_2_2_1 — the expression follows right below
    expect(leadColon('Вычислите эффективным способом')).toBe(
      'Вычислите эффективным способом:',
    )
    expect(leadColon('Преобразуйте в секунды ')).toBe(
      'Преобразуйте в секунды: ',
    )
    expect(leadColon('Тиімді тәсілмен есептеңіз')).toBe(
      'Тиімді тәсілмен есептеңіз:',
    )
  })

  it('leaves a title without a mark alone when it is prose or ends in a bracket', () => {
    expect(leadColon('Преобразуйте в дни. (1 год = 365 дней)')).toBe(
      'Преобразуйте в дни. (1 год = 365 дней)',
    )
    expect(leadColon('Выразите в указанной единице измерения.(м²)')).toBe(
      'Выразите в указанной единице измерения.(м²)',
    )
    expect(leadColon('Решите задачу. Запишите ответ')).toBe(
      'Решите задачу. Запишите ответ',
    )
    expect(leadColon('Найдите значение \\(x\\)')).toBe(
      'Найдите значение \\(x\\)',
    )
  })

  it('leaves colons, questions, ellipses and prose alone', () => {
    expect(leadColon('Вычислите:')).toBe('Вычислите:')
    expect(leadColon('Сколько стоит альбом?')).toBe('Сколько стоит альбом?')
    expect(leadColon('Продолжите ряд...')).toBe('Продолжите ряд...')
    const prose = 'У Асана 5 яблок. Сколько яблок у Асана.'
    expect(leadColon(prose)).toBe(prose)
  })
})
