import { MATH_ISLAND_RE } from '@/ui/math-text/normalize-operator-signs'

/** A TeX command (`\cos`, `\frac`, `\left`) or a power / index. */
const BARE_TEX_RE = /\\[a-zA-Z]+|[\^_]/

/** Multiplication typed as a dot — `×` everywhere, MathJax included (05.10). */
const DOT_TIMES_RE = /[·⋅]/g

/**
 * Equation content as MathJax should see it.
 *
 * From grade 5 on, generators send the equation as bare TeX with no math
 * delimiters: `y = 2.25\cos{ x }`, `2x^4 + 9x^3 = 0`,
 * `\left\{ \begin{array}{l} … \end{array} \right.`. The old site typeset the
 * whole `content` as one TeX node (`MathJaxFormula`), so these never showed
 * raw. MathJax here only looks inside `\( … \)`, and without this the child
 * would read `\cos{ x }` and `\frac{\pi}{3}` as text (math-signs.md, 5).
 *
 * Narrow on purpose: content that already has a math island, or has no TeX
 * command, power or index, is returned as is. That keeps every grade-4
 * `equation.before` condition (`353 + x = 804 · 4 + 726`) byte for byte —
 * plain arithmetic there goes through `normalizeOperatorSigns` as before.
 */
export const toEquationTex = (content: string): string => {
  const text = content.trim()
  if (!text) return content
  if (MATH_ISLAND_RE.test(text)) return content
  if (!BARE_TEX_RE.test(text)) return content

  return `\\(${text.replace(DOT_TIMES_RE, '\\times ')}\\)`
}
