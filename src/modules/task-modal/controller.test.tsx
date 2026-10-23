import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { makeTrainerProps } from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import type { Task } from '@/types/api/task'

import { TaskModalController } from './controller'
import { useStore } from './model/store/task-modal-store'
import type { TaskModalProps } from './model/types/props'
import {
  midLesson,
  secondTask,
} from './ui/content/header/task-list/storybook/lesson-fixture'

// The browser calls window.onpopstate on «back»; jsdom doesn't on dispatchEvent
const back = () =>
  act(() => {
    window.onpopstate?.call(window, new PopStateEvent('popstate'))
  })

// A window a test leaves open would live on in a detached root and re-render
// on the next test's store
// The element the controller mounts the window into: which mount is on the
// page is the subject here, not what it shows
const windowRoot = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.getElementById('task-modal-root')

const unmountWindow = () => {
  const root = windowRoot()?.instance
  if (root) act(() => root.unmount())
}

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
    unmountWindow()
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

// The site (TaskModalController.jsx, matheducator origin/test): the state the
// window is opened with, re-rendered on every setState and every change of
// the address (withRouter); the address kept by its own code.
const LESSON_ID = 2121

const site = (tasks: Task[], activeTask: Task, search: string) => {
  const base = makeTrainerProps(activeTask as unknown as TextTask)
  const host = {
    state: {
      ...base.state,
      activeTask,
      tasks,
      initialTasksCount: tasks.length,
      userProgress: 0,
    },
    search,
    renders: 0,
  }

  // updateHistoryWithTaskIndex, as on the site: history.replace({ search })
  const updateHistoryWithTaskIndex = (list: Task[], task: Task) => {
    const searchParams = new URLSearchParams(host.search)
    searchParams.set('lessonId', LESSON_ID.toString())
    searchParams.set('taskIndex', list.indexOf(task).toString())
    host.search = `?${searchParams.toString()}`
    render() // the address changed — withRouter re-renders the controller
  }

  // MySocket.push tells the mentor the pupil's new task
  const deps = {
    ...base.deps,
    socketController: { ...base.deps.socketController, push: vi.fn() },
  }

  const props = (): TaskModalProps => ({
    ...base,
    deps,
    activeTask: host.state.activeTask,
    state: { ...host.state },
    // setHostState with the site's part of the fix (2.5.5 report): the state
    // first, then an active task in it goes into the address
    setState: (next, callback) => {
      if (typeof next === 'function') return
      Object.assign(host.state, next)
      render()
      if (next.activeTask && host.state.tasks) {
        updateHistoryWithTaskIndex(host.state.tasks, host.state.activeTask)
      }
      callback?.()
    },
    closeModal: vi.fn(),
  })

  const render = () => {
    host.renders += 1
    TaskModalController(props())
  }

  return { host, render }
}

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

describe('TaskModalController — «Далее» and the site address (2.5.5)', () => {
  beforeEach(() => {
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
    unmountWindow()
    document.body.innerHTML = '<div id="task-modal-wrapper"></div>'
    useStore.setState({ state: null, taskList: null })
  })

  afterEach(() => {
    unmountWindow()
    window.onpopstate = null
    document.body.innerHTML = ''
  })

  it('«Далее» on №1: the host gets №2 and its address reads taskIndex=1', async () => {
    // №1 with its lives spent — the window offers «Далее»
    const { tasks: lesson } = secondTask()
    const first: Task = { ...lesson[1], id: 'first', attemptsCount: 3 }
    const tasks = [first, ...lesson.slice(1)]
    const { host, render } = site(
      tasks,
      first,
      `?grade=4&lessonId=${LESSON_ID}&taskIndex=0`,
    )

    render()
    await settle()
    const root = windowRoot()

    fireEvent.click(await screen.findByRole('button', { name: 'Далее' }))
    await waitFor(() => expect(host.state.activeTask.id).toBe(tasks[1].id))
    await settle()

    // the host has the window's own objects: it finds the task in the list
    expect(host.state.tasks?.indexOf(host.state.activeTask)).toBe(1)
    expect(new URLSearchParams(host.search).get('taskIndex')).toBe('1')
    expect(new URLSearchParams(host.search).get('lessonId')).toBe('2121')
    // the host re-rendered — on its setState and on the address — and the
    // window stayed itself, on №2
    expect(host.renders).toBeGreaterThanOrEqual(3)
    expect(windowRoot()).toBe(root)
    expect(useStore.getState().state?.activeTask.id).toBe(tasks[1].id)
  })

  it('a host re-render on its own older state does not rebuild the open window', async () => {
    const lesson = midLesson()
    const { host, render } = site(
      lesson.tasks,
      lesson.activeTask,
      `?lessonId=${LESSON_ID}&taskIndex=8`,
    )
    render()
    await settle()
    const root = windowRoot()
    await screen.findByTestId('tasks-num')

    // a check moved the window on (lock version, an extra task); the host
    // knows nothing of it and re-renders for a reason of its own
    act(() => {
      useStore.getState().setState({ lockVersion: 7 })
    })
    expect(host.state.lockVersion).not.toBe(7)
    render()
    await settle()

    expect(useStore.getState().state?.lockVersion).toBe(7)
    expect(windowRoot()).toBe(root)
  })
})
