import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import type {
  TaskModalDependencies,
  TaskModalState,
} from '@/modules/task-modal/model/types/props'
import type { Task } from '@/types/api/task'

import { TasksNum } from './tasks-num'

const task = (id: string) => ({ id }) as Task

/** The host's translate: the field of the interface language. */
const deps = (field: 'rus' | 'kaz') =>
  ({
    global: {
      translate: (entry: Record<string, string>) => entry[field],
    },
  }) as unknown as TaskModalDependencies

describe('TasksNum', () => {
  beforeEach(() => {
    const tasks = [task('a'), task('b'), task('c')]
    useStore.setState({
      taskList: null,
      state: {
        tasks,
        activeTask: tasks[1],
        initialTasksCount: 2,
      } as unknown as TaskModalState,
    })
  })

  it('is the button to the task list, with the counter as it was', () => {
    render(<TasksNum deps={deps('rus')} />)
    const button = screen.getByRole('button', { name: 'Список задач' })
    // №2 of 3, the initial 2 struck through: three tasks after an extra one.
    expect(button).toHaveTextContent('№2/2 3')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('opens the list on a click — not on focus', () => {
    render(<TasksNum deps={deps('kaz')} />)
    const button = screen.getByRole('button', { name: 'Есептер тізімі' })

    fireEvent.focus(button)
    expect(useStore.getState().taskList).toBeNull()

    fireEvent.click(button)
    expect(useStore.getState().taskList).toEqual({ screen: 'list' })
  })

  it('keeps Enter for itself, away from the answer check on the task', () => {
    // The task root hears Enter natively to check the answer (actions.tsx).
    render(
      <div data-testid="task-root">
        <TasksNum deps={deps('rus')} />
      </div>,
    )
    const heard: string[] = []
    screen
      .getByTestId('task-root')
      .addEventListener('keydown', (e) => heard.push(e.key))

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    fireEvent.keyDown(screen.getByRole('button'), { key: 'a' })
    expect(heard).toEqual(['a'])
  })
})
