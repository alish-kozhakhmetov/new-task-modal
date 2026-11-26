import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import {
  isCalculateByImageCorrect,
  type ExpectedListAnswer,
} from '../../lib/check-calculate-by-image'
import { toCalculateByImageApiAnswer } from '../../lib/parse-calculate-by-image'
import { solveCalculateByImage } from '../../lib/solve-calculate-by-image'
import type { FixtureFile, FixtureTask } from '../../lib/storybook/story-frame'

import fixtures from './data/tasks.json'

import { CalculateByImagePlain as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)

const { tasks } = fixtures as unknown as FixtureFile
const task = (id: string) => {
  const found = tasks.find((t) => t.type === `Elixir.Task_${id}`)
  if (!found) throw new Error(`no fixture ${id}`)
  return found
}

/** Controlled like the window: the store answer comes back as a prop. */
const renderTask = (t: FixtureTask) => {
  let answer = ''
  const deps = makeTaskModalDeps()
  const view = (value: string) => (
    <Template
      task={{ ...t, solution: null }}
      deps={deps}
      answer={value}
      onChange={(next) => {
        answer = next
        rerender(view(next))
      }}
      mathInput={{ current: new Map() }}
    />
  )
  const { rerender } = render(view(''))
  return { answer: () => answer }
}

const tapPool = (index: number) => {
  const button = screen
    .getAllByTestId('cbi-pool-item')
    .find((el) => el.getAttribute('data-index') === String(index))
  if (!button) throw new Error(`no row item ${index}`)
  fireEvent.click(button)
}

const expected = (t: FixtureTask) => t._expected as ExpectedListAnswer

/*
 * Units «мм», «мг» (Task_3_15_1_4): the reference is a list of translation
 * maps, and the backend's `String.starts_with?` raises on its head. Kept in
 * the stories to show the picture, not counted as solvable.
 */
const BACKEND_RAISES = new Set(['Elixir.Task_3_15_1_4'])

describe('calculateByImage.plain — каждая реальная задача решается', () => {
  it.each(
    tasks
      .filter((t) => !BACKEND_RAISES.has(t.type))
      .map((t) => [t.type.replace('Elixir.Task_', ''), t] as const),
  )('%s: нажатия по эталону дают верный ответ бэку', (_, t) => {
    const plan = solveCalculateByImage(t.description, expected(t))
    expect(plan).not.toBeNull()

    const { answer } = renderTask(t)
    for (const index of plan ?? []) tapPool(index)

    const wire = toCalculateByImageApiAnswer(answer(), t.description)
    const isEmptyAdd = (plan ?? []).length === 0
    if (isEmptyAdd) return
    expect(isCalculateByImageCorrect(expected(t), wire)).toBe(true)

    // Mutation: the zone without the last tap must not pass.
    fireEvent.click(screen.getAllByTestId('cbi-zone-item').at(-1) as Element)
    const shorter = toCalculateByImageApiAnswer(answer(), t.description)
    expect(isCalculateByImageCorrect(expected(t), shorter)).toBe(false)
  })
})

