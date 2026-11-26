import { DrawingFigure } from './drawing-figure'
import { compileGraphFunction, compileInequality } from './expression'
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
      // near first; up to 10 for y = √(5x) (Task_8_3_13_1: x = 5)
      const dxs = [1, -1, 2, -2, 3, -3, 4, -4]
      for (let d = 5; d <= 10; d += 1) dxs.push(d, -d)
      for (const dx of dxs) {
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
      // one function → two points of it (several: solveFigures)
      const fns = a.functions as string[]
      if (!Array.isArray(fns) || fns.length !== 1) return null
      return graphFunctionPoints(fns[0])
    }
    default:
      return null
  }
}

/**
 * Two nodes of a line `y = …` or `x = …` (GraphFunctionTaskAnswer checks the
 * clicks one by one against the function). The near nodes first, so a line
 * through the origin is drawn there; |t| up to 10 for a slope like 5/9
 * (Task_6_6_16_5: x = 3 and x = −6).
 */
const graphFunctionPoints = (fn: string): Pt[] | null => {
  try {
    const { defines, rhs } = compileGraphFunction(fn)
    const pts: Pt[] = []
    const ts = [0, 1, -1, 2, -2, 3, -3]
    for (let t = 4; t <= 10; t += 1) ts.push(t, -t)
    for (const t of ts) {
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

const structOf = (answer: unknown) => {
  const a = answer as Record<string, unknown> | null
  return (typeof a?._struct === 'string' ? a._struct : '').replace(
    /^TaskAnswers\.CoordinatePlane\./,
    '',
  )
}

/**
 * The figures that answer a task with several (scenario E), in the order the
 * answer module reads them — what a pupil who solved it draws:
 *
 * - GraphFunctionTaskAnswer of n functions → n lines, figures[i] ↔
 *   functions[i] (the module compares by index; a list answer carries the
 *   permutations, the first is taken);
 * - EquationsGraphTaskAnswer → one figure per graph (any order is accepted);
 * - PolygonTaskAnswer → its sides as segments, vertex to vertex;
 * - any single figure → that figure (a plane where the pupil picks the type).
 *
 * Null when a part has a form the window does not draw.
 */
export const solveFigures = (
  answer: unknown,
  field?: { lo: number; hi: number },
): { type: number; points: Pt[] }[] | null => {
  // a list: any element is accepted — the first the plane can draw
  if (Array.isArray(answer)) {
    const all = answer.map((a) => solveFigures(a, field))
    const fits = (figs: { points: Pt[] }[] | null) =>
      figs != null &&
      (!field ||
        figs.every((f) =>
          f.points.every((p) =>
            [p.x, p.y].every((v) => v >= field.lo && v <= field.hi),
          ),
        ))
    return all.find(fits) ?? all.find(Boolean) ?? null
  }
  if (!answer || typeof answer !== 'object') return null
  const a = answer as Record<string, unknown>
  const p = (v: unknown): Pt => {
    const o = v as Record<string, number>
    return { x: Number(o.x), y: Number(o.y) }
  }
  switch (structOf(a)) {
    case 'TaskAnswers.AnyOfThemTaskAnswer':
      return Array.isArray(a.answers) ? solveFigures(a.answers, field) : null
    case 'GraphFunctionTaskAnswer': {
      const fns = a.functions as string[]
      if (!Array.isArray(fns) || !fns.length) return null
      const out = fns.map((fn) => graphFunctionPoints(fn))
      return out.every(Boolean)
        ? out.map((points) => ({ type: DrawingFigure.Line, points: points! }))
        : null
    }
    case 'EquationsGraphTaskAnswer':
    case 'InEqualitiesGraphTaskAnswer': {
      const graphs = a.graphs as unknown[]
      if (!Array.isArray(graphs) || !graphs.length) return null
      const out = graphs.map((g) => solveFigures(g))
      return out.every((f) => f?.length === 1) ? out.map((f) => f![0]) : null
    }
    case 'PolygonTaskAnswer': {
      const pts = (a.points as unknown[]).map(p)
      if (pts.length < 2) return null
      return pts.map((q, i) => ({
        type: DrawingFigure.LineSegment,
        points: [q, pts[(i + 1) % pts.length]],
      }))
    }
    default: {
      const type = figureTypeOfAnswer(a)
      const points = solveWire(a, null)
      return type != null && points?.length === 2 ? [{ type, points }] : null
    }
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

/** The inequalities answer a list or an AnyOfThem picks for `figures`. */
const inequalitiesOf = (
  answer: unknown,
  field?: { lo: number; hi: number },
): string[] | null => {
  if (Array.isArray(answer)) {
    // the element solveFigures drew
    const want = JSON.stringify(solveFigures(answer, field))
    const hit: unknown = (answer as unknown[]).find(
      (a) => JSON.stringify(solveFigures(a)) === want,
    )
    return hit ? inequalitiesOf(hit, field) : null
  }
  const a = answer as Record<string, unknown> | null
  if (!a) return null
  if (structOf(a) === 'TaskAnswers.AnyOfThemTaskAnswer')
    return inequalitiesOf(a.answers, field)
  return structOf(a) === 'InEqualitiesGraphTaskAnswer'
    ? (a.functions as string[])
    : null
}

const holdsAll = (fns: string[]): ((p: Pt) => boolean) | null => {
  try {
    const all = fns.map(compileInequality)
    return (p) => all.every((f) => f(p))
  } catch {
    return null
  }
}

/** Does a filling point satisfy every inequality of the answer. */
export const fillPredicate = (
  answer: unknown,
  field: { lo: number; hi: number },
): ((p: Pt) => boolean) | null => {
  const fns = inequalitiesOf(answer, field)
  return fns?.length ? holdsAll(fns) : null
}

/**
 * The filling point of a plane to shade (scenario F): a point half a tick
 * apart that satisfies every inequality, its four neighbours too when one
 * such exists (inside the region, off its edge). Null when the answer
 * shades nothing (a GraphFunction on a canFill plane).
 */
export const solveFill = (
  answer: unknown,
  field: { lo: number; hi: number; step: number },
): Pt | null => {
  const holds = fillPredicate(answer, field)
  if (!holds) return null
  const h = field.step / 2
  let any: Pt | null = null
  for (let y = field.lo; y <= field.hi + 1e-9; y += h)
    for (let x = field.lo; x <= field.hi + 1e-9; x += h) {
      const p = { x: Math.round(x * 1e6) / 1e6, y: Math.round(y * 1e6) / 1e6 }
      if (!holds(p)) continue
      any ??= p
      const around: Pt[] = [
        { x: p.x + h, y: p.y },
        { x: p.x - h, y: p.y },
        { x: p.x, y: p.y + h },
        { x: p.x, y: p.y - h },
      ]
      if (around.every(holds)) return p
    }
  return any
}
