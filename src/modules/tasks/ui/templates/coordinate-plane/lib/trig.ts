import type { Shape } from './curves'
import { DrawingFigure } from './figure-ids'
import type { Pt } from './plane-answer'

/**
 * Trigonometric planes (scenario D′, 45 generators of grade 10): the axes,
 * the curve two clicks define and the coordinates the backend reads.
 *
 * The old window drew these on fixed axes whatever the plane declares
 * (reactjs_client …/coordinatePlane/Trigonometry*Axis.js): a grid of 2X × 2Y
 * cells, x in fractions of π. A node is (u, v) in cells from the origin.
 * Its point on the wire is (u, v + X − Y): DotPointConverter.fromDotToPoint
 * reads y against −minPosition = X, not against maxPosition = Y, and every
 * answer module subtracts that offset back (y_diff = 8 for sin/cos, 2 for
 * tan/cot, 0 for arcsin/arccos). Sending (u, v) instead would be judged on
 * a graph shifted by X − Y cells.
 */
export type TrigFamily = 'sinCos' | 'tanCot' | 'arcSinCos'

export interface TrigAxes {
  family: TrigFamily
  /** Half-width and half-height of the grid, in cells. */
  X: number
  Y: number
  /** Labels under the x axis and left of the y axis: cell → text. */
  xLabels: [number, string][]
  yLabels: [number, string][]
}

const PI_X: [number, string][] = [
  [-4, '−2π'],
  [-3, '−3π/2'],
  [-2, '−π'],
  [-1, '−π/2'],
  [1, 'π/2'],
  [2, 'π'],
  [3, '3π/2'],
  [4, '2π'],
]

const units = (cells: number[], value: (c: number) => number) =>
  cells.map((c): [number, string] => {
    const v = value(c)
    return [c, v < 0 ? `−${-v}` : String(v)]
  })

export const TRIG_AXES: Record<TrigFamily, TrigAxes> = {
  // TrigonometrySinCosAxis: 12 × 4, a cell is π/6 across and 1/2 up
  sinCos: {
    family: 'sinCos',
    X: 12,
    Y: 4,
    xLabels: PI_X.map(([k, t]) => [k * 3, t]),
    yLabels: units([4, 2, -2, -4], (c) => c / 2),
  },
  // TrigonometryTanCotAxis: 8 × 6, a cell is π/4 across and 1/2 up
  tanCot: {
    family: 'tanCot',
    X: 8,
    Y: 6,
    xLabels: PI_X.map(([k, t]) => [k * 2, t]),
    yLabels: units([6, 4, 2, -2, -4, -6], (c) => c / 2),
  },
  // TrigonometryArcSinCosAxis: 6 × 6, a cell is 1/2 across and π/6 up
  arcSinCos: {
    family: 'arcSinCos',
    X: 6,
    Y: 6,
    xLabels: units([-6, -4, -2, 2, 4, 6], (c) => c / 2),
    yLabels: [
      [6, 'π'],
      [3, 'π/2'],
      [-3, '−π/2'],
      [-6, '−π'],
    ],
  },
}

const FAMILY_OF: Record<number, TrigFamily> = {
  [DrawingFigure.Sinus]: 'sinCos',
  [DrawingFigure.Cosinus]: 'sinCos',
  [DrawingFigure.Tangent]: 'tanCot',
  [DrawingFigure.Cotangent]: 'tanCot',
  [DrawingFigure.Arcsin]: 'arcSinCos',
  [DrawingFigure.Arccos]: 'arcSinCos',
}

export const isTrigType = (type: number) => type in FAMILY_OF

/**
 * The axes of a plane, as CoordinatePlaneHelper.isTrigonometry decides:
 * the figure to draw, or any figure of the condition, is trigonometric.
 */
export const trigAxesOf = (plane: {
  drawingFigure?: number
  figures?: Record<string, unknown>[]
}): TrigAxes | null => {
  const own = FAMILY_OF[Number(plane.drawingFigure)]
  if (own) return TRIG_AXES[own]
  for (const f of plane.figures ?? []) {
    const family = FAMILY_OF[Number(f.type)]
    if (family) return TRIG_AXES[family]
  }
  return null
}

