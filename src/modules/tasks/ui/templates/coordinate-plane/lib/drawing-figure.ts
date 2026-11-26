/**
 * What the pupil draws on a `coordinatePlane` task, and how.
 *
 * Ids mirror the backend enum `CoordinatePlaneDrawingFigure`
 * (matheducator_task_common/lib/enums/coordinate_plane_drawing_figure.ex).
 * The plane's `drawingFigure` decides the mechanic; there is no text field —
 * the old window lists `CoordinatePlane` among descriptions without tools and
 * sends what the pupil drew (TaskDescriptionAndAnswerInput.jsx, case
 * CoordinatePlane → onDrawingFinished).
 */
export const DrawingFigure = {
  None: 0,
  Any: 5,
  Point: 10,
  MultipleDots: 15,
  Line: 20,
  LineSegment: 30,
  Circle: 60,
  Vector: 80,
  Parabola: 90,
  Function: 120,
  CubicParabola: 130,
  ModuleX: 140,
  Hyperbola: 150,
  RootFunction: 180,
  Sinus: 190,
  Cosinus: 200,
  Tangent: 210,
  Cotangent: 220,
  Arcsin: 230,
  Arccos: 240,
} as const

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
}

export type PlaneMode =
  | { kind: 'point' }
  | { kind: 'dots' }
  | { kind: 'figure'; figureType: number }
  /** Shown, not answerable here yet (trigonometry, several figures, shading). */
  | { kind: 'unsupported'; reason: string }

interface ModeInput {
  drawingFigure?: number
  canDrawMultipleFigures?: boolean
  canFill?: boolean
  allowedFigures?: number[]
}

/**
 * The mechanic of a plane, from its flags.
 *
 * Measured on 261 generators in lessons (grades 1–11, backend source,
 * 26.11): point 17, several points 12, one figure by two clicks 132 (87
 * without trigonometry), several figures 57, shading 28, typed answer 15.
 */
export const planeModeOf = (figure: ModeInput): PlaneMode => {
  const type = Number(figure.drawingFigure ?? DrawingFigure.None)
  if (figure.canFill) return { kind: 'unsupported', reason: 'fill' }
  if (figure.canDrawMultipleFigures || type === DrawingFigure.Any)
    return { kind: 'unsupported', reason: 'multiple' }
  if (type === DrawingFigure.Point) return { kind: 'point' }
  if (type === DrawingFigure.MultipleDots) return { kind: 'dots' }
  if (TWO_POINT_FIGURES[type]) return { kind: 'figure', figureType: type }
  if (type >= DrawingFigure.Sinus && type <= DrawingFigure.Arccos)
    return { kind: 'unsupported', reason: 'trigonometry' }
  return { kind: 'unsupported', reason: 'none' }
}
