import { afterEach, describe, expect, it, vi } from 'vitest'

import type { MathInputRef } from '@/ui/math-input/types'

import { findFieldInput, typesOnPhysicalKeyboard } from './use-input-focus'

const input = (id: string): MathInputRef => ({
  id,
  insertSymbol: vi.fn(),
  setLatex: vi.fn(),
  getLatex: () => '',
  writeOnCursorPosition: vi.fn(),
  focus: vi.fn(),
})

const field = (id: string) => {
  const el = document.createElement('span')
  el.id = id
  el.setAttribute('data-input', '')
  return el
}

describe('findFieldInput', () => {
  it('finds a single-field input keyed «default» by its own DOM id (2.5.7)', () => {
    // set-math-input-ref.ts keys a template without ids «default»; the
    // lookup by the DOM id missed it and the field was never focused.
    const only = input('«r5»')
    const map = new Map([['default', only]])

    expect(map.get('«r5»')).toBeUndefined()
    expect(findFieldInput(map, field('«r5»'))).toBe(only)
  })

  it('keeps the lookup by key for multi-field templates', () => {
    const first = input('field-0')
    const second = input('field-1')
    const map = new Map([
      ['field-0', first],
      ['field-1', second],
    ])

    expect(findFieldInput(map, field('field-1'))).toBe(second)
  })

  it('finds nothing for a field without an input', () => {
    const map = new Map([['default', input('«r5»')]])
    expect(findFieldInput(map, field('«r9»'))).toBeUndefined()
  })
})

describe('typesOnPhysicalKeyboard', () => {
  // jsdom has no matchMedia: the device is what the stub says.
  const setPointer = (fine: boolean) =>
    vi.stubGlobal(
      'matchMedia',
      (query: string) =>
        ({
          matches: query === '(pointer: fine)' && fine,
          media: query,
        }) as MediaQueryList,
    )

  afterEach(() => {
    vi.unstubAllGlobals()
    delete (window as { ontouchstart?: unknown }).ontouchstart
  })

  it('a mouse or a trackpad: the computer keyboard types', () => {
    setPointer(true)
    ;(window as { ontouchstart?: unknown }).ontouchstart = null
    expect(typesOnPhysicalKeyboard()).toBe(true)
  })

  it('a phone: a coarse pointer and touch — its own keyboard, as before', () => {
    setPointer(false)
    ;(window as { ontouchstart?: unknown }).ontouchstart = null
    expect(typesOnPhysicalKeyboard()).toBe(false)
  })

  it('no touch at all: the computer keyboard types', () => {
    setPointer(false)
    expect('ontouchstart' in window).toBe(false)
    expect(typesOnPhysicalKeyboard()).toBe(true)
  })
})
