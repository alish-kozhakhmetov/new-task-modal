import { describe, expect, it } from 'vitest'

import {
  pickWordForm,
  resolveWordForms,
  WORD_FORM_MARK,
  wordFormsOf,
} from './resolve-word-forms'

const M = WORD_FORM_MARK

describe('resolveWordForms', () => {
  it.each([
    ['тысяч|а|и', 'тысяч'],
    ['единиц|а|ы', 'единиц'],
    ['цвет|ок|ка|ков', 'цветков'],
    ['год|года|лет', 'лет'],
    ['день|дня|дней', 'дней'],
    ['сот(ня|ни|ен)', 'сотен'],
    ['месяц(а|ов)', 'месяцов'],
  ])('%s → %s', (input, expected) => {
    expect(resolveWordForms(input)).toBe(expected + M)
  })

  it('keeps the rest of the sentence', () => {
    expect(resolveWordForms('Ему 7 год|года|лет.')).toBe(`Ему 7 лет${M}.`)
    expect(resolveWordForms('\\(Хорд(а|ы):\\)')).toBe(`\\(Хорды${M}:\\)`)
  })

  it('leaves absolute values and segments alone', () => {
    expect(resolveWordForms('\\(|x| = 5\\)')).toBe('\\(|x| = 5\\)')
    expect(resolveWordForms('|АВ| = 3 см')).toBe('|АВ| = 3 см')
    expect(resolveWordForms('Длина ВС|')).toBe('Длина ВС|')
  })

  it('returns text without pipes untouched', () => {
    expect(resolveWordForms('десятков тысяч')).toBe('десятков тысяч')
  })
})

describe('pickWordForm', () => {
  resolveWordForms('год|года|лет')
  resolveWordForms('сот(ня|ни|ен)')
  const years = wordFormsOf('лет')!
  const hundreds = wordFormsOf('сотен')!

  it.each([
    ['1', 'год'],
    ['21', 'год'],
    ['101', 'год'],
    ['11', 'лет'],
    ['3', 'года'],
    ['24', 'года'],
    ['12', 'лет'],
    ['14', 'лет'],
    ['5', 'лет'],
    ['0', 'лет'],
    ['', 'лет'],
    ['2,5', 'года'],
    ['\\frac{1}{2}', 'года'],
  ])('«%s» → %s', (value, expected) => {
    expect(pickWordForm(years, value)).toBe(expected)
  })

  it('works for bracket forms', () => {
    expect(pickWordForm(hundreds, '1')).toBe('сотня')
    expect(pickWordForm(hundreds, '3')).toBe('сотни')
    expect(pickWordForm(hundreds, '6')).toBe('сотен')
  })
})
