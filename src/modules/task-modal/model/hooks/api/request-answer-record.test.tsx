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
const check = async (typed: string, asTask?: (task: Task) => Task) => {
  const lesson = midLesson()
  const activeTask = asTask ? asTask(lesson.activeTask) : lesson.activeTask
  const tasks = lesson.tasks.map((t) =>
    t.id === lesson.activeTask.id ? activeTask : t,
  )
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

/** The lesson's task as a test, the flag where the backend puts it. */
const asTest =
  (flag: Record<string, unknown>) =>
  (task: Task): Task =>
    ({
      ...task,
      type: 'Elixir.Task_5_1_8',
      description: {
        type: 'test',
        question: 'Найдите ряды, в которых все числа натуральные.',
        variants: ['1; 2', '0; 1', '3; 4', '5; −6', '7; 8'],
        ...flag,
      },
    }) as unknown as Task

describe('useCheckAnswer — a test with several correct options', () => {
  // TaskChecker of origin/master accepts only a list: ["A","D","E"] → 30,
  // "A,D,E", "A;;D;;E" → 20; one correct option — ["D"], not "D" (27.11)
  it('the picks go as a list of letters', async () => {
    expect(
      await check('A;;D;;E', asTest({ hasMultipleAnswers: true })),
    ).toEqual(['A', 'D', 'E'])
  })

  it('one option picked: still a list', async () => {
    expect(await check('D', asTest({ hasMultipleAnswers: true }))).toEqual([
      'D',
    ])
  })

  it('a test with one correct option: the letter as a string', async () => {
    expect(await check('B', asTest({ hasMultipleAnswers: false }))).toBe('B')
  })
})
