/**
 * Proof against the backend itself: the answer the window builds, not the
 * ported rule. Off by default; on with two env vars:
 *
 *   CBI_GEN=<gen.jsonl> CBI_JOBS=<jobs.jsonl> npx vitest run --project=unit --maxWorkers=2 backend-window-answers
 *
 * `gen.jsonl` — tasks built by the monolith's generators
 * (`scripts/calculate-by-image-backend-gen.exs`). Every calculateByImage task
 * is rendered in the template, the pupil's taps are clicks on the rendered
 * row, and what the window stores goes through `toWireAnswer` — the same
 * call `use-check-answer` makes before `api.checkAnswer`. Records for the
 * monolith's TaskChecker (`check.exs`), `expect` is the verdict wanted:
 *
 * - `ref`  — the zone after the reference taps → 30;
 * - `miss` — the zone with the last tap taken back (or, when that leaves
 *   nothing to send or another accepted set, one more item) → 20;
 * - `raw`  — the store string as 2.5.8 would send it, no `toWireAnswer` → 20.
 *
 * withCell: the window shows the field only after the action the condition
 * asks for; the number goes as typed — `ref` the reference, `miss` + 1.
 * Tasks the window cannot answer go to `<jobs>.skipped.json` with the reason.
 */
import { closeSync, openSync, readSync, writeFileSync } from 'node:fs'

// eslint-disable-next-line testing-library/no-manual-cleanup -- one test renders ~1800 tasks in turn
import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TaskDescriptionType } from '@/modules/task-modal/model/constants'
import { toWireAnswer } from '@/modules/task-modal/model/lib/to-wire-answer'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { CalculateByImagePlain } from '../ui/plain'
import { CalculateByImageWithCell } from '../ui/with-cell'

import {
  isCalculateByImageCorrect,
  type ExpectedListAnswer,
  type WireListAnswer,
} from './check-calculate-by-image'
import { solveCalculateByImage } from './solve-calculate-by-image'
import type { CalculateByImageTask } from './types.task'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../text/lib/testing/mocks/math-text'),
)
vi.mock('@/ui/math-input/math-input', () => ({
  MathInput: () => <input data-testid="cbi-input" />,
}))

interface Generated {
  type: string
  seed: number
  dtype?: string
  error?: string
  refError?: string
  answer?: unknown
  task?: CalculateByImageTask
}

/** Lines of a JSONL file read in chunks: a generator run is ~550 MB. */
function* readLines(path: string): Generator<string> {
  const fd = openSync(path, 'r')
  const chunk = Buffer.alloc(1 << 22)
  let rest = Buffer.alloc(0)
  try {
    for (;;) {
      const n = readSync(fd, chunk, 0, chunk.length, null)
      if (n === 0) break
      let data = Buffer.concat([rest, chunk.subarray(0, n)])
      let at = data.indexOf(10)
      while (at >= 0) {
        const line = data.subarray(0, at).toString('utf8')
        if (line.trim()) yield line
        data = data.subarray(at + 1)
        at = data.indexOf(10)
      }
      rest = Buffer.from(data)
    }
    if (rest.length > 0 && rest.toString('utf8').trim())
      yield rest.toString('utf8')
  } finally {
    closeSync(fd)
  }
}

const GEN = process.env.CBI_GEN
const OUT = process.env.CBI_JOBS

const wireOf = (task: CalculateByImageTask, stored: string) =>
  toWireAnswer({
    description: task.description,
    answer: stored,
    calculateByImageType: TaskDescriptionType.CalculateByImage,
  })

/** Plain: the template under control, as the window holds it. */
const renderPlain = (task: CalculateByImageTask) => {
  let answer = ''
  const deps = makeTaskModalDeps()
  const view = (value: string) => (
    <CalculateByImagePlain
      task={task}
      deps={deps}
      answer={value}
      onChange={(next) => {
        answer = next
        rerender(view(next))
      }}
      mathInput={{ current: new Map() }}
    />
  )
  const { rerender, container } = render(view(''))
  const ui = within(container)
  const tap = (index: number): string | null => {
    const button = ui
      .queryAllByTestId('cbi-pool-item')
      .find((el) => el.getAttribute('data-index') === String(index))
    if (!button) return `в ряду нет кнопки ${index}`
    if ((button as HTMLButtonElement).disabled) return 'ряд неактивен'
    fireEvent.click(button)
    return null
  }
  const takeBackLast = () => {
    const own = ui
      .queryAllByTestId('cbi-zone-item')
      .filter((el) => el.tagName === 'BUTTON')
    const last = own.at(-1)
    if (last) fireEvent.click(last)
  }
  /** First enabled row item, other than `except` when given. */
  const tapAnyEnabled = (except?: number) => {
    const button = ui
      .queryAllByTestId('cbi-pool-item')
      .find(
        (el) =>
          !(el as HTMLButtonElement).disabled &&
          el.getAttribute('data-index') !== String(except),
      )
    if (button) fireEvent.click(button)
    return Boolean(button)
  }
  return { answer: () => answer, tap, takeBackLast, tapAnyEnabled }
}

