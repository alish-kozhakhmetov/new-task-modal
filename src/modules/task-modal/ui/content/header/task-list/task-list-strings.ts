import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type { TaskStatus } from './task-status'

/**
 * Words of the task list. The host's `localize` has no such strings and the
 * package has no dictionary of its own (Internals › Язык и направление), so
 * the list carries its three languages here: Russian, Kazakh, English. Other
 * host languages fall back to Russian, as the package's other own strings
 * (chat, «Открыть доску») do.
 *
 * Kazakh: «Сабақ есептері», «Шешілді», «Дұрыс», «Қатемен», «Жауап
 * көрсетілді» — given with the task (22.10); «қосымша есеп» — the site's
 * word for the extra task after a mistake (Localization.js, kk-cyrillic).
 */
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
  /** Review of a task solved on an earlier visit: nothing but the status. */
  conditionGone: string
}

const RU: TaskListStrings = {
  title: 'Задачи урока',
  openList: 'Список задач',
  backToTask: 'Вернуться к задаче',
  backToList: 'К списку задач',
  backToCurrent: 'Вернуться к текущей задаче',
  solved: (n, m) => `Решено: ${n}/${m}`,
  summary: (c, e, s) =>
    `Верно ${c}, с ошибкой ${e}${s ? `, ответ показан ${s}` : ''}`,
  status: {
    correct: 'Решена верно',
    error: 'Решена с ошибкой',
    shown: 'Ответ показан',
    current: 'Сейчас решаешь',
    ahead: 'Впереди',
  },
  markShown: 'ответ',
  markCurrent: 'сейчас',
  extra: 'дополнительная',
  solvedEarlier: 'Решена раньше',
  task: 'Задача',
  reviewTitle: (n) => `Задача №${n}`,
  conditionGone: 'Задача решена в прошлый раз — её условие не сохраняется.',
}

const KK: TaskListStrings = {
  title: 'Сабақ есептері',
  openList: 'Есептер тізімі',
  backToTask: 'Есепке оралу',
  backToList: 'Есептер тізіміне',
  backToCurrent: 'Қазіргі есепке оралу',
  solved: (n, m) => `Шешілді: ${n}/${m}`,
  summary: (c, e, s) =>
    `Дұрыс ${c}, қатемен ${e}${s ? `, жауап көрсетілді ${s}` : ''}`,
  status: {
    correct: 'Дұрыс',
    error: 'Қатемен',
    shown: 'Жауап көрсетілді',
    current: 'Қазір шешіп жатырсың',
    ahead: 'Алда',
  },
  markShown: 'жауап',
  markCurrent: 'қазір',
  extra: 'қосымша',
  solvedEarlier: 'Бұрын шешілген',
  task: 'Есеп',
  reviewTitle: (n) => `№${n} есеп`,
  conditionGone: 'Есеп өткен жолы шешілген — оның шарты сақталмайды.',
}

const EN: TaskListStrings = {
  title: 'Lesson tasks',
  openList: 'Task list',
  backToTask: 'Back to the task',
  backToList: 'Back to the task list',
  backToCurrent: 'Back to the current task',
  solved: (n, m) => `Solved: ${n}/${m}`,
  summary: (c, e, s) =>
    `Correct ${c}, with a mistake ${e}${s ? `, answer shown ${s}` : ''}`,
  status: {
    correct: 'Solved correctly',
    error: 'Solved with a mistake',
    shown: 'Answer shown',
    current: 'Solving now',
    ahead: 'Ahead',
  },
  markShown: 'answer',
  markCurrent: 'now',
  extra: 'extra',
  solvedEarlier: 'Solved earlier',
  task: 'Task',
  reviewTitle: (n) => `Task ${n}`,
  conditionGone: 'This task was solved last time — its condition is not kept.',
}

const BY_LANGUAGE: Record<string, TaskListStrings> = {
  russian: RU,
  'kk-cyrillic': KK,
  english: EN,
}

export const taskListStrings = (language: string | undefined) =>
  (language && BY_LANGUAGE[language]) || RU

export const getTaskListStrings = (deps: TaskModalDependencies) =>
  taskListStrings(deps.global.getLanguage?.())
