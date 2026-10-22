import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import { TopBar } from './top-bar'

const deps = (field?: 'rus' | 'kaz' | 'eng') =>
  ({
    global: field
      ? { translate: (entry: Record<string, string>) => entry[field] }
      : {},
    helpers: {
      ArabicNumeralUtils: { isArabic: () => false, getDirection: () => 'ltr' },
    },
  }) as unknown as TaskModalDependencies

const noop = () => undefined

// The cross of the task window and the chat: a name for a screen reader, in
// the lesson's language.
describe('TopBar close button', () => {
  it.each([
    ['rus', 'Закрыть'],
    ['kaz', 'Жабу'],
    ['eng', 'Close'],
  ] as const)('is named in %s', (field, name) => {
    render(
      <TopBar deps={deps(field)} onClose={noop}>
        №1/15
      </TopBar>,
    )
    expect(screen.getByRole('button', { name })).toBeInTheDocument()
  })

  it('falls back to Russian without the host translate', () => {
    render(
      <TopBar deps={deps()} onClose={noop}>
        №1/15
      </TopBar>,
    )
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument()
  })

  it('has no button without onClose — only the hidden spacer', () => {
    render(<TopBar deps={deps('rus')}>AI-чат</TopBar>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
