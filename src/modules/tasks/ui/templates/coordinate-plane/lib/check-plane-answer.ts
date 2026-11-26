import { DrawingFigure } from './drawing-figure'
import { compileGraphFunction, compileInequality } from './expression'
import type { Pt } from './plane-answer'

/**
 * The backend's verdict on a plane answer, for Storybook only.
 *
 * A port of TaskChecker.answer_correct? and the coordinate-plane answer
 * modules (matheducator_task_common, 21.10): the stories are solvable
 * without a server. The site checks on the server, never with this.
 * Kept honest by a differential test against the compiled backend
 * (scripts/coordinate-plane/check-against-backend.mjs → backend-verdicts.json).
 *
 * `answer` is the task answer as the backend serialises it: snake_case keys
 * and `_struct` naming the module (answer/1 of the generator).
 */
export type BackendAnswer = unknown

type UserFigure = { type: number; points: Pt[]; dashed: boolean }

const isObj = (v: unknown): v is Record<string, unknown> =>
  v != null && typeof v === 'object' && !Array.isArray(v)

const toNum = (v: unknown): number => {
  if (typeof v === 'number') return v
  if (isObj(v)) {
    // MyDecimal / Fraction as Poison writes them
    if (
      v._struct === 'Fraction' &&
      typeof v.a === 'number' &&
      typeof v.b === 'number'
    )
      return (Number(v.sign ?? 1) * (Number(v.integer ?? 0) * v.b + v.a)) / v.b
    if (typeof v.coef === 'number' && typeof v.exp === 'number')
      return Number(v.sign ?? 1) * v.coef * 10 ** v.exp
  }
  return Number(v)
}

const pt = (v: unknown): Pt | null =>
  isObj(v) ? { x: toNum(v.x), y: toNum(v.y) } : null

const eq = (a: Pt | null, b: Pt | null) =>
  a != null && b != null && a.x === b.x && a.y === b.y

const userFigures = (wire: unknown): UserFigure[] | null => {
  if (!isObj(wire) || !Array.isArray(wire.figures)) return null
  return wire.figures.map((f) => ({
    type: Number((f as Record<string, unknown>).type),
    points: ((f as { points?: unknown[] }).points ?? []).map((p) => pt(p)!),
    dashed: Boolean((f as Record<string, unknown>).dashed),
  }))
}

const evalAt = (fn: string, x: number): number => {
  const { rhs } = compileGraphFunction(fn)
  return rhs({ x })
}

/** Point.correct?: the four string forms, then coordinate by coordinate. */
const pointCorrect = (
  answer: Record<string, unknown>,
  user: string,
): boolean => {
  const x = toNum(answer.x)
  const y = toNum(answer.y)
  const s = user.replace(/\s/g, '')
  if ([`(${x};${y})`, `(${x},${y})`, `${x};${y}`, `${x},${y}`].includes(s))
    return true
  const parts = s.replace(/^\(/, '').replace(/\)$/, '').split(';')
  if (parts.length !== 2) return false
  return (
    Number(parts[0]) === x &&
    Number(parts[1]) === y &&
    parts.every((p) => p !== '')
  )
}

const single = (wire: unknown, type: number): UserFigure | null => {
  const figs = userFigures(wire)
  if (!figs || figs.length !== 1) return null
  const f = figs[0]
  if (f.points.length !== 2 || f.type !== type) return null
  return f
}

const dashedOk = (answer: Record<string, unknown>, f: UserFigure) =>
  Boolean(answer['dashed?']) === f.dashed

