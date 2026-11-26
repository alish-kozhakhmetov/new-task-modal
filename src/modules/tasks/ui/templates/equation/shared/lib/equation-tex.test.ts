import { describe, expect, it } from 'vitest'

import allTasks from '../../ui/before/data/all-tasks.json'

import { toEquationTex } from './equation-tex'

const rus = (value: unknown) =>
  typeof value === 'string' ? value : ((value as { rus?: string }).rus ?? '')

describe('toEquationTex', () => {
  it('голый TeX 5–11 класса уходит в MathJax целиком', () => {
    expect(toEquationTex('y = 2.25\\cos{ x }')).toBe('\\(y = 2.25\\cos{ x }\\)')
    expect(toEquationTex('2x^4 + 9x^3 = 0')).toBe('\\(2x^4 + 9x^3 = 0\\)')
    expect(toEquationTex('a_n = \\dfrac{n^2 - 3}{n}')).toBe(
      '\\(a_n = \\dfrac{n^2 - 3}{n}\\)',
    )
  })

  it('умножение точкой внутри TeX — ×', () => {
    expect(toEquationTex('5z·z^4')).toBe('\\(5z\\times z^4\\)')
  })

  it('условие с готовым островом и арифметика без TeX — как есть', () => {
    expect(toEquationTex('\\(x\\) + 25 = 67')).toBe('\\(x\\) + 25 = 67')
    expect(toEquationTex('353 + x = 804 · 4 + 726')).toBe(
      '353 + x = 804 · 4 + 726',
    )
  })

  it('все 40 условий 4 класса (equation.before) не меняются ни на байт', () => {
    const contents = (
      allTasks as unknown as {
        byGrade: Record<
          string,
          { task: { description: { content: unknown } } }[]
        >
      }
    ).byGrade['4'].map(({ task }) => rus(task.description.content))
    expect(contents).toHaveLength(40)
    for (const content of contents) expect(toEquationTex(content)).toBe(content)
  })
})
