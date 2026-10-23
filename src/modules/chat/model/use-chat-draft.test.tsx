import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalState } from '@/modules/task-modal/model/types/props'

import { useChatDraft } from './use-chat-draft'

const onTask = (id: string) =>
  useStore.setState({
    state: { activeTask: { id } } as unknown as TaskModalState,
  })

const draftOf = (kind: 'ai' | 'mentor' = 'ai') =>
  renderHook(() => useChatDraft(kind)).result

describe('useChatDraft (2.5.6)', () => {
  beforeEach(() => {
    useStore.getState().resetChatDraft()
    onTask('T1')
  })

  it('keeps the text when the chat unmounts and mounts again', () => {
    const { result, unmount } = renderHook(() => useChatDraft('ai'))
    act(() => result.current[1]('вопрос по задаче'))
    unmount()
    expect(draftOf().current[0]).toBe('вопрос по задаче')
  })

  it('AI chat and mentor keep separate drafts', () => {
    const ai = draftOf('ai')
    const mentor = draftOf('mentor')
    act(() => ai.current[1]('ai'))
    act(() => mentor.current[1]('mentor'))
    expect(ai.current[0]).toBe('ai')
    expect(mentor.current[0]).toBe('mentor')
  })

  it('another task reads an empty draft and does not carry the old one back', () => {
    const draft = draftOf()
    act(() => draft.current[1]('на №1'))
    act(() => onTask('T2'))
    expect(draft.current[0]).toBe('')
    act(() => draft.current[1]('на №2'))
    act(() => onTask('T1'))
    expect(draft.current[0]).toBe('')
  })

  it('sending clears it (the input sets an empty string)', () => {
    const draft = draftOf()
    act(() => draft.current[1]('текст'))
    act(() => draft.current[1](''))
    expect(draft.current[0]).toBe('')
  })

  it('a new window starts empty', () => {
    const draft = draftOf()
    act(() => draft.current[1]('текст'))
    act(() => useStore.getState().resetChatDraft())
    expect(draft.current[0]).toBe('')
  })
})
