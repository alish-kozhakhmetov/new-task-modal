import {
  fromPointToDot,
  type PlaneOptions,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import {
  GRID_INK,
  INK,
  STROKE,
} from '@/modules/tasks/ui/templates/complex/shared/figures/figure-paint'
import { SvgFraction } from '@/modules/tasks/ui/templates/complex/shared/figures/svg-fraction'
import { LABEL_PX } from '@/modules/tasks/ui/templates/complex/shared/figures/use-label-scale'

import type { TrigAxes } from '../lib/trig'

/**
 * Plane options for the trigonometric grid: a cell maps through the same
 * `fromPointToDot` as everywhere, with the field −X…Y, so (u, v) cells land
 * where the old window drew them (TrigonometryAxis.js).
 */
export const trigPlaneOptions = (
  base: PlaneOptions,
  axes: TrigAxes,
): PlaneOptions => ({ ...base, minPosition: -axes.X, maxPosition: axes.Y })

/** Width and height in px: 2X × 2Y cells and a cell of margin each side. */
export const trigPlaneSize = (options: PlaneOptions, axes: TrigAxes) => {
  const side = (cells: number) =>
    options.stepSize * (cells / options.tickStep + 1) + options.stepSize
  return { width: side(2 * axes.X), height: side(2 * axes.Y) }
}

/** «3π/2» → a fraction in two tiers (math-signs.md, rule 3); else as is. */
const Label = ({
  x,
  y,
  text,
  anchor,
}: {
  x: number
  y: number
  text: string
  anchor: 'middle' | 'end'
}) => {
  const m = /^(−?\d*π)\/(\d+)$/.exec(text)
  if (m)
    return (
      <SvgFraction
        x={anchor === 'end' ? x - LABEL_PX * 0.6 : x}
        y={y}
        num={m[1]}
        den={m[2]}
        fontSize={LABEL_PX}
        fill={INK}
      />
    )
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontSize={LABEL_PX}
      fill={INK}
    >
      {text}
    </text>
  )
}

/**
 * Grid, axes and π-labels of a trigonometric plane. Weights and inks are the
 * ones of PlaneAxes (figure-paint.ts): grid 1, axes 2, ticks 1.5.
 */
export const TrigPlaneAxes = ({
  options,
  axes,
}: {
  options: PlaneOptions
  axes: TrigAxes
}) => {
  const { X, Y } = axes
  const { width, height } = trigPlaneSize(options, axes)
  const dot = (u: number, v: number) => fromPointToDot(options, u, v)
  const t = options.tickStep
  const us: number[] = []
  for (let u = -X; u <= X + 1e-9; u += t) us.push(u)
  const vs: number[] = []
  for (let v = -Y; v <= Y + 1e-9; v += t) vs.push(v)
  const o = dot(0, 0)
  const arrow = options.stepSize / 2
  return (
    <g>
      <g data-plane-layer="grid">
        {us.map((u) => (
          <line
            key={`v${u}`}
            x1={dot(u, 0).x}
            y1={dot(0, Y).y}
            x2={dot(u, 0).x}
            y2={dot(0, -Y).y}
            stroke={GRID_INK}
            strokeWidth={STROKE.grid}
          />
        ))}
        {vs.map((v) => (
          <line
            key={`h${v}`}
            x1={dot(-X, 0).x}
            y1={dot(0, v).y}
            x2={dot(X, 0).x}
            y2={dot(0, v).y}
            stroke={GRID_INK}
            strokeWidth={STROKE.grid}
          />
        ))}
      </g>
      <g data-plane-layer="x-axis">
        <line
          x1={0}
          y1={o.y}
          x2={width}
          y2={o.y}
          stroke={INK}
          strokeWidth={STROKE.data}
        />
        <path
          d={`M${arrow},${o.y - 5} L0,${o.y} L${arrow},${o.y + 5}z`}
          fill={INK}
        />
        <path
          d={`M${width - arrow},${o.y - 5} L${width},${o.y} L${width - arrow},${o.y + 5}z`}
          fill={INK}
        />
        {axes.xLabels.map(([u, text]) => (
          <g key={`xl${u}`}>
            <line
              x1={dot(u, 0).x}
              y1={o.y - 6}
              x2={dot(u, 0).x}
              y2={o.y + 6}
              stroke={INK}
              strokeWidth={STROKE.hair}
            />
            <Label
              x={dot(u, 0).x}
              y={o.y + LABEL_PX}
              text={text}
              anchor="middle"
            />
          </g>
        ))}
        <text
          x={width}
          y={o.y - LABEL_PX}
          textAnchor="end"
          fontSize={LABEL_PX}
          fill={INK}
        >
          {options.xAxisLabel}
        </text>
      </g>
      <g data-plane-layer="y-axis">
        <line
          x1={o.x}
          y1={0}
          x2={o.x}
          y2={height}
          stroke={INK}
          strokeWidth={STROKE.data}
        />
        <path
          d={`M${o.x - 5},${arrow} L${o.x},0 L${o.x + 5},${arrow}z`}
          fill={INK}
        />
        <path
          d={`M${o.x - 5},${height - arrow} L${o.x},${height} L${o.x + 5},${height - arrow}z`}
          fill={INK}
        />
        {axes.yLabels.map(([v, text]) => (
          <g key={`yl${v}`}>
            <line
              x1={o.x - 6}
              y1={dot(0, v).y}
              x2={o.x + 6}
              y2={dot(0, v).y}
              stroke={INK}
              strokeWidth={STROKE.hair}
            />
            <Label x={o.x - 9} y={dot(0, v).y} text={text} anchor="end" />
          </g>
        ))}
        <text x={o.x + 10} y={LABEL_PX * 0.9} fontSize={LABEL_PX} fill={INK}>
          {options.yAxisLabel}
        </text>
      </g>
      <text
        x={o.x - 9}
        y={o.y + LABEL_PX * 0.7}
        textAnchor="end"
        dominantBaseline="central"
        fontSize={LABEL_PX}
        fill={INK}
      >
        0
      </text>
    </g>
  )
}
