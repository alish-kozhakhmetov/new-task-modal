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
  // grade 11 (11_6_1, 11_6_4): the curve and its asymptote, by two clicks each
  ExponentialGraph: 270,
  AsymptoteLine: 280,
  LogarithmGraph: 290,
} as const
