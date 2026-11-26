import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { makeDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { checkPlaneAnswer } from '../../lib/check-plane-answer'
import { planeModeOf } from '../../lib/drawing-figure'
import { toWireAnswer, type Pt } from '../../lib/plane-answer'
import { solvePlaneAnswer } from '../../lib/solve-plane-answer'

import verdicts from './data/backend-verdicts.json'
import { SEED_PLANE_TASKS, keyOf, type PlaneFixture } from './fixtures'

import { CoordinatePlaneDraw as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../text/lib/testing/mocks/math-formula'),
)

/** The template in a host that keeps the answer, as the store does. */
const Host = ({
  task,
  onAnswer,
}: {
  task: PlaneFixture
  onAnswer: (a: string) => void
}) => {
  const [answer, setAnswer] = useState('')
  return (
    <Template
      task={{ ...task, solution: null }}
      deps={makeDeps()}
      answer={answer}
      onChange={(a) => {
        setAnswer(a)
        onAnswer(a)
      }}
      mathInput={{ current: new Map() }}
    />
  )
}

/** Walks the keyboard cursor from the origin to a node and puts a point. */
const keyTo = (plane: Element, from: Pt, to: Pt, step: number) => {
  const press = (key: string, n: number) => {
    for (let i = 0; i < Math.round(Math.abs(n) / step); i += 1)
      fireEvent.keyDown(plane, { key })
  }
  press(to.x > from.x ? 'ArrowRight' : 'ArrowLeft', to.x - from.x)
  press(to.y > from.y ? 'ArrowUp' : 'ArrowDown', to.y - from.y)
  fireEvent.keyDown(plane, { key: 'Enter' })
}

/**
 * Verdicts of the real TaskChecker (local backend, scripts/coordinate-plane/
 * backend/check.exs) on the answers the window sends: the solving points,
 * reversed, one point off, and the store's JSON string sent as is.
 */
type Verdict = {
  id: string
  seed: number
  label: string
  wire: unknown
  verdict: unknown
}
const rows = verdicts as Verdict[]
/**
 * The local backend runs on OTP 29 (PCRE2): ExpressionTaskAnswer.replace_powers
 * compiles `[\w+,\w-,…]`, which PCRE2 refuses, so any answer whose
 * graph_function has «^» raises there. Not a verdict — left out, counted.
 */
const OTP_REGEX = 'raise: invalid range in character class'
const judged = rows.filter(
  (r) => !(typeof r.verdict === 'string' && r.verdict.startsWith(OTP_REGEX)),
)
/** A raise on a valid request is a 500 for the pupil: not accepted. */
const accepted = (r: Verdict) => r.verdict === true

const answerable = SEED_PLANE_TASKS.filter(
  (t) =>
    planeModeOf(t.description.figure).kind !== 'unsupported' &&
    solvePlaneAnswer(t._backend.answer, t.description.figure),
)

describe('coordinatePlane.draw — real tasks solved through the window', () => {
  it('has the scenarios it claims (a gate that can fail: an empty corpus is a failure)', () => {
    const kinds = new Set(
      answerable.map((t) => planeModeOf(t.description.figure).kind),
    )
    expect([...kinds].sort()).toEqual(['dots', 'figure', 'point'])
    // the trigonometric axes are in the corpus (scenario D′, grade 10)
    expect(
      answerable.filter((t) => {
        const mode = planeModeOf(t.description.figure)
        return mode.kind === 'figure' && mode.trig
      }).length,
    ).toBeGreaterThan(100)
    expect(answerable.length).toBeGreaterThan(90)
  })

  it('covers every generator with three seeds', () => {
    const seeds = new Map<string, Set<number>>()
    for (const t of answerable)
      seeds.set(
        t._backend.id,
        (seeds.get(t._backend.id) ?? new Set()).add(t._backend.seed),
      )
    const short = [...seeds].filter(([, s]) => s.size < 3).map(([id]) => id)
    expect(short).toEqual([])
  })

  it.each(answerable.map((t) => [keyOf(t._backend), t] as const))(
    '%s: the keyboard puts the solving points, the backend port accepts',
    (_, task) => {
      const onAnswer = vi.fn()
      render(<Host task={task} onAnswer={onAnswer} />)
      const plane = screen.getByTestId('coordinate-plane-interactive')
      // Tab onto the plane: the cursor shows at the origin
      fireEvent.keyDown(document.body, { key: 'Tab' })
      act(() => (plane as unknown as SVGSVGElement).focus())
      expect(plane.getAttribute('data-cursor')).toBeTruthy()
      const step = task.description.figure.tickStep || 1
      let at: Pt = { x: 0, y: 0 }
      for (const p of solvePlaneAnswer(
        task._backend.answer,
        task.description.figure,
      )!) {
        keyTo(plane, at, p, step)
        at = p
      }
      const last = onAnswer.mock.calls.at(-1)?.[0] as string
      expect(last).toBeTruthy()
      expect(checkPlaneAnswer(task._backend.answer, toWireAnswer(last))).toBe(
        true,
      )
      // the very answer the window sent is the one TaskChecker accepted
      const record = rows.find(
        (r) => keyOf(r) === keyOf(task._backend) && r.label === 'solved',
      )
      expect(record, 'a verdict of the backend for this seed').toBeTruthy()
      expect(record?.wire).toEqual(toWireAnswer(last))
      // accepted, or not judged locally (the OTP regex, see above)
      expect(
        record?.verdict === true ||
          String(record?.verdict).startsWith(OTP_REGEX),
      ).toBe(true)
    },
  )

  it('«Стереть» empties the answer', () => {
    const task = answerable.find(
      (t) => planeModeOf(t.description.figure).kind === 'point',
    )!
    const onAnswer = vi.fn()
    render(<Host task={task} onAnswer={onAnswer} />)
    const plane = screen.getByTestId('coordinate-plane-interactive')
    keyTo(
      plane,
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      task.description.figure.tickStep || 1,
    )
    expect(onAnswer).toHaveBeenLastCalledWith('(1;1)')
    fireEvent.click(screen.getByTestId('coordinate-plane-clear'))
    expect(onAnswer).toHaveBeenLastCalledWith('')
  })
})

describe('the backend accepts what the window sends', () => {
  /**
   * A wrong cosine with |b₁| < 1 (the points more than a quarter period
   * apart) divides by zero in CosinusTaskAnswer.normalize_c_argument — for
   * the pupil that is a 500, not «wrong». A fact of the backend; the window
   * sends what was drawn.
   */
  const COS_DIV_ZERO = 'raise: bad argument in arithmetic expression'

  it('every raise is the local OTP regex, a string where a map is due, or the cosine division', () => {
    const raises = rows.filter((r) => typeof r.verdict === 'string')
    for (const r of raises)
      expect(
        String(r.verdict).startsWith(OTP_REGEX) ||
          r.label === 'solved as string' ||
          (r.verdict === COS_DIV_ZERO &&
            r.label !== 'solved' &&
            (r.wire as { figures?: { type: number }[] }).figures?.[0]?.type ===
              200),
        `${r.id} ${r.label}: ${String(r.verdict)}`,
      ).toBe(true)
  })

  it('the solving points are accepted for every judged task', () => {
    const solved = judged.filter((r) => r.label === 'solved')
    expect(solved.length).toBeGreaterThan(100)
    expect(solved.filter((r) => !accepted(r)).map((r) => r.id)).toEqual([])
  })

  it('the store string sent as is is refused: the wire answer must be an object', () => {
    const asString = rows.filter((r) => r.label === 'solved as string')
    expect(asString.length).toBeGreaterThan(80)
    expect(asString.filter(accepted).map((r) => r.id)).toEqual([])
  })
})

describe('the port of the backend checker agrees with the backend', () => {
  const byKey = new Map(SEED_PLANE_TASKS.map((t) => [keyOf(t._backend), t]))

  it('the verdicts carry both answers: a check that only ever says «yes» proves nothing', () => {
    expect(judged.filter(accepted).length).toBeGreaterThan(80)
    expect(judged.filter((r) => !accepted(r)).length).toBeGreaterThan(80)
  })

  it.each(judged.map((r) => [`${keyOf(r)} · ${r.label}`, r] as const))(
    '%s',
    (_, row) => {
      const task = byKey.get(keyOf(row))
      expect(task, `fixture ${keyOf(row)}`).toBeTruthy()
      expect(checkPlaneAnswer(task!._backend.answer, row.wire)).toBe(
        accepted(row),
      )
    },
  )
})
