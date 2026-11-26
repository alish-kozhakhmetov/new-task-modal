import { DrawingFigure, type PlaneMode } from './drawing-figure'
import { NEEDS_DIFFERENT_X, type Pt } from './plane-answer'

/**
 * Several figures on one plane (scenario E, 50 generators in lessons: lines
 * of a system, segments of a polygon, a graph whose type the pupil picks).
 *
 * As DrawingFigureList.jsx of the old window: a figure is drawn by two
 * clicks, one figure is active and takes the clicks, the pupil adds the next
 * one and may delete any. Unlike the old window, only finished figures go
 * into the answer: an empty or half figure there makes every answer module
 * count one figure too many (EquationsGraphTaskAnswer, GraphFunctionTaskAnswer
 * compare the numbers first).
 */
export type DrawnFigure = { type: number; points: Pt[] }
/** `fills` — the points that mark the shaded region (scenario F). */
export type MultiDraft = {
  figures: DrawnFigure[]
  active: number
  fills?: Pt[]
}

type MultiMode = Extract<PlaneMode, { kind: 'multi' }>

export const initialMulti = (mode: MultiMode): MultiDraft =>
  mode.fixed == null
    ? { figures: [], active: -1 }
    : { figures: [{ type: mode.fixed, points: [] }], active: 0 }

const clean = (p: Pt): Pt => ({
  x: Number(p.x.toFixed(6)),
  y: Number(p.y.toFixed(6)),
})

/** A figure the answer may carry: two points that define it. */
export const isFinished = (f: DrawnFigure) =>
  f.points.length === 2 &&
  !(NEEDS_DIFFERENT_X.has(f.type) && f.points[0].x === f.points[1].x)

/** The store string: `{figures, fillingPoints}` of the finished figures, in order. */
export const toMultiAnswer = (draft: MultiDraft): string => {
  const done = draft.figures.filter(isFinished)
  if (!done.length) return ''
  return JSON.stringify({
    figures: done.map((f) => ({
      points: f.points.map(clean),
      type: f.type,
      dashed: false,
    })),
    fillingPoints: (draft.fills ?? []).map(clean),
  })
}

/** The store string back into figures; a reset ('') gives the plane's start. */
export const fromMultiAnswer = (
  answer: string,
  mode: MultiMode,
): MultiDraft => {
  try {
    const parsed = JSON.parse(answer) as {
      figures?: { type?: number; points?: Pt[] }[]
      fillingPoints?: Pt[]
    }
    const figures = (parsed.figures ?? []).map((f) => ({
      type: Number(f.type),
      points: (f.points ?? []).map(clean),
    }))
    const fills = (parsed.fillingPoints ?? []).map(clean)
    if (figures.length) return { figures, active: figures.length - 1, fills }
  } catch {
    /* '' or not ours */
  }
  return initialMulti(mode)
}

/** Words of the panel that the host dictionary does not carry yet. */
export const FIGURE_NAMES: Record<
  number,
  { rus: string; kaz: string; eng: string }
> = {
  // reactjs_client common/Localization.js, figureTypes (rus «кубич.» spelled out)
  [DrawingFigure.Line]: { rus: 'Прямая', kaz: 'Түзу', eng: 'Line' },
  [DrawingFigure.LineSegment]: {
    rus: 'Отрезок',
    kaz: 'Кесінді',
    eng: 'Segment',
  },
  [DrawingFigure.Parabola]: {
    rus: 'Парабола',
    kaz: 'Парабола',
    eng: 'Parabola',
  },
  [DrawingFigure.CubicParabola]: {
    rus: 'Кубическая парабола',
    kaz: 'Кубтық парабола',
    eng: 'Cubic parabola',
  },
  [DrawingFigure.Hyperbola]: {
    rus: 'Гипербола',
    kaz: 'Гипербола',
    eng: 'Hyperbola',
  },
  [DrawingFigure.Circle]: {
    rus: 'Окружность',
    kaz: 'Шеңбер',
    eng: 'Circle',
  },
  [DrawingFigure.RootFunction]: {
    rus: 'График корня',
    kaz: 'Түбір графигі',
    eng: 'Square root',
  },
}

export const PANEL_WORDS = {
  add: { rus: 'Добавить', kaz: 'Қосу', eng: 'Add' },
  remove: { rus: 'Удалить', kaz: 'Жою', eng: 'Delete' },
  // old window fillGraph: «заливка», «бояу», «filling» — here a verb, a button
  fill: { rus: 'Закрасить', kaz: 'Бояу', eng: 'Fill' },
  choose: {
    rus: 'Выберите график',
    kaz: 'Графикті таңдаңыз',
    eng: 'Choose graph',
  },
}

/**
 * Which side of each figure a point lies on: lines and segments by the side
 * of their line, circles inside or out, and the axes when the plane limits
 * the shading by them (isFillingLimitedByAxis). Points with the same
 * signature are one region — what the old window shaded from the pupil's
 * filling point. Other curves do not bound a region here.
 */
export const regionSignature = (
  figures: DrawnFigure[],
  q: Pt,
  byAxes: boolean,
): string => {
  const sign = (v: number) => (v > 1e-9 ? '+' : v < -1e-9 ? '-' : '0')
  const parts = figures.filter(isFinished).map((f) => {
    const [a, b] = f.points
    if (f.type === DrawingFigure.Line || f.type === DrawingFigure.LineSegment)
      return sign((b.x - a.x) * (q.y - a.y) - (b.y - a.y) * (q.x - a.x))
    if (f.type === DrawingFigure.Circle)
      return sign(
        (q.x - a.x) ** 2 +
          (q.y - a.y) ** 2 -
          ((b.x - a.x) ** 2 + (b.y - a.y) ** 2),
      )
    return ''
  })
  if (byAxes) parts.push(sign(q.x), sign(q.y))
  return parts.join('')
}
