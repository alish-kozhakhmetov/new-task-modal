import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { makeTrainerProps } from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import { TaskModalController } from './controller'
import { useStore } from './model/store/task-modal-store'
import type { TaskModalProps } from './model/types/props'
import { midLesson } from './ui/content/header/task-list/storybook/lesson-fixture'

// The browser calls window.onpopstate on «back»; jsdom doesn't on dispatchEvent
const back = () =>
  act(() => {
    window.onpopstate?.call(window, new PopStateEvent('popstate'))
  })

// The site: a wrapper the controller mounts into, its own «back» handler, a
// closeModal that reads the progress from its own state.
const mount = () => {
  const lesson = midLesson()
  const base = makeTrainerProps(lesson.activeTask as unknown as TextTask)
  const host = { userProgress: 0, closedWith: null as number | null }
  const props: TaskModalProps = {
    ...base,
    activeTask: lesson.activeTask,
    state: {
      ...base.state,
      activeTask: lesson.activeTask,
      tasks: lesson.tasks,
      initialTasksCount: lesson.initialTasksCount,
      userProgress: 40,
    },
    setState: (next, callback) => {
      if (typeof next !== 'function') Object.assign(host, next)
      callback?.()
    },
    closeModal: vi.fn(() => {
      host.closedWith = host.userProgress
    }),
  }
  act(() => {
    TaskModalController(props)
  })
  return { props, host }
}

const openList = async () => {
  fireEvent.click(await screen.findByTestId('tasks-num'))
  await waitFor(() => expect(useStore.getState().taskList).not.toBeNull())
}

describe('TaskModalController — browser «back»', () => {
  const hostBack = vi.fn()

  beforeEach(() => {
    // jsdom has no media queries; the window asks for the phone layout
    window.matchMedia ??= ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
    vi.useFakeTimers({ toFake: ['setTimeout'] })
    document.body.innerHTML = '<div id="task-modal-wrapper"></div>'
    window.onpopstate = hostBack
    useStore.setState({ state: null, taskList: null })
  })

  afterEach(() => {
    vi.useRealTimers()
    window.onpopstate = null
    document.body.innerHTML = ''
    hostBack.mockReset()
  })

  const run = async () => {
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    vi.useRealTimers()
  }

  it('with the task list open closes the whole window, like the chat and the draft', async () => {
    const { props, host } = mount()
    await run()
    await openList()
    expect(screen.getByTestId('task-list')).toBeInTheDocument()

    back()

    // one close, through the package: the lesson progress reached the host
    expect(props.closeModal).toHaveBeenCalledTimes(1)
    expect(host.closedWith).toBe(40)
    expect(hostBack).not.toHaveBeenCalled()
    // nothing of the window — the list included — stays on the page
    expect(screen.queryByTestId('tasks-num')).not.toBeInTheDocument()
    expect(screen.queryByTestId('task-list')).not.toBeInTheDocument()
    // the host's own «back» is back in place
    expect(window.onpopstate).toBe(hostBack)
  })

  it('opens the next time on the task, not on the list left open', async () => {
    mount()
    await run()
    await openList()
    back()

    document.body.innerHTML = '<div id="task-modal-wrapper"></div>'
    vi.useFakeTimers({ toFake: ['setTimeout'] })
    mount()
    await run()

    await screen.findByTestId('tasks-num')
    await waitFor(() => expect(useStore.getState().taskList).toBeNull())
  })
})
