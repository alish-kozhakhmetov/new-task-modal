/**
 * A label that is a plain fraction, drawn in two tiers inside SVG (rule 74).
 *
 * Generators label number-line and plane marks with `\frac{2}{7}` and flag
 * it `isLatex: false`, so it reached the child as raw text over the ticks
 * (4_13_5_5, seen 05.10). MathJax can't run inside SVG `<text>`; the canon
 * (qalan-docs/ds/math-illustrations.md §4) is a stacked fraction anyway —
 * a one-line «2/7» crowds the next label on a ray.
 */

const FRACTION =
  /^\s*(?:\\\(\s*)?\\[dt]?frac\{\s*(-?\d+)\s*\}\{\s*(\d+)\s*\}(?:\s*\\\))?\s*$/

export const parseFraction = (
  text: string,
): { num: string; den: string } | null => {
  const m = FRACTION.exec(text)
  return m ? { num: m[1], den: m[2] } : null
}

interface Props {
  x: number
  y: number
  num: string
  den: string
  fontSize: number
  fill?: string
}

/**
 * Numerator above the bar, denominator below, 0.82 of the label size. `y` is
 * where a one-line label would be centred; two tiers are taller, so the bar
 * goes a little lower to keep the numerator off the ticks above it.
 */
export const SvgFraction = ({
  x,
  y: labelY,
  num,
  den,
  fontSize,
  fill,
}: Props) => {
  const size = fontSize * 0.82
  const y = labelY + size * 0.45
  const half = Math.max(num.length, den.length) * size * 0.32 + 2
  return (
    <g fill={fill}>
      <text
        x={x}
        y={y - size * 0.2}
        fontSize={size}
        textAnchor="middle"
        dominantBaseline="auto"
      >
        {num}
      </text>
      <line
        x1={x - half}
        y1={y}
        x2={x + half}
        y2={y}
        stroke={fill ?? 'currentColor'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <text
        x={x}
        y={y + size * 0.15}
        fontSize={size}
        textAnchor="middle"
        dominantBaseline="hanging"
      >
        {den}
      </text>
    </g>
  )
}
