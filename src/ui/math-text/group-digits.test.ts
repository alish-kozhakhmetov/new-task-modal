import { describe, expect, it } from 'vitest'

import {
  digitClasses,
  groupDigitsInTex,
  splitDigitGroups,
} from './group-digits'

const flat = (text: string, from = 5) =>
  splitDigitGroups(text, from)
    .map((p) => (typeof p === 'string' ? p : `[${p.classes.join('|')}]`))
    .join('')

describe('rule 100: digit grouping', () => {
  it('splits into classes of three from the right', () => {
    expect(digitClasses('35784')).toEqual(['35', '784'])
    expect(digitClasses('8201794')).toEqual(['8', '201', '794'])
    expect(digitClasses('100000')).toEqual(['100', '000'])
  })

  it('groups five digits and more, leaves four solid', () => {
    expect(flat('В 2019 году 5825 и 35784 книги')).toBe(
      'В 2019 году 5825 и [35|784] книги',
    )
  })

  it('a table column lowers the threshold to four', () => {
    expect(flat('5825', 4)).toBe('[5|825]')
  })

  it('groups only the integer part of a decimal', () => {
    expect(flat('12345,0159 и 3,14159')).toBe('[12|345],0159 и 3,14159')
  })

  it('leaves numbers after «№» alone', () => {
    expect(flat('Задача №123456')).toBe('Задача №123456')
    expect(flat('Задача № 123456')).toBe('Задача № 123456')
  })

  it('normalises numbers the backend spaced with plain spaces', () => {
    expect(flat('6 000 000 и 75 834')).toBe('[6|000|000] и [75|834]')
    expect(flat('3 000 л')).toBe('3000 л')
  })

  it('does the same inside TeX with a fixed gap', () => {
    expect(groupDigitsInTex('800000 \\approx', 5)).toBe(
      '800\\hspace{0.14em}000 \\approx',
    )
    expect(groupDigitsInTex('75\\,834', 5)).toBe('75\\hspace{0.14em}834')
    expect(groupDigitsInTex('5825', 5)).toBe('5825')
    expect(groupDigitsInTex('12345,0159', 5)).toBe(
      '12\\hspace{0.14em}345,0159',
    )
  })
})
