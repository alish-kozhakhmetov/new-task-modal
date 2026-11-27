import { useLayoutEffect, useRef } from 'react'

/**
 * Puts `attribute` on the element while `measure` finds it on its default
 * layout, and takes it off when it no longer does. Re-measured once the fonts
 * load, when the width changes and when MathJax typesets (it fills the
 * element after the first layout) — the loop of `useRowWrap` (answer-cell).
 *
 * Where `measure` is false nothing is added: the markup and the layout of
 * a row that fits stay as they were (grade 4 since 2.5.8). `measure` should
 * be a module-level function: a new one each render re-runs the effect.
 */
export const useLayoutFlag = <T extends HTMLElement>(
  attribute: string,
  measure: (element: T) => boolean,
) => {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const layout = () => {
      element.removeAttribute(attribute)
      if (measure(element)) element.setAttribute(attribute, '')
    }

    layout()
    void document.fonts?.ready.then(layout)

    let lastWidth = element.getBoundingClientRect().width
    const resize =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            const width = element.getBoundingClientRect().width
            if (Math.abs(width - lastWidth) < 1) return
            lastWidth = width
            layout()
          })
    resize?.observe(element)

    let frame = 0
    const typeset = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(layout)
    })
    typeset.observe(element, { childList: true, subtree: true })

    return () => {
      resize?.disconnect()
      typeset.disconnect()
      cancelAnimationFrame(frame)
      element.removeAttribute(attribute)
    }
  }, [attribute, measure])

  return ref
}

/**
 * Whether the element's inline content takes more than one line: one of its
 * pieces (a text run, a formula, a group of digits) starts below the bottom
 * of the first. A one-line answer with a fraction is one line — the
 * fraction's box is taller, but the text beside it overlaps it.
 */
export const spansLines = (element: Element): boolean => {
  const boxes: DOMRect[] = []
  for (const node of Array.from(element.childNodes)) {
    if (node instanceof Element) {
      boxes.push(...Array.from(node.getClientRects()))
      continue
    }
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
    const range = document.createRange()
    range.selectNodeContents(node)
    if (typeof range.getClientRects === 'function')
      boxes.push(...Array.from(range.getClientRects()))
  }
  const pieces = boxes.filter((box) => box.width > 0 && box.height > 0)
  const first = pieces[0]
  return Boolean(first) && pieces.some((box) => box.top >= first.bottom - 1)
}