/** withCell: do what the condition asks until the field shows up. */
const reachField = (task: CalculateByImageTask): boolean => {
  const { container } = render(
    <CalculateByImageWithCell
      task={task}
      deps={makeTaskModalDeps()}
      answer=""
      onChange={() => undefined}
      mathInput={{ current: new Map() }}
    />,
  )
  const ui = within(container)
  for (let step = 0; step <= 25; step += 1) {
    if (ui.queryByTestId('cbi-field')) return true
    const pool = ui
      .queryAllByTestId('cbi-pool-item')
      .find((el) => !(el as HTMLButtonElement).disabled)
    const zone = ui
      .queryAllByTestId('cbi-zone-item')
      .filter((el) => el.tagName === 'BUTTON')
    const target = pool ?? zone.at(-1)
    if (!target) return false
    fireEvent.click(target)
  }
  return Boolean(ui.queryByTestId('cbi-field'))
}

describe.skipIf(!GEN || !OUT)(
  'calculateByImage — ответы окна для TaskChecker',
  () => {
    it('собирает записи', { timeout: 600_000 }, () => {
      const jobs: string[] = []
      const skipped: { type: string; seed: number; why: string }[] = []
      let rendered = 0

      for (const line of readLines(GEN as string)) {
        const g = JSON.parse(line) as Generated
        const isPlain = g.dtype === TaskDescriptionType.CalculateByImage
        const isCell = g.dtype === TaskDescriptionType.CalculateByImageWithCell
        if (!isPlain && !isCell) continue
        const skip = (why: string) =>
          skipped.push({ type: g.type, seed: g.seed, why })
        if (!g.task) {
          skip(`генератор: ${g.error ?? 'нет задачи'}`)
          continue
        }
        if (g.refError) {
          skip(`эталон падает: ${g.refError}`)
          continue
        }
        const task = { ...g.task, solution: null }
        const push = (kind: string, want: number, answer: unknown) =>
          jobs.push(
            JSON.stringify({
              key: `${g.type}#${g.seed}#${kind}`,
              expect: want,
              type: task.type,
              fields: task.fields,
              answer,
            }),
          )

        rendered += 1
        try {
          if (isCell) {
            if (!reachField(task)) {
              skip('поле не появляется')
              continue
            }
            const n = Number(g.answer)
            if (!Number.isInteger(n)) {
              skip(`эталон не целое: ${JSON.stringify(g.answer)}`)
              continue
            }
            push('ref', 30, String(n))
            push('miss', 20, String(n + 1))
            continue
          }

          const expected = g.answer as ExpectedListAnswer
          const plan = solveCalculateByImage(task.description, expected)
          if (!plan) {
            skip('не собрать в шаблоне')
            continue
          }
          const view = renderPlain(task)
          const tapError = plan.map((index) => view.tap(index)).find(Boolean)
          if (tapError) {
            skip(`окно: ${tapError}`)
            continue
          }
          const stored = view.answer()
          if (stored === '') {
            skip('нечего добавить: «Проверить» не активна')
            continue
          }
          push('ref', 30, wireOf(task, stored))
          push('raw', 20, stored)

          // A wrong answer the window can send: one tap back, unless that
          // empties the zone or is another accepted set — then the tap again
          // and one more item. The ported rule only picks the candidate; the
          // verdict is the backend's.
          const isWrong = (value: string) =>
            value !== '' &&
            value !== stored &&
            !isCalculateByImageCorrect(
              expected,
              wireOf(task, value) as WireListAnswer,
            )
          const attempt = (
            mutate: (utils: ReturnType<typeof renderPlain>) => void,
          ) => {
            cleanup()
            const utils = renderPlain(task)
            for (const index of plan) utils.tap(index)
            mutate(utils)
            return utils.answer()
          }
          const last = plan[plan.length - 1]
          const candidates = [
            // one tap back (one bun fewer)
            (utils: ReturnType<typeof renderPlain>) => utils.takeBackLast(),
            // the last tap on another item of the row (a wrong card)
            (utils: ReturnType<typeof renderPlain>) => {
              utils.takeBackLast()
              utils.tapAnyEnabled(last)
            },
            // more items than asked, one by one up to the zone's capacity
            ...Array.from(
              { length: 6 },
              (_, n) => (utils: ReturnType<typeof renderPlain>) => {
                for (let i = 0; i <= n; i += 1) utils.tapAnyEnabled()
              },
            ),
          ]
          let missStored: string | undefined
          for (const mutate of candidates) {
            const value = attempt(mutate)
            if (isWrong(value)) {
              missStored = value
              break
            }
          }
          if (missStored) {
            push('miss', 20, wireOf(task, missStored))
          } else {
            skip('неверный ответ окном не собрать')
          }
        } finally {
          cleanup()
        }
      }

      writeFileSync(OUT as string, jobs.join('\n') + '\n')
      writeFileSync(`${OUT}.skipped.json`, JSON.stringify(skipped, null, 1))
      console.log(
        `задач ${rendered}, записей ${jobs.length}, пропущено ${skipped.length}`,
      )
      expect(rendered).toBeGreaterThan(0)
    })
  },
)
