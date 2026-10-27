import { useEffect, type RefObject } from 'react'

import { DATA_INPUT } from '../../helpers'

const FOCUSABLE =
  'button, [href], input, select, textarea, iframe, [tabindex], [contenteditable="true"]'

/**
 * What a field takes the keys with: MathQuill's textarea, or on a touch
 * screen the span it is swapped for (math-input/model.ts).
 */
const fieldKeyTarget = (field: HTMLElement): HTMLElement | null =>
  field.querySelector<HTMLElement>('.mq-textarea > textarea') ??
  field.querySelector<HTMLElement>('.mq-textarea > [tabindex]')

/** On screen, not under an inert layer (the task list, a hidden slide). */
const isShown = (el: HTMLElement) => {
  if (el.closest('[inert]')) return false
  if (el.getClientRects().length === 0) return false
  return getComputedStyle(el).visibility !== 'hidden'
}

/**
 * Answer fields of the task, in the order of the page. Only the task's own:
 * a solved task drawn in the task list is a picture.
 */
export const answerFields = (root: HTMLElement): HTMLElement[] =>
  [...root.querySelectorAll<HTMLElement>(`.task-modal [${DATA_INPUT}]`)].filter(
    (field) => isShown(field) && fieldKeyTarget(field) !== null,
  )

/**
 * Everything in the window Tab can reach, in the order of the page.
 * MathQuill's textarea is a clipped 1px box — its field decides whether it
 * shows. Host focus traps (react-modal's) drop it as hidden: on Safari and a
 * headless Chrome their own walk then jumped from a field to the window's
 * first button (live test 27.10).
 */
export const tabbables = (root: HTMLElement): HTMLElement[] =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => {
    if (el.tabIndex < 0) return false
    if ((el as HTMLButtonElement).disabled) return false
    const field = el.closest<HTMLElement>(`[${DATA_INPUT}]`)
    if (field) return fieldKeyTarget(field) === el && isShown(field)
    return isShown(el)
  })

const step = <T>(list: T[], index: number, back: boolean) =>
  list[(index + (back ? list.length - 1 : 1)) % list.length]

/**
 * Where Tab goes from `active` inside the window `root`:
 * - from an answer field — to the next field (Shift — the previous), round
 *   the task's fields; one field keeps the keys;
 * - from anything else in the window — to the next element Tab can reach in
 *   it, round the window, never out of it.
 */
export const nextTabTarget = (
  root: HTMLElement,
  active: HTMLElement,
  back: boolean,
): HTMLElement | null => {
  const field = active.closest<HTMLElement>(`[${DATA_INPUT}]`)
  const fields = answerFields(root)
  const at = field ? fields.indexOf(field) : -1
  if (at >= 0) return fieldKeyTarget(step(fields, at, back))

  const list = tabbables(root)
  if (list.length === 0) return null
  const index = list.indexOf(active)
  if (index >= 0) return step(list, index, back)

  // Focus on something Tab doesn't stop at (the task list's own layer, a
  // field's box): the nearest one after it in the page, or before it.
  const after = (el: HTMLElement) =>
    Boolean(
      active.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
    )
  if (back) {
    const before = list.filter((el) => !after(el) && !el.contains(active))
    return before[before.length - 1] ?? list[list.length - 1]
  }
  return list.find((el) => after(el) && !active.contains(el)) ?? list[0]
}

/**
 * Tab and Shift+Tab stay inside the window and walk the answer fields round
 * (2.5.8, live test 27.10, 2120 №22–25: Tab from the first field went to
 * «Список задач», then «Закрыть», and stuck there). The host's modal traps
 * Tab by its own list of elements, which has no MathQuill textareas; the
 * window walks its own and keeps the key from the host.
 */
export const useTabWithinWindow = (root: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = root.current
    if (!el) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.altKey || event.ctrlKey) return
      if (event.metaKey || event.isComposing) return
      // MathQuill leaves a fraction or a power by Tab and says so itself.
      if (event.defaultPrevented) return

      const active = document.activeElement
      if (!(active instanceof HTMLElement) || !el.contains(active)) return

      const target = nextTabTarget(el, active, event.shiftKey)
      event.preventDefault()
      event.stopPropagation()
      if (target && target !== active) target.focus()
    }

    el.addEventListener('keydown', onKeyDown)
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [root])
}
