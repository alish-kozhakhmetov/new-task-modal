import { createContext, use } from 'react'

/**
 * Digit grouping (rule 100, Alisher 09.10, after Bureau Gorbunov, Milchin,
 * Gilenson): an integer of five digits or more is split into classes of three
 * from the right — 35 784, 8 201 794; a four-digit number in running text
 * stays solid — 5825. The gap is about half a space and never breaks.
 *
 * Not grouped: the fraction part of a decimal (12 345,0159), numbers after
 * «№», column arithmetic and place-value tables (each digit has its own cell),
 * the pupil's own field, and the tasks where the classes are the question
 * (GROUPING_OFF_TASKS).
 */
export const DIGIT_GROUP_FROM = 5

/** The gap between classes: half of Halvar's space (0.28em). */
export const DIGIT_GROUP_GAP_EM = 0.14

/**
 * `from` — fewest digits that get grouped; `null` switches grouping off for
 * everything below (column arithmetic, place-value tasks). A table column
 * that holds a five-digit number lowers it to 4, so classes line up.
 */
export interface DigitGrouping {
  from: number | null
}

export const DigitGroupingContext = createContext<DigitGrouping>({
  from: DIGIT_GROUP_FROM,
})

export const useDigitGrouping = () => use(DigitGroupingContext)

/**
 * An integer as it appears in text: solid (35784) or already split by the
 * backend with spaces (75 834, 6 000 000). Not after a digit, a decimal mark
 * or «№»; not followed by more digits or a decimal mark and digits.
 */
const NUMBER =
  /(?<![\d.,]|№\s?|[.,]\d*)(\d{1,3}(?:[ \u00a0\u202f\u2009]\d{3})+|\d+)(?![\d]|[ \u00a0\u202f\u2009]\d{3})/g

/** Class groups of an integer, left to right: «8201794» → 8 | 201 | 794. */
export const digitClasses = (digits: string): string[] => {
  const out: string[] = []
  for (let end = digits.length; end > 0; end -= 3)
    out.unshift(digits.slice(Math.max(0, end - 3), end))
  return out
}

export type DigitPiece = string | { classes: string[] }

/**
 * Splits plain text (no math) into pieces: strings, and numbers to be drawn
 * grouped. A backend-spaced number below the threshold is joined back
 * («3 000» → 3000 in text, rule: four digits in a line are solid).
 */
export const splitDigitGroups = (text: string, from: number): DigitPiece[] => {
  const out: DigitPiece[] = []
  let last = 0
  for (const m of text.matchAll(NUMBER)) {
    const raw = m[1]
    const digits = raw.replace(/[^\d]/g, '')
    const spaced = digits !== raw
    if (digits.length < from && !spaced) continue
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(digits.length < from ? digits : { classes: digitClasses(digits) })
    last = m.index + raw.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out.length ? out : [text]
}

/** The same inside TeX: classes joined by a fixed `\hspace`. */
export const groupDigitsInTex = (tex: string, from: number): string =>
  tex.replace(
    /(?<![\d.,]|\\[a-zA-Z]*|[.,]\d*)(\d{1,3}(?:(?:\\[ ,;:]|\\hspace\{[^}]*\}|[ ~])\d{3})+|\d+)(?![\d]|\\[ ,;:]\d{3})/g,
    (raw) => {
      const digits = raw.replace(/\\hspace\{[^}]*\}|\\[ ,;:]|[^\d]/g, '')
      if (digits.length < from) return digits
      return digitClasses(digits).join(`\\hspace{${DIGIT_GROUP_GAP_EM}em}`)
    },
  )
