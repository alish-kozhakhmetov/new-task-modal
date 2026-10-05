import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { toCalculateByImageApiAnswer } from '../../lib/parse-calculate-by-image'
import type { CalculateByImageTask } from '../../lib/types.task'

import fixtures from './data/tasks.json'

import { CalculateByImagePlain as Template } from '.'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)

const tasks = (fixtures as unknown as { tasks: CalculateByImageTask[] }).tasks
const task = (id: string) => {
  const found = tasks.find((t) => t.type === `Elixir.Task_${id}`)
  if (!found) throw new Error(`no fixture ${id}`)
  return { ...found, solution: null }
}

const renderTask = (
  t: CalculateByImageTask,
  answer = '',
  onChange = vi.fn(),
) => {
  render(
    <Template
      task={t}
      deps={makeTaskModalDeps()}
      answer={answer}
      onChange={onChange}
      mathInput={{ current: new Map() }}
    />,
  )
  return onChange
}

describe('calculateByImage.plain', () => {
  it('открывается с заранее положенными предметами (Task_0_1_38_9)', () => {
    renderTask(task('0_1_38_9'))
    expect(screen.getAllByTestId('cbi-zone-item')).toHaveLength(3)
    expect(screen.getAllByTestId('cbi-pool-item')).toHaveLength(1)
  })

  it('нажатие в ряду добавляет ещё один к тому, что в зоне', () => {
    const onChange = renderTask(task('0_1_38_9'))
    fireEvent.click(screen.getByTestId('cbi-pool-item'))
    // catalog: three preplaced rulers (0–2), then the row (3)
    expect(onChange).toHaveBeenCalledWith('[0,1,2,3]')
  })

  it('нажатие в зоне убирает предмет', () => {
    const onChange = renderTask(task('0_1_38_9'), '[3,3]')
    fireEvent.click(screen.getAllByTestId('cbi-zone-item')[0])
    expect(onChange).toHaveBeenCalledWith('[3]')
  })

  it('последний убранный предмет даёт пустой ответ', () => {
    const onChange = renderTask(task('0_1_38_9'), '[3]')
    fireEvent.click(screen.getByTestId('cbi-zone-item'))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('три нажатия к трём линейкам дают эталон бэка (Task_0_1_38_9)', () => {
    const t = task('0_1_38_9') as CalculateByImageTask & {
      _expected: { list: string[] }
    }
    let answer = ''
    const onChange = vi.fn((next: string) => {
      answer = next
    })
    for (let i = 0; i < 3; i += 1) {
      const { unmount } = render(
        <Template
          task={t}
          deps={makeTaskModalDeps()}
          answer={answer}
          onChange={onChange}
          mathInput={{ current: new Map() }}
        />,
      )
      fireEvent.click(screen.getByTestId('cbi-pool-item'))
      unmount()
    }
    expect(toCalculateByImageApiAnswer(answer, t.description)).toEqual({
      list: t._expected.list.map((id) => ({ image: '', id })),
    })
  })

  it('у каждого члена семьи своя картинка в зоне (Task_1_13_8_4)', () => {
    const onChange = renderTask(task('1_13_8_4'))
    const buttons = screen.getAllByTestId('cbi-pool-item')
    fireEvent.click(buttons[1])
    const stored = onChange.mock.calls[0][0] as string
    renderTask(task('1_13_8_4'), stored)
    const zoneItem = screen.getAllByTestId('cbi-zone-item')[0]
    expect(zoneItem.innerHTML).toBe(buttons[1].innerHTML)
    expect(zoneItem.innerHTML).not.toBe(buttons[0].innerHTML)
  })

  it('полная зона блокирует ряд', () => {
    const t = task('0_1_38_9')
    const full = Array.from(
      { length: Number(t.description.itemsMaxQuantity) },
      () => 3,
    )
    renderTask(t, JSON.stringify(full))
    expect(screen.getByTestId('cbi-pool-item')).toBeDisabled()
  })
})
