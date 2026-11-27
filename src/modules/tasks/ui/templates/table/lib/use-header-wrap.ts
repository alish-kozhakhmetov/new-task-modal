import { type RefObject, useLayoutEffect } from 'react'

import styles from '../shared/table.module.scss'

export const HEADER_WRAP_ATTRIBUTE = 'data-header-wrap'

/**
 * Rule 59а where it pays for itself: a header line of several words wraps
 * between them (`data-header-wrap` on the scroll box) only when the table
 * then fits its column.
 *
 * 4_10_9_9 «Площадь выращивания» over «(S) (га)» held one line each, and the
 * table was 637px. At 1280 the column is 592: wrapped, the table is 588 and
 * fits, so the sideways scroll and the fade go. On a phone the column is
 * 292–362, and wrapped the table is still 461: it scrolls all the same, while
 * the header grew from 65 to 110px and pushed the keypad's bottom row past a
 * 390×800 screen. There the table stays as it was in 2.5.9.
 *
 * Measured on the live box, one line first: a table that fits on one line,
 * or still overflows wrapped, keeps one line. Re-measured in the next frame
 * when the column or the table changes size (typesetting, fonts, a field
 * that grows): switching resizes the table the observer watches.
 */
export const useHeaderWrapWhenItFits = (ref: RefObject<HTMLElement | null>) => {
  useLayoutEffect(() => {
    const box = ref.current
    if (!box) return

    const overflows = () => box.scrollWidth > box.clientWidth + 1

    const decide = () => {
      const wrapping = box.querySelector(
        `.${styles.cellHeader} .${styles.cellLineWords}`,
      )
      if (!wrapping) {
        box.removeAttribute(HEADER_WRAP_ATTRIBUTE)
        return
      }
      // the probe below may clamp a scrolled box; a child's place is kept
      const { scrollLeft } = box
      box.removeAttribute(HEADER_WRAP_ATTRIBUTE)
      if (overflows()) {
        box.setAttribute(HEADER_WRAP_ATTRIBUTE, '')
        if (overflows()) box.removeAttribute(HEADER_WRAP_ATTRIBUTE)
      }
      if (box.scrollLeft !== scrollLeft) box.scrollLeft = scrollLeft
    }

    decide()

    // jsdom has no ResizeObserver; the measurement above still runs.
    if (typeof ResizeObserver === 'undefined') return
    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(decide)
    })
    observer.observe(box)
    if (box.firstElementChild) observer.observe(box.firstElementChild)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [ref])
}
