import { beforeAll, describe, expect, it } from 'vitest'

import '../../../../.storybook/jquery-global'
import '@edtr-io/mathquill/build/mathquill.js'

import {
  insertSymbolToMathField,
  MATHQUILL_CONFIG,
} from '@/ui/math-input/model'
import type { MathField } from '@/ui/math-input/types'

import { toCheckerAnswer } from './checker-answer'
import verdicts from './data/backend-answer-verdicts.json'

/**
 * The fixture is the backend's own verdicts: every task instance was built
 * by its generator, round-tripped through its stored fields and checked by
 * `TaskChecker.user_answer_correct?/2` (see `_source` in the JSON). `type`
 * is the reference record, `accepted` / `rejected` what the checker said.
 * Here we type `type` as a pupil does — with the window's keyboard, into a
 * real MathQuill field — and require the package to send an accepted record.
 */

type Case = (typeof verdicts.cases)[number]

/** Keys of the window's keyboard (calculator `main.ts`) that type `record`. */
const keysFor = (record: string): string[] => {
  const keys: string[] = []
  const fraction = /^\\frac\{(\d+)\}\{(\d+)\}/
  let rest = record
  while (rest) {
    const frac = fraction.exec(rest)
    if (frac) {
      // «x/y», numerator, down to the denominator, out of the fraction
      keys.push('\\frac', ...frac[1], 'Down', ...frac[2], 'Right')
      rest = rest.slice(frac[0].length)
      continue
    }
    const ch = rest[0]
    if (ch === '(') keys.push('( )')
    else if (ch === ')') keys.push('Right')
    else keys.push(ch)
    rest = rest.slice(1)
  }
  return keys
}

let MQ: { MathField: (el: HTMLElement, config: unknown) => MathField }

const typeInField = (keys: string[]): string => {
  const el = document.createElement('span')
  document.body.append(el)
  const field = MQ.MathField(el, MATHQUILL_CONFIG)
  for (const key of keys) insertSymbolToMathField(field, key)
  const latex = field.latex()
  el.remove()
  return latex
}

/** What use-check-answer sends: one field, or fields joined with `;;`. */
const sendTyped = (record: string): string =>
  toCheckerAnswer(
    record
      .split(';;')
      .map((part) => typeInField(keysFor(part)))
      .join(';;'),
  )

beforeAll(() => {
  MQ = window.MathQuill.getInterface(2)
})

const byRule = (rule: string) =>
  verdicts.cases.filter((c: Case) => c.rule === rule)

describe('toCheckerAnswer — what the checker already accepts stays as is', () => {
  const accepted = [...new Set(verdicts.cases.flatMap((c: Case) => c.accepted))]

  it(`${accepted.length} accepted records pass through unchanged`, () => {
    expect(accepted.length).toBeGreaterThan(500)
    for (const record of accepted) expect(toCheckerAnswer(record)).toBe(record)
  })

  it('non-strings (picked variants, counted pictures) pass through', () => {
    const list = ['1', '2']
    expect(toCheckerAnswer(list)).toBe(list)
    expect(toCheckerAnswer(undefined)).toBeUndefined()
  })
})

describe('toCheckerAnswer — a minus inside a fraction moves in front', () => {
  it.each([
    ['\\frac{-1}{8}', '-\\frac{1}{8}'],
    ['\\frac{1}{-8}', '-\\frac{1}{8}'],
    ['\\frac{-1}{-8}', '\\frac{1}{8}'],
    ['\\frac{-1}{9};\\frac{1}{9}', '-\\frac{1}{9};\\frac{1}{9}'],
    ['\\frac{1}{3};;\\frac{-3}{8}', '\\frac{1}{3};;-\\frac{3}{8}'],
    ['\\left(\\frac{-1}{2};3\\right)', '\\left(-\\frac{1}{2};3\\right)'],
  ])('%s → %s', (typed, sent) => {
    expect(toCheckerAnswer(typed)).toBe(sent)
  })

  it.each([
    // not a number's start: an expression or a mixed number — left as typed
    '2\\frac{-1}{3}',
    '-\\frac{-1}{3}',
    '3+\\frac{-1}{2}',
    '\\frac{-x}{2}',
  ])('%s is left as typed', (typed) => {
    expect(toCheckerAnswer(typed)).toBe(typed)
  })

  const negatives = verdicts.minusInsideFraction

  it(`${negatives.length} generators: the minus typed in the numerator reaches the checker as the accepted record`, () => {
    expect(negatives.length).toBeGreaterThan(40)
    for (const n of negatives) {
      // the record as typed is the one the checker rejected…
      expect(toCheckerAnswer(n.minusInNumerator)).not.toBe(n.minusInNumerator)
      // …and what we send is the one it accepted
      expect(toCheckerAnswer(n.minusInNumerator)).toBe(n.accepted)
    }
  })

  it('typed with the keyboard: «x/y», «−», «1», down, «8» → -\\frac{1}{8}', () => {
    const latex = typeInField(['\\frac', '-', '1', 'Down', '8', 'Right'])
    expect(latex).toBe('\\frac{-1}{8}')
    expect(toCheckerAnswer(latex)).toBe('-\\frac{1}{8}')
  })
})

describe('typed with the window keyboard, sent as the checker accepts', () => {
  const rules = [
    'ans:fraction-5-6',
    'scan:fraction-5-6',
    'ans:TaskAnswers.TwoAnswersTaskAnswer',
    'ans:float',
    'ans:EquationSystemsTaskAnswer',
    'ans:PeriodicNumber',
  ]

  // ~150 real MathQuill fields per rule: seconds alone, more in a full run
  const TYPING_TIMEOUT = 60_000

  it.each(rules)(
    '%s',
    (rule) => {
      const cases = byRule(rule)
      expect(cases.length).toBeGreaterThan(0)
      const misses = cases
        .map((c) => ({
          id: c.id,
          sent: sendTyped(c.type),
          accepted: c.accepted,
        }))
        .filter((r) => !r.accepted.includes(r.sent))
      expect(misses).toEqual([])
    },
    TYPING_TIMEOUT,
  )

  it('a mixed number: «2», «x/y», «4», down, «45» → 2\\frac{4}{45}', () => {
    expect(sendTyped('2\\frac{4}{45}')).toBe('2\\frac{4}{45}')
  })

  it('the fault check can fail: a record the checker rejected is not sent as accepted', () => {
    const improper = verdicts.cases.find(
      (c) =>
        c.rule === 'ans:fraction-5-6' &&
        c.rejected.some((r) => /^\\frac\{\d+\}\{\d+\}$/.test(r)),
    )
    expect(improper).toBeDefined()
    const rejected = improper!.rejected.find((r) =>
      /^\\frac\{\d+\}\{\d+\}$/.test(r),
    )!
    expect(improper!.accepted).not.toContain(sendTyped(rejected))
  })
})
