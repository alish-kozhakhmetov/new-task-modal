import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NumberLinePart } from './number-line-part'

const labels = (part: Parameters<typeof NumberLinePart>[0]['part']) => {
  const { container } = render(<NumberLinePart part={part} />)
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  return [...container.querySelectorAll('text')].map((t) => t.textContent)
}

describe('NumberLinePart', () => {
  it('labels below zero carry a real minus, not a hyphen (rule 34)', () => {
    const texts = labels({
      type: 20,
      minPosition: -3,
      maxPosition: 2,
      numbers: [{ position: -3 }, { position: -1 }, { position: 2 }],
      dots: [{ position: -2, withNumber: true }],
    })
    expect(texts).toEqual(expect.arrayContaining(['−3', '−1', '2', '−2']))
    expect(texts.some((t) => t?.includes('-'))).toBe(false)
  })
})
