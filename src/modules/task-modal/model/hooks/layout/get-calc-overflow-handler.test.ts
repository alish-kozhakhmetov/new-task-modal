import { describe, expect, it, vi } from 'vitest'

import type { OpenState } from '../use-open-state'

import {
  handleCalcOverflow,
  hasTaskContainerOverflow,
} from './get-calc-overflow-handler'
import type { TaskModalRefs } from './use-refs'

describe('hasTaskContainerOverflow', () => {
  it('is true when scrollHeight exceeds clientHeight', () => {
    const el = {
      clientHeight: 100,
      scrollHeight: 250,
    } as HTMLDivElement
    expect(hasTaskContainerOverflow(el)).toBe(true)
  })

  it('is false when content fits', () => {
    const el = {
      clientHeight: 200,
      scrollHeight: 200,
    } as HTMLDivElement
    expect(hasTaskContainerOverflow(el)).toBe(false)
  })
})

describe('handleCalcOverflow', () => {
  const makeRefs = (taskContainer: HTMLDivElement): TaskModalRefs => ({
    taskContainer: { current: taskContainer },
    root: { current: null },
    header: { current: null },
    calc: { current: null },
    actions: { current: null },
    mathInput: { current: null },
  })

  const makeCalc = (): OpenState & { isOpen: boolean } => {
    const state = { isOpen: true }
    return {
      get isOpen() {
        return state.isOpen
      },
      open: vi.fn(() => {
        state.isOpen = true
      }),
      close: vi.fn(() => {
        state.isOpen = false
      }),
    }
  }

  it('attaches listeners before closing on overflow and reopens on control click', () => {
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 100 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 400 })

    const control = document.createElement('span')
    control.setAttribute('data-control', '')
    taskContainer.appendChild(control)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({
      refs: makeRefs(taskContainer),
      calc,
    })

    expect(calc.close).toHaveBeenCalled()
    expect(calc.isOpen).toBe(false)

    control.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(calc.open).toHaveBeenCalled()

    cleanup()
    taskContainer.remove()
  })

  it('reopens calc on focusin of data-control when overflowing', () => {
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 100 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 400 })

    const control = document.createElement('span')
    control.setAttribute('data-control', '')
    control.tabIndex = 0
    taskContainer.appendChild(control)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({
      refs: makeRefs(taskContainer),
      calc,
    })

    expect(calc.isOpen).toBe(false)

    control.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(calc.open).toHaveBeenCalled()

    cleanup()
    taskContainer.remove()
  })
  it('keeps calc open when a press on a control is released past it', () => {
    // Focusing the field scrolls the task under the pointer: the release lands
    // elsewhere and the browser clicks the common ancestor.
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 100 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 400 })

    const stack = document.createElement('div')
    const control = document.createElement('span')
    control.setAttribute('data-control', '')
    stack.appendChild(control)
    taskContainer.appendChild(stack)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({
      refs: makeRefs(taskContainer),
      calc,
    })

    control.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(calc.isOpen).toBe(true)

    control.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    stack.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(calc.isOpen).toBe(true)

    // A press off the controls still hides it.
    stack.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    stack.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(calc.isOpen).toBe(false)

    cleanup()
    taskContainer.remove()
  })

  const rect = (top: number, height: number) =>
    ({
      top,
      bottom: top + height,
      height,
      left: 0,
      right: 300,
      width: 300,
      x: 0,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect

  it('keeps calc open on a short task whose field is visible above it (iPhone Safari)', () => {
    // 2.5.2: the task area with the calculator open is 180px; the task text
    // and the field fit, a bit of padding below does not — «overflow».
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 180 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 220 })
    taskContainer.getBoundingClientRect = () => rect(60, 180)

    const field = document.createElement('span')
    field.setAttribute('data-control', '')
    field.getBoundingClientRect = () => rect(150, 56)
    taskContainer.appendChild(field)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({ refs: makeRefs(taskContainer), calc })

    expect(calc.close).not.toHaveBeenCalled()
    expect(calc.isOpen).toBe(true)

    cleanup()
    taskContainer.remove()
  })

  it('keeps calc open when the field needs a scroll of up to a line', () => {
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 160 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 240 })
    taskContainer.getBoundingClientRect = () => rect(60, 160)

    const field = document.createElement('span')
    field.setAttribute('data-control', '')
    field.getBoundingClientRect = () => rect(170, 56) // 6px under the edge
    taskContainer.appendChild(field)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({ refs: makeRefs(taskContainer), calc })
    expect(calc.isOpen).toBe(true)

    cleanup()
    taskContainer.remove()
  })

  it('closes calc when showing the field would hide the task text', () => {
    // 600px phone: the field would need the text scrolled away.
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 80 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 220 })
    taskContainer.getBoundingClientRect = () => rect(60, 80)

    const field = document.createElement('span')
    field.setAttribute('data-control', '')
    field.getBoundingClientRect = () => rect(150, 56)
    taskContainer.appendChild(field)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({ refs: makeRefs(taskContainer), calc })
    expect(calc.isOpen).toBe(false)

    cleanup()
    taskContainer.remove()
  })

  it('still closes calc when the first field is under it (long task)', () => {
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 180 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 600 })
    taskContainer.getBoundingClientRect = () => rect(60, 180)

    const field = document.createElement('span')
    field.setAttribute('data-control', '')
    field.getBoundingClientRect = () => rect(420, 56)
    taskContainer.appendChild(field)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({ refs: makeRefs(taskContainer), calc })

    expect(calc.close).toHaveBeenCalled()
    expect(calc.isOpen).toBe(false)

    cleanup()
    taskContainer.remove()
  })
})
