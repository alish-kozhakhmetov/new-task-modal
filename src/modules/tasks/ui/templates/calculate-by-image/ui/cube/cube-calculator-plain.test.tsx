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
  MathInput: () => <input data-testid="cube-field" />,
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

  it('два поля равенства — ответ из двух чисел', () => {
    renderTask('1_8_4_11')
    expect(screen.getAllByTestId('cube-field')).toHaveLength(2)
  })
})
