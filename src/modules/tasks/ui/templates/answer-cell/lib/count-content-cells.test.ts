import { describe, expect, it } from 'vitest'

import { countContentCells } from './count-content-cells'

const translate = (value: unknown) =>
  typeof value === 'string' ? value : ((value as { rus?: string }).rus ?? '')

describe('countContentCells', () => {
  it('counts the cells the content draws, not the inputs answerInput lists (Task_1_1_10_16)', () => {
    const description = {
      type: 'answerCell',
      content: '4 = answercell + answercell',
    }
    expect(countContentCells(description, translate)).toBe(2)
  })

  it('reads the content in the host language', () => {
    const description = {
      type: 'answerCell',
      content: {
        module_name: 'Elixir.Helpers.Translation',
        rus: '1 + 4 = answercell\n5 − 1 = answercell\n5 − 4 = answercell\n',
        kaz: '',
      },
    }
    expect(countContentCells(description, translate)).toBe(3)
  })

  it('is 0 without cells, so the factory keeps its own count', () => {
    expect(
      countContentCells({ type: 'answerCell', content: '' }, translate),
    ).toBe(0)
    expect(countContentCells(undefined, translate)).toBe(0)
  })
})
