import { describe, expect, it } from 'vitest'

import { getRevealScrollTop } from './reveal-in-container'

const box = (top: number, height: number) => ({
  top,
  bottom: top + height,
  height,
})

describe('getRevealScrollTop', () => {
  const area = box(100, 120)

  it('leaves a fully visible field alone', () => {
    expect(getRevealScrollTop(area, box(130, 48), 0)).toBeNull()
    expect(getRevealScrollTop(area, box(100, 120), 40)).toBeNull()
  })

  it('centres a field below the visible part', () => {
    // field 200px below the area top; area 120, field 48 → 36px above it
    expect(getRevealScrollTop(area, box(300, 48), 0)).toBe(164)
  })

  it('centres a field cut by the bottom edge', () => {
    expect(getRevealScrollTop(area, box(200, 48), 10)).toBe(74)
  })

  it('centres a field above the visible part', () => {
    expect(getRevealScrollTop(area, box(20, 48), 200)).toBe(84)
  })

  it('aligns a field taller than the area to its top', () => {
    expect(getRevealScrollTop(area, box(260, 160), 0)).toBe(160)
  })
})