export const checkPlaneAnswer = (
  answer: BackendAnswer,
  wire: unknown,
): boolean => {
  if (wire == null || wire === '') return false
  if (Array.isArray(answer))
    return answer.some((a) => checkPlaneAnswer(a, wire))
  if (!isObj(answer)) {
    return (
      typeof wire === 'string' && wire.replace(/\s/g, '') === String(answer)
    )
  }
  const kind = (
    typeof answer._struct === 'string' ? answer._struct : ''
  ).replace(/^TaskAnswers\.CoordinatePlane\./, '')

  switch (kind) {
    case 'CustomeTypes.CoordinatePlane.Point':
      return typeof wire === 'string' && pointCorrect(answer, wire)

    case 'TaskAnswers.AnyOfThemTaskAnswer':
      return (
        Array.isArray(answer.answers) &&
        answer.answers.some((a) => checkPlaneAnswer(a, wire))
      )

    case 'PointListTaskAnswer': {
      if (!isObj(wire) || !Array.isArray(wire.points)) return false
      const expected = (answer.points as unknown[]).map(pt)
      const got = wire.points.map(pt)
      if (expected.length !== got.length) return false
      return got.every((g) => expected.some((e) => eq(g, e)))
    }

    case 'LineSegmentTaskAnswer': {
      const f = single(wire, DrawingFigure.LineSegment)
      if (!f) return false
      const [a, b] = [pt(answer.point1), pt(answer.point2)]
      return (
        (eq(f.points[0], a) && eq(f.points[1], b)) ||
        (eq(f.points[0], b) && eq(f.points[1], a))
      )
    }

    case 'VectorTaskAnswer': {
      const f = single(wire, DrawingFigure.Vector)
      return (
        f != null &&
        eq(f.points[0], pt(answer.point1)) &&
        eq(f.points[1], pt(answer.point2))
      )
    }

    case 'LineTaskAnswer': {
      const f = single(wire, DrawingFigure.Line)
      if (!f || !dashedOk(answer, f)) return false
      const a = pt(answer.point1)!
      const b = pt(answer.point2)!
      // LineTaskAnswer.get_y: a horizontal or vertical answer line yields y0
      const getY = (x: number) =>
        a.y === b.y || a.x === b.x
          ? a.y
          : (x - a.x) / ((a.x - b.x) / (a.y - b.y)) + a.y
      return f.points.every((p) => Math.abs(getY(p.x) - p.y) <= 1e-10)
    }

    case 'CircleTaskAnswer': {
      const figs = userFigures(wire)
      if (!figs || figs.length !== 1) return false
      const f = figs[0]
      if (
        f.points.length !== 2 ||
        f.type !== DrawingFigure.Circle ||
        !dashedOk(answer, f)
      )
        return false
      const c = pt(answer.center_point)!
      if (!eq(f.points[0], c)) return false
      const r = toNum(answer.radius)
      const { x, y } = f.points[1]
      const t = Math.sqrt(Math.abs(r * r - (x - c.x) ** 2))
      return (
        Math.abs(y - (t + c.y)) <= 1e-10 || Math.abs(y - (-t + c.y)) <= 1e-10
      )
    }

    case 'HyperbolaTaskAnswer': {
      const f = single(wire, DrawingFigure.Hyperbola)
      if (!f || !dashedOk(answer, f)) return false
      const c = pt(answer.symmetry_point)!
      if (!eq(f.points[0], c)) return false
      const { x, y } = f.points[1]
      return x !== c.x && toNum(answer.k) / (x - c.x) + c.y === y
    }

    case 'ParabolaTaskAnswer':
    case 'CubicParabolaTaskAnswer':
    case 'RootFunctionTaskAnswer':
    case 'ModuleXTaskAnswer': {
      const type = {
        ParabolaTaskAnswer: DrawingFigure.Parabola,
        CubicParabolaTaskAnswer: DrawingFigure.CubicParabola,
        RootFunctionTaskAnswer: DrawingFigure.RootFunction,
        ModuleXTaskAnswer: DrawingFigure.ModuleX,
      }[kind]
      const f = single(wire, type)
      if (!f) return false
      // ModuleXTaskAnswer.correct? does not compare `dashed`
      if (kind !== 'ModuleXTaskAnswer' && !dashedOk(answer, f)) return false
      if (!eq(f.points[0], pt(answer.vertex_point))) return false
      try {
        return (
          evalAt(String(answer.graph_function), f.points[1].x) === f.points[1].y
        )
      } catch {
        return false
      }
    }

    case 'GraphFunctionTaskAnswer': {
      const figs = userFigures(wire)
      const fns = (answer.functions as string[]) ?? []
      if (!figs || figs.length !== fns.length) return false
      return fns.every((fn, i) => {
        const [p1, p2] = figs[i].points
        if (!p1 || !p2) return false
        try {
          const { defines, rhs } = compileGraphFunction(fn)
          return defines === 'x'
            ? rhs({ y: p1.y }) === p1.x && rhs({ y: p2.y }) === p2.x
            : rhs({ x: p1.x }) === p1.y && rhs({ x: p2.x }) === p2.y
        } catch {
          return false
        }
      })
    }

    case 'EquationsGraphTaskAnswer': {
      // as many figures as graphs, and every graph drawn by one of them alone
      const figs = userFigures(wire)
      const graphs = (answer.graphs as unknown[]) ?? []
      if (!figs || figs.length !== graphs.length) return false
      return graphs.every((g) =>
        figs.some((f) => checkPlaneAnswer(g, { figures: [f] })),
      )
    }

    case 'InEqualitiesGraphTaskAnswer': {
      // the graphs as EquationsGraph, then exactly filling_points_quantity
      // points, each satisfying every inequality
      const figs = userFigures(wire)
      const graphs = (answer.graphs as unknown[]) ?? []
      if (!figs || figs.length !== graphs.length) return false
      const fills =
        isObj(wire) && Array.isArray(wire.fillingPoints)
          ? wire.fillingPoints.map((p) => pt(p)!)
          : []
      const quantity = Number(answer.filling_points_quantity ?? 1)
      if (!fills.length || fills.length !== quantity) return false
      const drawn = graphs.every((g) =>
        figs.some((f) => checkPlaneAnswer(g, { figures: [f] })),
      )
      try {
        const fns = ((answer.functions as string[]) ?? []).map(
          compileInequality,
        )
        return drawn && fills.every((p) => fns.every((f) => f(p)))
      } catch {
        return false
      }
    }

    case 'PolygonTaskAnswer': {
      // only segments, and their distinct ends are the vertices (any order)
      const figs = userFigures(wire)
      if (!figs) return false
      if (!figs.every((f) => f.type === DrawingFigure.LineSegment)) return false
      const key = (p: Pt) => `${p.x};${p.y}`
      const got = [...new Set(figs.flatMap((f) => f.points.map(key)))].sort()
      const want = ((answer.points as unknown[]) ?? [])
        .map((p) => key(pt(p)!))
        .sort()
      return got.length === want.length && got.every((k, i) => k === want[i])
    }

    case 'SinusTaskAnswer':
    case 'CosinusTaskAnswer':
    case 'TangentTaskAnswer':
    case 'CotangentTaskAnswer':
    case 'ArcsinTaskAnswer':
    case 'ArccosTaskAnswer':
      return trigCorrect(kind, answer, wire)

    default:
      return false
  }
}

