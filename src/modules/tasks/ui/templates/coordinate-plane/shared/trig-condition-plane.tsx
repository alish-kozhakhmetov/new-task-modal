import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { PlaneFigure } from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-figures'
import {
  fromPointToDot,
  type PlaneOptions,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import {
  INK,
  STROKE,
} from '@/modules/tasks/ui/templates/complex/shared/figures/figure-paint'
import { LABEL_PX } from '@/modules/tasks/ui/templates/complex/shared/figures/use-label-scale'

import { isTrigType, trigCurveShapes, type TrigAxes } from '../lib/trig'

import { TrigPlaneAxes, trigPlaneOptions, trigPlaneSize } from './trig-axes'

/** MyDecimal / Fraction as Poison writes them, or a plain number. */
const num = (v: unknown): number => {
  if (v && typeof v === 'object') {
    const o = v as Record<string, number>
    if ('coef' in o && 'exp' in o) return (o.sign ?? 1) * o.coef * 10 ** o.exp
    if ('a' in o && 'b' in o)
      return ((o.sign ?? 1) * ((o.integer ?? 0) * o.b + o.a)) / o.b
  }
  return Number(v)
}

/**
 * A drawing of the condition on the trigonometric axes: «read the graph»
 * (Task_10_2_7_1 — y = sin x drawn, the pupil types the interval). The old
 * window put such a plane on TrigonometrySinCosAxis whatever it declared;
 * the shared renderer drew an empty −5…5 grid, so there was nothing to read.
 */
export const TrigConditionPlane = ({
  base,
  axes,
  figures,
  deps,
}: {
  base: PlaneOptions
  axes: TrigAxes
  figures: Record<string, unknown>[]
  deps: TaskModalDependencies
}) => {
  const options = trigPlaneOptions(base, axes)
  const { width, height } = trigPlaneSize(options, axes)
  const translate = (value: unknown) => deps.global.translateTasks(value)
  const path = (pts: { x: number; y: number }[]) =>
    pts
      .map((p, i) => {
        const q = fromPointToDot(options, p.x, p.y)
        return `${i ? 'L' : 'M'}${q.x.toFixed(2)},${q.y.toFixed(2)}`
      })
      .join(' ')
  return (
    <svg
      data-figure-type="110"
      data-plane-axes="trig"
      data-testid="complex-coordinate-plane-part"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fontSize={LABEL_PX}
      style={{ maxWidth: '100%', height: 'auto' }}
      role="img"
    >
      <TrigPlaneAxes options={options} axes={axes} />
      <g data-plane-layer="condition">
        {figures.map((f, i) => {
          const type = Number(f.type)
          if (!isTrigType(type))
            return (
              <PlaneFigure
                // eslint-disable-next-line react-x/no-array-index-key -- the condition's figures never reorder
                key={i}
                options={options}
                figure={f}
                translate={translate}
              />
            )
          const shapes = trigCurveShapes(
            type,
            { a: num(f.a), b: num(f.b), c: num(f.c), d: num(f.d) },
            axes,
          )
          return shapes.map((s, j) =>
            s.kind === 'polyline' ? (
              <path
                // eslint-disable-next-line react-x/no-array-index-key -- runs of one curve never reorder
                key={`${i}-${j}`}
                data-trig-curve={type}
                d={path(s.points)}
                fill="none"
                stroke={INK}
                strokeWidth={STROKE.data}
                strokeDasharray={f.dashed ? '6 4' : undefined}
                strokeLinejoin="round"
              />
            ) : null,
          )
        })}
      </g>
    </svg>
  )
}
