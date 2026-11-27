import { afterEach, describe, expect, it } from 'vitest'

import { spansLines } from './use-layout-flag'

/** An answer of pieces with their boxes: [top, bottom] each. */
const answerOf = (...pieces: Array<[number, number]>) => {
  const answer = document.createElement('span')
  for (const [top, bottom] of pieces) {
    const piece = document.createElement('mjx-container')
    piece.getClientRects = () =>
      [new DOMRect(0, top, 40, bottom - top)] as unknown as DOMRectList
    answer.append(piece, document.createTextNode(' ; '))
  }
  return answer
}

describe('spansLines', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('one line of values is one line', () => {
    expect(spansLines(answerOf([2, 20], [2, 20], [2, 20]))).toBe(false)
  })

  it('a fraction beside a number is one line: its box is taller, not lower', () => {
    expect(spansLines(answerOf([2, 20], [-8, 30]))).toBe(false)
  })

  it('a value that starts under the first is a second line', () => {
    expect(spansLines(answerOf([2, 20], [2, 20], [33, 51]))).toBe(true)
  })

  it('an empty answer is no line break', () => {
    expect(spansLines(document.createElement('span'))).toBe(false)
  })
})
