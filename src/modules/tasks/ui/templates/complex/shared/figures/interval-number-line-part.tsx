import type {
  ComplexIntervalNumberLinePart,
  IntervalLineDot,
} from '../../lib/types.task'
import styles from '../complex.module.scss'

import { INK, paint, STROKE } from './figure-paint'
import { signedNumber } from './signed-number'
import { SvgFraction } from './svg-fraction'

interface Props {
  part: ComplexIntervalNumberLinePart
}

/**
 * Drawn in the backend's units with 14-unit labels, shown at 18/14 so the
 * labels come out at the task size, 18px — the same scale as the number line
 * of part type 20 (rule 79). The old screen stretched it to the column
 * (×2.7 on a desktop: 10 units per step, labels around 38px).
 */
const SCALE = 18 / 14
const FONT = 14
const INFINITY = 'infinity'

/** Line height in units: room for a two-tier fraction above and below. */
const HEIGHT = 72
const Y = 36
const START_X = 30

/** `-15\frac{5}{6}`, `7\frac{2}{9}` — a mixed number in a dot label. */
const MIXED = /^\s*(-?)(\d*)\s*\\[dt]?frac\{\s*(\d+)\s*\}\{\s*(\d+)\s*\}\s*$/

const isInfinity = (dot: IntervalLineDot) => dot.position === INFINITY

/** What a dot shows under / over itself: its label, else its position. */
const labelOf = (dot: IntervalLineDot): string | null => {
  if (isInfinity(dot)) return null
  const { label } = dot
  if (label === null || label === undefined || label === '') {
    return signedNumber(Number(dot.position))
  }
  const text = String(label)
  // A blank label (`" "`) is how a generator hides the number of a dot that
  // another interval already labels.
  return text.trim() === '' ? null : text
}

const Label = ({ x, y, text }: { x: number; y: number; text: string }) => {
  const mixed = MIXED.exec(text)
  if (!mixed) {
    return (
      <text x={x} y={y} fontSize={FONT} textAnchor="middle" fill={INK}>
        {text.replace(/^-/, '−')}
      </text>
    )
  }
  const [, minus, whole, num, den] = mixed
  const lead = `${minus ? '−' : ''}${whole}`
  // Two tiers are taller than a line: centre the fraction on the line's
  // middle, a bit further from the axis than plain text.
  const centre = y - FONT * 0.35
  const fracX = lead ? x + lead.length * FONT * 0.3 : x
  return (
    <g data-label="mixed">
      {lead ? (
        <text
          x={fracX - FONT * 0.45}
          y={centre}
          fontSize={FONT}
          textAnchor="end"
          dominantBaseline="central"
          fill={INK}
        >
          {lead}
        </text>
      ) : null}
      <SvgFraction
        x={fracX + Math.max(num.length, den.length) * FONT * 0.2}
        y={centre}
        num={num}
        den={den}
        fontSize={FONT}
        fill={INK}
      />
    </g>
  )
}

/**
 * Interval on a number line (part type 40), display-only — port of
 * Matheducator `IntervalNumberLine`: the line with ±∞, each interval hatched
 * above or below, filled ends included, hollow ends excluded.
 *
 * One deliberate change: the old screen drew an end's number twice when the
 * interval asked for numbers above (under the dot and over it). Here a number
 * goes where `numbersUp` says, once.
 */
export const IntervalNumberLinePart = ({ part }: Props) => {
  const tickStep = part.tickStep || 1
  const stepSize = part.stepSize ?? 10
  const minPosition = part.minPosition ?? 0
  const maxPosition = part.maxPosition ?? 10
  const showInfinities = part.showInfinities !== false

  const divisions = Math.abs((maxPosition - minPosition) / tickStep)
  const length = START_X + stepSize * (divisions + 1) + stepSize / 2
  const viewW = length + START_X
  const line = STROKE.hair / SCALE
  const dotRadius = 4 / SCALE

  const xAt = (position: number) =>
    START_X + (stepSize * (position - minPosition)) / tickStep
  const span = (from: IntervalLineDot, to: IntervalLineDot) => ({
    from: isInfinity(from) ? minPosition : Number(from.position),
    to: isInfinity(to) ? maxPosition : Number(to.position),
  })

  const intervals = part.intervals ?? []
  const labelY = (up: boolean) => (up ? Y - 14 : Y + 24)

  const dot = (d: IntervalLineDot, key: string) => {
    if (isInfinity(d)) return null
    const color = paint(d.color, INK)
    return (
      <circle
        key={key}
        data-inclusive={d.inclusive ? 'true' : 'false'}
        cx={xAt(Number(d.position))}
        cy={Y}
        r={dotRadius}
        fill={d.inclusive ? color : 'var(--bg-surface)'}
        stroke={color}
        strokeWidth={line}
      />
    )
  }

  const label = (d: IntervalLineDot, up: boolean, key: string) => {
    const text = labelOf(d)
    if (text === null) return null
    return (
      <Label key={key} x={xAt(Number(d.position))} y={labelY(up)} text={text} />
    )
  }

  return (
    <svg
      className={styles.numberLineSvg}
      data-figure-type="40"
      data-testid="complex-interval-number-line-part"
      width={viewW * SCALE}
      height={HEIGHT * SCALE}
      viewBox={`0 0 ${viewW} ${HEIGHT}`}
    >
      <path
        d={`M${START_X},${Y} L${length},${Y}`}
        stroke={INK}
        strokeWidth={line}
        fill="none"
      />
      {showInfinities ? (
        <g data-layer="infinities">
          <path
            d={`M${length - 15},${Y + 4} L${length},${Y} L${length - 15},${Y - 4}z`}
            fill={INK}
          />
          <text
            x={START_X - 4}
            y={Y}
            fontSize={FONT}
            textAnchor="end"
            dominantBaseline="central"
            fill={INK}
          >
            −∞
          </text>
          <text
            x={length + 4}
            y={Y}
            fontSize={FONT}
            dominantBaseline="central"
            fill={INK}
          >
            +∞
          </text>
          {part.name ? (
            <text
              x={length}
              y={Y + 24}
              fontSize={FONT}
              textAnchor="end"
              fontStyle={part.latexName ? 'italic' : undefined}
              fill={INK}
            >
              {part.name}
            </text>
          ) : null}
        </g>
      ) : null}

      {intervals.map((interval, index) => {
        const { from, to } = span(interval.from, interval.to)
        const hatches: number[] = []
        for (let x = from + 0.5; x < to - 0.5; x += 0.5) hatches.push(x)
        const dy = interval.dashesUp ? -10 : 10
        return (
          <g
            key={`hatch-${index}`}
            data-layer="hatch"
            stroke={INK}
            strokeWidth={line}
            strokeLinecap="round"
          >
            {hatches.map((x) => (
              <path
                key={x}
                d={`M${xAt(x) + 8},${Y + dy} L${xAt(x)},${Y}`}
                fill="none"
              />
            ))}
          </g>
        )
      })}

      {intervals.map((interval, index) => (
        <g key={`ends-${index}`} data-layer="ends">
          {dot(interval.from, 'from')}
          {dot(interval.to, 'to')}
          {label(interval.from, Boolean(interval.numbersUp), 'from-label')}
          {label(interval.to, Boolean(interval.numbersUp), 'to-label')}
        </g>
      ))}

      {(part.dots ?? []).map((d, index) => (
        <g key={`dot-${index}`}>
          {dot(d, 'dot')}
          {label(d, false, 'dot-label')}
        </g>
      ))}
      {(part.numbers ?? []).map((d, index) => label(d, false, `num-${index}`))}
    </svg>
  )
}
