/** Drawing-figure type ids used inside CoordinatePlane `figures[]`. */
export const PlaneFigureType = {
  Point: 10,
  Line: 20,
  LineSegment: 30,
  Polygon: 50,
  Circle: 60,
  Vector: 80,
  Text: 100,
  EllipticalArc: 110,
} as const

export type PlaneOptions = {
  minPosition: number
  maxPosition: number
  tickStep: number
  stepSize: number
  showAxis: boolean
  showCells: boolean
  tickStepXMultiply: number
  tickStepYMultiply: number
  xAxisLabel: string
  yAxisLabel: string
  reduceHeight?: number
}

export type PlanePoint = {
  x: number
  y: number
  letter?: string
  color?: string
  radius?: number
  borderColor?: string
  showOnlyLetter?: boolean
  showCoordinate?: boolean
  showDashes?: boolean
}

export const cellSize = (options: PlaneOptions) =>
  options.stepSize / options.tickStep

export const tickStartX = (options: PlaneOptions) => options.stepSize

export const planeLength = (options: PlaneOptions) => {
  const divisionsQuantity =
    (options.maxPosition - options.minPosition) / options.tickStep
  return options.stepSize * (divisionsQuantity + 1) + tickStartX(options)
}

/**
 * Bounding box of everything actually drawn, in plane units.
 *
 * The backend declares `minPosition`/`maxPosition` for the whole coordinate
 * field, and that field is often much larger than the figure it carries. A
 * segment spanning 0..1 inside a field declared -10..10 ends up as a thin line
 * in a large empty grid.
 *
 * **Reads exactly the keys `PlaneFigure` renders from** — `point1`/`point2`,
 * `centerPoint` with `radius` or `rx`/`ry`, `mPoint`/`endPoint`, `point`,
 * `points`. The first version read `x1`/`y1`/`x2`/`y2` and `f.x` for circles,
 * a shape the backend never sends: on real payloads it saw only some figures
 * and could narrow the canvas past the ones it missed. Caught by rendering
 * real tasks, not by the unit tests, which had been written on the same
 * invented shape.
 *
 * Returns `null` — keep the declared field — when nothing is drawn, when a
 * `Line` is present (it runs to the edges of the declared field by
 * definition), or when a figure type is unknown (its extent is unknown).
 */
export const contentBounds = (
  points: PlanePoint[],
  figures: Record<string, unknown>[],
): { minX: number; maxX: number; minY: number; maxY: number } | null => {
  const xs: number[] = []
  const ys: number[] = []
  const num = (v: unknown): v is number =>
    typeof v === 'number' && Number.isFinite(v)
  const pt = (v: unknown): PlanePoint | null => {
    if (!v || typeof v !== 'object') return null
    const { x, y } = v as Record<string, unknown>
    return num(x) && num(y) ? { x, y } : null
  }
  const add = (p: PlanePoint | null, rx = 0, ry = rx) => {
    if (!p) return
    xs.push(p.x - rx, p.x + rx)
    ys.push(p.y - ry, p.y + ry)
  }

  for (const p of points) add(pt(p))

  for (const f of figures) {
    switch (Number(f.type)) {
      case PlaneFigureType.Point:
        add(pt({ ...f, ...(f.point as object) }))
        break
      case PlaneFigureType.LineSegment:
      case PlaneFigureType.Vector:
        add(pt(f.point1))
        add(pt(f.point2))
        break
      case PlaneFigureType.Polygon:
        if (Array.isArray(f.points)) for (const p of f.points) add(pt(p))
        break
      case PlaneFigureType.Circle:
        if (num(f.radius)) add(pt(f.centerPoint), Math.abs(f.radius))
        break
      case PlaneFigureType.EllipticalArc:
        if (num(f.rx) && num(f.ry))
          add(pt(f.centerPoint), Math.abs(f.rx), Math.abs(f.ry))
        add(pt(f.mPoint))
        add(pt(f.endPoint))
        break
      case PlaneFigureType.Text:
        // The renderer places a Text without coordinates at the origin.
        add({ x: num(f.x) ? f.x : 0, y: num(f.y) ? f.y : 0 })
        break
      case PlaneFigureType.Line:
        return null
      default:
        return null
    }
  }

  if (!xs.length || !ys.length) return null
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

/**
 * Options narrowed to what is actually drawn, with one cell of air around it.
 *
 * Two guards, both measured on the backend corpus (1741 variants, 345 planes):
 *
 * - **The origin stays on the canvas when axes are shown.** Axes are drawn
 *   through zero; a figure sitting at 3..6 would otherwise narrow the field to
 *   2..7 and push both axes off the canvas, leaving a coordinate task with
 *   nothing to read coordinates against. One task in the corpus hit this
 *   (Task_7_3_1_15).
 * - **Bounds snap to the tick grid.** Without it an integer grid drifts to
 *   fractional lines (-0.5, 0.5, …) whenever the drawn content is fractional,
 *   and the cells stop matching integer coordinates. Sixteen tasks hit this.
 *
 * The declared field is never exceeded: snapping and the origin are clamped to
 * it, so a field declared without zero stays without zero.
 */
export const fitOptionsToContent = (
  options: PlaneOptions,
  points: PlanePoint[],
  figures: Record<string, unknown>[],
): PlaneOptions => {
  const b = contentBounds(points, figures)
  if (!b) return options

  const tick = options.tickStep > 0 ? options.tickStep : 1
  let lo = Math.floor((Math.min(b.minX, b.minY) - tick) / tick) * tick
  let hi = Math.ceil((Math.max(b.maxX, b.maxY) + tick) / tick) * tick
  if (options.showAxis) {
    lo = Math.min(lo, 0)
    hi = Math.max(hi, 0)
  }
  const min = Math.max(options.minPosition, lo)
  const max = Math.min(options.maxPosition, hi)
  if (!(max > min)) return options

  return { ...options, minPosition: min, maxPosition: max }
}

export const getAxisX = (options: PlaneOptions, xPosition: number) =>
  tickStartX(options) +
  (options.stepSize * (xPosition - options.minPosition)) / options.tickStep

/** Math point → SVG pixel (matches Matheducator DotPointConverter.fromPointToDot). */
export const fromPointToDot = (
  options: PlaneOptions,
  pointX: number,
  pointY: number,
) => {
  const size = cellSize(options)
  const start = tickStartX(options)
  return {
    x: (pointX - options.minPosition) * size + start,
    y: (options.maxPosition - pointY) * size + start,
  }
}
