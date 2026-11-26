import { DrawingFigure } from './drawing-figure'
import { compileExpression } from './expression'
import type { Pt } from './plane-answer'

/** The visible field in plane units, a little wider so curves leave the edge. */
export type Field = { min: number; max: number }

export type Shape =
  | { kind: 'polyline'; points: Pt[] }
  | { kind: 'circle'; center: Pt; radius: number }
  | { kind: 'arrow'; from: Pt; to: Pt }

const STEPS = 240

/**
 * Samples y = f(x) over the field, split where the value leaves the field or
 * is not a number — a hyperbola gives two branches, a root starts at its
 * vertex, nothing is drawn across an asymptote.
 */
export const sample = (
  f: (x: number) => number,
  field: Field,
  from = field.min,
  to = field.max,
): Pt[][] => {
  const out: Pt[][] = []
  let run: Pt[] = []
  const pad = (field.max - field.min) * 0.5
  const step = (to - from) / STEPS
  for (let i = 0; i <= STEPS; i += 1) {
    const x = from + step * i
    const y = f(x)
    if (!Number.isFinite(y) || y < field.min - pad || y > field.max + pad) {
      if (run.length > 1) out.push(run)
      run = []
      continue
    }
    run.push({ x, y })
  }
  if (run.length > 1) out.push(run)
  return out
}

const lines = (runs: Pt[][]): Shape[] =>
  runs.map((points) => ({ kind: 'polyline', points }))

/**
 * The figure two clicks define — the same curve the backend will check:
 * every formula below is the one its answer module evaluates at the second
 * point (ParabolaTaskAnswer, HyperbolaTaskAnswer, … in
 * matheducator_task_common/lib/task_models/task_answers/coordinate_plane).
 * Returns [] while the two points do not define the figure (same x for a
 * parabola: no curve rather than a wrong one).
 */
export const figureShapes = (
  type: number,
  p1: Pt,
  p2: Pt,
  field: Field,
): Shape[] => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  switch (type) {
    case DrawingFigure.LineSegment:
      return [{ kind: 'polyline', points: [p1, p2] }]
    case DrawingFigure.Vector:
      return [{ kind: 'arrow', from: p1, to: p2 }]
    case DrawingFigure.Line: {
      if (!dx && !dy) return []
      const span = (field.max - field.min) * 4
      const len = Math.hypot(dx, dy)
      const ux = dx / len
      const uy = dy / len
      return [
        {
          kind: 'polyline',
          points: [
            { x: p1.x - ux * span, y: p1.y - uy * span },
            { x: p1.x + ux * span, y: p1.y + uy * span },
          ],
        },
      ]
    }
    case DrawingFigure.Circle: {
      const radius = Math.hypot(dx, dy)
      return radius ? [{ kind: 'circle', center: p1, radius }] : []
    }
    case DrawingFigure.Parabola: {
      if (!dx) return []
      const a = dy / dx ** 2
      return lines(sample((x) => a * (x - p1.x) ** 2 + p1.y, field))
    }
    case DrawingFigure.CubicParabola: {
      if (!dx) return []
      const a = dy / dx ** 3
      return lines(sample((x) => a * (x - p1.x) ** 3 + p1.y, field))
    }
    case DrawingFigure.ModuleX: {
      if (!dx) return []
      const a = Math.abs(dy / dx) * (dy >= 0 ? 1 : -1)
      return lines(sample((x) => a * Math.abs(x - p1.x) + p1.y, field))
    }
    case DrawingFigure.Hyperbola: {
      if (!dx) return []
      const k = dy * dx
      const left = sample(
        (x) => k / (x - p1.x) + p1.y,
        field,
        field.min,
        p1.x - 1e-3,
      )
      const right = sample(
        (x) => k / (x - p1.x) + p1.y,
        field,
        p1.x + 1e-3,
        field.max,
      )
      return lines([...left, ...right])
    }
    case DrawingFigure.RootFunction: {
      if (!dx) return []
      const k = dy ** 2 / dx
      const sign = dy >= 0 ? 1 : -1
      const f = (x: number) => p1.y + sign * Math.sqrt(k * (x - p1.x))
      const [from, to] = k >= 0 ? [p1.x, field.max] : [field.min, p1.x]
      return lines(sample(f, field, from, to))
    }
    default:
      return []
  }
}

/**
 * A function figure of the condition (type 120): `formula` over
 * `startPoint`…`endPoint`, expr-eval syntax as the old window read it.
 */
export const functionFigureShapes = (
  figure: Record<string, unknown>,
  field: Field,
): Shape[] => {
  if (typeof figure.formula !== 'string') return []
  let f: (x: number) => number
  try {
    const compiled = compileExpression(figure.formula)
    f = (x) => compiled({ x })
  } catch {
    return []
  }
  const from =
    typeof figure.startPoint === 'number' ? figure.startPoint : field.min
  const to = typeof figure.endPoint === 'number' ? figure.endPoint : field.max
  return lines(
    sample(
      f,
      field,
      Math.max(from, field.min - 1),
      Math.min(to, field.max + 1),
    ),
  )
}
