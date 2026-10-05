import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import type { CalculateByImageTask } from '../../lib/types.task'

import fixtures from './data/tasks.json'

import { CalculateByImageWithCell as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock('@/ui/math-input/math-input', () => ({
  MathInput: () => <input data-testid="cbi-field" />,
}))

const tasks = (fixtures as unknown as { tasks: CalculateByImageTask[] }).tasks
const rabbits = { ...tasks[0], solution: null }

const renderTask = () =>
  render(
    <Template
      task={rabbits}
      deps={makeTaskModalDeps()}
      answer=""
      onChange={vi.fn()}
      mathInput={{ current: new Map() }}
    />,
  )

const html = (el: HTMLElement) => el.innerHTML

describe('calculateByImage.withCell — «до» и «после» (Task_0_3_11_6)', () => {
  it('нажатие в ряду превращает первого кролика, число предметов то же', () => {
    renderTask()
    const before = screen.getAllByTestId('cbi-zone-item').map(html)
    fireEvent.click(screen.getByTestId('cbi-pool-item'))
    const after = screen.getAllByTestId('cbi-zone-item').map(html)
    expect(after).toHaveLength(before.length)
    expect(after[0]).toBe(html(screen.getByTestId('cbi-pool-item')))
    expect(after.slice(1)).toEqual(before.slice(1))
  })

  it('когда превращать некого, ряд заблокирован; нажатие в зоне возвращает', () => {
    renderTask()
    const pool = screen.getByTestId('cbi-pool-item')
    const count = screen.getAllByTestId('cbi-zone-item').length
    for (let i = 0; i < count; i += 1) fireEvent.click(pool)
    expect(pool).toBeDisabled()
    fireEvent.click(screen.getAllByTestId('cbi-zone-item')[0])
    expect(pool).toBeEnabled()
  })

  it('ответ — число в поле', () => {
    renderTask()
    expect(screen.getByTestId('cbi-field')).toBeInTheDocument()
  })
})
