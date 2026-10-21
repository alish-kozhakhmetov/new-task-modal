import { create } from 'zustand'

/** Phase of the lesson test: running → (confirm) → finishing → result. */
export type TestPhase =
  | 'loading'
  | 'running'
  | 'confirm'
  | 'finishing'
  | 'result'

interface TestState {
  phase: TestPhase
  checkLessonId: number | null
  /** Tasks with an answer saved on the server (this session or a resumed attempt). */
  answeredIds: string[]
  /** Countdown end, ms since epoch; null — no limit from the server. */
  deadline: number | null
  resultProgress: number | null
  set: (patch: Partial<Omit<TestState, 'set' | 'reset'>>) => void
  reset: () => void
}

const initial = {
  phase: 'loading' as TestPhase,
  checkLessonId: null,
  answeredIds: [],
  deadline: null,
  resultProgress: null,
}

export const useTestStore = create<TestState>((set) => ({
  ...initial,
  set: (patch) => set(patch),
  reset: () => set(initial),
}))
