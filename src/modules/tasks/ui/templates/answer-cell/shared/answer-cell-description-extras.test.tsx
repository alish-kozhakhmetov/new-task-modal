import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeDeps, makeTranslation } from '../lib/testing/test-utils'
import type { AnswerCellTaskDescription } from '../lib/types.task'

import { AnswerCellDescriptionExtras } from './answer-cell-description-extras'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../text/lib/testing/mocks/math-formula'),
)

// Task_1_1_10_16 of the local backend (stream CX, 27.11): «Запишите
// выражение, соответствующее рисунку», the picture is a borderless one-cell
// table 120 in `tableBefore`; the old window draws it between textBefore and
// imageBefore (TaskDescriptionAndAnswerInput.jsx, AnswerCell).
const picture =
  '<svg xmlns="http://www.w3.org/2000/svg" width="300px" height="200px" viewBox="0 0 437 324"><circle cx="10" cy="10" r="5"/></svg>'

const description = (
  extra: Partial<AnswerCellTaskDescription> & Record<string, unknown>,
): AnswerCellTaskDescription => ({
  type: 'answerCell',
  content: '4 = answercell + answercell',
  textBefore: makeTranslation('Запишите выражение, соответствующее рисунку.'),
  ...extra,
})

const table = {
  width: '300px',
  type: 120,
  tableAlign: 'center',
  removeBorders: true,
  rows: [{ cells: [picture], colspan_list: [], rowspan_list: [] }],
}

describe('AnswerCellDescriptionExtras', () => {
  it('рисует рисунок tableBefore (таблица 120 со svg) под textBefore', () => {
    render(
      <AnswerCellDescriptionExtras
        description={description({ tableBefore: table })}
        deps={makeDeps()}
      />,
    )

    const figure = screen.getByTestId('complex-table-part')
    expect(screen.getByTestId('table-html-cell').innerHTML).toContain('<svg')
    // after the condition's text, as in the old window
    const text = screen.getByText(/соответствующее рисунку/)
    expect(
      text.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('snake_case table_before из ответа API тоже рисуется', () => {
    render(
      <AnswerCellDescriptionExtras
        description={description({ table_before: table })}
        deps={makeDeps()}
      />,
    )

    expect(screen.getByTestId('table-html-cell').innerHTML).toContain('<svg')
  })

  it('без tableBefore (null, как у 3_5_4_19) рисунка нет', () => {
    render(
      <AnswerCellDescriptionExtras
        description={description({ tableBefore: null })}
        deps={makeDeps()}
      />,
    )

    expect(screen.queryByTestId('complex-table-part')).not.toBeInTheDocument()
  })
})
