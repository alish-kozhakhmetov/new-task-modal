import type { ComplexNumberLinePart } from '../../lib/types.task'
import styles from '../complex.module.scss'

import { INK, STROKE } from './figure-paint'

interface Props {
  part: ComplexNumberLinePart
}

/**
 * Labels are drawn at 14 viewBox units; the line is shown at a fixed scale so
 * they come out at the task size, 18px (rule 79). It used to stretch to the
 * column width: ×1.82 on a phone, labels around 25px.
 */
const SCALE = 18 / 14

/** Pure-SVG port of Matheducator NumberLine (display-only). */
export const NumberLinePart = ({ part }: Props) => {
  const tickStep = part.tickStep ?? 1
  const stepSize = part.stepSize ?? 20
  const minPosition = part.minPosition ?? 0
  const maxPosition = part.maxPosition ?? 10
  const divisionsIsVisible = part.divisionsIsVisible !== false

  // A point is 4px in brand colour (rule 79); the backend's green is dropped.
  const dotRadius = 4 / SCALE
  const DOT = 'var(--bg-brand)'
  const line = STROKE.hair / SCALE
  const startX = dotRadius * 3
  const yPos = 30
  const divisionsQuantity = (maxPosition - minPosition) / tickStep
  const length = startX + stepSize * (divisionsQuantity + 1) + stepSize / 2
  const viewW = length + startX

  const xAt = (position: number) =>
    startX + (stepSize * (position - minPosition)) / tickStep

  const ticks: number[] = []
  if (divisionsIsVisible) {
    for (let x = startX; x < length - stepSize; x += stepSize) {
      ticks.push(x)
    }
  }

  return (
    <svg
      className={styles.numberLineSvg}
      data-figure-type="20"
      width={viewW * SCALE}
      height={70 * SCALE}
      viewBox={`0 0 ${viewW} 70`}
    >
      <path
        d={`M0,${yPos} L${length},${yPos}`}
        stroke={INK}
        strokeWidth={line}
        fill="none"
      />
      <path
        d={`M${length - 15},${yPos + 4} L${length},${yPos} L${length - 15},${yPos - 4}z`}
        fill={INK}
      />

      {ticks.map((x) => (
        <path
          key={x}
          d={`M${x},${yPos - 6} L${x},${yPos + 6}`}
          stroke={INK}
          strokeWidth={line}
          fill="none"
        />
      ))}

      {/* origin */}
      <circle cx={xAt(0)} cy={yPos} r={dotRadius} fill={DOT} />
      <text
        x={xAt(0)}
        y={yPos - 10}
        fontSize={14}
        fontStyle="italic"
        textAnchor="middle"
      >
        O
      </text>
      <text x={xAt(0)} y={yPos + 20} fontSize={14} textAnchor="middle">
        0
      </text>

      {(part.dots ?? []).map((dot, index) => (
        <g key={`dot-${index}`}>
          <circle cx={xAt(dot.position)} cy={yPos} r={dotRadius} fill={DOT} />
          {dot.letter ? (
            <text
              x={xAt(dot.position)}
              y={yPos - 10}
              fontSize={14}
              fontStyle="italic"
              textAnchor="middle"
            >
              {dot.letter}
            </text>
          ) : null}
          {dot.withNumber ? (
            <text
              x={xAt(dot.position)}
              y={yPos + 20}
              fontSize={14}
              textAnchor="middle"
            >
              {dot.position}
            </text>
          ) : null}
        </g>
      ))}

      {(part.numbers ?? []).map((item, index) => (
        <text
          key={`num-${index}`}
          x={xAt(item.position)}
          y={yPos + 20}
          fontSize={14}
          textAnchor="middle"
        >
          {item.position}
        </text>
      ))}

      {(part.letters ?? []).map((item, index) => (
        <text
          key={`let-${index}`}
          x={xAt(item.position)}
          y={yPos - 10}
          fontSize={14}
          fontStyle="italic"
          textAnchor="middle"
        >
          {item.letter}
        </text>
      ))}
    </svg>
  )
}
