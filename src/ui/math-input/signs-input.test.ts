import { afterEach, describe, expect, it } from 'vitest'

import '../../../.storybook/jquery-global'
import '@edtr-io/mathquill/build/mathquill.js'

import { LETTERS } from '@/modules/task-modal/ui/content/controls/calculator/model/symbols/letters'
import { keyboardForTask } from '@/modules/task-modal/ui/content/controls/calculator/model/symbols/signs'

import { insertSymbolToMathField, MATHQUILL_CONFIG } from './model'
import type { MathField } from './types'

/**
 * The signs keys (grades 5–13) through the keyboard's own path into a real
 * MathQuill field. The latex here is what the window sends; that the backend
 * accepts it was checked by its own TaskChecker on 3 915 sampled references
 * of 783 generators (scripts/keys/README.md) — these pin the form that passed.
 */
type Field = MathField & { typedText: (t: string) => void }

const field = (): Field => {
  const el = document.createElement('span')
  document.body.appendChild(el)
  return window.MathQuill.getInterface(2).MathField(el, {
    ...MATHQUILL_CONFIG,
  }) as unknown as Field
}

/** Press keys by their title on the task's keyboard, as the pupil sees them. */
const press = (task: string, f: Field, ...titles: string[]) => {
  const kb = keyboardForTask(task)
  const keys = [...LETTERS, ...kb.main, ...(kb.extra ?? [])]
  for (const t of titles) {
    if (t === '→') {
      insertSymbolToMathField(f, 'Right')
      continue
    }
    const k = keys.find((s) => s.title === t)
    if (!k) throw new Error(`no key «${t}» in ${task}`)
    insertSymbolToMathField(f, k ? (k.latex ?? k.title) : t)
  }
  return f.latex()
}

const INTERVAL = 'Task_6_5_49_4'
const UNION = 'Task_6_5_63_7'
const TRIG = 'Task_9_4_18_9'

describe('signs keys → the latex the window sends', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('an interval, brackets mixed: (−∞; −3,5]', () => {
    expect(
      press(INTERVAL, field(), '(', '-', '∞', ';', '-', '3', ',', '5', ']'),
    ).toBe('(-\\infty;-3,5]')
  })

  it('a union: (−∞; −1] ∪ [1; +∞)', () => {
    expect(
      press(UNION, field(), '(', '-', '∞', ';', '-', '1', ']', '∪', '[', '1', ';', '+', '∞', ')'),
    ).toBe('(-\\infty;-1]\\cup[1;+\\infty)') // prettier-ignore
  })

  it('a fraction of π in an interval: [−π/2; 0]', () => {
    expect(
      press('Task_10_2_7_1', field(), '[', '-', 'x/y', 'π', '→', '2', '→', ';', '0', ']'),
    ).toBe('[-\\frac{\\pi}{2};0]') // prettier-ignore
  })

  it('the computer keyboard: brackets typed, ∞ from our key', () => {
    const f = field()
    f.typedText('(-')
    press(INTERVAL, f, '∞')
    f.typedText(';5]')
    // MathQuill pairs typed brackets — \left( … \right]; the backend drops
    // \left and \right before it compares
    expect(f.latex()).toBe('\\left(-\\infty;5\\right]')
  })

  it('trigonometry: tg 2α, sin³α, cos 30°', () => {
    expect(press(TRIG, field(), 'tg', '2', 'α')).toBe('tg2\\alpha')
    expect(press(TRIG, field(), '4', 'sin', 'x³', 'α')).toBe('4\\sin^3\\alpha')
    expect(press(TRIG, field(), 'cos', '3', '0', '°')).toBe('\\cos30^{\\circ}')
    expect(press(TRIG, field(), 'ctg', 'x')).toBe('\\operatorname{ctg}x')
    expect(press(TRIG, field(), 'arctg', 'x')).toBe('\\operatorname{arctg}x')
  })

  it('xⁿ and ⁿ√: x⁴, the fifth root of x⁴', () => {
    expect(press(TRIG, field(), 'x', 'xⁿ', '4', '→', '+', '1')).toBe('x^4+1')
    expect(press(TRIG, field(), 'ⁿ√', '5', '→', 'x', 'xⁿ', '4')).toBe(
      '\\sqrt[5]{x^4}',
    )
  })

  it('a vector: AB with the arrow', () => {
    const f = field()
    press('Task_6_7_8', f, 'a⃗')
    insertSymbolToMathField(f, 'A')
    insertSymbolToMathField(f, 'B')
    expect(f.latex()).toBe('\\overrightarrow{AB}')
  })

  it('no solutions: ∅ — \\varnothing, the only form the backend takes', () => {
    expect(press('Task_10_1_10_5', field(), '∅')).toBe('\\varnothing')
  })

  it('a logarithm with its base: (3; 2log₇6)', () => {
    // the system's pair in the released «( )» key, log₇ from the signs page
    expect(
      press('Task_11_7_6_9', field(), '( )', '3', ';', '2', 'log', '7', '→', '6'),
    ).toBe('(3;2\\log_76)')
  })

  it('π alone, grade 6: C = 2πR', () => {
    const f = field()
    press('Task_6_9_11_3', f, '2', 'π')
    f.typedText('R')
    expect(f.latex()).toBe('2\\pi R')
  })
})
