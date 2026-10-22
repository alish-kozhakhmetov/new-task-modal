import { describe, expect, it } from 'vitest'

import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'
import { makeTranslation } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import type { Task } from '@/types/api/task'

import { makeTaskListStrings, ruTaskListStrings } from './task-list-strings'
import { taskPreview } from './task-preview'
import {
  hasCondition,
  isOpenable,
  taskListRows,
  taskListSummary,
} from './task-status'

const translate = (value: unknown) => pickTranslationText(value)

const task = (id: string, extra: Partial<Task> = {}): Task =>
  ({
    id,
    type: 'Elixir.Task_4_1_1',
    title: '',
    description: {
      type: 'text',
      with_audio: false,
      content: makeTranslation(`Условие ${id}`),
    },
    result: 'none',
    ...extra,
  }) as Task

/** As the backend sends a task solved on an earlier visit. */
const earlier = (id: string, result: string): Task =>
  ({
    id,
    type: 'Elixir.Task_4_1_1',
    title: '',
    description: '',
    solution: '-',
    result,
  }) as unknown as Task

describe('task list rows', () => {
  const tasks = [
    earlier('a', 'correct'),
    task('b', { result: 'error' }),
    task('c', { result: 'solution_shown' }),
    task('d', { result: 'error' }),
    task('d-extra', { result: 'correct', isPenalty: true }),
    task('e'),
    task('f'),
  ]
  const rows = taskListRows(tasks, 'e')

  it('numbers rows as «№N/M» does, extra tasks in their place', () => {
    expect(rows.map((r) => r.num)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(rows[4].isPenalty).toBe(true)
  })

  it('keeps the strict order: solved and current open, ahead locked', () => {
    expect(rows.map((r) => r.status)).toEqual([
      'correct',
      'error',
      'shown',
      'error',
      'correct',
      'current',
      'ahead',
    ])
    expect(rows.map((r) => isOpenable(r))).toEqual([
      // solved on an earlier visit: no condition from the backend — a status
      // row, not a dead-end review
      false,
      true,
      true,
      true,
      true,
      true,
      false,
    ])
  })

  it('counts the solved by results', () => {
    expect(taskListSummary(tasks)).toEqual({
      correct: 2,
      errors: 2,
      shown: 1,
      solved: 5,
      total: 7,
    })
  })

  it('counts the current task once it is solved and waits for «Далее»', () => {
    const left = [task('x', { result: 'correct' }), task('y')]
    expect(taskListRows(left, 'x')[0].status).toBe('current')
    expect(taskListSummary(left).solved).toBe(1)
  })
})

describe('hasCondition', () => {
  it('is false for a task solved on an earlier visit (empty description)', () => {
    expect(hasCondition(earlier('a', 'correct'))).toBe(false)
    expect(hasCondition(task('b'))).toBe(true)
  })
})

describe('taskPreview', () => {
  it('joins the title and the condition, with numbers from fields', () => {
    const t = task('t', {
      title: makeTranslation('Запишите число цифрами.') as unknown as string,
      description: {
        type: 'text',
        with_audio: false,
        content: makeTranslation('{tens} десятков тысяч'),
      },
      fields: { tens: 9 },
    })
    expect(taskPreview(t, translate)).toBe(
      'Запишите число цифрами. 9 десятков тысяч',
    )
  })

  it('cuts display blocks and never leaves inline math open', () => {
    const t = task('t', {
      description: {
        type: 'text',
        with_audio: false,
        content: makeTranslation(
          'Выполните сложение столбиком. \\(\\begin{array}{c} 12 \\\\ 34 \\end{array}\\)',
        ),
      },
    })
    expect(taskPreview(t, translate)).toBe('Выполните сложение столбиком.')
  })

  it('keeps inline math and drops markup', () => {
    const t = task('t', {
      description: {
        type: 'text',
        with_audio: false,
        content: makeTranslation('Сколько <b>\\(м^2\\)</b> линолеума?'),
      },
    })
    expect(taskPreview(t, translate)).toBe('Сколько \\(м^2\\) линолеума?')
  })

  it('reads the question of a test task', () => {
    const t = task('t', {
      description: {
        type: 'test',
        question: makeTranslation('Укажите правильное чтение числа 30000.'),
      } as unknown as Task['description'],
    })
    expect(taskPreview(t, translate)).toBe(
      'Укажите правильное чтение числа 30000.',
    )
  })

  it('is empty without a condition', () => {
    expect(taskPreview(earlier('a', 'correct'), translate)).toBe('')
  })
})

describe('task list strings', () => {
  const pick =
    (field: 'rus' | 'kaz' | 'eng') =>
    (entry: Record<'rus' | 'kaz' | 'eng', string>) =>
      entry[field]

  it('speak Russian, Kazakh and English through the host translate', () => {
    expect(makeTaskListStrings(pick('rus')).title).toBe('Задачи урока')
    const kk = makeTaskListStrings(pick('kaz'))
    expect(kk.title).toBe('Сабақ есептері')
    expect(kk.solved(3, 15)).toBe('Шешілді: 3/15')
    expect(kk.summary(5, 2, 1)).toBe('Дұрыс 5, қатемен 2, жауап көрсетілді 1')
    expect(kk.reviewTitle(7)).toBe('№7 есеп')
    expect(makeTaskListStrings(pick('eng')).title).toBe('Lesson tasks')
  })

  it('leave out «answer shown» when there is none', () => {
    expect(ruTaskListStrings.summary(1, 0, 0)).toBe('Верно 1, с ошибкой 0')
  })
})
