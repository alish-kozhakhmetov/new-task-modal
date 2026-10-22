import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type { TaskStatus } from './task-status'

/**
 * Words of the task list, the way the chat keeps its own (chat-text.tsx,
 * 2.5.2): Russian, Kazakh and English per string, picked by the host's
 * `global.translate` like every other string of the site — so other host
 * languages fall back exactly as the chat's strings do.
 *
 * Kazakh: «Сабақ есептері», «Шешілді», «Дұрыс», «Қатемен», «Жауап
 * көрсетілді» — given with the task (22.10); «қосымша» — the site's and the
 * chat's word for the extra task after a mistake.
 */
const TEXT = {
  title: { rus: 'Задачи урока', kaz: 'Сабақ есептері', eng: 'Lesson tasks' },
  openList: { rus: 'Список задач', kaz: 'Есептер тізімі', eng: 'Task list' },
  backToTask: {
    rus: 'Вернуться к задаче',
    kaz: 'Есепке оралу',
    eng: 'Back to the task',
  },
  backToList: {
    rus: 'К списку задач',
    kaz: 'Есептер тізіміне',
    eng: 'Back to the task list',
  },
  backToCurrent: {
    rus: 'Вернуться к текущей задаче',
    kaz: 'Қазіргі есепке оралу',
    eng: 'Back to the current task',
  },
  solved: {
    rus: 'Решено: {solved}/{total}',
    kaz: 'Шешілді: {solved}/{total}',
    eng: 'Solved: {solved}/{total}',
  },
  summary: {
    rus: 'Верно {correct}, с ошибкой {errors}',
    kaz: 'Дұрыс {correct}, қатемен {errors}',
    eng: 'Correct {correct}, with a mistake {errors}',
  },
  summaryShown: {
    rus: ', ответ показан {shown}',
    kaz: ', жауап көрсетілді {shown}',
    eng: ', answer shown {shown}',
  },
  correct: { rus: 'Решена верно', kaz: 'Дұрыс', eng: 'Solved correctly' },
  error: {
    rus: 'Решена с ошибкой',
    kaz: 'Қатемен',
    eng: 'Solved with a mistake',
  },
  shown: { rus: 'Ответ показан', kaz: 'Жауап көрсетілді', eng: 'Answer shown' },
  current: {
    rus: 'Сейчас решаешь',
    kaz: 'Қазір шешіп жатырсың',
    eng: 'Solving now',
  },
  ahead: { rus: 'Впереди', kaz: 'Алда', eng: 'Ahead' },
  markShown: { rus: 'ответ', kaz: 'жауап', eng: 'answer' },
  markCurrent: { rus: 'сейчас', kaz: 'қазір', eng: 'now' },
  extra: { rus: 'дополнительная', kaz: 'қосымша', eng: 'extra' },
  solvedEarlier: {
    rus: 'Решена раньше',
    kaz: 'Бұрын шешілген',
    eng: 'Solved earlier',
  },
  task: { rus: 'Задача', kaz: 'Есеп', eng: 'Task' },
  reviewTitle: { rus: 'Задача №{num}', kaz: '№{num} есеп', eng: 'Task {num}' },
} as const

export type TaskListTextKey = keyof typeof TEXT
type Entry = (typeof TEXT)[TaskListTextKey]
type Translate = (entry: Entry) => string

export interface TaskListStrings {
  title: string
  /** Aria name of the «№N/M» button in the task header. */
  openList: string
  /** Back from the list to the task. */
  backToTask: string
  /** Back from a solved task to the list. */
  backToList: string
  backToCurrent: string
  solved: (solved: number, total: number) => string
  summary: (correct: number, errors: number, shown: number) => string
  status: Record<TaskStatus, string>
  /** Short marks at the right of a row. */
  markShown: string
  markCurrent: string
  /** An extra task, added after a mistake. */
  extra: string
  /** A row whose condition the backend no longer sends. */
  solvedEarlier: string
  /** A row with no text in its condition (a drawing, a table). */
  task: string
  reviewTitle: (num: number) => string
}

const fill = (text: string, values: Record<string, number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))

export const makeTaskListStrings = (translate: Translate): TaskListStrings => {
  const t = (key: TaskListTextKey) => translate(TEXT[key])
  return {
    title: t('title'),
    openList: t('openList'),
    backToTask: t('backToTask'),
    backToList: t('backToList'),
    backToCurrent: t('backToCurrent'),
    solved: (solved, total) => fill(t('solved'), { solved, total }),
    summary: (correct, errors, shown) =>
      fill(t('summary'), { correct, errors }) +
      (shown ? fill(t('summaryShown'), { shown }) : ''),
    status: {
      correct: t('correct'),
      error: t('error'),
      shown: t('shown'),
      current: t('current'),
      ahead: t('ahead'),
    },
    markShown: t('markShown'),
    markCurrent: t('markCurrent'),
    extra: t('extra'),
    solvedEarlier: t('solvedEarlier'),
    task: t('task'),
    reviewTitle: (num) => fill(t('reviewTitle'), { num }),
  }
}

/** Russian — as the chat's `ruChatT`, when the host gives no translate. */
export const ruTaskListStrings = makeTaskListStrings((entry) => entry.rus)

export const getTaskListStrings = (deps: TaskModalDependencies) => {
  const { translate } = deps.global
  if (typeof translate !== 'function') return ruTaskListStrings
  return makeTaskListStrings((entry) => translate(entry) || entry.rus)
}
