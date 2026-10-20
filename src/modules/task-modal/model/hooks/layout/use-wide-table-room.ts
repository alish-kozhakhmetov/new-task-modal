import { useEffect, type RefObject } from 'react'

const WIDE_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1100px)'
const COLUMN = 640

/**
 * Wide layout: a table wider than the 640 task column gets exactly the room it
 * lacks, centred on the keys, instead of a scroll inside the column with empty
 * space on both sides. Only tables marked `data-ntm-table-scroll` (the Table
 * template's scroll box) count: «fit-content» on the whole task widened plain
 * conditions too — Table/mixed stretched a sentence to 1000px (20.10).
 *
 * The room only grows within a task: once widened, the box no longer
 * overflows, and shrinking back on that would loop. Off the wide layout (the
 * phone, the app, no `layout="wide"`) nothing is touched.
 */
export const useWideTableRoom = (
  root: RefObject<HTMLElement | null>,
  taskId: unknown,
) => {
  useEffect(() => {
    const element = root.current
    if (!element) return
    let extra = 0

    const isWide = () =>
      !!element.closest('[data-ntm-layout="wide"]') &&
      window.matchMedia(WIDE_QUERY).matches

    const measure = () => {
      if (!isWide()) {
        if (extra) {
          extra = 0
          element.style.removeProperty('max-width')
        }
        return
      }
      let over = 0
      element
        .querySelectorAll<HTMLElement>('[data-ntm-table-scroll]')
        .forEach((box) => {
          over = Math.max(over, box.scrollWidth - box.clientWidth)
        })
      if (over > 1) {
        extra += over
        element.style.setProperty('max-width', `min(100%, ${COLUMN + extra}px)`)
      }
    }

    measure()
    // jsdom has no ResizeObserver; the initial measurement still runs.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(element)
    element
      .querySelectorAll('[data-ntm-table-scroll] > *')
      .forEach((table) => observer?.observe(table))

    return () => {
      observer?.disconnect()
      element.style.removeProperty('max-width')
    }
  }, [root, taskId])
}
