import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { makeDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { checkPlaneAnswer } from '../../lib/check-plane-answer'
import { planeModeOf } from '../../lib/drawing-figure'
import { toWireAnswer, type Pt } from '../../lib/plane-answer'
import {
  fillPredicate,
  solveFigures,
  solveFill,
  solvePlaneAnswer,
} from '../../lib/solve-plane-answer'

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

/**
 * What a pupil who solved a plane of figures draws (E, F): the figures, and
 * on a plane to shade the filling point when the answer asks for one.
 */
const solutionOf = (t: PlaneFixture) => {
  const f = t.description.figure
  const step = f.tickStep || 1
  const field = {
    lo: (f.minPosition ?? -5) - step,
    hi: (f.maxPosition ?? 5) + step,
  }
  const mode = planeModeOf(f)
  const fill = mode.kind === 'multi' && mode.fill
  return {
    field,
    step,
    figures: solveFigures(t._backend.answer, field),
    needsFill: fill && fillPredicate(t._backend.answer, field) != null,
    fill: fill
      ? solveFill(t._backend.answer, {
          lo: field.lo + step,
          hi: field.hi - step,
          step,
        })
      : null,
  }
}

const answerable = SEED_PLANE_TASKS.filter((t) => {
  const kind = planeModeOf(t.description.figure).kind
  if (kind === 'unsupported') return false
  return kind === 'multi'
    ? solutionOf(t).figures
    : solvePlaneAnswer(t._backend.answer, t.description.figure)
})
const single = answerable.filter(
  (t) => planeModeOf(t.description.figure).kind !== 'multi',
)
/**
 * A solution the window can draw: the figures' nodes within the field and
 * one tick past it, as InteractivePlane snaps, and a filling point where one
 * is due. Facts of the generators, counted below, not drawn:
 * Task_11_5_5_25 seeds 1–2 ask for a circle of radius 9 on a −5…5 plane (no
 * node reachable). On the test branch also Task_5_8_8_6 seeds 2–3 (shade
 * x² + y² ≥ 16 and x² + y² ≤ 9 at once — an empty region); master orders the
 * radii, and the corpus is master's (27.11).
 */
const UNSOLVABLE = new Set(['Task_11_5_5_25#1', 'Task_11_5_5_25#2'])
const reachable = (t: PlaneFixture) => {
  const { field, figures, needsFill, fill } = solutionOf(t)
  const inField = (figures ?? []).every((g) =>
    g.points.every(
      (p) =>
        p.x >= field.lo &&
        p.x <= field.hi &&
        p.y >= field.lo &&
        p.y <= field.hi,
    ),
  )
  return inField && (!needsFill || fill != null)
}
const allMulti = answerable.filter(
  (t) => planeModeOf(t.description.figure).kind === 'multi',
)
const multi = allMulti.filter(reachable)

/** The very answer the window sent is the one TaskChecker judged. */
const expectBackendAccepted = (task: PlaneFixture, last: string) => {
  const record = rows.find(
    (r) => keyOf(r) === keyOf(task._backend) && r.label === 'solved',
  )
  expect(record, 'a verdict of the backend for this seed').toBeTruthy()
  expect(record?.wire).toEqual(toWireAnswer(last))
  // accepted, or not judged locally (the OTP regex, see above)
  expect(
    record?.verdict === true || String(record?.verdict).startsWith(OTP_REGEX),
  ).toBe(true)
}

/** How many figures a store answer of several carries. */
const figureCount = (answer: unknown) =>
  (JSON.parse(String(answer)) as { figures: unknown[] }).figures.length

/** Tab onto the plane afresh: the cursor shows at the origin. */
const focusPlane = (plane: Element) => {
  act(() => (plane as unknown as SVGSVGElement).blur())
  fireEvent.keyDown(document.body, { key: 'Tab' })
  act(() => (plane as unknown as SVGSVGElement).focus())
}

describe('coordinatePlane.draw — real tasks solved through the window', () => {
  it('has the scenarios it claims (a gate that can fail: an empty corpus is a failure)', () => {
    const kinds = new Set(
      answerable.map((t) => planeModeOf(t.description.figure).kind),
    )
    expect([...kinds].sort()).toEqual(['dots', 'figure', 'multi', 'point'])
    // several figures (scenario E): lines, segments, the pupil's pick
    expect(multi.length).toBeGreaterThan(120)
    expect(
      allMulti.filter((t) => !reachable(t)).map((t) => keyOf(t._backend)),
    ).toEqual([...UNSOLVABLE])
    // a plane to shade (scenario F): lines and circles, then the region
    expect(multi.filter((t) => solutionOf(t).fill).length).toBeGreaterThan(20)
    // the exponent and the logarithm with the asymptote (grade 11): 5 × 3 seeds
    expect(
      multi.filter((t) => /^Task_11_6_[14]_/.test(t._backend.id)),
    ).toHaveLength(15)
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

  it.each(single.map((t) => [keyOf(t._backend), t] as const))(
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
      expectBackendAccepted(task, last)
    },
  )

  it.each(multi.map((t) => [keyOf(t._backend), t] as const))(
    '%s: figure by figure — add, Tab back, the keyboard puts its points',
    (_, task) => {
      const onAnswer = vi.fn()
      render(<Host task={task} onAnswer={onAnswer} />)
      const mode = planeModeOf(task.description.figure)
      if (mode.kind !== 'multi') throw new Error('not a multi-figure plane')
      const plane = screen.getByTestId('coordinate-plane-interactive')
      const { step, figures: solved, fill } = solutionOf(task)
      const figures = solved!
      figures.forEach((f, i) => {
        // a fixed plane opens with its first figure; any other is added
        if (i > 0 || mode.fixed == null)
          fireEvent.click(screen.getByTestId(`coordinate-plane-add-${f.type}`))
        const pressed = screen
          .getAllByTestId('coordinate-plane-figure')
          .map((b) => b.getAttribute('aria-pressed'))
        expect(pressed.indexOf('true')).toBe(i)
        focusPlane(plane)
        let at: Pt = { x: 0, y: 0 }
        for (const p of f.points) {
          keyTo(plane, at, p, step)
          at = p
        }
      })
      if (fill) {
        // «Закрасить»: the clicks go half a cell apart, to the region
        fireEvent.click(screen.getByTestId('coordinate-plane-fill'))
        focusPlane(plane)
        keyTo(plane, { x: 0, y: 0 }, fill, step / 2)
      }
      // the region is hatched once the filling point is put, and only then
      expect(screen.queryByTestId('coordinate-plane-shade') != null).toBe(
        fill != null,
      )
      const last = onAnswer.mock.calls.at(-1)?.[0] as string
      expect(figureCount(last)).toBe(figures.length)
      expect(checkPlaneAnswer(task._backend.answer, toWireAnswer(last))).toBe(
        true,
      )
      expectBackendAccepted(task, last)
    },
  )

  it('several figures: a half figure is not sent, «Удалить» takes the active one', () => {
    const task = multi.find((t) => {
      const mode = planeModeOf(t.description.figure)
      return mode.kind === 'multi' && mode.fixed === 20
    })!
    const onAnswer = vi.fn()
    render(<Host task={task} onAnswer={onAnswer} />)
    const plane = screen.getByTestId('coordinate-plane-interactive')
    focusPlane(plane)
    keyTo(plane, { x: 0, y: 0 }, { x: 1, y: 1 }, 1)
    // one point of a line: no answer yet, and no second figure to add
    expect(onAnswer).not.toHaveBeenCalled()
    expect(screen.getByTestId('coordinate-plane-add-20')).toBeDisabled()
    keyTo(plane, { x: 1, y: 1 }, { x: 2, y: 2 }, 1)
    const one = onAnswer.mock.calls.at(-1)?.[0] as string
    expect(figureCount(one)).toBe(1)
    fireEvent.click(screen.getByTestId('coordinate-plane-add-20'))
    focusPlane(plane)
    keyTo(plane, { x: 0, y: 0 }, { x: 0, y: 1 }, 1)
    // the second line is half: the answer is still the first one
    expect(onAnswer.mock.calls.at(-1)?.[0]).toBe(one)
    keyTo(plane, { x: 0, y: 1 }, { x: 1, y: 3 }, 1)
    expect(figureCount(onAnswer.mock.calls.at(-1)?.[0] as string)).toBe(2)
    fireEvent.click(screen.getByTestId('coordinate-plane-remove'))
    expect(onAnswer.mock.calls.at(-1)?.[0]).toBe(one)
    fireEvent.click(screen.getByTestId('coordinate-plane-clear'))
    expect(onAnswer).toHaveBeenLastCalledWith('')
    expect(screen.getAllByTestId('coordinate-plane-figure')).toHaveLength(1)
  })

  it('keeps its keys: Enter and the arrows do not reach the modal, which checks the answer on Enter', () => {
    // actions.tsx hears Enter natively on the task root and checks the
    // answer: a pupil putting the second figure's point lost a life (27.11)
    const task = multi.find((t) => {
      const mode = planeModeOf(t.description.figure)
      return mode.kind === 'multi' && mode.fixed === 20
    })!
    const onAnswer = vi.fn()
    const heard = vi.fn<(key: string) => void>()
    render(
      <div data-testid="task-root">
        <Host task={task} onAnswer={onAnswer} />
      </div>,
    )
    screen
      .getByTestId('task-root')
      .addEventListener('keydown', (e: KeyboardEvent) => {
        heard(e.key)
      })
    const plane = screen.getByTestId('coordinate-plane-interactive')
    focusPlane(plane)
    keyTo(plane, { x: 0, y: 0 }, { x: 1, y: 1 }, 1)
    keyTo(plane, { x: 1, y: 1 }, { x: 2, y: 2 }, 1)
    fireEvent.click(screen.getByTestId('coordinate-plane-add-20'))
    focusPlane(plane)
    keyTo(plane, { x: 0, y: 0 }, { x: 0, y: 1 }, 1)
    expect(figureCount(onAnswer.mock.calls.at(-1)?.[0] as string)).toBe(1)
    expect(heard).not.toHaveBeenCalled()
  })

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
    expect(
      solved
        .filter((r) => !accepted(r) && !UNSOLVABLE.has(keyOf(r)))
        .map((r) => r.id),
    ).toEqual([])
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