/** Node (cells) → the point the answer carries, and back. */
export const toTrigWire = (axes: TrigAxes, p: Pt): Pt => ({
  x: p.x,
  y: p.y + axes.X - axes.Y,
})
export const fromTrigWire = (axes: TrigAxes, p: Pt): Pt => ({
  x: p.x,
  y: p.y - axes.X + axes.Y,
})

export type TrigParams = { a: number; b: number; c: number; d: number }

/**
 * a, b, c, d of the curve two clicks define, from the wire points — the
 * formulas of the old window's drawByUser (Sinus.js, Cosinus.js, …), which
 * are the formulas the answer modules check with. Null when the clicks do
 * not make a curve (same x).
 */
export const trigParamsOf = (
  type: number,
  w1: Pt,
  w2: Pt,
): TrigParams | null => {
  const dx = w2.x - w1.x
  if (!dx) return null
  switch (type) {
    case DrawingFigure.Sinus:
    case DrawingFigure.Cosinus: {
      const d = (w1.y - 8) / 2
      return {
        d,
        b: 12 / (dx * 4),
        a: (w2.y - 8) / 2 - d,
        c: type === DrawingFigure.Sinus ? -w1.x : -w2.x,
      }
    }
    case DrawingFigure.Tangent: {
      const d = (w1.y - 2) / 2
      return { d, b: 4 / (dx * 4), a: (w2.y - 2) / 2 - d, c: -w1.x }
    }
    case DrawingFigure.Cotangent: {
      const d = (w1.y - 2) / 2
      return {
        d,
        b: 4 / (-dx * 4),
        a: (w2.y - 2) / 2 - d,
        c: Math.abs(dx) * 2 - w1.x,
      }
    }
    case DrawingFigure.Arcsin:
      return { a: (w2.y - w1.y) / 3, b: 2 / dx, c: -w1.x / 2, d: w1.y }
    case DrawingFigure.Arccos: {
      const a1 = (w2.y - w1.y) / 3
      return {
        a: Math.abs(a1),
        b: (2 / -dx) * (w2.y > w1.y ? 1 : -1),
        c: -w1.x / 2,
        d: w2.y - (a1 > 0 ? (w2.y - w1.y) * 2 : 0),
      }
    }
    default:
      return null
  }
}

/**
 * The curve in cells: u ↦ v, as the old window's getY puts it on its axes
 * (sin and cos in π/6 a cell, tan and cot in π/4, arcsin and arccos with x
 * in halves and y in π/6).
 */
export const trigCurve = (
  type: number,
  { a, b, c, d }: TrigParams,
): ((u: number) => number) | null => {
  switch (type) {
    case DrawingFigure.Sinus:
      return (u) => 2 * (a * Math.sin((b * (u + c) * Math.PI) / 6) + d)
    case DrawingFigure.Cosinus:
      return (u) => 2 * (a * Math.cos((b * (u + c) * Math.PI) / 6) + d)
    case DrawingFigure.Tangent:
      return (u) => 2 * (a * Math.tan((b * (u + c) * Math.PI) / 4) + d)
    case DrawingFigure.Cotangent:
      return (u) => 2 * (a / Math.tan((b * (u + c) * Math.PI) / 4) + d)
    case DrawingFigure.Arcsin:
      return (u) =>
        ((a * Math.asin(b * (u / 2 + c)) + (d * Math.PI) / 6) * 6) / Math.PI
    case DrawingFigure.Arccos:
      return (u) =>
        ((a * Math.acos(b * (u / 2 + c)) + (d * Math.PI) / 6) * 6) / Math.PI
    default:
      return null
  }
}

/**
 * Clicks that draw a given curve, as wire points — the inverse of
 * trigParamsOf, every pair the answer module accepts that the window can
 * reach: the same curve from another half-period (sin, cos: the sign of a
 * flips with it) or period (tan, cot), and the other end of arcsin and
 * arccos. A grade-10 answer often peaks past the grid (Task_10_2_1_16:
 * y = cos(x + 2) + 2 peaks at 3, the grid stops at 2), and the old window
 * accepted the clicks a half-period away. The stories and the test solve
 * with it; the window never does.
 */
