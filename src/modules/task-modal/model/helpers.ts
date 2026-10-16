import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'

import type { TaskModalDependencies } from './types/props'

export const FOCUSED = 'focused'
export const DATA_INPUT = 'data-input'
export const DATA_CALC = 'data-calc'

export const getParentWithAttr = (element: HTMLElement, attr: string) => {
  let parent = element.parentElement
  while (parent) {
    if (parent.hasAttribute(attr)) return parent
    parent = parent.parentElement
  }
  return null
}

/**
 * What a click was aimed at. Press and release on different elements — the
 * task scrolled in between, as focusing a field scrolls it — and the browser
 * dispatches the click to their common ancestor: a press on a field turned
 * into a click «past the field» and hid the calculator. The element pressed,
 * if it is still in the page and inside that ancestor, is the pupil's aim.
 */
export const trackPressTarget = (root: HTMLElement) => {
  let pressed: EventTarget[] = []

  const onPointerDown = (event: PointerEvent) => {
    pressed = event.composedPath()
  }
  root.addEventListener('pointerdown', onPointerDown, true)

  const resolve = (event: Event): EventTarget | null => {
    const path = pressed
    pressed = []
    const target = event.target
    if (!(target instanceof Node)) return target

    for (const el of path) {
      if (el === target) break
      if (el instanceof Element && el.isConnected && target.contains(el))
        return el
    }
    return target
  }

  const dispose = () =>
    root.removeEventListener('pointerdown', onPointerDown, true)

  return { resolve, dispose }
}

export const isAnswerEmpty = (answer: string, deps: TaskModalDependencies) => {
  return splitMultiAnswer(
    answer,
    deps.helpers.TaskHelper.multipleTaskAnswerSeparator,
  ).some((it) => it === '')
}
