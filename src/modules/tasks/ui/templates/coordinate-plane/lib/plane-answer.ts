import { DrawingFigure, type PlaneMode } from './drawing-figure'

export type Pt = { x: number; y: number }

/**
 * What the pupil has put on the plane. The store keeps a string, so this is
 * serialised into it (`toAnswerString`) and read back (`fromAnswerString`):
 * the template is controlled by the store's answer, and a reset clears it.
 */
export type PlaneDraft = { points: Pt[] }

/**
 * The answer as the backend checks it (TaskChecker.answer_correct?):
 *
 * - one point — the string `(x;y)`; Point.correct? also takes `x;y`, `(x,y)`;
 * - several points — `{"points":[{x,y}…]}` → PointListTaskAnswer.correct?;
 * - a figure — `{"figures":[{type, points:[p1,p2], dashed}], "fillingPoints":[]}`
 *   → GraphUserAnswer.from_map, then the answer module of the figure.
 *
 * The two JSON forms are maps on the wire, not strings: `toWireAnswer` turns
 * the store string into the object `api.checkAnswer` must send. A string
 * `{"figures":…}` would reach the `is_binary` branch of the checker and fail.
 */
export const toAnswerString = (mode: PlaneMode, draft: PlaneDraft): string => {
  const pts = draft.points
  if (!pts.length) return ''
  switch (mode.kind) {
    case 'point':
      return `(${num(pts[0].x)};${num(pts[0].y)})`
    case 'dots':
      return JSON.stringify({ points: pts.map(clean) })
    case 'figure':
      if (pts.length < 2) return ''
      return JSON.stringify({
        figures: [
          {
            points: pts.slice(0, 2).map(clean),
            type: mode.figureType,
            dashed: false,
          },
        ],
        fillingPoints: [],
      })
    default:
      return ''
  }
}

export const fromAnswerString = (answer: string): PlaneDraft => {
  const s = answer.trim()
  if (!s) return { points: [] }
  const point = /^\(?\s*(-?[\d.]+)\s*[;,،]\s*(-?[\d.]+)\s*\)?$/.exec(s)
  if (point) return { points: [{ x: Number(point[1]), y: Number(point[2]) }] }
  try {
    const parsed = JSON.parse(s) as {
      points?: Pt[]
      figures?: { points?: Pt[] }[]
    }
    if (Array.isArray(parsed.figures))
      return { points: (parsed.figures[0]?.points ?? []).map(clean) }
    if (Array.isArray(parsed.points))
      return { points: parsed.points.map(clean) }
  } catch {
    /* not ours */
  }
  return { points: [] }
}

/** Store string → what the API body carries (object for the JSON forms). */
export const toWireAnswer = (
  answer: string,
): string | Record<string, unknown> => {
  const s = answer.trim()
  if (s.startsWith('{"figures"') || s.startsWith('{"points"')) {
    try {
      return JSON.parse(s) as Record<string, unknown>
    } catch {
      return answer
    }
  }
  return answer
}

const num = (v: number) => String(Number(v.toFixed(6)))
const clean = (p: Pt): Pt => ({
  x: Number(p.x.toFixed(6)),
  y: Number(p.y.toFixed(6)),
})

export const samePoint = (a: Pt, b: Pt) =>
  Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9

/**
 * A click on the plane, applied to the draft.
 *
 * - one point: the click moves it;
 * - several points: the click toggles a node;
 * - a figure: first click, second click; a click on a placed point removes
 *   it; a third click elsewhere moves the nearer point and keeps its role
 *   (the vertex stays the vertex). The old window removed the nearer point
 *   and appended the new one, so a click near the vertex silently swapped
 *   vertex and second point.
 */
export const applyClick = (
  mode: PlaneMode,
  draft: PlaneDraft,
  p: Pt,
): PlaneDraft => {
  const pts = draft.points
  const hit = pts.findIndex((q) => samePoint(q, p))
  switch (mode.kind) {
    case 'point':
      return { points: hit === 0 ? [] : [p] }
    case 'dots':
      return {
        points: hit >= 0 ? pts.filter((_, i) => i !== hit) : [...pts, p],
      }
    case 'figure': {
      if (hit >= 0) return { points: pts.filter((_, i) => i !== hit) }
      if (pts.length < 2) return { points: [...pts, p] }
      const d = (q: Pt) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2
      const replace = d(pts[0]) < d(pts[1]) ? 0 : 1
      return { points: pts.map((q, i) => (i === replace ? p : q)) }
    }
    default:
      return draft
  }
}

/** Ids of figures whose second point may not share the first one's x. */
export const NEEDS_DIFFERENT_X: ReadonlySet<number> = new Set([
  DrawingFigure.Parabola,
  DrawingFigure.CubicParabola,
  DrawingFigure.ModuleX,
  DrawingFigure.Hyperbola,
  DrawingFigure.RootFunction,
])
