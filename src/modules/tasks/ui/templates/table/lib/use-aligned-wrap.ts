import { useLayoutEffect, useRef } from 'react'

/**
 * Answer rows that do not fit switch from one line to aligned columns.
 *
 * «796441 = ▢ + ▢ + ▢ + ▢ + ▢ + ▢» is six 120px fields: on a phone it cannot be
 * one line. Plain wrapping put the fields at different offsets on every line —
 * the first line starts after «796441 =», the next ones at the edge — and the
 * row read as a scatter. A row that overflows gets `data-wrap`: its lead
 * («796441 =») takes a line of its own, and the field groups («▢ +») stand in
 * columns of one width, the width of the widest group.
 *
 * A row that fits is not touched: the decision is measured on the one-line
 * layout, before switching.
 *
 * Re-measured only when the width changes. Switching a row to columns changes
 * the height of the table, and reacting to that would flip the row back and
 * forth.
 */
export const useAlignedWrap = <T extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const table = ref.current
    if (!enabled || !table) return

    const layout = () => {
      for (const row of Array.from(table.querySelectorAll('tr'))) {
        row.removeAttribute('data-wrap')
        row.style.removeProperty('--group-width')
        const groups = Array.from(
          row.querySelectorAll<HTMLElement>(':scope > [data-group]'),
        )
        // The width of a column comes from the glued groups («▢ +»). A lone
        // trailing field is stretched to the whole row on one line
        // (`.tableRemoveBorders .inputCell:last-child`), and measuring it gave
        // a single 343px column; in columns it is pinned to 120px anyway.
        const glued = groups.filter((g) => g.dataset.group === 'glued')
        const measured = glued.length ? glued : groups
        if (groups.length < 2 || row.scrollWidth <= row.clientWidth + 1) {
          continue
        }
        // Clamped to the row: `repeat(auto-fill, min(…))` is not a valid track
        // list, so the clamp lives here and CSS gets a plain length.
        const width = Math.min(
          row.clientWidth,
          Math.ceil(
            Math.max(...measured.map((g) => g.getBoundingClientRect().width)),
          ),
        )
        row.style.setProperty('--group-width', `${width}px`)
        row.setAttribute('data-wrap', '')
      }
    }

    layout()
    void document.fonts?.ready.then(layout)

    let lastWidth = table.getBoundingClientRect().width
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            const width = table.getBoundingClientRect().width
            if (Math.abs(width - lastWidth) < 1) return
            lastWidth = width
            layout()
          })
    observer?.observe(table)

    return () => observer?.disconnect()
  }, [enabled])

  return ref
}
