import { describe, expect, it } from 'vitest'

import { MAIN } from './main'
import { keyboardForTask, keySetForTask } from './signs'
import { TASK_KEY_SETS } from './task-keys'

const titles = (keys: { title: string }[]) => keys.map((k) => k.title)

describe('signs — which task gets which keys', () => {
  it('grade 4 keeps the released keyboard, key for key', () => {
    const grade4 = Object.values(TASK_KEY_SETS)
      .flat()
      .filter((k) => k.startsWith('4_'))
    expect(grade4).toEqual([])
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

  it('interval: ( [ ] ) ∞ ∪ π in the digits page, { } ∅ √ log after it', () => {
    // Task_10_1_10_1: «y↑, x ∈ …», reference (−∞; +∞)
    for (const t of ['Task_10_1_10_1', 'Elixir.Task_10_1_10_1', '10_1_10_1']) {
      expect(keySetForTask(t)).toBe('interval')
    }
    const kb = keyboardForTask('Task_6_5_63_7') // union
    expect(titles(kb.extra!)).toEqual(['{', '}', '∅', '√', 'Delete', 'log'])
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
      'π', '√', 'ⁿ√', '°',
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
    expect(titles(keyboardForTask('Task_5_8_7_25').extra!)).toEqual([
      '°',
      'Delete',
    ])
    expect(keyboardForTask('Task_13_4_10_10').set).toBe('root')
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
      'log',
      'Delete',
    ])
    const trigInterval = keyboardForTask('Task_10_4_12_10') // (−π/4 + πk; arctg 7 + πk)
    expect(trigInterval.main).toEqual(keyboardForTask('Task_6_5_63_7').main)
    expect(titles(trigInterval.extra!)).toContain('arctg')
    // a graph on the plane is drawn, not typed
    expect(keyboardForTask('Task_11_6_4_1').set).toBeNull()
  })
})
