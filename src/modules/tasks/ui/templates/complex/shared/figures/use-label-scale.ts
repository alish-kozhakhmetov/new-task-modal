import { useLayoutEffect, useState, type RefObject } from 'react'

/** Labels of a drawing: the condition's size, 18px (rules 1 and 73). */
export const LABEL_PX = 18

/**
 * How many viewBox units make one screen pixel of this SVG — the factor that
 * keeps a drawing's labels at their own size while the drawing scales.
 *
 * Drawings fit the column: a plane wider than it shrinks (4_7_18_6: ×0.73),
 * an angle list stretches to it (4_12_22_1: ×1.29 on a phone, 4_12_22_2:
 * ×0.75). Labels in viewBox units scaled with them — 10.4 to 25.5px against
 * the condition's 18 (Alisher, 11.09: labels in the condition's size,
 * registry row 57). A label drawn at `size × factor` units shows at `size`
 * px whatever the scale.
 *
 * 1 until measured (no layout in jsdom, first paint). Measured again when
 * the SVG resizes and when `viewBox` (the cropped box) changes. Changes under
 * 2% are ignored: a label that grows can widen a cropped viewBox, which moves
 * the scale a little — the threshold stops that from going round.
 */
export const useLabelScale = (
  svgRef: RefObject<SVGSVGElement | null>,
  viewBox?: string,
): number => {
  const [factor, setFactor] = useState(1)

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const measure = () => {
      const viewWidth = svg.viewBox?.baseVal?.width
      const width = svg.getBoundingClientRect().width
      if (!viewWidth || !width) return
      const next = Math.round((viewWidth / width) * 100) / 100
      setFactor((prev) => (Math.abs(prev - next) / prev > 0.02 ? next : prev))
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(svg)
    return () => observer.disconnect()
  }, [svgRef, viewBox])

  return factor
}
