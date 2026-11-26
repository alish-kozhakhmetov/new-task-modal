/**
 * The pupil's answer as MathQuill writes it → the record the backend's
 * `TaskChecker` accepts (matheducator_task_common/lib/helpers/task/task_checker.ex).
 *
 * What the checker already forgives, we leave alone: spaces and `\ `,
 * `\left` / `\right`, `,` or `.` in a decimal. What it does not, and the
 * pupil can type with our keyboard, is a minus inside a fraction:
 * «x/y» first, then «−1» in the numerator gives `\frac{-1}{8}`. The checker
 * reads a fraction only as `\frac{digits}{digits}`, so that record fails
 * in every grade — while `-\frac{1}{8}`, the same number, passes (checked on
 * the checker itself for 49 generators of grades 5–6 and 7 «two answers»
 * generators, `data/backend-answer-verdicts.json`, 26.11).
 *
 * Only the sign moves; the fraction stays as typed — not reduced, not turned
 * into a mixed number. In grades 5–6 the checker compares a fraction as a
 * string with its reference, and the form (reduced, whole part taken out)
 * is what those tasks check.
 */

/** A number starts here: the field's start, after `;` (two answers, `;;` fields) or an opening bracket. */
const NUMBER_START = String.raw`(^|;|\(|\\left\()`

const SIGNED_FRACTION = new RegExp(
  `${NUMBER_START}\\\\frac\\{(-?)(\\d+)\\}\\{(-?)(\\d+)\\}`,
  'g',
)

export const toCheckerAnswer = <T>(answer: T): T => {
  if (typeof answer !== 'string' || !answer.includes('\\frac{')) return answer

  return answer.replace(
    SIGNED_FRACTION,
    (
      whole,
      start: string,
      numSign: string,
      num: string,
      denSign: string,
      den: string,
    ) => {
      if (!numSign && !denSign) return whole
      const negative = (numSign === '-') !== (denSign === '-')
      return `${start}${negative ? '-' : ''}\\frac{${num}}{${den}}`
    },
  ) as T
}
