import { describe, expect, it } from 'vitest'

import { normalizeOperatorSigns as n } from './normalize-operator-signs'

const M = '−'
const X = '×'

describe('normalizeOperatorSigns', () => {
  // Strings below are taken from the rendered text of whitelisted tasks.
  it('turns a spaced hyphen between numbers into a minus', () => {
    expect(n('(54009 - 36865) · 4 =')).toBe(`(54009 ${M} 36865) ${X} 4 =`)
    expect(n('469 - 5688 :')).toBe(`469 ${M} 5688 :`)
    expect(n(') - 21 = 92')).toBe(`) ${M} 21 = 92`)
  })

  it('turns a spaced hyphen after a unit into a minus', () => {
    expect(n('12 дм - 1065 мм =')).toBe(`12 дм ${M} 1065 мм =`)
    expect(n('39 месяцев 436 дней - 125 недель =')).toBe(
      `39 месяцев 436 дней ${M} 125 недель =`,
    )
    expect(n('60 т 74319 кг - 660 ц =')).toBe(`60 т 74319 кг ${M} 660 ц =`)
    expect(n('8 га - 260 а =')).toBe(`8 га ${M} 260 а =`)
    expect(n('7 ч 617 минут 2945 секунд - 3 ч =')).toBe(
      `7 ч 617 минут 2945 секунд ${M} 3 ч =`,
    )
    expect(n('436 күн - 125 апта')).toBe(`436 күн ${M} 125 апта`)
  })

  it('turns a hyphen after an ordinary word into a prose dash, not a minus', () => {
    expect(n('а в Санкт-Петербург - 7887 студентов.')).toBe(
      'а в Санкт-Петербург — 7887 студентов.',
    )
    expect(n('а во второй день - 460110 кг моркови.')).toBe(
      'а во второй день — 460110 кг моркови.',
    )
    expect(n('из другой - 10 ведер воды')).toBe('из другой — 10 ведер воды')
    expect(n('1 килограмм картофеля - 130 тенге.')).toBe(
      '1 килограмм картофеля — 130 тенге.',
    )
  })

  it('turns dots and asterisks between operands into times', () => {
    expect(n('81224 − 8858 · 2 =')).toBe(`81224 − 8858 ${X} 2 =`)
    expect(n('28773 ⋅ 4 - 115425 : 3 =')).toBe(`28773 ${X} 4 ${M} 115425 : 3 =`)
    expect(n('60 : (4 · 5) =')).toBe(`60 : (4 ${X} 5) =`)
    expect(n('x - (966 - 740) = (807 - 731) · 5')).toBe(
      `x ${M} (966 ${M} 740) = (807 ${M} 731) ${X} 5`,
    )
  })

  it('handles a sign that stands alone in a label between fields', () => {
    expect(n('-')).toBe(M)
    expect(n(' - ')).toBe(` ${M} `)
    expect(n('·')).toBe(X)
    expect(n('*')).toBe(X)
  })

  it('handles a sign at the edge of a label next to a field', () => {
    expect(n('- 14')).toBe(`${M} 14`)
    expect(n('+ 39 -')).toBe(`+ 39 ${M}`)
    expect(n('изд./ч *')).toBe(`изд./ч ${X}`)
  })

  it('long dash in prose, hyphens inside words stay', () => {
    expect(
      n('население Березники 1578700 человек, Нижневартовска – 254500 человек'),
    ).toBe(
      'население Березники 1578700 человек, Нижневартовска — 254500 человек',
    )
    expect(n('Белые овцы – 3')).toBe('Белые овцы — 3')
    expect(n('а второй – 5 недель')).toBe('а второй — 5 недель')
    expect(n('сот.6-й, дес.5-й')).toBe('сот.6-й, дес.5-й')
    expect(n('2022-жылы')).toBe('2022-жылы')
    expect(n('5-7 лет')).toBe('5-7 лет')
    // place-value headers: both classes stay alike
    expect(n('II - класс')).toBe('II - класс')
    expect(n('I - класс')).toBe('I - класс')
  })

  it('turns a lone slash between fields into ÷, keeps fractions and units', () => {
    expect(n('/')).toBe('÷')
    expect(n(' / ')).toBe(' ÷ ')
    expect(n('1/2')).toBe('1/2')
    expect(n('80 км/ч')).toBe('80 км/ч')
  })

  it('writes tenge as ₸ next to a number, keeps the word', () => {
    expect(n('500 тг')).toBe('500 ₸')
    expect(n('500тг')).toBe('500₸')
    expect(n('тг')).toBe('₸')
    expect(n('цена 20 тг.')).toBe('цена 20 ₸.')
    expect(n('у Асана 300 тенге')).toBe('у Асана 300 тенге')
    expect(n('тгх')).toBe('тгх')
  })

  it('inside math islands only turns \\\\cdot into \\\\times', () => {
    expect(n('\\(3 - 2 \\cdot 4\\) - 1')).toBe(`\\(3 - 2 \\times  4\\) ${M} 1`)
    expect(n('\\(8 · 10\\)')).toBe('\\(8 \\times  10\\)')
    expect(n('\\(a \\cdotp b\\)')).toBe('\\(a \\cdotp b\\)')
  })

  it('is idempotent', () => {
    const once = n('(54009 - 36865) · 4 =')
    expect(n(once)).toBe(once)
  })
})
