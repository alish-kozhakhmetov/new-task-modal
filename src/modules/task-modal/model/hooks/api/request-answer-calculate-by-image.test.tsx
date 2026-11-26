import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { midLesson } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-fixture'
import plainFixtures from '@/modules/tasks/ui/templates/calculate-by-image/ui/plain/data/tasks.json'
import {
  makeTrainerProps,
  makeTrainerState,
} from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { Task } from '@/types/api/task'

import { useStore } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'
import type { TaskModalRefs } from '../layout/use-refs'

import { useCheckAnswer } from './use-check-answer'

/*
 * What the site's Api.checkAnswer(task) gets from the window for a
 * calculateByImage task. The store keeps catalog indexes as a string; the
 * backend's CalculateByImageTaskAnswer.correct?/2 matches only a map
 * `%{"list" => [%{"id" => …}]}` — a string answer is never correct
 * (TaskChecker on the local backend, test and master, 27.11). Without
 * `toWireAnswer` in use-check-answer the first case goes red.
 */
const { tasks } = plainFixtures as unknown as {
  tasks: Task[]
}
const buns = tasks.find((t) => t.id === 'Elixir.Task_0_10_5_2')

const sendFor = async (activeTask: Task, answer: string) => {
  const base = makeTrainerProps(activeTask)
  const sent: unknown[] = []
  const { api } = base.deps
  const props: TaskModalProps = {
    ...base,
    deps: {
      ...base.deps,
      api: {
        ...api,
        checkAnswer: (...args: Parameters<typeof api.checkAnswer>) => {
          sent.push(args[0].answer)
          return api.checkAnswer(...args)
        },
      },
    },
  }
  const { tasks: lesson } = midLesson()
  useStore.getState().setState({
    ...makeTrainerState(activeTask),
    activeTask,
    tasks: [activeTask, ...lesson],
  })
  useStore.getState().setAnswer(answer)
  const refs = { mathInput: { current: null } } as unknown as TaskModalRefs
  const { result } = renderHook(() => useCheckAnswer({ props, refs }))
  await act(() => result.current.checkAnswer())
  expect(sent).toHaveLength(1)
  return sent[0]
}

beforeEach(() => {
  useStore.setState({ state: null, answer: '', prevAnswer: null })
})

describe('useCheckAnswer — calculateByImage goes out as the old window sends it', () => {
  it('three buns in the zone: { list: [{ image: "", id }] ×3 }, not the store string', async () => {
    expect(buns).toBeDefined()
    expect(await sendFor(buns as Task, '[0,0,0]')).toEqual({
      list: [
        { image: '', id: 'tokash' },
        { image: '', id: 'tokash' },
        { image: '', id: 'tokash' },
      ],
    })
  })

  it('any other task: the typed string goes as it is', async () => {
    const { activeTask } = midLesson()
    expect(await sendFor(activeTask, '100')).toBe('100')
  })
})
