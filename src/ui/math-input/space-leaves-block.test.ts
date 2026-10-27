import { describe, expect, it } from 'vitest'

import { spaceLeavesBlock } from './space-leaves-block'

/** MathQuill's markup of a field, as it draws it (edtr-io and 0.10.1). */
const field = (html: string) => {
  const el = document.createElement('span')
  el.innerHTML = `<span class="mq-root-block">${html}</span>`
  return el
}

const CARET = '<span class="mq-cursor">&#8203;</span>'
const open = '<span class="mq-scaled mq-paren">(</span>'
const close = '<span class="mq-scaled mq-paren">)</span>'

describe('spaceLeavesBlock', () => {
  it('not out of brackets: «(a| + b)» stays «(a+b)»', () => {
    const el = field(
      `<span class="mq-non-leaf">${open}<span class="mq-non-leaf"><var>a</var>${CARET}</span>${close}</span>`,
    )
    expect(spaceLeavesBlock(el)).toBe(false)
  })

  it('out of a fraction: «1/2| + 3» is ½ + 3', () => {
    const el = field(
      `<span class="mq-fraction mq-non-leaf"><span class="mq-numerator"><span>1</span></span><span class="mq-denominator"><span>2</span>${CARET}</span></span>`,
    )
    expect(spaceLeavesBlock(el)).toBe(true)
  })

  it('out of a fraction inside brackets', () => {
    const el = field(
      `<span class="mq-non-leaf">${open}<span class="mq-non-leaf"><span class="mq-fraction mq-non-leaf"><span class="mq-numerator"><span>1</span></span><span class="mq-denominator">${CARET}</span></span></span>${close}</span>`,
    )
    expect(spaceLeavesBlock(el)).toBe(true)
  })

  it('nothing to leave in the field itself, or without a caret', () => {
    expect(spaceLeavesBlock(field(`<var>a</var>${CARET}`))).toBe(false)
    expect(spaceLeavesBlock(field('<var>a</var>'))).toBe(false)
    expect(spaceLeavesBlock(null)).toBe(false)
  })
})