export const trigClicksFor = (
  type: number,
  { a, b, c, d }: TrigParams,
): [Pt, Pt][] => {
  if (!b) return []
  const out: [Pt, Pt][] = []
  const ks = [0, 1, -1, 2, -2, 3, -3, 4, -4]
  switch (type) {
    case DrawingFigure.Sinus:
      for (const k of ks) {
        const x1 = -c + (6 * k) / b
        const ak = k % 2 ? -a : a
        out.push([
          { x: x1, y: 2 * d + 8 },
          { x: x1 + 3 / b, y: 2 * (ak + d) + 8 },
        ])
      }
      return out
    case DrawingFigure.Cosinus:
      // normalize_c_argument divides by trunc(|b|): below 1 only c = 0 holds
      for (const k of Math.abs(b) >= 1 ? ks : [0]) {
        const x2 = -c + (6 * k) / b
        const ak = k % 2 ? -a : a
        out.push([
          { x: x2 - 3 / b, y: 2 * d + 8 },
          { x: x2, y: 2 * (ak + d) + 8 },
        ])
      }
      return out
    case DrawingFigure.Tangent:
      for (const k of ks) {
        const x1 = -c + (4 * k) / b
        out.push(
          [
            { x: x1, y: 2 * d + 2 },
            { x: x1 + 1 / b, y: 2 * (a + d) + 2 },
          ],
          [
            { x: x1, y: 2 * d + 2 },
            { x: x1 - 1 / b, y: 2 * (d - a) + 2 },
          ],
        )
      }
      return out
    case DrawingFigure.Cotangent:
      for (const k of ks) {
        const x1 = 2 * Math.abs(1 / b) - c + (4 * k) / Math.abs(b)
        out.push([
          { x: x1, y: 2 * d + 2 },
          { x: x1 - 1 / b, y: 2 * (a + d) + 2 },
        ])
      }
      return out
    case DrawingFigure.Arcsin: {
      const x1 = -2 * c
      return [
        [
          { x: x1, y: d },
          { x: x1 + 2 / b, y: 3 * a + d },
        ],
        [
          { x: x1, y: d },
          { x: x1 - 2 / b, y: d - 3 * a },
        ],
      ]
    }
    case DrawingFigure.Arccos: {
      // ArccosTaskAnswer takes |a1| and the sign from b1: from the middle
      // of the curve up to its far end, or down to its near end (y = d)
      const x1 = -2 * c
      const A = Math.abs(a)
      return [
        [
          { x: x1, y: d + 3 * A },
          { x: x1 - 2 / b, y: d + 6 * A },
        ],
        [
          { x: x1, y: d + 3 * A },
          { x: x1 + 2 / b, y: d },
        ],
      ]
    }
    default:
      return []
  }
}

/** Is a node (cells) on the grid — `margin` cells beyond it allowed. */
export const onTrigGrid = (axes: TrigAxes, p: Pt, margin = 0) =>
  Math.abs(p.x) <= axes.X + margin + 1e-9 &&
  Math.abs(p.y) <= axes.Y + margin + 1e-9

/**
 * The pupil's curve from two nodes (cells), as polylines in cells. A run
 * breaks where the curve leaves the grid by more than its height or jumps
 * across an asymptote (tan, cot), and where it is not defined (arcsin and
 * arccos outside [−1, 1]).
 */
export const trigShapes = (
  type: number,
  p1: Pt,
  p2: Pt,
  axes: TrigAxes,
): Shape[] => {
  const params = trigParamsOf(type, toTrigWire(axes, p1), toTrigWire(axes, p2))
  return params ? trigCurveShapes(type, params, axes) : []
}

/**
 * The curve of given a, b, c, d as polylines in cells — the pupil's (from two
 * clicks, above) and the condition's: a figure 190…240 of a drawing carries
 * a, b, c, d itself (Task_10_2_7_1: y = sin x, the pupil reads it).
 */
export const trigCurveShapes = (
  type: number,
  params: TrigParams,
  axes: TrigAxes,
): Shape[] => {
  const f = trigCurve(type, params)
  if (!f) return []
  const { X, Y } = axes
  const out: Shape[] = []
  let run: Pt[] = []
  const end = () => {
    if (run.length > 1) out.push({ kind: 'polyline', points: run })
    run = []
  }
  const steps = X * 2 * 20
  for (let i = 0; i <= steps; i += 1) {
    const u = -X + (2 * X * i) / steps
    const v = f(u)
    const prev = run[run.length - 1]
    if (!Number.isFinite(v) || Math.abs(v) > 2 * Y) {
      end()
      continue
    }
    if (prev && Math.abs(v - prev.y) > Y) end()
    run.push({ x: u, y: v })
  }
  end()
  return out
}
