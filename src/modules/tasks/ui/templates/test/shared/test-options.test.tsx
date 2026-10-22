import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { TestTaskDescription } from '../lib/types.task'

import { TestOptions } from './test-options'

vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../text/lib/testing/mocks/math-formula'),
)

const options = ['A', 'B', 'C', 'D'].map((value) => ({
  value,
  label: `вариант ${value}`,
}))

const setup = ({ multiple = false, value = '', readOnly = false } = {}) => {
  const onChange = vi.fn()
  render(
    <TestOptions
      name="task-1"
      options={options}
      value={value}
      onChange={onChange}
      description={{} as TestTaskDescription}
      multiple={multiple}
      readOnly={readOnly}
    />,
  )
  return onChange
}

const press = (code: string, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(document, { code, ...init })

describe('TestOptions — physical keyboard', () => {
  it('a letter or a number picks the option, on any layout', () => {
    const onChange = setup()
    press('KeyB', { key: 'и' }) // Russian layout: the B key types «и»
    press('Digit3')
    press('Numpad4')
    expect(onChange.mock.calls).toEqual([['B'], ['C'], ['D']])
  })

  it('ignores keys past the options, modifiers and typing in a text field', () => {
    const onChange = setup()
    press('KeyE')
    press('Digit9')
    press('KeyC', { metaKey: true })
    press('KeyC', { ctrlKey: true })
    const chat = document.createElement('textarea')
    document.body.append(chat)
    fireEvent.keyDown(chat, { code: 'KeyA' })
    chat.remove()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('toggles a checkbox of a several-answers test', () => {
    const onChange = setup({ multiple: true, value: 'A;;C' })
    press('KeyC')
    press('KeyB')
    expect(onChange.mock.calls).toEqual([['A'], ['A;;B;;C']])
  })

  it('does nothing on the solution (read-only options)', () => {
    const onChange = setup({ readOnly: true })
    press('KeyA')
    expect(onChange).not.toHaveBeenCalled()
  })
})
