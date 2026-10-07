import { useLayoutEffect, useRef } from 'react'

/**
 * An answer row that does not fit lets its expression take a line of its own.
 *
 * «27 месяцев 681 день − 160 недель = ▢ дней» is one segment that never
 * shrinks: on a phone the field went past the right edge and «дней», a row
 * item of its own, dropped to the next line alone (4_6_10_10, rule 24). A row
 * that overflows gets `data-wrap`: the segment opens up (`display: contents`),
 * the expression wraps on its own, and the field moves down together with
 * its unit.
 *
 * A row that fits is not touched: the decision is measured on the one-line
 * layout, before switching. Re-measured only when the width changes, as
 * `useAlignedWrap` does for table rows.
 */
export const useRowWrap = <T extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const row = ref.current
    if (!enabled || !row) return

    const layout = () => {
      row.removeAttribute('data-wrap')
      if (row.scrollWidth > row.clientWidth + 1)
        row.setAttribute('data-wrap', '')
    }

    layout()
    void document.fonts?.ready.then(layout)

    let lastWidth = row.getBoundingClientRect().width
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            const width = row.getBoundingClientRect().width
            if (Math.abs(width - lastWidth) < 1) return
            lastWidth = width
            layout()
          })
    observer?.observe(row)

    // MathJax typesets after the first layout and changes the row's width
    // from inside; re-measure once its markup lands.
    let frame = 0
    const typeset = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(layout)
    })
    typeset.observe(row, { childList: true, subtree: true })

    return () => {
      observer?.disconnect()
      typeset.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  return ref
}
