import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import '../../../.storybook/jquery-global'
import '@edtr-io/mathquill/build/mathquill.js'

import { DigitGroupingContext } from '../math-text/group-digits'

import { DIGIT_GAP_ATTR } from './group-field-digits'
import { MathInput } from './math-input'

type Field = { typedText: (text: string) => void; latex: () => string }

const fieldOf = (el: HTMLElement) =>
  (
    window.MathQuill.getInterface(2) as unknown as (
      el: HTMLElement,
    ) => Field | undefined
  )(el)

const mount = (from: number | null, formula = '') => {
  const onChange = vi.fn<(latex: string) => void>()
  render(
    <DigitGroupingContext value={{ from }}>
      <MathInput
        id="answer"
        data-testid="answer"
        formula={formula}
        onMathFieldChanged={onChange}
      />
    </DigitGroupingContext>,
  )
  return { el: screen.getByTestId('answer'), onChange }
}

/** MathQuill's own DOM is the subject here, not what a user queries by role. */
const gaps = (el: HTMLElement) =>
  // eslint-disable-next-line testing-library/no-node-access
  [...el.querySelectorAll(`[${DIGIT_GAP_ATTR}]`)].map((n) => n.textContent)

describe('MathInput — digit grouping (rule 100, 23.10)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('«50000» reads «50 000»; onChange — the store — gets «50000»', async () => {
    const { el, onChange } = mount(5)
    await waitFor(() => expect(fieldOf(el)).toBeTruthy())
    const field = fieldOf(el)
    for (const ch of '50000') field?.typedText(ch)

    await waitFor(() => expect(gaps(el)).toEqual(['0']))
    expect(onChange).toHaveBeenLastCalledWith('50000')
    expect(field?.latex()).toBe('50000')
    // the gap is a margin: no space reaches the text of the field
    // eslint-disable-next-line testing-library/no-node-access
    expect(el.querySelector('.mq-root-block')).toHaveTextContent(
      /^50000\u200b?$/,
    )
  })

  it('a seeded answer is grouped on mount', async () => {
    const { el } = mount(5, '8201794')
    await waitFor(() => expect(gaps(el)).toEqual(['8', '1']))
  })

  it('off for the task (GROUPING_OFF_TASKS, column arithmetic)', async () => {
    const { el, onChange } = mount(null)
    await waitFor(() => expect(fieldOf(el)).toBeTruthy())
    for (const ch of '12345') fieldOf(el)?.typedText(ch)
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith('12345'))
    expect(gaps(el)).toEqual([])
  })
})
