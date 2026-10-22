/**
 * The overlap detector for the plane's labels (rule 73, row 57).
 *
 * A plane that shrinks to the column keeps its labels at 18px, so in viewBox
 * units a label grows (useLabelScale). The backend placed it for its own
 * size: grown around the same point, «16 см» of 4_7_18_5 runs into the
 * circle and the diameter beside it, «6 см» of 4_7_18_6 into the rectangle.
 *
 * Each label gets the largest size, from the full compensation down to 18
 * viewBox units (the size the backend placed it for, as before), at which it
 * crosses no line and no filled shape of the drawing. A label that touches a
 * line even at 18 units stays at 18, as before.
 */

/** Wrapper of one text figure: `data-label` with its anchor point. */
export const LABEL_ATTR = 'data-label'

const SHAPES = 'line, path, polyline, polygon, rect, circle, ellipse'

/** Factors tried, from the full compensation down to none. */
const STEPS = 8

/** Ink sits inside the text box: line gap above and below is not ink. */
const INK_INSET_Y = 0.2

/**
 * Air a label keeps from a line, in viewBox units (≈ 3px on a phone). Not
 * crossing is not enough: «16 см» of 4_7_18_5 grown to 18px stops a pixel
 * short of the diameter and the circle and reads as touching them.
 */
const CLEARANCE = 4

const isPainted = (value: string) =>
  value !== '' &&
  value !== 'none' &&
  value !== 'transparent' &&
  !/rgba\([^)]*,\s*0\)$/.test(value)

type Shape = {
  el: SVGGeometryElement
  stroke: boolean
  fill: boolean
  toLocal: DOMMatrix
}

const collectShapes = (content: SVGGElement): Shape[] => {
  const out: Shape[] = []
  for (const el of content.querySelectorAll<SVGGeometryElement>(SHAPES)) {
    if (typeof el.isPointInStroke !== 'function') continue
    if (el.closest(`[${LABEL_ATTR}]`)) continue // a fraction's own bar
    const style = getComputedStyle(el)
    const ctm = el.getCTM()
    if (!ctm) continue
    out.push({
      el,
      stroke: isPainted(style.stroke),
      fill: isPainted(style.fill),
      toLocal: ctm.inverse(),
    })
  }
  return out
}

const isHit = (shapes: Shape[], point: DOMPoint) =>
  shapes.some(({ el, stroke, fill, toLocal }) => {
    const local = point.matrixTransform(toLocal)
    return (
      (stroke && el.isPointInStroke(local)) || (fill && el.isPointInFill(local))
    )
  })

type Box = { x: number; y: number; width: number; height: number }
type Point = { x: number; y: number }

/** The ink band of a text box, grown by the clearance. */
const inkBox = (box: Box): Box => {
  const inset = box.height * INK_INSET_Y
  return {
    x: box.x - CLEARANCE,
    y: box.y + inset - CLEARANCE,
    width: box.width + 2 * CLEARANCE,
    height: box.height - 2 * inset + 2 * CLEARANCE,
  }
}

/**
 * Points of the drawing inside `area` (label coordinates), on a one-unit
 * grid: lines are 1–2 units thick, a coarser grid steps over them.
 */
const drawingPoints = (
  shapes: Shape[],
  area: Box,
  toViewport: DOMMatrix,
): Point[] => {
  const out: Point[] = []
  for (let x = area.x; x <= area.x + area.width; x += 1) {
    for (let y = area.y; y <= area.y + area.height; y += 1) {
      if (isHit(shapes, new DOMPoint(x, y).matrixTransform(toViewport)))
        out.push({ x, y })
    }
  }
  return out
}

const inside = (p: Point, box: Box) =>
  p.x >= box.x &&
  p.x <= box.x + box.width &&
  p.y >= box.y &&
  p.y <= box.y + box.height

/**
 * Per text figure (its index in `data-label`), the label factor to draw it
 * with: `target` when nothing is in the way, less when a line is, never under
 * 1. Measured on the DOM as drawn at `target`.
 */
export const fitLabelFactors = (
  content: SVGGElement | null,
  target: number,
): Record<string, number> => {
  const out: Record<string, number> = {}
  if (!content || target <= 1 || typeof content.getBBox !== 'function')
    return out

  const shapes = collectShapes(content)
  for (const label of content.querySelectorAll<SVGGElement>(
    `[${LABEL_ATTR}]`,
  )) {
    const key = label.getAttribute(LABEL_ATTR) ?? ''
    const ax = Number(label.dataset.x)
    const ay = Number(label.dataset.y)
    const toViewport = label.getCTM()
    let box: DOMRect
    try {
      box = label.getBBox()
    } catch {
      continue
    }
    if (!toViewport || !box.width || Number.isNaN(ax + ay)) continue

    // what of the drawing lies under the label at its biggest
    const crowd = drawingPoints(shapes, inkBox(box), toViewport)

    let factor = 1
    for (let step = STEPS; step >= 0; step -= 1) {
      const f = 1 + ((target - 1) * step) / STEPS
      const k = f / target
      const scaled = inkBox({
        x: ax + (box.x - ax) * k,
        y: ay + (box.y - ay) * k,
        width: box.width * k,
        height: box.height * k,
      })
      if (!crowd.some((p) => inside(p, scaled))) {
        factor = f
        break
      }
    }
    out[key] = Math.round(factor * 100) / 100
  }
  return out
}
