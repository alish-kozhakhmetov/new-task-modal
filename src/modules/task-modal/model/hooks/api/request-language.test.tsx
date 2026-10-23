import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { midLesson } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-fixture'
import {
  makeTrainerProps,
  makeTrainerState,
} from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import type { Task } from '@/types/api/task'
import type { Language } from '@/types/enums'

import { useStore } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'
import type { TaskModalRefs } from '../layout/use-refs'

import { useCheckAnswer } from './use-check-answer'
import { useShowSolution } from './use-show-solution'

// The site's Global (common/Global.js): the language lives in a cookie under
// its full name; getAbbreviatedLanguage gives the short one, any other name
// goes as it is.
const SITE_SHORT: Record<string, string> = {
  'kk-cyrillic': 'kaz',
  russian: 'rus',
  uzbek: 'uzb',
  kyrgyz: 'kgz',
  'ar-eg': 'ar-eg',
  'ar-sa': 'ar-sa',
  azerbaijani: 'aze',
}

const siteGlobal = (language: string, host = 'test.qalan.kz') => ({
  getLanguage: () => language as Language,
  getAbbreviatedLanguage: () => SITE_SHORT[language] ?? language,
  isLocationQalanSchool: () =>
    host === 'qalan.school' || host === 'www.qalan.school',
})

// The site's Api.checkAnswer(task) (api/Api.js): what goes to the backend is
// read from the task object; any argument after it is never looked at.
const sitePayload = (task: Task & { applicationType?: unknown }) => {
  const { fields, answer, lockVersion, language, type, applicationType } =
    task as Task & { language?: string; applicationType?: unknown }
  return { fields, answer, lockVersion, language, type, applicationType }
}

/** A pupil mid-lesson on the site: what the site's Api got from the window. */
const setup = (language: string, host?: string) => {
  const { activeTask, tasks } = midLesson()
  const base = makeTrainerProps(activeTask as unknown as TextTask)
  const sent: ReturnType<typeof sitePayload>[] = []
  const { api } = base.deps

  const props: TaskModalProps = {
    ...base,
    deps: {
      ...base.deps,
      global: { ...base.deps.global, ...siteGlobal(language, host) },
      api: {
        ...api,
        checkAnswer: (...args: Parameters<typeof api.checkAnswer>) => {
          sent.push(sitePayload(args[0]))
          return api.checkAnswer(...args)
        },
        getTaskSolution: (...args: Parameters<typeof api.getTaskSolution>) => {
          sent.push(sitePayload(args[0]))
          return api.getTaskSolution(...args)
        },
      },
    },
  }

  useStore.getState().setState({
    ...makeTrainerState(activeTask as unknown as TextTask),
    activeTask,
    tasks,
  })
  useStore.getState().setAnswer('100')

  return { props, sent }
}

const check = async (language: string, host?: string) => {
  const { props, sent } = setup(language, host)
  const refs = { mathInput: { current: null } } as unknown as TaskModalRefs
  const { result } = renderHook(() => useCheckAnswer({ props, refs }))
  await act(() => result.current.checkAnswer())

  expect(sent).toHaveLength(1)
  return sent[0]
}

const showSolution = async (language: string, host?: string) => {
  const { props, sent } = setup(language, host)
  const { result } = renderHook(() => useShowSolution({ props }))
  await act(() => result.current({}))

  expect(sent).toHaveLength(1)
  return sent[0]
}

beforeEach(() => {
  useStore.setState({ state: null, answer: '', prevAnswer: null })
})

describe('useCheckAnswer — the language goes with the answer (2.5.5)', () => {
  it('a Kazakh pupil: the site sends language «kaz», as the old window', async () => {
    const payload = await check('kk-cyrillic')
    expect(payload.language).toBe('kaz')
    expect(payload.answer).toBe('100')
  })

  it('a Russian pupil: «rus»', async () => {
    expect((await check('russian')).language).toBe('rus')
  })

  it('qalan.school: «school», whatever the language', async () => {
    expect((await check('russian', 'qalan.school')).language).toBe('school')
  })
})

describe('useShowSolution — the language goes with «show the solution»', () => {
  it('a Kazakh pupil: «kaz», as the old window', async () => {
    expect((await showSolution('kk-cyrillic')).language).toBe('kaz')
  })

  it('a Russian pupil: «rus»', async () => {
    expect((await showSolution('russian')).language).toBe('rus')
  })
})
