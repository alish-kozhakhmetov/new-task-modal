/**
 * A list separator that opens the text after a field: «; 51; 56» or «, 7».
 * Only before a space or the end of the part: «▢,5» is a decimal comma and
 * stays with its digits.
 */
const LEADING_SEPARATOR = /^\s*([;,])(?=\s|$)\s*/

/**
 * Rule 24: a separator belongs to the field on its left.
 *
 * `content.split('answercell')` puts the «;» after a field at the start of the
 * next part: «31; 36; ▢|; ▢|; 51; 56; 61». When the row wraps, that part goes
 * to a new line and the line opens with «; 51…» (4_12_19_8). The separator is
 * moved to the end of the cell before it. Only «;» and «,» — a «:» there is
 * division («▢ : ▢», 4_1_73) and stays with its operand on the right.
 */
export const splitLeadingSeparators = (
  parts: string[],
): { parts: string[]; trailing: string[] } => {
  const out = [...parts]
  const trailing = parts.slice(0, -1).map((_, index) => {
    const next = out[index + 1]
    const match = LEADING_SEPARATOR.exec(next)
    if (!match) return ''
    out[index + 1] = next.slice(match[0].length)
    return match[1]
  })
  return { parts: out, trailing }
}