const sign = (v: number) => (v > 0 ? 1 : v < 0 ? -1 : 0)

const TRIG_TYPE: Record<string, number> = {
  SinusTaskAnswer: DrawingFigure.Sinus,
  CosinusTaskAnswer: DrawingFigure.Cosinus,
  TangentTaskAnswer: DrawingFigure.Tangent,
  CotangentTaskAnswer: DrawingFigure.Cotangent,
  ArcsinTaskAnswer: DrawingFigure.Arcsin,
  ArccosTaskAnswer: DrawingFigure.Arccos,
}

/**
 * The six answer modules of trigonometry/ (matheducator_task_common,
 * task_answers/coordinate_plane/trigonometry/*.ex). Each rebuilds a, b, c,
 * d from the two points in the old window's coordinates (lib/trig.ts) and
 * compares them with its own; a division by zero there is a raise, here
 * a refusal.
 */
const trigCorrect = (
  kind: string,
  answer: Record<string, unknown>,
  wire: unknown,
): boolean => {
  const f = single(wire, TRIG_TYPE[kind])
  if (!f) return false
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = f.points
  const a = toNum(answer.a)
  const b = toNum(answer.b)
  const c = toNum(answer.c)
  const d = toNum(answer.d)
  if (x1 === x2) return false
  switch (kind) {
    case 'SinusTaskAnswer': {
      const d1 = (y1 - 8) / 2
      const b1 = 12 / ((x2 - x1) * 4)
      const a1 = (y2 - 8) / 2 - d1
      const c1 = -x1
      const at = (x: number, A: number, B: number, C: number, D: number) =>
        A * Math.sin((B * (30 * (x + C)) * Math.PI) / 180) + D
      const near = (u: number, v: number) => Math.abs(u - v) <= 1e-9
      return (
        Math.abs(a) === Math.abs(a1) &&
        Math.abs(b) === Math.abs(b1) &&
        near(at(x1, a1, b1, c1, d1), at(x1, a, b, c, d)) &&
        near(at(x2, a1, b1, c1, d1), at(x2, a, b, c, d)) &&
        d === d1
      )
    }
    case 'CosinusTaskAnswer': {
      const d1 = (y1 - 8) / 2
      const b1 = 12 / ((x2 - x1) * 4)
      const a1 = (y2 - 8) / 2 - d1
      const c1 = -x2
      // normalize_c_argument: c = 0 stays 0, else c mod the half-period;
      // a |b| below 1 divides by zero there — a raise
      const norm = (B: number, C: number) => {
        if (C === 0) return 0
        const whole = Math.trunc(Math.abs(B)) * 2
        if (!whole) return NaN
        const period = Math.trunc(12 / whole)
        const r = Math.trunc(C) % period
        return C < 0 && r !== 0 ? r + period : r
      }
      return (
        Math.abs(a) === Math.abs(a1) &&
        Math.abs(b) === Math.abs(b1) &&
        norm(b, c) === norm(b1, c1) &&
        d === d1
      )
    }
    case 'TangentTaskAnswer':
    case 'CotangentTaskAnswer': {
      const tan = kind === 'TangentTaskAnswer'
      const d1 = (y1 - 2) / 2
      const b1 = tan ? 4 / ((x2 - x1) * 4) : 4 / ((x1 - x2) * 4)
      const a1 = (y2 - y1) / 2
      const c1 = tan ? -x1 : Math.abs(x2 - x1) * 2 - x1
      const norm = (C: number) => {
        const r = Math.trunc(C) % 4
        return C < 0 ? (r === 0 ? 0 : r + 4) : r
      }
      return (
        Math.abs(a) === Math.abs(a1) &&
        Math.abs(b) === Math.abs(b1) &&
        norm(c) === norm(c1) &&
        d === d1 &&
        sign(a * b) === sign(a1 * b1)
      )
    }
    case 'ArcsinTaskAnswer': {
      const a1 = (y2 - y1) / 3
      const b1 = 1 / ((x2 - x1) / 2)
      const c1 = -x1 / 2
      const d1 = y1
      return (
        Math.abs(a) === Math.abs(a1) &&
        Math.abs(b) === Math.abs(b1) &&
        c === c1 &&
        d === d1 &&
        sign(a * b) === sign(a1 * b1)
      )
    }
    case 'ArccosTaskAnswer': {
      const a1 = Math.abs((y2 - y1) / 3)
      const b1 = (1 / ((x1 - x2) / 2)) * (y2 > y1 ? 1 : -1)
      const c1 = -x1 / 2
      const d1 = y2 - (y2 > y1 ? (y2 - y1) * 2 : 0)
      return (
        Math.abs(a) === Math.abs(a1) &&
        Math.abs(b) === Math.abs(b1) &&
        c === c1 &&
        d === d1 &&
        sign(a * b) === sign(a1 * b1)
      )
    }
    default:
      return false
  }
}
