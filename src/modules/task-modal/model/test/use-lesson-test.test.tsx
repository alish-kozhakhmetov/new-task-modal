import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TaskModalRefs } from '../hooks/layout/use-refs'
import { getAppState, useStore } from '../store/task-modal-store'
import type { TaskModalProps, TaskModalState } from '../types/props'

import { useTestStore } from './test-store'
import { useLessonTest, useLoadLessonTest } from './use-lesson-test'

// Lesson test rules — the site's CheckTaskModal (package-parity.md, «Тест
// урока на сайте»): first task without an answer, an answer is saved on
// leaving the task and only when there is one, «Завершить» returns the percent.
const task = (id: string, answer?: string) =>
  ({ id, title: id, answer }) as never

const setup = (tasks = [task('a', '5'), task('b'), task('c')]) => {
  const api = {
    getCheckTasksByLessonId: vi.fn(() =>
      Promise.resolve({ tasks, timeLeft: 600, checkLessonId: 77 }),
    ),
    saveCheckLessonTaskUserAnswer: vi.fn(() => Promise.resolve({})),
    setCheckLessonAsFinished: vi.fn(() =>
      Promise.resolve({ resultProgress: 80 }),
    ),
  }
  const onTestFinish = vi.fn()
  const props = {
    mode: 'test',
    deps: {
      api,
      alert: { showError: vi.fn() },
      helpers: {
        CyrillicTo: { default_numeral: (s: string) => s },
        TaskHelper: { multipleTaskAnswerSeparator: ';' },
      },
      enums: {},
      lodash: {},
    },
    hostProps: { lessonId: 2101, applicationType: 'web', onTestFinish },
    closeModal: vi.fn(),
  } as unknown as TaskModalProps
  const refs = { mathInput: { current: new Map() } } as unknown as TaskModalRefs
  return { api, props, refs, onTestFinish }
}

beforeEach(() => {
  useStore.setState({
    state: { tasks: null } as unknown as TaskModalState,
    answer: '',
  })
  useTestStore.getState().reset()
})

describe('lesson test', () => {
  it('loads the attempt and opens the first task without an answer', async () => {
    const { api, props } = setup()
    renderHook(() => useLoadLessonTest(props))
    await waitFor(() => expect(useTestStore.getState().phase).toBe('running'))
    expect(api.getCheckTasksByLessonId).toHaveBeenCalledWith(
      2101,
      undefined,
      undefined,
    )
    expect(getAppState().activeTask.id).toBe('b')
    expect(useTestStore.getState().answeredIds).toEqual(['a'])
    expect(useTestStore.getState().checkLessonId).toBe(77)
  })

  it('«Далее» saves a typed answer; an empty answer skips without a request', async () => {
    const { api, props, refs } = setup()
    renderHook(() => useLoadLessonTest(props))
    await waitFor(() => expect(useTestStore.getState().phase).toBe('running'))
    const view = renderHook(() => useLessonTest(props, refs))

    useStore.setState({ answer: '12' })
    await act(() => view.result.current.next())
    expect(api.saveCheckLessonTaskUserAnswer).toHaveBeenCalledWith('b', '12')
    expect(getAppState().activeTask.id).toBe('c')

    await act(() => view.result.current.next()) // c is empty: skip
    expect(api.saveCheckLessonTaskUserAnswer).toHaveBeenCalledTimes(1)
    // the last task, nothing skipped before it — the finish question
    expect(getAppState().activeTask.id).toBe('c')
    expect(useTestStore.getState().phase).toBe('confirm')
  })

  it('«Завершить» finishes the attempt and reports the percent', async () => {
    const { api, props, refs, onTestFinish } = setup()
    renderHook(() => useLoadLessonTest(props))
    await waitFor(() => expect(useTestStore.getState().phase).toBe('running'))
    const view = renderHook(() => useLessonTest(props, refs))

    await act(() => view.result.current.finish())
    expect(api.setCheckLessonAsFinished).toHaveBeenCalledWith(77, 'web')
    expect(useTestStore.getState()).toMatchObject({
      phase: 'result',
      resultProgress: 80,
    })
    expect(onTestFinish).toHaveBeenCalledWith({
      resultProgress: 80,
      checkLessonId: 77,
    })
  })
})
