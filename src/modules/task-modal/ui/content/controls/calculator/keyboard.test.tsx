import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Keyboard } from './keyboard'
import { CALC_MODE } from './model/constants'
import { MAIN } from './model/symbols/main'

const setup = () => {
  const onKeyPress = vi.fn()
  render(<Keyboard keys={MAIN} mode={CALC_MODE.MAIN} onKeyPress={onKeyPress} />)
  const zero = screen.getByRole('button', { name: '0' })
  const typed = () =>
    onKeyPress.mock.calls.map(([key]) => (key as { title: string }).title)
  return { zero, typed }
}

const tap = (el: HTMLElement, { click = true, dx = 0, id = 1 } = {}) => {
  fireEvent.pointerDown(el, {
    pointerType: 'touch',
    pointerId: id,
    clientX: 10,
    clientY: 10,
  })
  fireEvent.pointerUp(el, {
    pointerType: 'touch',
    pointerId: id,
    clientX: 10 + dx,
    clientY: 10,
  })
  if (click) fireEvent.click(el, { detail: 1 })
}

describe('Keyboard — taps', () => {
  it('types every tap of one key, the clicks iOS drops included', () => {
    const { zero, typed } = setup()
    // eight quick taps; iOS sends a click only for every other one
    for (let i = 0; i < 8; i += 1) tap(zero, { click: i % 2 === 0 })
    expect(typed()).toEqual(Array(8).fill('0'))
  })

  it('does not type a tap twice when its click does come', () => {
    const { zero, typed } = setup()
    tap(zero)
    expect(typed()).toEqual(['0'])
  })

  it('types nothing for a finger that slid — a swipe between the pages', () => {
    const { zero, typed } = setup()
    tap(zero, { click: false, dx: 40 })
    expect(typed()).toEqual([])
  })

  it('a mouse click and Enter on a focused key type once each', () => {
    const { zero, typed } = setup()
    fireEvent.pointerDown(zero, { pointerType: 'mouse' })
    fireEvent.pointerUp(zero, { pointerType: 'mouse' })
    fireEvent.click(zero, { detail: 1 })
    // keyboard activation: a click with detail 0, right after a tap too
    tap(zero, { click: false })
    fireEvent.click(zero, { detail: 0 })
    expect(typed()).toEqual(['0', '0', '0'])
  })
})
