import { useRef, type ReactNode } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type {
  ComplexFrequencyHistogramPart,
  ComplexFrequencyPolygonPart,
} from '../../lib/types.task'
import styles from '../complex.module.scss'

import { GRID_INK, INK, paint, STROKE } from './figure-paint'
import { signedNumber } from './signed-number'
import { LABEL_PX, useLabelScale } from './use-label-scale'

/**
 * Frequency charts of the condition, display-only: the histogram (part type
 * 200) and the polygon (190) of statistics in grades 5, 8 and 11. The child
 * reads values off the chart into the fields or the table below it.
 *
 * Ports of Matheducator `FrequencyHistogram` / `FrequencyPolygon` with
 * `taskType="graph"` (the canvas that does not take clicks). The old canvas
 * was 600×400 with 50px margins and 14px Arial; here it is SVG on the same
 * plot, margins wide enough for 18px labels (rule 73) and the axis names.
 */

const W = 600
const H = 400
const LEFT = 72
const RIGHT = 24
const TOP = 24
const BOTTOM = 72
const PLOT_W = W - LEFT - RIGHT
const PLOT_H = H - TOP - BOTTOM
const X0 = LEFT
const Y0 = H - BOTTOM

interface ChartProps {
  figureType: '190' | '200'
  testId: string
  xName: string
  yName: string
  /** Wide y labels (text ticks) push the y axis name further left. */
  yLabelChars: number
  children: (font: number) => ReactNode
}

const Chart = ({
  figureType,
  testId,
  xName,
  yName,
  yLabelChars,
  children,
}: ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const font = LABEL_PX * useLabelScale(svgRef)
  const yNameX = Math.max(14, X0 - 20 - yLabelChars * font * 0.55)
  return (
    <svg
      ref={svgRef}
      className={styles.planeSvg}
      data-figure-type={figureType}
      data-testid={testId}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fontSize={font}
      overflow="visible"
    >
      {children(font)}
      <path
        d={`M${X0},${TOP} L${X0},${Y0} L${X0 + PLOT_W},${Y0}`}
        stroke={INK}
        strokeWidth={STROKE.data}
        fill="none"
        data-plane-layer="axes"
      />
      {xName ? (
        <text
          x={X0 + PLOT_W / 2}
          y={Y0 + 48}
          textAnchor="middle"
          dominantBaseline="central"
          fill={INK}
        >
          {xName}
        </text>
      ) : null}
      {yName ? (
        <text
          transform={`translate(${yNameX} ${TOP + PLOT_H / 2}) rotate(-90)`}
          textAnchor="middle"
          dominantBaseline="central"
          fill={INK}
        >
          {yName}
        </text>
      ) : null}
    </svg>
  )
}

const range = (from: number, to: number, step: number) => {
  const out: number[] = []
  const s = step > 0 ? step : 1
  for (let i = from; i <= to + 1e-9; i += s) out.push(Math.round(i * 1e6) / 1e6)
  return out
}

/**
 * Text ticks wider than their slot («Понедельник» under a 57px bar on a
 * phone) are drawn smaller, all of them by the same factor, so the row stays
 * one size and no word runs into its neighbour. 0.62em per letter is the
 * width of the widest Cyrillic labels measured in Halvar at 18px.
 */
const fitFont = (texts: string[], slot: number, font: number) => {
  const widest = Math.max(...texts.map((text) => text.length), 1) * font * 0.62
  return widest > slot - 6
    ? Math.max(font * 0.6, ((slot - 6) / widest) * font)
    : font
}

interface HistogramProps {
  part: ComplexFrequencyHistogramPart
  deps: TaskModalDependencies
}

