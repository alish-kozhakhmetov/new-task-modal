/**
 * A number as a drawing labels it: below zero with a real minus U+2212, not
 * the hyphen `String(-3)` gives (rules 27 and 34). Axis numbers of the plane
 * and labels of the number line.
 */
export const signedNumber = (n: number): string =>
  n < 0 ? `−${-n}` : String(n)
