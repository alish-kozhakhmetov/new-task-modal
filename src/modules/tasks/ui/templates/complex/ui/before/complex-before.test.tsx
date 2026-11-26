import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyComplexTemplate } from '../../lib/classify-complex-template'
import { makeSolution, renderTemplate } from '../../lib/testing/test-utils'
import type { ComplexTask } from '../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import fixture from './data/task.json'

import { ComplexBefore as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../text/lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as ComplexTask), solution: null }

type Entry = { id: string; task: ComplexTask; truncated?: boolean }
const corpus = Object.values(
  (allTasksJson as unknown as { byGrade: Record<string, Entry[]> }).byGrade,
).flat()

const visibleFields = (t: ComplexTask) =>
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

describe('complex.before', () => {
  it('фикстура классифицируется в complex.before', () => {
    expect(classifyComplexTemplate(task)).toBe('complex.before')
  })

  it('1 поле , подпись слева', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    expect(screen.getAllByTestId('text-prefix').length).toBeGreaterThan(0)
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('7') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it.each(countable.map((e) => [e.id, e.task] as const))(
    'корпус: %s классифицируется сюда и рисует 1 поле',
    (_id, t) => {
      expect(classifyComplexTemplate(t)).toBe('complex.before')
      renderTemplate(Template, t)
      expect(screen.getAllByTestId('math-input')).toHaveLength(1)
    },
  )

  // a cut export string may cut the cells out of the condition, a hidden
  // answer row keeps its fields in the table: these only classify and render
  it.each(uncounted.map((e) => [e.id, e.task] as const))(
    'корпус: %s (урезан выгрузкой или поля в таблице) классифицируется сюда и рисуется',
    (_id, t) => {
      expect(classifyComplexTemplate(t)).toBe('complex.before')
      expect(() => renderTemplate(Template, t)).not.toThrow()
    },
  )
})
