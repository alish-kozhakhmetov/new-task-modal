import { DrawingFigure } from './drawing-figure'
import { compileGraphFunction } from './expression'
import type { Pt } from './plane-answer'
import {
  fromTrigWire,
  onTrigGrid,
  trigAxesOf,
  trigClicksFor,
  type TrigAxes,
} from './trig'

const TRIG_ANSWERS: Record<string, number> = {
  SinusTaskAnswer: DrawingFigure.Sinus,
  CosinusTaskAnswer: DrawingFigure.Cosinus,
  TangentTaskAnswer: DrawingFigure.Tangent,
  CotangentTaskAnswer: DrawingFigure.Cotangent,
  ArcsinTaskAnswer: DrawingFigure.Arcsin,
  ArccosTaskAnswer: DrawingFigure.Arccos,
}

/** MyDecimal / Fraction as Poison writes them, or a plain number. */
const numOf = (v: unknown): number => {
  if (v && typeof v === 'object') {
    const o = v as Record<string, number>
    if ('coef' in o && 'exp' in o) return (o.sign ?? 1) * o.coef * 10 ** o.exp
    if ('a' in o && 'b' in o)
      return ((o.sign ?? 1) * ((o.integer ?? 0) * o.b + o.a)) / o.b
  }
  return Number(v)
}

/**
 * The clicks that answer a task, derived from the backend's answer — what a
 * pupil who solved it would put on the plane. Storybook plays and the
 * differential test use it; the window never does.
 *
 * Returns null when the answer has a form this prototype does not draw.
 */
export const solvePlaneAnswer = (
  answer: unknown,
  plane?: Parameters<typeof trigAxesOf>[0],
): Pt[] | null => {
  const trig = plane ? trigAxesOf(plane) : null
  const pts = solveWire(answer, trig)
  return trig && pts ? pts.map((p) => fromTrigWire(trig, p)) : pts
}

/** The solving clicks as the answer carries them (wire coordinates). */
const solveWire = (answer: unknown, trig: TrigAxes | null): Pt[] | null => {
  if (Array.isArray(answer))
    return answer.length ? solveWire(answer[0], trig) : null
  if (!answer || typeof answer !== 'object') return null
  const a = answer as Record<string, unknown>
  const kind = (typeof a._struct === 'string' ? a._struct : '').replace(
    /^TaskAnswers\.CoordinatePlane\./,
    '',
  )
  const p = (v: unknown): Pt => {
    const o = v as Record<string, number>
    return { x: Number(o.x), y: Number(o.y) }
  }
  const onGraph = (vertex: Pt, fn: string): Pt[] | null => {
    try {
      const { rhs } = compileGraphFunction(fn)
      for (const dx of [1, -1, 2, -2, 3, -3, 4, 4]) {
        const x = vertex.x + dx
        const y = rhs({ x })
        if (
          Number.isFinite(y) &&
          Number.isInteger(Math.round(y * 1e6) / 1e6) &&
          Math.abs(y) <= 12
        )
          return [vertex, { x, y: Math.round(y * 1e6) / 1e6 }]
      }
    } catch {
      return null
    }
    return null
  }

  if (TRIG_ANSWERS[kind]) {
    if (!trig) return null
    const round = (p: Pt) => ({
      x: Math.round(p.x * 1e6) / 1e6,
      y: Math.round(p.y * 1e6) / 1e6,
    })
    const pairs = trigClicksFor(TRIG_ANSWERS[kind], {
      a: numOf(a.a),
      b: numOf(a.b),
      c: numOf(a.c),
      d: numOf(a.d),
    }).map((pair) => pair.map(round))
    // nodes only, on the grid first, then one cell past it (the window's margin)
    const node = (p: Pt) => Number.isInteger(p.x) && Number.isInteger(p.y)
    const fits = (margin: number) =>
      pairs.find((pair) =>
        pair.every(
          (p) => node(p) && onTrigGrid(trig, fromTrigWire(trig, p), margin),
        ),
      )
    return fits(0) ?? fits(1) ?? null
  }

  switch (kind) {
    case 'CustomeTypes.CoordinatePlane.Point':
      return [p(a)]
    case 'TaskAnswers.AnyOfThemTaskAnswer':
      return Array.isArray(a.answers) ? solveWire(a.answers[0], trig) : null
    case 'PointListTaskAnswer':
      return (a.points as unknown[]).map(p)
    case 'LineSegmentTaskAnswer':
    case 'VectorTaskAnswer':
    case 'LineTaskAnswer':
      return [p(a.point1), p(a.point2)]
    case 'CircleTaskAnswer': {
      const c = p(a.center_point)
      return [c, { x: c.x + Number(a.radius), y: c.y }]
    }
    case 'HyperbolaTaskAnswer': {
      const c = p(a.symmetry_point)
      const k = Number(a.k)
      for (const dx of [1, -1, 2, -2, k, -k]) {
        if (dx && Number.isInteger(k / dx))
          return [c, { x: c.x + dx, y: k / dx + c.y }]
      }
      return null
    }
    case 'ParabolaTaskAnswer':
    case 'CubicParabolaTaskAnswer':
    case 'ModuleXTaskAnswer':
    case 'RootFunctionTaskAnswer':
      return onGraph(p(a.vertex_point), String(a.graph_function))
    case 'GraphFunctionTaskAnswer': {
      // one function → two points of it (several functions: not this prototype)
      const fns = a.functions as string[]
      if (!Array.isArray(fns) || fns.length !== 1) return null
      try {
        const { defines, rhs } = compileGraphFunction(fns[0])
        const pts: Pt[] = []
        for (const t of [0, 1, -1, 2, -2, 3, -3]) {
          const v = defines === 'x' ? rhs({ y: t }) : rhs({ x: t })
          if (Number.isInteger(v) && Math.abs(v) <= 10)
            pts.push(defines === 'x' ? { x: v, y: t } : { x: t, y: v })
          if (pts.length === 2) return pts
        }
      } catch {
        return null
      }
      return null
    }
    default:
      return null
  }
}

/** Figure type of an answer module, for the wire answer of a solved task. */
export const figureTypeOfAnswer = (answer: unknown): number | null => {
  const a = (Array.isArray(answer) ? answer[0] : answer) as Record<
    string,
    unknown
  > | null
  const kind = (typeof a?._struct === 'string' ? a._struct : '').replace(
    /^TaskAnswers\.CoordinatePlane\./,
    '',
  )
  const map: Record<string, number> = {
    LineSegmentTaskAnswer: DrawingFigure.LineSegment,
    VectorTaskAnswer: DrawingFigure.Vector,
    LineTaskAnswer: DrawingFigure.Line,
    GraphFunctionTaskAnswer: DrawingFigure.Line,
    CircleTaskAnswer: DrawingFigure.Circle,
    HyperbolaTaskAnswer: DrawingFigure.Hyperbola,
    ParabolaTaskAnswer: DrawingFigure.Parabola,
    CubicParabolaTaskAnswer: DrawingFigure.CubicParabola,
    ModuleXTaskAnswer: DrawingFigure.ModuleX,
    RootFunctionTaskAnswer: DrawingFigure.RootFunction,
  }
  if (kind === 'TaskAnswers.AnyOfThemTaskAnswer')
    return figureTypeOfAnswer((a!.answers as unknown[])[0])
  return map[kind] ?? null
}
