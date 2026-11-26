import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyAnswerCellTemplate } from '../../../lib/classify-answer-cell-template'
import { makeSolution, renderTemplate } from '../../../lib/testing/test-utils'
import type { AnswerCellTask } from '../../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import fixture from './data/task.json'

import { AnswerCellMultiInlineN2After as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../../text/lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as AnswerCellTask), solution: null }

type Entry = { id: string; task: AnswerCellTask; truncated?: boolean }
const corpus = Object.values(
  (allTasksJson as unknown as { byGrade: Record<string, Entry[]> }).byGrade,
).flat()

const visibleFields = (t: AnswerCellTask) =>
  t.description && 'isAnswerCellHidden' in t.description
    ? !t.description.isAnswerCellHidden
    : true

const asInput = (e: Entry) => ({ ...e, task: { ...e.task, solution: null } })
const countable = corpus
  .map(asInput)
  .filter((e) => visibleFields(e.task) && !e.truncated)
const uncounted = corpus
  .map(asInput)
  .filter((e) => !visibleFields(e.task) || e.truncated)

describe('answerCell.multi.inline.n2.after', () => {
  it('фикстура классифицируется в answerCell.multi.inline.n2.after', () => {
    expect(classifyAnswerCellTemplate(task)).toBe(
      'answerCell.multi.inline.n2.after',
    )
  })

  it('2 поля в строку, подпись справа', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(2)
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('1;;2') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it.each(countable.map((e) => [e.id, e.task] as const))(
    'корпус: %s классифицируется сюда и рисует 2 поля',
    (_id, t) => {
      expect(classifyAnswerCellTemplate(t)).toBe(
        'answerCell.multi.inline.n2.after',
      )
      renderTemplate(Template, t)
      expect(screen.getAllByTestId('math-input')).toHaveLength(2)
    },
  )

  // a cut export string may cut the cells out of the condition, a hidden
  // answer row keeps its fields in the table: these only classify and render
  it.each(uncounted.map((e) => [e.id, e.task] as const))(
    'корпус: %s (урезан выгрузкой или поля в таблице) классифицируется сюда и рисуется',
    (_id, t) => {
      expect(classifyAnswerCellTemplate(t)).toBe(
        'answerCell.multi.inline.n2.after',
      )
      expect(() => renderTemplate(Template, t)).not.toThrow()
    },
  )
})
