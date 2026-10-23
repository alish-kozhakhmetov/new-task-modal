import { afterEach, describe, expect, it } from 'vitest'

import '../../../.storybook/jquery-global'
import '@edtr-io/mathquill/build/mathquill.js'

import {
  classGapsAfter,
  DIGIT_GAP_ATTR,
  groupFieldDigits,
  observeFieldDigits,
  showClassGaps,
} from './group-field-digits'

describe('classGapsAfter — classes of three as the pupil types', () => {
  it.each([
    ['1234', '1234'],
    ['12345', '12 345'],
    ['123456', '123 456'],
    ['1234567', '1 234 567'],
    ['50000', '50 000'],
    ['12345,678', '12 345,678'],
    ['12345.678', '12 345.678'],
    // «−12345»: the minus is a symbol of its own
    ['x12345', 'x12 345'],
    ['12345x67890', '12 345x67 890'],
  ])('%s → %s', (typed, shown) => {
    expect(showClassGaps(typed, 5)).toBe(shown)
  })

  it('leaves the fraction part solid, however long', () => {
    expect(showClassGaps('3,1415926', 5)).toBe('3,1415926')
    expect(showClassGaps('12345,1234567', 5)).toBe('12 345,1234567')
    expect(showClassGaps(',12345', 5)).toBe(',12345')
  })

  it('groups four digits where the column asks for it (from 4)', () => {
    expect(showClassGaps('5825', 4)).toBe('5 825')
  })

  it('returns the indexes in order', () => {
    expect(classGapsAfter('1234567', 5)).toEqual([0, 3])
  })
})

type Field = {
  typedText: (text: string) => void
  keystroke: (key: string) => void
  latex: (latex?: string) => string
  select: () => void
  write: (latex: string) => void
}

const mountField = () => {
  const el = document.createElement('span')
  document.body.append(el)
  const MQ = window.MathQuill.getInterface(2) as unknown as {
    MathField: (el: HTMLElement, config: unknown) => Field
  }
  const field = MQ.MathField(el, {})
  return { el, field }
}

const type = (field: Field, text: string) => {
  for (const ch of text) field.typedText(ch)
}

/** The field as it reads: digits, a space where the gap is. */
const shown = (el: HTMLElement) => {
  const root = el.querySelector('.mq-root-block')
  if (!root) return ''
  const parts: string[] = []
  root.querySelectorAll('[mathquill-command-id]').forEach((node) => {
    if (node.childElementCount > 0) return
    parts.push(node.textContent ?? '')
    if (node.hasAttribute(DIGIT_GAP_ATTR)) parts.push(' ')
  })
  return parts.join('')
}

/** MutationObserver callbacks run as microtasks — before the next paint. */
const flush = () => Promise.resolve()

describe('groupFieldDigits on a MathQuill field', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('marks the class ends, the value stays solid', async () => {
    const { el, field } = mountField()
    const stop = observeFieldDigits(el, () => 5)

    type(field, '5000')
    await flush()
    expect(shown(el)).toBe('5000')

    type(field, '0')
    await flush()
    expect(shown(el)).toBe('50 000')
    expect(field.latex()).toBe('50000')
    expect(el).not.toHaveTextContent(/\s/)

    type(field, '00')
    await flush()
    expect(shown(el)).toBe('5 000 000')
    expect(field.latex()).toBe('5000000')
    stop()
  })

  it('⌫ in the middle regroups; the caret moves by digits', async () => {
    const { el, field } = mountField()
    const stop = observeFieldDigits(el, () => 5)
    type(field, '1234567')
    await flush()
    expect(shown(el)).toBe('1 234 567')

    // caret between the classes «1 234 | 567»: three steps left
    for (let i = 0; i < 3; i += 1) field.keystroke('Left')
    await flush()
    const cursor = el.querySelector('.mq-cursor')
    expect(cursor?.previousElementSibling).toHaveTextContent(/^4$/)
    expect(cursor?.previousElementSibling?.hasAttribute(DIGIT_GAP_ATTR)).toBe(
      true,
    )

    field.keystroke('Backspace')
    await flush()
    expect(field.latex()).toBe('123567')
    expect(shown(el)).toBe('123 567')

    field.keystroke('Backspace')
    await flush()
    expect(shown(el)).toBe('12 567')

    // four digits — solid again
    field.keystroke('Backspace')
    await flush()
    expect(shown(el)).toBe('1567')
    expect(field.latex()).toBe('1567')
    stop()
  })

  it('a selection keeps its gaps and is replaced as a whole', async () => {
    const { el, field } = mountField()
    const stop = observeFieldDigits(el, () => 5)
    type(field, '50000')
    field.select()
    await flush()
    expect(el.querySelector('.mq-selection')).not.toBeNull()
    expect(shown(el)).toBe('50 000')

    type(field, '7')
    await flush()
    expect(field.latex()).toBe('7')
    expect(shown(el)).toBe('7')
    stop()
  })

  it('a paste or latex() regroups', async () => {
    const { el, field } = mountField()
    const stop = observeFieldDigits(el, () => 5)
    field.latex('8201794')
    await flush()
    expect(shown(el)).toBe('8 201 794')
    field.write('5')
    await flush()
    expect(shown(el)).toBe('82 017 945')
    stop()
  })

  it('fraction part, minus and the floors of a fraction', async () => {
    const { el, field } = mountField()
    const stop = observeFieldDigits(el, () => 5)
    field.latex('-12345,678')
    await flush()
    expect(shown(el)).toBe('−12 345,678')

    field.latex('\\frac{12345}{100000}')
    await flush()
    const floors = [...el.querySelectorAll('.mq-numerator, .mq-denominator')]
    expect(
      floors.map((f) => f.querySelectorAll(`[${DIGIT_GAP_ATTR}]`).length),
    ).toEqual([1, 1])
    expect(field.latex()).toBe('\\frac{12345}{100000}')
    stop()
  })

  it('switched off (null) — no gaps, and the old ones go', async () => {
    const { el, field } = mountField()
    let from: number | null = 5
    const stop = observeFieldDigits(el, () => from)
    type(field, '12345')
    await flush()
    expect(shown(el)).toBe('12 345')

    from = null
    groupFieldDigits(el, from)
    expect(shown(el)).toBe('12345')
    type(field, '6')
    await flush()
    expect(shown(el)).toBe('123456')
    stop()
  })
})
