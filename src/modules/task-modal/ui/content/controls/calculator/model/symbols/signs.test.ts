import { describe, expect, it } from 'vitest'

import { MAIN } from './main'
import { keyboardForTask, keySetForTask } from './signs'
import { TASK_KEY_SETS } from './task-keys'

const titles = (keys: { title: string }[]) => keys.map((k) => k.title)

describe('signs — which task gets which keys', () => {
  it('grades 0–4 keep the released keyboard, key for key', () => {
    const young = Object.values(TASK_KEY_SETS)
      .flat()
      .filter((k) => Number(k.split('_')[0]) < 5)
    expect(young).toEqual([])
    for (const t of ['Task_4_1_3', 'Elixir.Task_4_2_10_1', '4_11_10_4']) {
      const kb = keyboardForTask(t)
      expect(kb.set).toBeNull()
      expect(kb.main).toBe(MAIN)
      expect(kb.extra).toBeNull()
    }
  })

  it('no task, an unknown task — the released keyboard', () => {
    expect(keyboardForTask(undefined).main).toBe(MAIN)
    expect(keyboardForTask('Task_99_1_1').extra).toBeNull()
  })

  it('a task is in one set at most', () => {
    const all = Object.values(TASK_KEY_SETS).flat()
    expect(new Set(all).size).toBe(all.length)
  })

  it('interval: ( [ ] ) ∞ ∪ π in the digits page, { } ∅ √ log ± after it', () => {
    // Task_10_1_10_1: «y↑, x ∈ …», reference (−∞; +∞)
    for (const t of ['Task_10_1_10_1', 'Elixir.Task_10_1_10_1', '10_1_10_1']) {
      expect(keySetForTask(t)).toBe('interval')
    }
    const kb = keyboardForTask('Task_6_5_63_7') // union
    expect(titles(kb.extra!)).toEqual([
      '{',
      '}',
      '∅',
      '√',
      'Delete',
      'log',
      '±',
    ])
    expect(titles(kb.main)).toEqual([
      '(', '[', ']', ')', 'Delete',
      'x/y', '7', '8', '9', '÷',
      '∞', '4', '5', '6', '×',
      '∪', '1', '2', '3', '-',
      'π', ';', '0', ',', '+',
    ]) // prettier-ignore
    // digits, the operator column, x/y, «;» and «,» are the released ones
    const kept = kb.main.filter((k) => MAIN.includes(k))
    expect(kept).toHaveLength(18)
  })

  it('trigonometry: the digits page as released, then a signs page', () => {
    const kb = keyboardForTask('Task_9_4_18_9')
    expect(kb.set).toBe('trigonometry')
    expect(kb.main).toBe(MAIN)
    expect(titles(kb.extra!)).toEqual([
      'sin', 'cos', 'tg', 'ctg', 'Delete',
      'arcsin', 'arccos', 'arctg', 'arcctg', 'xⁿ',
      'π', '√', 'ⁿ√', '°', '±',
    ]) // prettier-ignore
  })

  it('what the keys write — the form the backend accepts', () => {
    const latex = Object.fromEntries(
      [
        ...keyboardForTask('Task_6_5_63_7').main,
        ...keyboardForTask('Task_6_5_63_7').extra!,
        ...keyboardForTask('Task_9_4_18_9').extra!,
      ].map((k) => [k.title, k.latex]),
    )
    expect(latex).toMatchObject({
      '(': '(',
      '[': '[',
      ']': ']',
      ')': ')',
      '∞': '\\infty',
      '∪': '\\cup',
      π: '\\pi',
      '∅': '\\varnothing',
      sin: '\\sin',
      tg: 'tg',
      ctg: 'ctg',
      arctg: '\\operatorname{arctg}',
      '°': '^{\\circ}',
      xⁿ: '^{}',
    })
  })

  it('vector, degree, root: a small signs page after the digits', () => {
    expect(titles(keyboardForTask('Task_6_7_8').extra!)).toEqual([
      'a⃗',
      'Delete',
    ])
    // 13_3_7_8: «90^\\circ» — the angle between two lines
    expect(titles(keyboardForTask('Task_13_3_7_8').extra!)).toEqual([
      '°',
      'Delete',
    ])
    // 5_8_7_25 the backend of 23.11 answers 100;;130;;50;;80, no degree sign
    expect(keyboardForTask('Task_5_8_7_25').set).toBeNull()
    expect(titles(keyboardForTask('Task_8_2_4_4').extra!)).toEqual([
      '√', 'ⁿ√', 'xⁿ', '±', 'Delete',
    ]) // prettier-ignore
  })

  it('π, a logarithm, an interval with arctg — sets by the backend samples', () => {
    // C = 2πR, grade 6: π alone, no sin and arctg beside it
    expect(titles(keyboardForTask('Task_6_9_11_3').extra!)).toEqual([
      'π',
      'Delete',
    ])
    // x = −π/3 + 2πk: grade 10 gets the functions too
    expect(keyboardForTask('Task_10_4_1_10').set).toBe('trigonometry')
    expect(keyboardForTask('Task_8_2_4_4').set).toBe('root') // √29; −√29
    expect(titles(keyboardForTask('Task_11_7_6_9').extra!)).toEqual([
      'log', 'xⁿ', '√', 'ⁿ√', 'Delete', '|',
    ]) // prettier-ignore
    // 7ln|x| + C: ln from the letters, the bars from the log page
    expect(keyboardForTask('Task_11_6_7_1').set).toBe('log')
    const trigInterval = keyboardForTask('Task_10_4_12_10') // (−π/4 + πk; arctg 7 + πk)
    expect(trigInterval.main).toEqual(keyboardForTask('Task_6_5_63_7').main)
    expect(titles(trigInterval.extra!)).toContain('arctg')
    // a graph on the plane is drawn, not typed
    expect(keyboardForTask('Task_11_6_4_1').set).toBeNull()
  })

  it('beyond keys:* of the stand — the signs every generator of 5–13 answers with', () => {
    // grade 8 roots: 6√3, √29; −√29
    expect(keyboardForTask('Task_8_2_4_25').set).toBe('root')
    // grade 7 powers: c¹⁹, a⁴
    expect(keyboardForTask('Task_7_1_21_1').set).toBe('root')
    expect(keyboardForTask('Task_7_1_3_3').set).toBe('root')
    // [2; 5) and ∅ without ∞
    expect(keyboardForTask('Task_11_4_5_11').set).toBe('interval')
    expect(keyboardForTask('Task_6_4_10_6').set).toBe('interval')
    // |x| ≤ 12, x ≥ 6,3: the released < > stay, ≤ ≥ | after the digits
    const cmp = keyboardForTask('Task_6_5_65_2')
    expect(cmp.set).toBe('compare')
    expect(cmp.main).toBe(MAIN)
    expect(titles(cmp.extra!)).toEqual(['≤', '≥', '|', 'Delete'])
    // a matrix is not typed with keys; a curve on the plane is drawn
    expect(keyboardForTask('Task_13_2_0_0').set).toBeNull()
    expect(keyboardForTask('Task_11_5_5_13').set).toBeNull()
  })
})
