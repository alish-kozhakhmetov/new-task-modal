import { DrawingFigure } from './figure-ids'
import { isTrigType, trigAxesOf, type TrigAxes } from './trig'

export { DrawingFigure }

/** A figure drawn by two clicks: what the first and the second click mean. */
export const TWO_POINT_FIGURES: Record<
  number,
  { first: string; second: string }
> = {
  [DrawingFigure.Line]: { first: 'point', second: 'point' },
  [DrawingFigure.LineSegment]: { first: 'end', second: 'end' },
  [DrawingFigure.Vector]: { first: 'start', second: 'end' },
  [DrawingFigure.Circle]: { first: 'center', second: 'onCircle' },
  [DrawingFigure.Parabola]: { first: 'vertex', second: 'onGraph' },
  [DrawingFigure.CubicParabola]: { first: 'center', second: 'onGraph' },
  [DrawingFigure.ModuleX]: { first: 'vertex', second: 'onGraph' },
  [DrawingFigure.Hyperbola]: { first: 'center', second: 'onGraph' },
  [DrawingFigure.RootFunction]: { first: 'start', second: 'onGraph' },
  // trigonometry (Sinus.js … ArcCosinus.js): a point of the midline, then the
  // point a quarter period away — the old window's two clicks
  [DrawingFigure.Sinus]: { first: 'midline', second: 'peak' },
  [DrawingFigure.Cosinus]: { first: 'midline', second: 'peak' },
  [DrawingFigure.Tangent]: { first: 'center', second: 'onGraph' },
  [DrawingFigure.Cotangent]: { first: 'center', second: 'onGraph' },
  [DrawingFigure.Arcsin]: { first: 'center', second: 'end' },
  [DrawingFigure.Arccos]: { first: 'center', second: 'end' },
  [DrawingFigure.ExponentialGraph]: { first: 'onGraph', second: 'onGraph' },
  [DrawingFigure.AsymptoteLine]: { first: 'point', second: 'point' },
  [DrawingFigure.LogarithmGraph]: { first: 'onGraph', second: 'onGraph' },
}

/**
 * What the pupil may add on a plane with drawingFigure Any — the old
 * DrawingFigureChooser.jsx without the exponent, the logarithm and the
 * asymptote: the planes that need them name them in allowedFigures
 * (11_6_1: 270 and 280, 11_6_4: 290 and 280), see planeModeOf.
 */
export const CHOOSER = [
  DrawingFigure.Line,
  DrawingFigure.LineSegment,
  DrawingFigure.Parabola,
  DrawingFigure.CubicParabola,
  DrawingFigure.Hyperbola,
  DrawingFigure.Circle,
  DrawingFigure.RootFunction,
] as const

export type PlaneMode =
  | { kind: 'point' }
  | { kind: 'dots' }
  /** `trig` — drawn on the fixed trigonometric axes (lib/trig.ts). */
  | { kind: 'figure'; figureType: number; trig?: TrigAxes }
  /**
   * Figures, each by two clicks (scenarios E and F): `fixed` — the type the
   * plane draws (lines, segments, circles), null — the pupil picks each
   * figure's type from `choices` (drawingFigure Any); `many` — more than one
   * figure may be added; `fill` — the pupil then marks the region to shade
   * (canFill: one filling point, InEqualitiesGraphTaskAnswer).
   */
  | {
      kind: 'multi'
      fixed: number | null
      choices: number[]
      many: boolean
      fill: boolean
    }
  /** Shown, not answerable here (a typed answer, trigonometry off its axes…). */
  | { kind: 'unsupported'; reason: string }

const ASYMPTOTE_LAST = (t: number) =>
  t === DrawingFigure.AsymptoteLine ? 1 : 0

interface ModeInput {
  drawingFigure?: number
  canDrawMultipleFigures?: boolean
  canFill?: boolean
  allowedFigures?: number[]
  figures?: Record<string, unknown>[]
}

/**
 * The mechanic of a plane, from its flags.
 *
 * Measured on 261 generators in lessons (grades 1–11, backend source,
 * 26.11): point 17, several points 12, one figure by two clicks 132 (87
 * without trigonometry, 45 on the trigonometric axes since 27.11), several
 * figures 57, shading 28, typed answer 15.
 */
export const planeModeOf = (figure: ModeInput): PlaneMode => {
  const type = Number(figure.drawingFigure ?? DrawingFigure.None)
  const fill = Boolean(figure.canFill)
  if (fill || figure.canDrawMultipleFigures || type === DrawingFigure.Any) {
    const allowed = figure.allowedFigures ?? []
    if (allowed.some((t) => !TWO_POINT_FIGURES[t]))
      return { kind: 'unsupported', reason: 'allowed' }
    if (trigAxesOf(figure))
      return { kind: 'unsupported', reason: fill ? 'fill' : 'multiple' }
    const many =
      Boolean(figure.canDrawMultipleFigures) || type === DrawingFigure.Any
    // the exponent or the logarithm and its asymptote: the curve first
    if (type === DrawingFigure.Any && allowed.length)
      return {
        kind: 'multi',
        fixed: null,
        choices: [...allowed].sort(
          (a, b) => ASYMPTOTE_LAST(a) - ASYMPTOTE_LAST(b),
        ),
        many,
        fill,
      }
    if (type === DrawingFigure.Any)
      return { kind: 'multi', fixed: null, choices: [...CHOOSER], many, fill }
    if (TWO_POINT_FIGURES[type] && !isTrigType(type))
      return { kind: 'multi', fixed: type, choices: [type], many, fill }
    return { kind: 'unsupported', reason: fill ? 'fill' : 'multiple' }
  }
  if (type === DrawingFigure.Point) return { kind: 'point' }
  if (type === DrawingFigure.MultipleDots) return { kind: 'dots' }
  const trig = trigAxesOf(figure)
  if (isTrigType(type))
    return trig
      ? { kind: 'figure', figureType: type, trig }
      : { kind: 'unsupported', reason: 'trigonometry' }
  if (TWO_POINT_FIGURES[type])
    return trig
      ? { kind: 'figure', figureType: type, trig }
      : { kind: 'figure', figureType: type }
  if (type >= DrawingFigure.Sinus && type <= DrawingFigure.Arccos)
    return { kind: 'unsupported', reason: 'trigonometry' }
  return { kind: 'unsupported', reason: 'none' }
}
