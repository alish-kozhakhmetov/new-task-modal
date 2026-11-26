import { describe, expect, it } from 'vitest'

import { figureShapes, functionFigureShapes } from './curves'
import { DrawingFigure, planeModeOf } from './drawing-figure'
import { compileExpression, compileGraphFunction } from './expression'
import {
  applyClick,
  fromAnswerString,
  toAnswerString,
  toWireAnswer,
} from './plane-answer'

const field = { min: -6, max: 6 }

describe('expression — both dialects that reach the plane', () => {
  // strings copied from real payloads (data/all-tasks.json, fixtures)
  it.each([
    ['5 - (x + (1))^2', 1, 1],
    ['-abs(x + 2)', 0, -2],
    ['(x - (3))^2 - 3', 5, 1],
  ])('figure formula %s at %d → %d', (src, x, y) => {
    expect(compileExpression(src)({ x })).toBe(y)
  })

  it.each([
    ['y = 1.0 * (x - (5)) * (x - (5)) + (0)', 6, 1],
    ['y=5x^2', 1, 5],
    ['y=\\frac{1}{2}x^2', 2, 2],
    ['y=-\\frac{1}{2}x^2', 2, -2],
    ['y=abs(-5*x)', -1, 5],
    ['y = :math.sqrt(5.0 * (x - (0))) + (0)', 5, 5],
    ['y=\\frac{1}{2}*x^3', 2, 4],
  ])('answer function %s at %d → %d', (src, x, y) => {
    const g = compileGraphFunction(src)
    expect(g.defines).toBe('y')
    expect(g.rhs({ x })).toBeCloseTo(y, 12)
  })

  it('x = … defines x', () => {
    const g = compileGraphFunction('x=0*y')
    expect(g.defines).toBe('x')
    expect(g.rhs({ y: 3 })).toBe(0)
  })

  it('refuses unknown names instead of guessing', () => {
    expect(() => compileExpression('foo(x)')({ x: 1 })).toThrow()
    expect(() => compileExpression('x +')).toThrow()
  })
})

describe('mode of a plane — from its flags', () => {
  it.each([
    [{ drawingFigure: 10 }, 'point'],
    [{ drawingFigure: 15 }, 'dots'],
    [{ drawingFigure: 90 }, 'figure'],
    [{ drawingFigure: 5, canDrawMultipleFigures: true }, 'unsupported'],
    [{ drawingFigure: 20, canFill: true }, 'unsupported'],
    [{ drawingFigure: 190 }, 'unsupported'],
    [{ drawingFigure: 0 }, 'unsupported'],
  ])('%o → %s', (figure, kind) => {
    expect(planeModeOf(figure).kind).toBe(kind)
  })
})

