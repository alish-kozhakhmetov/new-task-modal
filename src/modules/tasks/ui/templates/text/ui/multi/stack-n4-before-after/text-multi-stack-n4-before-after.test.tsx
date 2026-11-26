import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { classifyTextTemplate } from '../../../lib/classify-text-template'
import {
  makeSolution,
  makeTranslation,
  renderTemplate,
} from '../../../lib/testing/test-utils'
import type { TextTask } from '../../../lib/types.task'

import allTasksJson from './data/all-tasks.json'
import fixture from './data/task.json'

import { TextMultiStackN4BeforeAfter as Template } from '.'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../../lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../../lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../../lib/testing/mocks/math-formula'),
)

const task = { ...(fixture as unknown as TextTask), solution: null }

type Entry = { id: string; task: TextTask; truncated?: boolean }
const corpus = Object.values(
  (allTasksJson as unknown as { byGrade: Record<string, Entry[]> }).byGrade,
).flat()

const visibleFields = (t: TextTask) =>
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

describe('text.multi.stack.n4.beforeAfter', () => {
  it('фикстура классифицируется в text.multi.stack.n4.beforeAfter', () => {
    expect(classifyTextTemplate(task)).toBe('text.multi.stack.n4.beforeAfter')
  })

  it('4 поля столбиком, подписи слева и справа', () => {
    renderTemplate(Template, task)

    expect(screen.getAllByTestId('math-input')).toHaveLength(4)
    expect(screen.getAllByTestId('text-prefix').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('text-suffix').length).toBeGreaterThan(0)
  })

  // Task_6_12_3_10 of the local backend (stream CX, 27.11): «Отец: ▢», the
  // Russian `after` is a space. TextAdornment draws nothing for it, the row
  // lost its third grid cell and the next label took it: «Отец: ▢ Мама:» /
  // «▢ Лео: ▢» — and the last field went past a 390 px window.
  it('пустая подпись справа держит свою клетку: подпись и поле в одной строке', () => {
    const person = (rus: string) => ({
      type: 10,
      text: ' ',
      up: '',
      down: '',
      before: { ...makeTranslation(rus), kaz: rus },
      after: { ...makeTranslation(' '), kaz: 'жас' },
    })
    const family = {
      ...task,
      answerInput: {
        type: 40,
        input1: person('Отец: '),
        input2: person('Мама: '),
        input3: person('Лео: '),
        input4: person('Сестренка: '),
      },
    } as unknown as TextTask

    renderTemplate(Template, family)

    // three grid cells a row: label, field, unit (or its empty place)
    const grid = screen.getByTestId('text-inputs')
    // the grid's cells are the rows' children (`display: contents` rows)
    // eslint-disable-next-line testing-library/no-node-access
    const cells = [...grid.querySelectorAll(':scope > div > *')]
    expect(cells).toHaveLength(12)
    expect(
      cells.map(
        (c) => c.getAttribute('data-testid') ?? c.tagName.toLowerCase(),
      ),
    ).toEqual(
      Array.from({ length: 4 }, () => [
        'text-prefix',
        'math-input',
        'span',
      ]).flat(),
    )
  })

  it('solution-ветка вместо режима ввода', () => {
    renderTemplate(Template, { ...task, solution: makeSolution('1;;2;;3;;4') })

    expect(screen.queryByTestId('math-input')).not.toBeInTheDocument()
    expect(screen.getByText(/Правильный ответ/)).toBeInTheDocument()
  })

  it.each(countable.map((e) => [e.id, e.task] as const))(
    'корпус: %s классифицируется сюда и рисует 4 поля',
    (_id, t) => {
      expect(classifyTextTemplate(t)).toBe('text.multi.stack.n4.beforeAfter')
      renderTemplate(Template, t)
      expect(screen.getAllByTestId('math-input')).toHaveLength(4)
    },
  )

  // a cut export string may cut the cells out of the condition, a hidden
  // answer row keeps its fields in the table: these only classify and render
  it.each(uncounted.map((e) => [e.id, e.task] as const))(
    'корпус: %s (урезан выгрузкой или поля в таблице) классифицируется сюда и рисуется',
    (_id, t) => {
      expect(classifyTextTemplate(t)).toBe('text.multi.stack.n4.beforeAfter')
      expect(() => renderTemplate(Template, t)).not.toThrow()
    },
  )
})
