import { describe, expect, it } from 'vitest'

import { resolveWordForms } from './resolve-word-forms'

describe('resolveWordForms', () => {
  it.each([
    ['тысяч|а|и', 'тысяч'],
    ['единиц|а|ы', 'единиц'],
    ['цвет|ок|ка|ков', 'цветков'],
    ['год|года|лет', 'лет'],
    ['день|дня|дней', 'дней'],
    ['сот(ня|ни|ен)', 'сотен'],
    ['месяц(а|ов)', 'месяцов'],
    ['\\(Хорд(а|ы):\\)', '\\(Хорды:\\)'],
  ])('%s → %s', (input, expected) => {
    expect(resolveWordForms(input)).toBe(expected)
  })

  it('keeps the rest of the sentence', () => {
    expect(resolveWordForms('Ему 7 год|года|лет.')).toBe('Ему 7 лет.')
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
