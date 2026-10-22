import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStore } from '../store/task-modal-store'
import type { SetTaskModalState, TaskModalState } from '../types/props'

import { closeWithProgress } from './close-with-progress'

// A host like the site: React-16 setState, synchronous with a callback;
// closeModal reads the progress from the host's own state.
const makeHost = (initial: number, { withCallback = true } = {}) => {
  const host = {
    state: { userProgress: initial },
    closedWith: null as number | null,
  }
  const setState = vi.fn<SetTaskModalState>((next, callback) => {
    if (typeof next !== 'function') {
      host.state = { ...host.state, ...next } as typeof host.state
    }
    if (withCallback) callback?.()
  })
  const closeModal = vi.fn(() => {
    host.closedWith = host.state.userProgress
  })
  return { host, setState, closeModal }
}

describe('closeWithProgress', () => {
  beforeEach(() => {
    useStore.setState({ state: null })
  })

  it('hands the progress of the checks to the host before closing (× mid-lesson)', () => {
    const { host, setState, closeModal } = makeHost(0)
    // one check passed: the store holds the backend's userProgress
    useStore.getState().setState({ userProgress: 12 } as TaskModalState)

    const onClosed = vi.fn()
    closeWithProgress({ setState, closeModal }, onClosed)

    expect(setState).toHaveBeenCalledWith(
      { userProgress: 12 },
      expect.any(Function),
    )
    expect(host.closedWith).toBe(12)
    expect(closeModal).toHaveBeenCalledTimes(1)
    expect(onClosed).toHaveBeenCalledTimes(1)
  })

  it('closes once with a host that ignores the setState callback', () => {
    const { host, setState, closeModal } = makeHost(0, { withCallback: false })
    useStore.getState().setState({ userProgress: 40 } as TaskModalState)

    closeWithProgress({ setState, closeModal })

    expect(host.closedWith).toBe(40)
    expect(closeModal).toHaveBeenCalledTimes(1)
  })

  it('just closes when the store has no progress yet', () => {
    const { setState, closeModal } = makeHost(5)

    closeWithProgress({ setState, closeModal })

    expect(setState).not.toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
