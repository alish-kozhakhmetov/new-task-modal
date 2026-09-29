import { act, render, screen } from '@testing-library/react'
import { Activity, useEffect, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { create } from 'zustand'

const useS = create<{ id: string; set: (id: string) => void }>((set) => ({
  id: 't3',
  set: (id) => set({ id }),
}))

const Child = () => {
  const id = useS((s) => s.id)
  const [seen, setSeen] = useState('')
  useEffect(() => setSeen(id), [id])
  return <div data-testid="child">{id}|{seen}</div>
}

const Host = ({ visible }: { visible: boolean }) => (
  <Activity mode={visible ? 'visible' : 'hidden'}>
    <Child />
  </Activity>
)

// Pins the React behaviour behind alish-kozhakhmetov/qalan#14: a tree kept
// under <Activity mode="hidden"> does not see store updates made while it was
// hidden, even after it is shown again. Anything that acts on the active task
// (the chat) must not live under ReactActivity. If React changes this, the test
// fails — then the chat may go back under Activity.
describe('Activity + zustand', () => {
  it('hidden subtree misses store changes made while hidden', async () => {
    const { rerender } = render(<Host visible />)
    rerender(<Host visible={false} />)
    await act(async () => useS.getState().set('t4'))
    rerender(<Host visible />)
    await act(async () => {})
    expect(screen.getByTestId('child').textContent).toBe('t3|t3')
  })
})
