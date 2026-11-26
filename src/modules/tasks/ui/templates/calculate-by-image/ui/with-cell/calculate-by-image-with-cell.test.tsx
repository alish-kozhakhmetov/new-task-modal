import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { isCountCorrect } from '../../lib/check-calculate-by-image'
import { parseCalculateByImage } from '../../lib/parse-calculate-by-image'
import type { FixtureFile, FixtureTask } from '../../lib/storybook/story-frame'
import { withCellMode, type WithCellMode } from '../../lib/with-cell-rules'

import fixtures from './data/tasks.json'

import { CalculateByImageWithCell as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock('@/ui/math-input/math-input', () => ({
  MathInput: () => <input data-testid="cbi-input" />,
}))

const { tasks } = fixtures as unknown as FixtureFile
const task = (id: string) => {
  const found = tasks.find((t) => t.type === `Elixir.Task_${id}`)
  if (!found) throw new Error(`no fixture ${id}`)
  return found
}

const renderTask = (t: FixtureTask) =>
  render(
    <Template
      task={{ ...t, solution: null }}
      deps={makeTaskModalDeps()}
      answer=""
      onChange={vi.fn()}
      mathInput={{ current: new Map() }}
    />,
  )

const modeOf = (t: FixtureTask) =>
  withCellMode(t.description, parseCalculateByImage(t.description, String))

/** Do what the condition asks until the question and the field show up. */
const act = (t: FixtureTask): number => {
  let steps = 0
  while (!screen.queryByTestId('cbi-field') && steps < 25) {
    const mode = modeOf(t)
    if (mode === 'remove') {
      const items = screen.getAllByTestId('cbi-zone-item')
      fireEvent.click(items[items.length - 1])
    } else {
      fireEvent.click(screen.getAllByTestId('cbi-pool-item')[0])
    }
    steps += 1
  }
  return steps
}

const MODES: Record<string, WithCellMode> = {
  '0_10_5_1': 'count',
  '0_3_11_6': 'transform',
  '0_3_11_7': 'transform',
  '0_8_16_1': 'remove',
  '0_8_12_1': 'remove',
  '0_5_12_10': 'remove',
  '0_8_1_3': 'add',
  '1_6_11_7': 'add',
  '1_5_1_4': 'add',
  '1_7_1_13': 'add',
}

describe('calculateByImage.withCell — каждая реальная задача доходит до поля', () => {
  it.each(tasks.map((t) => [t.type.replace('Elixir.Task_', ''), t] as const))(
    '%s',
    (id, t) => {
      expect(modeOf(t)).toBe(MODES[id])
      renderTask(t)
      act(t)
      expect(screen.getByTestId('cbi-field')).toBeInTheDocument()
      // the reference typed in is correct, one off is not
      expect(isCountCorrect(t._expected, String(t._expected))).toBe(true)
      expect(isCountCorrect(t._expected, String(Number(t._expected) + 1))).toBe(
        false,
      )
    },
  )
})

describe('calculateByImage.withCell — поведение', () => {
  it('«Посчитайте булочки»: поле сразу, предметы не трогаются (0_10_5_1)', () => {
    renderTask(task('0_10_5_1'))
    expect(screen.getByTestId('cbi-field')).toBeInTheDocument()
    expect(screen.queryByTestId('cbi-pool')).not.toBeInTheDocument()
    expect(
      screen
        .getAllByTestId('cbi-zone-item')
        .every((el) => el.tagName === 'SPAN'),
    ).toBe(true)
  })

  it('кролики: морковка превращает кролика, поле — после всех пяти (0_3_11_6)', () => {
    renderTask(task('0_3_11_6'))
    expect(screen.queryByTestId('cbi-field')).not.toBeInTheDocument()
    expect(act(task('0_3_11_6'))).toBe(5)
    expect(screen.getAllByTestId('cbi-zone-item')).toHaveLength(5)
    expect(screen.getByTestId('cbi-pool-item')).toBeDisabled()
  })

  it('«Уберите 1 апельсин»: ряда нет, нажатие убирает, поле — при 1 (0_8_16_1)', () => {
    renderTask(task('0_8_16_1'))
    expect(screen.queryByTestId('cbi-pool')).not.toBeInTheDocument()
    expect(act(task('0_8_16_1'))).toBe(1)
    expect(screen.getAllByTestId('cbi-zone-item')).toHaveLength(1)
  })

  it('«Добавьте 2 кубика»: свой кубик убирается, данный — нет (0_8_1_3)', () => {
    renderTask(task('0_8_1_3'))
    const locked = screen.getAllByTestId('cbi-zone-item')
    expect(locked[0]).toHaveAttribute('data-locked', 'true')
    fireEvent.click(screen.getAllByTestId('cbi-pool-item')[0])
    const zone = screen.getAllByTestId('cbi-zone-item')
    expect(zone).toHaveLength(2)
    fireEvent.click(zone[1])
    expect(screen.getAllByTestId('cbi-zone-item')).toHaveLength(1)
  })
})
