import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { midLesson } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-fixture'
import {
  makeTrainerProps,
  makeTrainerState,
} from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { Task } from '@/types/api/task'

import { useStore } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'
import type { TaskModalRefs } from '../layout/use-refs'

import { useCheckAnswer } from './use-check-answer'

/**
 * The answer reaches the site's Api.checkAnswer(task) — and through it the
 * backend's TaskChecker — in the record the checker accepts
 * (`modules/tasks/lib/checker-answer.ts`), while the store keeps what the
 * pupil typed.
 */
const check = async (typed: string) => {
  const { activeTask, tasks } = midLesson()
  const base = makeTrainerProps(activeTask)
  const sent: string[] = []
  const { api } = base.deps

  const props: TaskModalProps = {
    ...base,
    deps: {
      ...base.deps,
      api: {
        ...api,
        checkAnswer: (...args: Parameters<typeof api.checkAnswer>) => {
          sent.push((args[0] as Task).answer as string)
          return api.checkAnswer(...args)
        },
      },
    },
  }

  useStore.getState().setState({
    ...makeTrainerState(activeTask),
    activeTask,
    tasks,
  })
  useStore.getState().setAnswer(typed)

  const refs = { mathInput: { current: null } } as unknown as TaskModalRefs
  const { result } = renderHook(() => useCheckAnswer({ props, refs }))
  await act(() => result.current.checkAnswer())

  expect(sent).toHaveLength(1)
  return sent[0]
}

beforeEach(() => {
  useStore.setState({ state: null, answer: '', prevAnswer: null })
})

describe('useCheckAnswer — the answer goes in the checker’s record', () => {
  it('«−1» typed in the numerator: the backend gets -\\frac{1}{8}', async () => {
    expect(await check('\\frac{-1}{8}')).toBe('-\\frac{1}{8}')
  })

  it('two answers, the second with the minus inside: -\\frac{1}{9} first', async () => {
    expect(await check('\\frac{1}{9};\\frac{-1}{9}')).toBe(
      '\\frac{1}{9};-\\frac{1}{9}',
    )
  })

  it('a grade-4 answer goes as typed', async () => {
    expect(await check('2\\frac{3}{5}')).toBe('2\\frac{3}{5}')
    expect(await check('100')).toBe('100')
  })
})
