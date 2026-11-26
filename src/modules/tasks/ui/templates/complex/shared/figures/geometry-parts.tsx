import type { ReactNode } from 'react'

import type {
  ComplexEulerEllipsePart,
  ComplexHexagonPart,
  ComplexRectanglePart,
} from '../../lib/types.task'
import styles from '../complex.module.scss'

import { INK, paint, STROKE } from './figure-paint'
import { LABEL_PX } from './use-label-scale'

/**
 * Small static drawings of the condition, display-only ports of Matheducator
 * figures: Euler–Venn circles (part type 30, grade 5 sets), a rectangle (60)
 * and a regular hexagon (70) with letters at the vertices (grade 6).
 *
 * The geometry and the letter places are the old screen's. Lines are the
 * system's (contour 2, `--text-primary`), letters 18px.
 */

/** An ellipse without a colour got a random one on the old screen. */
const SET_COLORS = ['blue', 'red', 'green', 'orange', 'purple']

const EDGE = STROKE.data

interface EulerProps {
  part: ComplexEulerEllipsePart
}

export const EulerEllipsePart = ({ part }: EulerProps) => {
  const width = part.rx * 2
  const height = part.ry * 2
  let colorIndex = 0
  const nextColor = (color: unknown) =>
    paint(color, paint(SET_COLORS[colorIndex++ % SET_COLORS.length], INK))

  const dots = (
    fromX: number,
    fromY: number,
    list: ComplexEulerEllipsePart['dots'],
    key: string,
  ) =>
    (list ?? []).map((dot, index) => {
      const size = dot.fontSize ?? LABEL_PX
      return (
        <g key={`${key}-dot-${index}`} data-euler="dot">
          {/* an element of a set is a marked point: 4px (rule 72) */}
          <circle cx={fromX + dot.x} cy={fromY + dot.y} r={4} fill={INK} />
          <text
            x={fromX + dot.x + size / 2 - 5}
            y={fromY + dot.y + 5}
            fontSize={size}
            fill={INK}
          >
            {dot.label}
          </text>
        </g>
      )
    })

  // Matheducator: an inner ellipse's dots and children are placed from the
  // top-left corner of its box, (x − rx, y − ry), of the parent's frame.
  const inner = (
    fromX: number,
    fromY: number,
    ellipse: ComplexEulerEllipsePart,
    key: string,
  ): ReactNode => {
    const color = nextColor(ellipse.color)
    const boxX = fromX + ellipse.x - ellipse.rx
    const boxY = fromY + ellipse.y - ellipse.ry
    return (
      <g key={key} data-euler="set" data-name={ellipse.name}>
        <ellipse
          cx={fromX + ellipse.x}
          cy={fromY + ellipse.y}
          rx={ellipse.rx}
          ry={ellipse.ry}
          stroke={color}
          strokeWidth={EDGE}
          fill="none"
        />
        {ellipse.name ? (
          <text
            x={boxX + ellipse.rx / 8}
            y={boxY + ellipse.ry / 8}
            fontSize={LABEL_PX}
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
          >
            {ellipse.name}
          </text>
        ) : null}
        {dots(boxX, boxY, ellipse.dots, key)}
        {(ellipse.ellipses ?? []).map((child, index) =>
          inner(boxX, boxY, child, `${key}-${index}`),
        )}
      </g>
    )
  }

  const outerColor = paint(part.color, 'none')
  const pad = EDGE
  return (
    <svg
      className={styles.numberLineSvg}
      data-figure-type="30"
      data-testid="complex-euler-part"
      width={width + pad * 2}
      height={height + pad * 2}
      viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
    >
      {outerColor !== 'none' && outerColor !== 'transparent' ? (
        <ellipse
          cx={part.x}
          cy={part.y}
          rx={part.rx}
          ry={part.ry}
          stroke={outerColor}
          strokeWidth={EDGE}
          fill="none"
        />
      ) : null}
      {part.name ? (
        <text x={part.rx / 8} y={part.ry / 8} fontSize={LABEL_PX} fill={INK}>
          {part.name}
        </text>
      ) : null}
      {dots(0, 0, part.dots, 'outer')}
      {(part.ellipses ?? []).map((ellipse, index) =>
        inner(0, 0, ellipse, `set-${index}`),
      )}
    </svg>
  )
}

interface RectangleProps {
  part: ComplexRectanglePart
}

/** Matheducator: the rectangle at (20, 20), letters in the 20px margin. */
export const RectanglePart = ({ part }: RectangleProps) => {
  const wrap = 40
  const { width, height } = part
  const w = width + wrap
  const h = height + wrap
  return (
    <svg
      className={styles.numberLineSvg}
      data-figure-type="60"
      data-testid="complex-rectangle-part"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
    >
      <rect
        x={20}
        y={20}
        width={width}
        height={height}
        stroke={INK}
        strokeWidth={EDGE}
        fill="none"
      />
      <g fontSize={LABEL_PX} fill={INK} dominantBaseline="central">
        <text x={10} y={10} textAnchor="middle">
          {part.topLeft}
        </text>
        <text x={width + 30} y={10} textAnchor="middle">
          {part.topRight}
        </text>
        <text x={10} y={height + 30} textAnchor="middle">
          {part.bottomLeft}
        </text>
        <text x={width + 30} y={height + 30} textAnchor="middle">
          {part.bottomRight}
        </text>
      </g>
    </svg>
  )
}

interface HexagonProps {
  part: ComplexHexagonPart
}

const rad = (deg: number) => (deg * Math.PI) / 180

/**
 * Vertex `i` at `i × 60°` counter-clockwise from the right one, its letter
 * 10px further out (Matheducator). The old canvas was 3 × side square, most
 * of it empty; here it is the hexagon and its letters (rule 75).
 */
export const HexagonPart = ({ part }: HexagonProps) => {
  const r = part.sideLength
  const letters = part.letters ?? []
  const halfW = r + 10 + LABEL_PX
  const halfH = (r + 10) * Math.sin(rad(60)) + LABEL_PX
  const vertex = (i: number, radius: number) => ({
    x: Math.cos(rad(i * 60)) * radius,
    y: -Math.sin(rad(i * 60)) * radius,
  })
  const outline = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const v = vertex(i, r)
      return `${v.x},${v.y}`
    })
    .join(' ')
  return (
    <svg
      className={styles.numberLineSvg}
      data-figure-type="70"
      data-testid="complex-hexagon-part"
      width={halfW * 2}
      height={halfH * 2}
      viewBox={`${-halfW} ${-halfH} ${halfW * 2} ${halfH * 2}`}
    >
      <polygon
        points={outline}
        stroke={INK}
        strokeWidth={EDGE}
        strokeLinejoin="round"
        fill="none"
      />
      <g
        fontSize={LABEL_PX}
        fill={INK}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const v = vertex(i, r + 12)
          return (
            <text key={i} x={v.x} y={v.y}>
              {letters[i]}
            </text>
          )
        })}
      </g>
    </svg>
  )
}
