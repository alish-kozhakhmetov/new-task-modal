import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import type { CubeCalculatorTask } from '../../lib/create-cube-calculator-template'

import fixtures from './data/tasks.json'

import { CubeCalculatorPlain as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock('@/ui/math-input/math-input', () => ({
  MathInput: ({ style }: { style?: { width?: string } }) => (
    <input data-testid="cube-field" data-width={style?.width} />
  ),
}))

const tasks = (fixtures as unknown as { tasks: CubeCalculatorTask[] }).tasks
const task = (id: string) => {
  const found = tasks.find((t) => t.type === `Elixir.Task_${id}`)
  if (!found) throw new Error(`no fixture ${id}`)
  return { ...found, solution: null }
}

const renderTask = (id: string) =>
  render(
    <Template
      task={task(id)}
      deps={makeTaskModalDeps()}
      answer=""
      onChange={vi.fn()}
      mathInput={{ current: new Map() }}
    />,
  )

describe('cubeCalculator.plain', () => {
  it('рамка на 20 мест, зелёных столько, сколько дано (7 + 8)', () => {
    renderTask('1_8_4_11')
    expect(screen.getAllByTestId('cube-filled')).toHaveLength(7)
    expect(screen.getAllByTestId('cube-empty')).toHaveLength(13)
  })

  it('«добавить» заполняет следующее место, полная рамка блокирует кнопку', () => {
    renderTask('1_8_4_11')
    const add = screen.getByTestId('cube-add')
    fireEvent.click(add)
    expect(screen.getAllByTestId('cube-filled')).toHaveLength(8)
    for (let i = 0; i < 12; i += 1) fireEvent.click(add)
    expect(add).toBeDisabled()
  })

  it('«уберите»: нажатие на зелёный опустошает место (15 − 8)', () => {
    renderTask('1_8_4_12')
    fireEvent.click(screen.getAllByTestId('cube-filled')[14])
    expect(screen.getAllByTestId('cube-filled')).toHaveLength(14)
  })

  it('два поля равенства, ширина по ожидаемому ответу (правило 16)', () => {
    renderTask('1_8_4_11')
    const fields = screen.getAllByTestId('cube-field')
    expect(fields).toHaveLength(2)
    // fields 7 and 15 → two digits → the 72px minimum, not 120
    expect(fields[0]).toHaveAttribute('data-width', '72px')
  })

  it('равенство — одна строка, начало не отрывается от полей', () => {
    renderTask('1_8_4_11')
    const row = screen.getByTestId('cube-equation')
    expect(row).toHaveTextContent('7+8=10+=')
    expect(row.querySelectorAll('[data-testid=cube-field]')).toHaveLength(2)
  })

  it('добавленные отмечены, исходные — нет', () => {
    renderTask('1_8_4_11')
    fireEvent.click(screen.getByTestId('cube-add'))
    const filled = screen.getAllByTestId('cube-filled')
    expect(filled.filter((b) => b.hasAttribute('data-added'))).toHaveLength(1)
    expect(filled[0]).not.toHaveAttribute('data-added')
  })
})