export const FrequencyHistogramPart = ({ part, deps }: HistogramProps) => {
  const t = (value: unknown) => deps.global.translateTasks(value)
  const { minX, maxX, minY, maxY } = part
  const stepX = part.stepSizeX || 1
  const stepY = part.stepSizeY || 1
  const scaleX = PLOT_W / (maxX - minX + 1)
  const scaleY = PLOT_H / (maxY - minY + 1)

  const xTicks = range(minX, maxX, stepX)
  const yTicks = range(minY, maxY, stepY)
  const xLabel = (i: number, index: number) =>
    part.isXText
      ? t(part.isCentered ? part.xLabels?.[index] : part.xLabels?.[i - minX])
      : signedNumber(i)
  const yLabel = (i: number) =>
    part.isYText ? t(part.yLabels?.[i - minY]) : signedNumber(i)
  const yLabelChars = Math.max(...yTicks.map((i) => yLabel(i).length), 1)
  const xTexts = xTicks.map((i, index) => xLabel(i, index))

  const xOfTick = (i: number) =>
    X0 + (i - minX + (part.isCentered ? stepX / 2 : 0)) * scaleX
  const yOfTick = (i: number) => Y0 - (i - minY) * scaleY

  return (
    <Chart
      figureType="200"
      testId="complex-frequency-histogram-part"
      xName={t(part.xName)}
      yName={t(part.yName)}
      yLabelChars={yLabelChars}
    >
      {(font) => {
        const textTickFont = fitFont(xTexts, stepX * scaleX, font)
        return (
          <>
            <g
              data-plane-layer="grid"
              stroke={GRID_INK}
              strokeWidth={STROKE.grid}
            >
              {yTicks.slice(1).map((i) => (
                <line
                  key={`gy-${i}`}
                  x1={X0}
                  y1={yOfTick(i)}
                  x2={X0 + PLOT_W}
                  y2={yOfTick(i)}
                />
              ))}
              {xTicks.slice(1).map((i) => (
                <line
                  key={`gx-${i}`}
                  x1={X0 + (i - minX) * scaleX}
                  y1={Y0}
                  x2={X0 + (i - minX) * scaleX}
                  y2={TOP}
                />
              ))}
            </g>
            <g data-plane-layer="bars">
              {(part.frequencies ?? []).map(({ x, y }, index) => {
                // Some generators send x1 > x2 (8_4_3_6): the canvas drew a
                // negative width leftwards; the bar is the span either way.
                const left = Math.min(x.x1, x.x2)
                const barW = Math.abs(x.x2 - x.x1) * scaleX
                const barH = y * scaleY
                const list = part.barColorList ?? []
                const fill = paint(
                  list.length ? list[index % list.length] : part.barColor,
                  'var(--bg-subtle)',
                )
                return (
                  <g key={index}>
                    <rect
                      x={X0 + left * scaleX}
                      y={Y0 - barH}
                      width={barW}
                      height={barH}
                      fill={fill}
                      stroke={INK}
                      strokeWidth={STROKE.data}
                    />
                    {part.frequencyValue ? (
                      <text
                        x={X0 + left * scaleX + barW / 2}
                        y={Y0 - barH / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={INK}
                      >
                        {signedNumber(y)}
                      </text>
                    ) : null}
                  </g>
                )
              })}
            </g>
            <g data-plane-layer="ticks" stroke={INK} strokeWidth={STROKE.hair}>
              {xTicks.map((i) => (
                <line
                  key={`tx-${i}`}
                  x1={xOfTick(i)}
                  y1={Y0}
                  x2={xOfTick(i)}
                  y2={Y0 + 6}
                />
              ))}
              {yTicks.map((i) => (
                <line
                  key={`ty-${i}`}
                  x1={X0 - 6}
                  y1={yOfTick(i)}
                  x2={X0}
                  y2={yOfTick(i)}
                />
              ))}
            </g>
            <g data-plane-layer="labels" fill={INK}>
              {xTicks.map((i, index) => {
                const text = xLabel(i, index)
                const size = part.isXText ? textTickFont : font
                return (
                  <text
                    key={`lx-${i}`}
                    x={xOfTick(i)}
                    y={Y0 + 18}
                    fontSize={size}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {text}
                  </text>
                )
              })}
              {yTicks.map((i) => (
                <text
                  key={`ly-${i}`}
                  x={X0 - 10}
                  y={yOfTick(i)}
                  textAnchor="end"
                  dominantBaseline="central"
                >
                  {yLabel(i)}
                </text>
              ))}
            </g>
          </>
        )
      }}
    </Chart>
  )
}

interface PolygonProps {
  part: ComplexFrequencyPolygonPart
  deps: TaskModalDependencies
}

/**
 * Matheducator puts tick `i` at `(i − min + 1)` steps from the axis and a
 * point at `point.x` steps: a point's x is the tick's place, not its value
 * (11_2_3_8: x 1, 3, 5 under the ticks 10, 12, 14). Kept as is.
 */
export const FrequencyPolygonPart = ({ part, deps }: PolygonProps) => {
  const t = (value: unknown) => deps.global.translateTasks(value)
  const { minX, maxX, minY, maxY } = part
  const scaleX = PLOT_W / (maxX - minX + 1)
  const scaleY = PLOT_H / (maxY - minY + 1)
  const xTicks = range(minX, maxX, part.stepSizeX || 1)
  const yTicks = range(minY, maxY, part.stepSizeY || 1)
  const xOfTick = (i: number) => X0 + (i - minX + 1) * scaleX
  const yOfTick = (i: number) => Y0 - (i - minY + 1) * scaleY
  const points = (part.points ?? []).map((p) => ({
    x: X0 + p.x * scaleX,
    y: Y0 - p.y * scaleY,
  }))
  const yLabelChars = Math.max(...yTicks.map((i) => signedNumber(i).length), 1)

  return (
    <Chart
      figureType="190"
      testId="complex-frequency-polygon-part"
      xName={t(part.xName)}
      yName={t(part.yName)}
      yLabelChars={yLabelChars}
    >
      {() => (
        <>
          <g
            data-plane-layer="grid"
            stroke={GRID_INK}
            strokeWidth={STROKE.grid}
          >
            {xTicks.map((i) => (
              <line
                key={`gx-${i}`}
                x1={xOfTick(i)}
                y1={TOP}
                x2={xOfTick(i)}
                y2={Y0}
              />
            ))}
            {yTicks.map((i) => (
              <line
                key={`gy-${i}`}
                x1={X0}
                y1={yOfTick(i)}
                x2={X0 + PLOT_W}
                y2={yOfTick(i)}
              />
            ))}
          </g>
          <g data-plane-layer="ticks" stroke={INK} strokeWidth={STROKE.hair}>
            {xTicks.map((i) => (
              <line
                key={`tx-${i}`}
                x1={xOfTick(i)}
                y1={Y0}
                x2={xOfTick(i)}
                y2={Y0 + 6}
              />
            ))}
            {yTicks.map((i) => (
              <line
                key={`ty-${i}`}
                x1={X0 - 6}
                y1={yOfTick(i)}
                x2={X0}
                y2={yOfTick(i)}
              />
            ))}
          </g>
          <g data-plane-layer="labels" fill={INK}>
            {xTicks.map((i) => (
              <text
                key={`lx-${i}`}
                x={xOfTick(i)}
                y={Y0 + 18}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {signedNumber(i)}
              </text>
            ))}
            {yTicks.map((i) => (
              <text
                key={`ly-${i}`}
                x={X0 - 10}
                y={yOfTick(i)}
                textAnchor="end"
                dominantBaseline="central"
              >
                {signedNumber(i)}
              </text>
            ))}
          </g>
          <polyline
            data-plane-layer="polygon"
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={INK}
            strokeWidth={STROKE.data}
            strokeLinejoin="round"
          />
          <g data-plane-layer="points" fill={INK}>
            {points.map((p, index) => (
              <circle key={index} cx={p.x} cy={p.y} r={4} />
            ))}
          </g>
        </>
      )}
    </Chart>
  )
}
