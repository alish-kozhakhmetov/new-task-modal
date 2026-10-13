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

describe('word forms in other languages (Intl.PluralRules)', () => {
  it('Russian keeps one|few|many: 1/3/5/11/21/2,5', () => {
    resolveWordForms('год|года|лет', 'russian')
    const w = wordFormsOf('лет')!
    expect(
      ['1', '3', '5', '11', '21', '2,5'].map((v) => pickWordForm(w, v)),
    ).toEqual(['год', 'года', 'лет', 'лет', 'год', 'года'])
  })

  it('English reads two forms as one|other: 1/2/0/1.5', () => {
    expect(resolveWordForms('3 year|years', 'english')).toBe(`3 years${M}`)
    const w = wordFormsOf('years')!
    expect(['1', '2', '0', '1.5', ''].map((v) => pickWordForm(w, v))).toEqual([
      'year',
      'years',
      'years',
      'years',
      'years',
    ])
  })

  it('Kazakh does not inflect after numbers: one form, forms → the first', () => {
    expect(resolveWordForms('5 күн', 'kk-cyrillic')).toBe('5 күн')
    expect(resolveWordForms('күн|күндер', 'kk-cyrillic')).toBe(`күн${M}`)
    const w = wordFormsOf('күн')!
    expect(['1', '3', '5'].map((v) => pickWordForm(w, v))).toEqual([
      'күн',
      'күн',
      'күн',
    ])
  })

  it('Latin letters of Uzbek and Azerbaijani are words too', () => {
    expect(resolveWordForms('gün|günlər', 'azerbaijani')).toBe(`gün${M}`)
    expect(resolveWordForms("o'n|o'nlar", 'uzbek')).toBe(`o'n${M}`)
  })

  it('Arabic is left as written', () => {
    expect(resolveWordForms('يوم|أيام', 'ar-eg')).toBe('يوم|أيام')
  })

  it('mixed strings: only the marked words change', () => {
    expect(
      resolveWordForms('Прошло 3 день|дня|дней и 2 часа, |АВ| = 4', 'russian'),
    ).toBe(`Прошло 3 дней${M} и 2 часа, |АВ| = 4`)
    expect(resolveWordForms('It took day|days, a|b stays', 'english')).toBe(
      `It took days${M}, a|b stays`,
    )
  })

  it('a bracket without a stem keeps its brackets (data must change)', () => {
    expect(resolveWordForms('(год|года|лет)', 'russian')).toBe(`(лет${M})`)
  })

  it('forms that do not match the categories fall back to the last', () => {
    resolveWordForms('mile|miles|milez', 'english')
    const w = wordFormsOf('milez')!
    expect(pickWordForm(w, '1')).toBe('mile')
    expect(pickWordForm(w, '4')).toBe('milez')
  })
})
