/**
 * Stream CX: the backend's answer check for the answer kinds of the corpus,
 * ported from `matheducator_task_common/lib/helpers/task/task_checker.ex`
 * (`user_answer_correct?` / `answer_correct?`, read 26.11). Only what the
 * CX corpus needs: integer, float, MyDecimal, binary, MultipleTaskAnswer,
 * AnyOfThemTaskAnswer and a list of alternatives. Anything else — Interval,
 * Union, Expression's own check, Fraction strings of grades 5–6 — returns
 * `null` («not judged here»): that is stream ANS's rule, not a layout's.
 *
 *   judge(taskType, backendAnswer, userAnswer) → true | false | null
 */

const normalizeUser = (s) =>
  s
    .split('\\ ')
    .join('')
    .split(' ')
    .join('')
    .split('_{}^')
    .join('^')
    .split('\\left')
    .join('')
    .split('\\right')
    .join('')
    .split('^{}')
    .join('')
    .split('∞')
    .join('\\infty')
    .split('∪')
    .join('\\cup')
    .split('∩')
    .join('\\cap')

const FRACTION = /[0-9]{0,}\\frac{[0-9]{1,}?}{[0-9]{1,}?}/

/** Converters.string_to_lib_decimal on what a pupil sends: «3,5» / «3.5» / «-2» */
const toDecimal = (s) => {
  const t = String(s).replace(',', '.')
  return /^[+-]?\d+(\.\d+)?$/.test(t) ? Number(t) : null
}

const myDecimalValue = (d) => d.sign * d.coef * 10 ** d.exp

const struct = (a) => (a && typeof a === 'object' && !Array.isArray(a) ? a._struct : null)

function answerCorrect(type, answer, user) {
  if (user == null) return false
  user = normalizeUser(String(user))
  if (typeof answer === 'string') {
    const a = answer.split(' ').join('').split('<=').join('\\le').split('>=').join('\\ge')
    return user === a || user === a.split(';').join(',') || user.split('.').join(',') === a
  }
  if (typeof answer === 'number') {
    if (Number.isInteger(answer)) return user === String(answer)
    if (FRACTION.test(user)) return null
    const u = toDecimal(user)
    return u !== null && Math.abs(u - answer) < 1e-12
  }
  switch (struct(answer)) {
    case 'MyDecimal': {
      if (FRACTION.test(user)) return null
      const u = toDecimal(user)
      return u !== null && Math.abs(u - myDecimalValue(answer)) < 1e-12
    }
    case 'MultipleTaskAnswer': {
      const parts = user.split(';;')
      if (parts.length !== answer.answers.length) return false
      let unknown = false
      for (const [i, x] of answer.answers.entries()) {
        const r = answerCorrect(type, x, parts[i] ?? '')
        if (r === false) return false
        if (r === null) unknown = true
      }
      return unknown ? null : true
    }
    case 'TaskAnswers.AnyOfThemTaskAnswer':
      return anyOf(type, answer.answers, user)
    default:
      if (Array.isArray(answer)) return anyOf(type, answer, user)
      return null
  }
}

function anyOf(type, answers, user) {
  let unknown = false
  for (const x of answers) {
    const r = answerCorrect(type, x, user)
    if (r === true) return true
    if (r === null) unknown = true
  }
  return unknown ? null : false
}

export const judge = (type, answer, user) => answerCorrect(type, answer, user)