describe('clicks → answer the backend reads', () => {
  const parabola = {
    kind: 'figure',
    figureType: DrawingFigure.Parabola,
  } as const

  it('one point: (x;y), a second click moves it', () => {
    const mode = { kind: 'point' } as const
    let d = applyClick(mode, { points: [] }, { x: 1, y: -5 })
    expect(toAnswerString(mode, d)).toBe('(1;-5)')
    d = applyClick(mode, d, { x: 2, y: 0 })
    expect(toAnswerString(mode, d)).toBe('(2;0)')
    expect(toWireAnswer('(2;0)')).toBe('(2;0)')
  })

  it('several points: a click toggles a node', () => {
    const mode = { kind: 'dots' } as const
    let d = applyClick(mode, { points: [] }, { x: -2, y: 0 })
    d = applyClick(mode, d, { x: 2, y: 0 })
    d = applyClick(mode, d, { x: 3, y: 1 })
    d = applyClick(mode, d, { x: 3, y: 1 })
    expect(toWireAnswer(toAnswerString(mode, d))).toEqual({
      points: [
        { x: -2, y: 0 },
        { x: 2, y: 0 },
      ],
    })
  })

  it('a figure: two clicks, a third moves the nearer point and keeps the vertex first', () => {
    let d = applyClick(parabola, { points: [] }, { x: 5, y: 0 })
    expect(toAnswerString(parabola, d)).toBe('') // half a figure is no answer
    d = applyClick(parabola, d, { x: 6, y: 1 })
    d = applyClick(parabola, d, { x: 7, y: 4 }) // nearer to (6;1)
    expect(d.points).toEqual([
      { x: 5, y: 0 },
      { x: 7, y: 4 },
    ])
    d = applyClick(parabola, d, { x: 4, y: 0 }) // nearer to the vertex: vertex moves, stays first
    expect(d.points[0]).toEqual({ x: 4, y: 0 })
    expect(toWireAnswer(toAnswerString(parabola, d))).toEqual({
      figures: [
        {
          points: [
            { x: 4, y: 0 },
            { x: 7, y: 4 },
          ],
          type: 90,
          dashed: false,
        },
      ],
      fillingPoints: [],
    })
  })

  it('a click on a placed point removes it', () => {
    const d = applyClick(parabola, { points: [{ x: 1, y: 1 }] }, { x: 1, y: 1 })
    expect(d.points).toEqual([])
  })

  it('the store string reads back into the same points', () => {
    for (const s of [
      '(1;-5)',
      '{"points":[{"x":-2,"y":0}]}',
      '{"figures":[{"points":[{"x":0,"y":0},{"x":1,"y":1}],"type":90,"dashed":false}],"fillingPoints":[]}',
    ]) {
      const back = fromAnswerString(s)
      expect(back.points.length).toBeGreaterThan(0)
    }
    expect(fromAnswerString('').points).toEqual([])
  })
})

describe('the drawn curve passes through both clicks', () => {
  const through = (
    type: number,
    p1: { x: number; y: number },
    p2: { x: number; y: number },
  ) => {
    const shapes = figureShapes(type, p1, p2, field)
    expect(shapes.length).toBeGreaterThan(0)
    const pts = shapes.flatMap((s) => (s.kind === 'polyline' ? s.points : []))
    const near = (p: { x: number; y: number }) =>
      pts.some((q) => Math.abs(q.x - p.x) < 0.06 && Math.abs(q.y - p.y) < 0.2)
    return near(p1) && near(p2)
  }
  it.each([
    [DrawingFigure.Parabola, { x: 5, y: 0 }, { x: 6, y: 1 }],
    [DrawingFigure.CubicParabola, { x: 0, y: 0 }, { x: 1, y: 2 }],
    [DrawingFigure.ModuleX, { x: 0, y: 0 }, { x: 1, y: 5 }],
    [DrawingFigure.RootFunction, { x: 0, y: 0 }, { x: 5, y: 5 }],
  ])('type %d', (type, p1, p2) => {
    expect(through(type, p1, p2)).toBe(true)
  })

  it('a hyperbola: two branches, none across the asymptote', () => {
    const shapes = figureShapes(
      DrawingFigure.Hyperbola,
      { x: 0, y: 0 },
      { x: 1, y: 4 },
      field,
    )
    expect(shapes.length).toBe(2)
  })

  it('no curve while the points do not define one (same x)', () => {
    expect(
      figureShapes(
        DrawingFigure.Parabola,
        { x: 1, y: 0 },
        { x: 1, y: 3 },
        field,
      ),
    ).toEqual([])
  })

  it('a condition function figure is drawn on its interval', () => {
    const shapes = functionFigureShapes(
      { type: 120, formula: '-abs(x + 2)', startPoint: -4, endPoint: 0 },
      field,
    )
    const xs = shapes.flatMap((s) =>
      s.kind === 'polyline' ? s.points.map((p) => p.x) : [],
    )
    expect(Math.min(...xs)).toBeCloseTo(-4)
    expect(Math.max(...xs)).toBeCloseTo(0)
  })
})
