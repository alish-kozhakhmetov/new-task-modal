import { stripMathDelimiters } from './strip-math-delimiters'
import { uprightMathUnits, uprightUnitsInTex } from './upright-math-units'

/**
 * True when the string needs MathJax (TeX commands / scripts), not plain prose.
 * Used so adornments like `\(в день\)` render as normal text instead of italic math.
 */
export const needsMathTypesetting = (value: string): boolean =>
  /\\[a-zA-Z]+|[\^_]/.test(value)

/** CMS sends `\%` inside `\(...\)`; show a literal percent for plain adornments. */
export const decodePlainTexEscapes = (text: string): string =>
  text.replace(/\\%/g, '%')

/**
 * Prepare an adornment for display: strip outer `\(...\)`, then decide whether
 * the result is prose (plain) or still needs math delimiters for MathText.
 * Math units are upright via `\mathrm`.
 *
 * Mixed CMS strings like `\(x\) = ` keep their islands and go through MathText
 * as-is (do not re-wrap the whole string).
 */
export const prepareAdornment = (
  value: string,
): { kind: 'plain' | 'math'; text: string } => {
  // «\(\angle\) B = \(\angle\)» starts with «\(» and ends with «\)» but is
  // two islands with prose between: the outer strip left «\angle\) B =
  // \(\angle» on the pupil's screen (GeoTask_7_2_8_2, stream CX, 27.11).
  const stripped = stripMathDelimiters(value)
  const islands =
    stripped !== value.trim() && /(?<!\\)\\\)[\s\S]*(?<!\\)\\\(/.test(stripped)
  if (islands) return { kind: 'math', text: uprightMathUnits(value.trim()) }

  const text = decodePlainTexEscapes(stripped)
  if (!text) return { kind: 'plain', text: '' }

  // Outer strip only applies when the whole value is `\(...\)`. Leftover
  // islands mean mixed math + prose (e.g. `\(x\) = `).
  if (text.includes('\\(')) {
    return { kind: 'math', text: uprightMathUnits(text) }
  }

  if (needsMathTypesetting(text)) {
    return { kind: 'math', text: `\\(${uprightUnitsInTex(text)}\\)` }
  }
  return { kind: 'plain', text }
}