describe('calculateByImage.plain — поведение', () => {
  it('предметы, лежавшие с начала, не убираются (Task_0_1_38_9)', () => {
    renderTask(task('0_1_38_9'))
    const zone = screen.getAllByTestId('cbi-zone-item')
    expect(zone).toHaveLength(3)
    expect(zone.every((el) => el.getAttribute('data-locked') === 'true')).toBe(
      true,
    )
  })

  it('ряд-источник: одна кнопка даёт сколько угодно (Task_0_10_5_2, 15 булочек)', () => {
    const { answer } = renderTask(task('0_10_5_2'))
    expect(screen.getAllByTestId('cbi-pool-item')).toHaveLength(1)
    for (let i = 0; i < 15; i += 1) tapPool(0)
    const wire = toCalculateByImageApiAnswer(
      answer(),
      task('0_10_5_2').description,
    )
    expect(wire?.list).toHaveLength(15)
    expect(isCalculateByImageCorrect(expected(task('0_10_5_2')), wire)).toBe(
      true,
    )
  })

  it('isChangable: взятый предмет оставляет пустое место в ряду (Task_0_6_3_9)', () => {
    renderTask(task('0_6_3_9'))
    const before = screen.getAllByTestId('cbi-pool-item').length
    fireEvent.click(screen.getAllByTestId('cbi-pool-item')[0])
    expect(screen.getAllByTestId('cbi-pool-item')).toHaveLength(before - 1)
    expect(screen.getAllByTestId('cbi-pool-slot')).toHaveLength(1)
    // back from the zone — the place fills again
    fireEvent.click(screen.getAllByTestId('cbi-zone-item')[0])
    expect(screen.queryAllByTestId('cbi-pool-slot')).toHaveLength(0)
  })

  it('порядок важен: те же мячи в другом порядке — неверно (Task_0_6_3_9)', () => {
    const t = task('0_6_3_9')
    const plan = solveCalculateByImage(t.description, expected(t)) ?? []
    const { answer } = renderTask(t)
    for (const index of [...plan].reverse()) tapPool(index)
    const wire = toCalculateByImageApiAnswer(answer(), t.description)
    expect(isCalculateByImageCorrect(expected(t), wire)).toBe(false)
  })

  it('монеты: верна любая сумма, не только набор эталона (Task_1_20_1_14)', () => {
    const t = task('1_20_1_14')
    const list = (expected(t).list as string[]) ?? []
    const sum = list.reduce((s, id) => s + Number(id.replace('coin', '')), 0)
    const ones = Array.from({ length: sum }, () => ({ id: 'coin1' }))
    expect(isCalculateByImageCorrect(expected(t), { list: ones })).toBe(true)
    expect(
      isCalculateByImageCorrect(expected(t), { list: ones.slice(1) }),
    ).toBe(false)
  })

  it('зона полна — ряд неактивен (Task_0_1_38_9, вместимость 7)', () => {
    renderTask(task('0_1_38_9'))
    for (let i = 0; i < 4; i += 1) tapPool(3)
    expect(screen.getAllByTestId('cbi-zone-item')).toHaveLength(7)
    expect(screen.getByTestId('cbi-pool-item')).toBeDisabled()
  })

  it('пустая зона — пустой ответ, «Проверить» не активна', () => {
    const { answer } = renderTask(task('0_10_5_2'))
    tapPool(0)
    fireEvent.click(screen.getAllByTestId('cbi-zone-item')[0])
    expect(answer()).toBe('')
  })
})

describe('проверка — порт CalculateByImageTaskAnswer.correct?', () => {
  const ids = (...xs: unknown[]) => ({ list: xs.map((id) => ({ id })) })

  it('повторы значимы: одна линейка — не шесть', () => {
    const e = { list: Array<string>(6).fill('ruler'), 'sortable?': true }
    expect(
      isCalculateByImageCorrect(e, ids(...Array<string>(6).fill('ruler'))),
    ).toBe(true)
    expect(isCalculateByImageCorrect(e, ids('ruler'))).toBe(false)
  })

  it('sortable?: true — порядок не важен, false — важен', () => {
    expect(
      isCalculateByImageCorrect(
        { list: ['a', 'b'], 'sortable?': true },
        ids('b', 'a'),
      ),
    ).toBe(true)
    expect(
      isCalculateByImageCorrect(
        { list: ['a', 'b'], 'sortable?': false },
        ids('b', 'a'),
      ),
    ).toBe(false)
  })

  it('список списков — любой из наборов (Task_0_7_14_1)', () => {
    const e = {
      list: [
        ['x', 'x'],
        ['x', 'x', 'x'],
      ],
      'sortable?': true,
    }
    expect(isCalculateByImageCorrect(e, ids('x', 'x', 'x'))).toBe(true)
    expect(isCalculateByImageCorrect(e, ids('x'))).toBe(false)
  })

  it('list не список (Task_3_7_7_30: list = 2) — верного ответа нет', () => {
    expect(isCalculateByImageCorrect({ list: 2 }, ids('x'))).toBe(false)
  })
})
