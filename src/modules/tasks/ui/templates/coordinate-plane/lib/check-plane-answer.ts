import { DrawingFigure } from './drawing-figure'
import { compileGraphFunction } from './expression'
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

    default:
      return false
  }
}
