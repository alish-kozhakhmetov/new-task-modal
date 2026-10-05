import type { ReactNode } from 'react'

import { GRID_INK, INK, paint, STROKE } from '../figure-paint'
import { parseFraction, SvgFraction } from '../svg-fraction'

import {
  fromPointToDot,
  planeLength,
  PlaneFigureType,
  type PlaneOptions,
  type PlanePoint,
} from './plane-math'

/** Axis numbers with a real minus (rule 27), not a hyphen. */
const signed = (n: number) => (n < 0 ? `−${-n}` : String(n))

const asPoint = (value: unknown): PlanePoint | null => {
  if (!value || typeof value !== 'object') return null
  const p = value as Record<string, unknown>
  if (typeof p.x !== 'number' || typeof p.y !== 'number') return null
  return p as PlanePoint
}

const letterOf = (point: PlanePoint) =>
  typeof point.letter === 'string' ? point.letter : ''

interface DotProps {
  options: PlaneOptions
  point: PlanePoint
}

export const PlaneDot = ({ options, point }: DotProps) => {
  const { x, y } = fromPointToDot(options, point.x, point.y)
  const offsetX = 12 * (point.x >= 0 ? 1 : -1)
  const offsetY = 12 * (point.y >= 0 ? 1 : -1)
  const fill = paint(point.color || 'green', INK)
  const radius = point.radius === 0 ? 0 : (point.radius ?? 4)
  const letter = letterOf(point)

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={point.borderColor ? paint(point.borderColor, INK) : fill}
        strokeWidth={point.borderColor ? STROKE.grid : 0}
      />
      {point.showOnlyLetter && letter ? (
        <text
          x={x + offsetX}
          y={y - offsetY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
        >
          {letter}
        </text>
      ) : null}
      {point.showCoordinate && letter ? (
        <text
          x={x + offsetX}
          y={y - offsetY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
        >
          {`${letter}(${point.x};${point.y})`}
        </text>
      ) : null}
    </g>
  )
}

interface AxesProps {
  options: PlaneOptions
}

/**
 * Grid and axes, every line placed through `fromPointToDot` — the same
 * mapping the figures and the pupil's points use.
 *
 * The earlier version drew the Y half by rotating a group around `(0, mid)`:
 * horizontal grid lines came out only in the upper-left quarter, the Y axis
 * sat on the left edge at half height with no numbers, and the X axis lay on
 * the canvas middle rather than on y = 0, so on a field with min ≠ −max it
 * missed the origin.
 */
export const PlaneAxes = ({ options }: AxesProps) => {
  const {
    minPosition,
    maxPosition,
    tickStep,
    stepSize,
    showAxis,
    showCells,
    tickStepXMultiply,
    tickStepYMultiply,
    xAxisLabel,
    yAxisLabel,
  } = options
  const length = planeLength(options)
  const arrowLength = stepSize / 2

  const ticks: number[] = []
  for (let i = minPosition; i <= maxPosition; i += tickStep) {
    ticks.push(i)
  }

  const xOf = (value: number) => fromPointToDot(options, value, 0).x
  const yOf = (value: number) => fromPointToDot(options, 0, value).y
  const left = xOf(minPosition)
  const right = xOf(maxPosition)
  const top = yOf(maxPosition)
  const bottom = yOf(minPosition)
  // The axes cross at the origin; when 0 is outside the field, at its edge.
  const origin = Math.min(maxPosition, Math.max(minPosition, 0))
  const axisY = yOf(origin)
  const axisX = xOf(origin)

  const grid = showCells ? (
    <g data-plane-layer="grid">
      {ticks.map((i) => (
        <line
          key={`vgrid-${i}`}
          x1={xOf(i)}
          y1={top}
          x2={xOf(i)}
          y2={bottom}
          stroke={GRID_INK}
          strokeWidth={STROKE.grid}
        />
      ))}
      {ticks.map((i) => (
        <line
          key={`hgrid-${i}`}
          x1={left}
          y1={yOf(i)}
          x2={right}
          y2={yOf(i)}
          stroke={GRID_INK}
          strokeWidth={STROKE.grid}
        />
      ))}
    </g>
  ) : null

  if (!showAxis) return grid

  return (
    <g>
      {grid}
      <g data-plane-layer="x-axis">
        <line
          x1={0}
          y1={axisY}
          x2={length}
          y2={axisY}
          stroke={INK}
          strokeWidth={STROKE.data}
        />
        <path
          d={`M${arrowLength},${axisY - 5} L0,${axisY} L${arrowLength},${axisY + 5}z`}
          fill={INK}
        />
        <path
          d={`M${length - arrowLength},${axisY - 5} L${length},${axisY} L${length - arrowLength},${axisY + 5}z`}
          fill={INK}
        />
        {ticks.map((i) =>
          i === origin ? null : (
            <g key={`xt-${i}`}>
              <line
                x1={xOf(i)}
                y1={axisY - 6}
                x2={xOf(i)}
                y2={axisY + 6}
                stroke={INK}
                strokeWidth={STROKE.hair}
              />
              <text
                x={xOf(i)}
                y={axisY + 15}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
              >
                {signed(i * tickStepXMultiply)}
              </text>
            </g>
          ),
        )}
        <text x={length} y={axisY - 15} textAnchor="end">
          {xAxisLabel}
        </text>
      </g>
      <g data-plane-layer="y-axis">
        <line
          x1={axisX}
          y1={0}
          x2={axisX}
          y2={length}
          stroke={INK}
          strokeWidth={STROKE.data}
        />
        <path
          d={`M${axisX - 5},${arrowLength} L${axisX},0 L${axisX + 5},${arrowLength}z`}
          fill={INK}
        />
        <path
          d={`M${axisX - 5},${length - arrowLength} L${axisX},${length} L${axisX + 5},${length - arrowLength}z`}
          fill={INK}
        />
        {ticks.map((i) =>
          i === origin ? null : (
            <g key={`yt-${i}`}>
              <line
                x1={axisX - 6}
                y1={yOf(i)}
                x2={axisX + 6}
                y2={yOf(i)}
                stroke={INK}
                strokeWidth={STROKE.hair}
              />
              <text
                // End-aligned left of the axis: centred labels of the first
                // ticks below zero ran into the x-axis numbers («−1» under «0»).
                x={axisX - 9}
                y={yOf(i)}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={14}
              >
                {signed(i * tickStepYMultiply)}
              </text>
            </g>
          ),
        )}
        <text x={axisX + 10} y={15}>
          {yAxisLabel}
        </text>
      </g>
      <text
        x={axisX - 10}
        y={axisY + 10}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {origin}
      </text>
    </g>
  )
}

interface FigureProps {
  options: PlaneOptions
  figure: Record<string, unknown>
  /** ME parity: resolve Translation / string labels (side lengths, units). */
  translate: (value: unknown) => string
}

export const PlaneFigure = ({
  options,
  figure,
  translate,
}: FigureProps): ReactNode => {
  const type = Number(figure.type)

  switch (type) {
    case PlaneFigureType.Point: {
      const point = asPoint({ ...figure, ...(figure.point as object) })
      return point ? <PlaneDot options={options} point={point} /> : null
    }
    case PlaneFigureType.LineSegment: {
      const point1 = asPoint(figure.point1)
      const point2 = asPoint(figure.point2)
      if (!point1 || !point2) return null
      const d1 = fromPointToDot(options, point1.x, point1.y)
      const d2 = fromPointToDot(options, point2.x, point2.y)
      const color = paint(figure.lineColor, INK)
      const showLetters = Boolean(figure.showDotLetters)
      const radius =
        typeof figure.dotRadius === 'number' ? figure.dotRadius : undefined
      return (
        <g>
          <PlaneDot
            options={options}
            point={{
              ...point1,
              color,
              radius,
              showOnlyLetter: showLetters,
            }}
          />
          <PlaneDot
            options={options}
            point={{
              ...point2,
              color,
              radius,
              showOnlyLetter: showLetters,
            }}
          />
          <line
            x1={d1.x}
            y1={d1.y}
            x2={d2.x}
            y2={d2.y}
            stroke={color}
            strokeDasharray={figure.dashed ? '5 5' : undefined}
          />
        </g>
      )
    }
    case PlaneFigureType.Line: {
      const point1 = asPoint(figure.point1)
      const point2 = asPoint(figure.point2)
      if (!point1 || !point2) return null
      const d1 = fromPointToDot(options, point1.x, point1.y)
      const d2 = fromPointToDot(options, point2.x, point2.y)
      return (
        <line
          x1={d1.x}
          y1={d1.y}
          x2={d2.x}
          y2={d2.y}
          stroke={paint('green', INK)}
          strokeDasharray={figure.dashed ? '5' : undefined}
        />
      )
    }
    case PlaneFigureType.Polygon: {
      const points = Array.isArray(figure.points)
        ? (figure.points as unknown[]).map(asPoint).filter(Boolean)
        : []
      if (points.length < 2) return null
      const poly = points
        .map((p) => {
          const d = fromPointToDot(options, p!.x, p!.y)
          return `${d.x},${d.y}`
        })
        .join(' ')
      return (
        <g>
          <polygon
            points={poly}
            stroke={paint(figure.borderColor, INK)}
            strokeWidth={STROKE.data}
            fill={paint(figure.fill, 'none')}
          />
          {figure.showPointsLetter
            ? points.map((p, i) => (
                <PlaneDot
                  key={i}
                  options={options}
                  point={{ ...p!, showOnlyLetter: true, radius: 1 }}
                />
              ))
            : null}
        </g>
      )
    }
    case PlaneFigureType.Circle: {
      const center = asPoint(figure.centerPoint)
      if (!center || typeof figure.radius !== 'number') return null
      const d = fromPointToDot(options, center.x, center.y)
      return (
        <circle
          cx={d.x}
          cy={d.y}
          r={figure.radius * options.stepSize}
          stroke={paint(figure.strokeColor, INK)}
          fill={paint(figure.innerColor, 'transparent')}
          strokeDasharray={figure.dashed ? '5' : undefined}
        />
      )
    }
    case PlaneFigureType.Vector: {
      const point1 = asPoint(figure.point1)
      const point2 = asPoint(figure.point2)
      if (!point1 || !point2) return null
      const d1 = fromPointToDot(options, point1.x, point1.y)
      const d2 = fromPointToDot(options, point2.x, point2.y)
      const color = paint(figure.color, INK)
      const center = { x: (d1.x + d2.x) / 2, y: (d1.y + d2.y) / 2 }
      const degree =
        (Math.atan((d2.y - center.y) / (d2.x - center.x || 1)) * 180) / Math.PI
      const flip = d1.x > d2.x ? 1 : -1
      return (
        <g stroke={color} fill={color}>
          <circle
            cx={d1.x}
            cy={d1.y}
            r={typeof figure.dotRadius === 'number' ? figure.dotRadius : 4}
          />
          <line
            x1={d1.x}
            y1={d1.y}
            x2={d2.x}
            y2={d2.y}
            strokeDasharray={figure.dashed ? '5' : undefined}
          />
          <path
            d={`M${15 * flip},-5 L0,0 L${15 * flip},5z`}
            transform={`translate(${d2.x},${d2.y}) rotate(${degree})`}
          />
          {typeof figure.label === 'string' ? (
            <text x={center.x} y={center.y - 2} fill={color}>
              {figure.label}
            </text>
          ) : null}
        </g>
      )
    }
    case PlaneFigureType.Text: {
      const x = typeof figure.x === 'number' ? figure.x : 0
      const y = typeof figure.y === 'number' ? figure.y : 0
      const d = fromPointToDot(options, x, y)
      const label = translate(figure.text)
      if (!label) return null
      const fraction = parseFraction(label)
      if (fraction && !figure.degree) {
        return (
          <SvgFraction
            x={d.x}
            y={d.y}
            num={fraction.num}
            den={fraction.den}
            fontSize={(figure.fontSize as number) || 18}
            fill={INK}
          />
        )
      }
      return (
        <text
          x={d.x}
          y={d.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={(figure.fontSize as number) || 18}
          transform={
            figure.degree
              ? `rotate(${Number(figure.degree)} ${d.x} ${d.y})`
              : undefined
          }
        >
          {label}
        </text>
      )
    }
    case PlaneFigureType.EllipticalArc: {
      const center = asPoint(figure.centerPoint)
      const mPoint = asPoint(figure.mPoint)
      const endPoint = asPoint(figure.endPoint)
      if (!center || !mPoint || !endPoint) return null
      if (typeof figure.rx !== 'number' || typeof figure.ry !== 'number')
        return null
      const centerDot = fromPointToDot(options, center.x, center.y)
      const mDot = fromPointToDot(options, mPoint.x, mPoint.y)
      const endDot = fromPointToDot(options, endPoint.x, endPoint.y)
      const rx = figure.rx * options.stepSize
      const ry = figure.ry * options.stepSize
      const fill = paint(figure.fill, 'none')
      const start =
        fill === 'transparent'
          ? `M${mDot.x} ${mDot.y}`
          : `M${centerDot.x} ${centerDot.y} L${mDot.x} ${mDot.y}`
      const d = `${start} A${rx} ${ry} ${Number(figure.xAxisRotation ?? 0)} ${Number(figure.largeArcFlag ?? 0)} ${Number(figure.sweepFlag ?? 0)} ${endDot.x} ${endDot.y}`
      return (
        <g>
          <path
            d={d}
            stroke={paint(figure.borderColor, INK)}
            // System weight, not the payload's 1 / 2 / 2.5 (rule 68).
            strokeWidth={STROKE.data}
            fill={fill}
            strokeDasharray={figure.dashed ? '5' : undefined}
            transform={
              figure.rotateDegree
                ? `rotate(${Number(figure.rotateDegree)} ${centerDot.x} ${centerDot.y})`
                : undefined
            }
          />
          {figure.showDots ? (
            <>
              <PlaneDot
                options={options}
                point={{
                  ...mPoint,
                  radius: 3,
                  color: 'black',
                  showOnlyLetter: Boolean(mPoint.letter),
                }}
              />
              <PlaneDot
                options={options}
                point={{
                  ...endPoint,
                  radius: 3,
                  color: 'black',
                  showOnlyLetter: Boolean(endPoint.letter),
                }}
              />
            </>
          ) : null}
        </g>
      )
    }
    default:
      return null
  }
}
