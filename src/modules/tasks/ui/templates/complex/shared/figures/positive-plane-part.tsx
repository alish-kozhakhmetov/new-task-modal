import { useRef } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type {
  ComplexPositivePlanePart,
  PositivePlaneAxis,
} from '../../lib/types.task'
import styles from '../complex.module.scss'

import { GRID_INK, INK, paint, STROKE } from './figure-paint'
import { LABEL_PX, useLabelScale } from './use-label-scale'

interface Props {
  part: ComplexPositivePlanePart
  deps: TaskModalDependencies
}

/** Room left of the y axis and under the x axis (Matheducator: 50). */
const PADDING = 50

/** Matheducator `CoordinatePlaneDrawingFigure`. */
const POINT = 10
const LINE_SEGMENT = 30

const ticksOf = (axis: PositivePlaneAxis) =>
  (axis.ticks?.length ?? 0) || axis.ticksQuantity || 0

type Pt = { x?: number; y?: number }

/**
 * Quarter plane x ≥ 0, y ≥ 0 (part type 130), display-only — port of
 * Matheducator `PositiveCoordinatePlane`: graphs of motion, work, perimeter
 * and frequency in grades 6–7. The child reads the values off the graph and
 * types them into ordinary fields; nothing on the plane is clickable.
 *
 * Kept from the old screen: geometry (step, ticks, the 50px margin), labels
 * from `ticks` or `i × tickStepMultiply`. Changed to the drawing canon:
 * grid `--border-default` 1, axes 2, data 2, colours on the system palette,
 * labels at the condition's 18px (kept when the plane shrinks to a phone).
 */
