import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { TaskModalProps } from '../../types/props'

import { useTheory } from './use-theory'

// Theory coin (lead session, 20.10): on the phone it comes with opening the
// chat, as before; in the wide layout the chat is always open, so the coin
// waits for a press on the theory video — once per task.
const setup = (deferCoin: boolean) => {
  const addCoinForTheory = vi.fn(() => Promise.resolve())
  const props = {
    deps: {
      global: {
        getAbbreviatedLanguage: () => 'rus',
        isLocationQalanSchool: () => false,
      },
      api: {
        getLessonById: () =>
          Promise.resolve({
            theory: [{ type: 'video', content: null }],
            locatedCountry: null,
          }),
        addCoinForTheory,
      },
      alert: { showError: vi.fn() },
      enums: { LessonTheory: { VideoUrl: 'video' } },
    },
    hostProps: { lessonId: 7, personalStudyItemId: 3, applicationType: 1 },
  } as unknown as TaskModalProps
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const onLoad = vi.fn()
  const view = renderHook(
    () => useTheory({ props, onLoad, isTheoryShown: false, deferCoin }),
    { wrapper },
  )
  return { view, onLoad, addCoinForTheory }
}

describe('useTheory — theory coin', () => {
  it('phone: one coin when the theory loads', async () => {
    const { onLoad, addCoinForTheory } = setup(false)
    await waitFor(() => expect(onLoad).toHaveBeenCalled())
    expect(addCoinForTheory).toHaveBeenCalledTimes(1)
  })

  it('wide: no coin without a press, one coin for any number of presses', async () => {
    const { view, onLoad, addCoinForTheory } = setup(true)
    await waitFor(() => expect(onLoad).toHaveBeenCalled())
    expect(addCoinForTheory).not.toHaveBeenCalled()

    act(() => {
      view.result.current.awardTheoryCoin()
      view.result.current.awardTheoryCoin()
    })
    expect(addCoinForTheory).toHaveBeenCalledTimes(1)
    expect(addCoinForTheory).toHaveBeenCalledWith(7, 3, 1)
  })
})
