import {
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import {
  PlaneAxes,
  PlaneFigure,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-figures'
import {
  fromPointToDot,
  planeLength,
  type PlaneOptions,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import {
  INK,
  STROKE,
} from '@/modules/tasks/ui/templates/complex/shared/figures/figure-paint'
import { LABEL_PX } from '@/modules/tasks/ui/templates/complex/shared/figures/use-label-scale'

import {
  figureShapes,
  functionFigureShapes,
  type Field,
  type Shape,
} from '../lib/curves'
import { DrawingFigure, type PlaneMode } from '../lib/drawing-figure'
import { applyClick, type PlaneDraft, type Pt } from '../lib/plane-answer'
import type { CoordinatePlaneFigure } from '../lib/types.task'

import styles from './coordinate-plane.module.scss'

/** The pupil's ink: brand, not the condition's black (rule: semantics, not palette). */
const PUPIL_INK = 'var(--text-brand)'
const POINT_R = 5
const GHOST_R = 7

interface Props {
  figure: CoordinatePlaneFigure
  mode: PlaneMode
  draft: PlaneDraft
  onDraftChange?: (draft: PlaneDraft) => void
  deps: TaskModalDependencies
  readOnly?: boolean
  /** Accessible name of the plane: the task's own text. */
  label?: string
}

export const toPlaneOptions = (
  figure: CoordinatePlaneFigure,
): PlaneOptions => ({
  minPosition: figure.minPosition ?? -5,
  maxPosition: figure.maxPosition ?? 5,
  tickStep: figure.tickStep || 1,
  stepSize: figure.stepSize ?? 30,
  showAxis: figure.showAxis !== false,
  showCells: figure.showCells !== false,
  tickStepXMultiply: figure.tickStepXMultiply ?? 1,
  tickStepYMultiply: figure.tickStepYMultiply ?? 1,
  xAxisLabel: figure.xAxisLabel ?? 'x',
  yAxisLabel: figure.yAxisLabel ?? 'y',
  reduceHeight: figure.reduceHeight,
})

/**
 * The nodes a point may go to: the field plus one tick beyond each edge — the
 * old window snapped within its whole viewBox, which runs a cell past the
 * field, and some answers sit there (Task_11_9_5_9: y = −6 on a −5…5 plane).
 */
const nodeRange = (options: PlaneOptions) => ({
  lo: options.minPosition - options.tickStep,
  hi: options.maxPosition + options.tickStep,
})

/** Screen pixel → nearest node of the plane, in plane units; null off the field. */
const snap = (options: PlaneOptions, vx: number, vy: number): Pt | null => {
  const cell = options.stepSize / options.tickStep
  const start = options.stepSize
  const ux = options.minPosition + (vx - start) / cell
  const uy = options.maxPosition - (vy - start) / cell
  const t = options.tickStep
  const x = Math.round(ux / t) * t
  const y = Math.round(uy / t) * t
  const { lo, hi } = nodeRange(options)
  // half a cell of slack around the nodes, then clamp: an edge node stays reachable
  if (ux < lo - t / 2 || ux > hi + t / 2 || uy < lo - t / 2 || uy > hi + t / 2)
    return null
  const clamp = (v: number) => Number(Math.min(hi, Math.max(lo, v)).toFixed(6))
  return { x: clamp(x), y: clamp(y) }
}

/**
 * A plane without cells and axes is a row of the condition's dots, and the
 * pupil picks one of them (5th grade «точка на прямой»: Task_5_3_4_8,
 * Task_5_3_6_*). The dots are the targets, not grid nodes: they sit between
 * nodes (y = 0.5), where the old window landed only through its shifted
 * viewBox.
 */
const dotTargets = (figure: CoordinatePlaneFigure): Pt[] | null => {
  if (figure.showCells !== false || figure.showAxis === true) return null
  const given = Array.isArray(figure.figures) ? figure.figures : []
  const pts = given.flatMap((f) => {
    const p = (f as { type?: unknown; point?: { x?: unknown; y?: unknown } })
      .point
    return Number((f as { type?: unknown }).type) === DrawingFigure.Point && p
      ? [{ x: Number(p.x), y: Number(p.y) }]
      : []
  })
  return pts.length ? pts.filter((p) => Number.isFinite(p.x + p.y)) : null
}

const nearest = (targets: Pt[], to: Pt) =>
  targets.reduce((best, p) =>
    Math.hypot(p.x - to.x, p.y - to.y) <
    Math.hypot(best.x - to.x, best.y - to.y)
      ? p
      : best,
  )

/** The next target from `at` in the arrow's direction, or `at` itself. */
const stepAmong = (targets: Pt[], at: Pt, dx: number, dy: number): Pt => {
  const ahead = targets.filter((p) =>
    dx
      ? Math.sign(p.x - at.x) === Math.sign(dx)
      : Math.sign(p.y - at.y) === Math.sign(dy),
  )
  return ahead.length ? nearest(ahead, at) : at
}

/** Condition figures the shared renderer does not draw (function, triangle). */
const extraShapes = (f: Record<string, unknown>, field: Field): Shape[] => {
  const type = Number(f.type)
  if (type === DrawingFigure.Function) return functionFigureShapes(f, field)
  if (type === 40) {
    const pts = [f.point1, f.point2, f.point3].filter(Boolean) as Pt[]
    return pts.length === 3
      ? [{ kind: 'polyline', points: [...pts, pts[0]] }]
      : []
  }
  return []
}

const ShapeView = ({
  shape,
  options,
  color,
}: {
  shape: Shape
  options: PlaneOptions
  color: string
}) => {
  const dot = (p: Pt) => fromPointToDot(options, p.x, p.y)
  if (shape.kind === 'circle') {
    const c = dot(shape.center)
    const r = (shape.radius * options.stepSize) / options.tickStep
    return (
      <circle
        cx={c.x}
        cy={c.y}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={STROKE.data}
      />
    )
  }
  if (shape.kind === 'arrow') {
    const a = dot(shape.from)
    const b = dot(shape.to)
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
    return (
      <g>
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={color}
          strokeWidth={STROKE.data}
        />
        <path
          d="M-12,-5 L0,0 L-12,5z"
          fill={color}
          transform={`translate(${b.x},${b.y}) rotate(${angle})`}
        />
      </g>
    )
  }
  const d = shape.points
    .map((p, i) => {
      const q = dot(p)
      return `${i ? 'L' : 'M'}${q.x.toFixed(2)},${q.y.toFixed(2)}`
    })
    .join(' ')
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={STROKE.data}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  )
}

/**
 * The plane the pupil answers on: the condition's drawing, the pupil's points
 * and the figure they define. A click (tap) puts a point on the nearest node;
 * the keyboard walks the nodes with the arrows and puts a point with Enter.
 */
export const InteractivePlane = ({
  figure,
  mode,
  draft,
  onDraftChange,
  deps,
  readOnly = false,
  label,
}: Props) => {
  const options = useMemo(() => toPlaneOptions(figure), [figure])
  const length = planeLength(options)
  // The whole declared field: the pupil may need any node of it (no fit to content).
  const height = length
  const field: Field = {
    min: options.minPosition - options.tickStep,
    max: options.maxPosition + options.tickStep,
  }
  const svgRef = useRef<SVGSVGElement>(null)
  const [ghost, setGhost] = useState<Pt | null>(null)
  const [cursor, setCursor] = useState<Pt | null>(null)
  const translate = (value: unknown) => deps.global.translateTasks(value)

  const given = Array.isArray(figure.figures) ? figure.figures : []
  const targets = useMemo(() => dotTargets(figure), [figure])
  const interactive =
    !readOnly && mode.kind !== 'unsupported' && Boolean(onDraftChange)

  const toNode = (e: PointerEvent<SVGSVGElement>): Pt | null => {
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!svg || !ctm) return null
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    const node = snap(options, p.x, p.y)
    if (!targets || !node) return node
    const cell = options.stepSize / options.tickStep
    const raw = {
      x: options.minPosition + (p.x - options.stepSize) / cell,
      y: options.maxPosition - (p.y - options.stepSize) / cell,
    }
    return nearest(targets, raw)
  }

  const commit = (p: Pt) => {
    if (!interactive) return
    onDraftChange?.(applyClick(mode, draft, p))
  }

  const start = (): Pt =>
    cursor ??
    draft.points[draft.points.length - 1] ??
    (targets ? nearest(targets, { x: 0, y: 0 }) : { x: 0, y: 0 })

  // Focus from the keyboard shows the cursor at once: the ring is where Enter
  // will put the point (at the origin, or at the last point put).
  const onFocus = (e: FocusEvent<SVGSVGElement>) => {
    if (!interactive || cursor) return
    let fromKeyboard = true
    try {
      fromKeyboard = e.currentTarget.matches(':focus-visible')
    } catch {
      /* an engine without :focus-visible — treat as the keyboard */
    }
    if (!fromKeyboard) return
    const at = start()
    setCursor(at)
    setGhost(at)
  }

  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!interactive) return
    const t = options.tickStep
    const at = start()
    const move: Record<string, [number, number]> = {
      ArrowLeft: [-t, 0],
      ArrowRight: [t, 0],
      ArrowUp: [0, t],
      ArrowDown: [0, -t],
    }
    if (move[e.key]) {
      e.preventDefault()
      const [dx, dy] = move[e.key]
      const { lo, hi } = nodeRange(options)
      const clamp = (v: number) => Math.min(hi, Math.max(lo, v))
      const next = targets
        ? stepAmong(targets, at, dx, dy)
        : {
            x: Number(clamp(at.x + dx).toFixed(6)),
            y: Number(clamp(at.y + dy).toFixed(6)),
          }
      setCursor(next)
      setGhost(next)
    } else if ((e.key === 'Enter' || e.key === ' ') && (cursor ?? ghost)) {
      e.preventDefault()
      commit((cursor ?? ghost)!)
    }
  }

  const pupilShapes: Shape[] =
    mode.kind === 'figure' && draft.points.length >= 2
      ? figureShapes(mode.figureType, draft.points[0], draft.points[1], field)
      : []

  return (
    <svg
      ref={svgRef}
      className={styles.plane}
      data-testid="coordinate-plane-interactive"
      data-mode={mode.kind}
      data-points={draft.points.map((p) => `${p.x};${p.y}`).join(' ')}
      data-cursor={cursor ? `${cursor.x};${cursor.y}` : undefined}
      width={length}
      height={height}
      viewBox={`0 0 ${length} ${height}`}
      fontSize={LABEL_PX}
      role={interactive ? 'application' : 'img'}
      aria-label={label}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={() => {
        setCursor(null)
        setGhost(null)
      }}
      onPointerMove={(e) => interactive && setGhost(toNode(e))}
      onPointerDown={(e) => interactive && setGhost(toNode(e))}
      onPointerUp={(e) => {
        if (!interactive) return
        const p = toNode(e)
        if (p) commit(p)
        if (e.pointerType !== 'mouse') setGhost(null)
      }}
      onPointerLeave={() => setGhost(null)}
      onPointerCancel={() => setGhost(null)}
      data-interactive={interactive ? 'true' : 'false'}
    >
      <PlaneAxes options={options} />
      <g data-plane-layer="condition">
        {given.map((f, i) => {
          const extra = extraShapes(f, field)
          if (extra.length)
            return extra.map((s, j) => (
              <ShapeView
                key={`c${i}-${j}`}
                shape={s}
                options={options}
                color={INK}
              />
            ))
          return (
            <PlaneFigure
              key={`c${i}`}
              options={options}
              figure={f}
              translate={translate}
            />
          )
        })}
      </g>
      <g data-plane-layer="pupil">
        {pupilShapes.map((s, i) => (
          <ShapeView
            key={`s${i}`}
            shape={s}
            options={options}
            color={PUPIL_INK}
          />
        ))}
        {draft.points.map((p, i) => {
          const d = fromPointToDot(options, p.x, p.y)
          return (
            <circle
              key={`p${i}`}
              data-pupil-point={`${p.x};${p.y}`}
              cx={d.x}
              cy={d.y}
              r={POINT_R}
              fill={PUPIL_INK}
            />
          )
        })}
        {ghost && interactive ? (
          <circle
            data-ghost
            cx={fromPointToDot(options, ghost.x, ghost.y).x}
            cy={fromPointToDot(options, ghost.x, ghost.y).y}
            r={GHOST_R}
            fill="none"
            stroke={PUPIL_INK}
            strokeWidth={STROKE.hair}
            pointerEvents="none"
          />
        ) : null}
      </g>
    </svg>
  )
}
