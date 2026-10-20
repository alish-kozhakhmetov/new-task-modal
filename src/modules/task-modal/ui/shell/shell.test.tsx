import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TaskModalShell } from './shell'

// The site turns the wide layout on with `layout="wide"`; the package's wide
// rules and the skin's full-window rule key on this attribute.
describe('TaskModalShell', () => {
  it('marks itself wide only when asked', () => {
    const { container, rerender } = render(
      <TaskModalShell isChatOpen={false} isDraftOpen={false}>
        <i />
      </TaskModalShell>,
    )
    // The shell has no role or text of its own — its element is the subject.
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).not.toHaveAttribute('data-ntm-layout')

    rerender(
      <TaskModalShell isWide isChatOpen={false} isDraftOpen={false}>
        <i />
      </TaskModalShell>,
    )
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstElementChild).toHaveAttribute(
      'data-ntm-layout',
      'wide',
    )
  })
})