export const PositivePlanePart = ({ part, deps }: Props) => {
  const { xAxis, yAxis } = part
  const svgRef = useRef<SVGSVGElement>(null)
  const scale = useLabelScale(svgRef)
  const font = LABEL_PX * scale
  const t = (value: unknown) => deps.global.translateTasks(value)

  const nx = ticksOf(xAxis)
  const ny = ticksOf(yAxis)
  const stepX = xAxis.stepSize ?? 40
  const stepY = yAxis.stepSize ?? 40
  const xLen = stepX * (nx + 1)
  const yLen = stepY * (ny + 1)
  const width = xLen + PADDING
  const height = yLen + PADDING
  const multX = xAxis.tickStepMultiply || 1
  const multY = yAxis.tickStepMultiply || 1

  // Origin at (PADDING, yLen); a point is in axis values, a tick in steps.
  const px = (value: number) => PADDING + (value / multX) * stepX
  const py = (value: number) => yLen - (value / multY) * stepY
  const tickText = (axis: PositivePlaneAxis, i: number, mult: number) =>
    axis.ticks?.length ? t(axis.ticks[i - 1]) : String(i * mult)

  const xs = Array.from({ length: nx }, (_, i) => i + 1)
  const ys = Array.from({ length: ny }, (_, i) => i + 1)
  const arrowX = stepX / 2
  const arrowY = stepY / 2

  const figures = (part.figures ?? []).map((figure, index) => {
    const type = Number(figure.type)
    if (type === LINE_SEGMENT) {
      const p1 = (figure.point1 ?? {}) as Pt
      const p2 = (figure.point2 ?? {}) as Pt
      const r = Number(figure.dotRadius) || 0
      const color = paint(figure.lineColor, INK)
      const dashed = figure.dashed === true
      return (
        <g key={index} data-plane-figure="segment">
          <line
            x1={px(p1.x ?? 0)}
            y1={py(p1.y ?? 0)}
            x2={px(p2.x ?? 0)}
            y2={py(p2.y ?? 0)}
            stroke={color}
            strokeWidth={dashed ? STROKE.hair : STROKE.data}
            strokeDasharray={dashed ? '6 6' : undefined}
            strokeLinecap="round"
          />
          {r > 0 ? (
            <>
              <circle cx={px(p1.x ?? 0)} cy={py(p1.y ?? 0)} r={r} fill={INK} />
              <circle cx={px(p2.x ?? 0)} cy={py(p2.y ?? 0)} r={r} fill={INK} />
            </>
          ) : null}
        </g>
      )
    }
    if (type === POINT) {
      // Matheducator: drawPoint({ ...figure, ...figure.point }).
      const p = {
        ...figure,
        ...((figure.point ?? {}) as Record<string, unknown>),
      }
      const x = Number(p.x) || 0
      const y = Number(p.y) || 0
      // A point on a graph is a marked point: 4px (rule 72).
      const r = Math.max(4, Number(figure.radius) || 0)
      const letter = typeof p.letter === 'string' ? p.letter : ''
      const text = figure.showOnlyLetter
        ? letter
        : figure.showCoordinate
          ? `${letter}(${x}; ${y})`
          : ''
      return (
        <g key={index} data-plane-figure="point">
          {figure.showDashes ? (
            <path
              d={`M${PADDING},${py(y)} L${px(x)},${py(y)} L${px(x)},${yLen}`}
              stroke={GRID_INK}
              strokeWidth={STROKE.hair}
              strokeDasharray="4 4"
              fill="none"
            />
          ) : null}
          <circle cx={px(x)} cy={py(y)} r={r} fill={paint(figure.color, INK)} />
          {text ? (
            <text x={px(x) + 12} y={py(y) - 12} fontSize={font} fill={INK}>
              {text}
            </text>
          ) : null}
        </g>
      )
    }
    return null
  })

  return (
    <svg
      ref={svgRef}
      className={styles.planeSvg}
      data-figure-type="130"
      data-testid="complex-positive-plane-part"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
    >
      <g data-plane-layer="grid" stroke={GRID_INK} strokeWidth={STROKE.grid}>
        {xs.map((i) => (
          <line key={`gx-${i}`} x1={px(i * multX)} y1={0} x2={px(i * multX)} y2={yLen} />
        ))}
        {ys.map((i) => (
          <line key={`gy-${i}`} x1={PADDING} y1={py(i * multY)} x2={width} y2={py(i * multY)} />
        ))}
      </g>

      <g data-plane-layer="axes" stroke={INK}>
        <line x1={PADDING} y1={yLen} x2={width} y2={yLen} strokeWidth={STROKE.data} />
        <line x1={PADDING} y1={yLen} x2={PADDING} y2={0} strokeWidth={STROKE.data} />
        {xs.map((i) => (
          <line
            key={`tx-${i}`}
            x1={px(i * multX)}
            y1={yLen - 6}
            x2={px(i * multX)}
            y2={yLen + 6}
            strokeWidth={STROKE.hair}
          />
        ))}
        {ys.map((i) => (
          <line
            key={`ty-${i}`}
            x1={PADDING - 6}
            y1={py(i * multY)}
            x2={PADDING + 6}
            y2={py(i * multY)}
            strokeWidth={STROKE.hair}
          />
        ))}
      </g>
      <path
        d={`M${width - arrowX},${yLen - 5} L${width},${yLen} L${width - arrowX},${yLen + 5}z`}
        fill={INK}
      />
      <path
        d={`M${PADDING - 5},${arrowY} L${PADDING},0 L${PADDING + 5},${arrowY}z`}
        fill={INK}
      />

      <g data-plane-layer="labels" fill={INK} fontSize={font}>
        {xs.map((i) => (
          <text
            key={`lx-${i}`}
            x={px(i * multX)}
            y={yLen + 18}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {tickText(xAxis, i, multX)}
          </text>
        ))}
        {ys.map((i) => (
          <text
            key={`ly-${i}`}
            x={PADDING - 10}
            y={py(i * multY)}
            textAnchor="end"
            dominantBaseline="central"
          >
            {tickText(yAxis, i, multY)}
          </text>
        ))}
        <text x={width} y={yLen - 14} textAnchor="end">
          {t(xAxis.label)}
        </text>
        <text x={PADDING + 12} y={font * 0.8}>
          {t(yAxis.label)}
        </text>
      </g>

      <g data-plane-layer="figures">{figures}</g>
    </svg>
  )
}
