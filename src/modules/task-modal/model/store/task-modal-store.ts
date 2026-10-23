import { create } from 'zustand'

import type { TaskModalState } from '../types/props'

/**
 * The task list opened from «№N/M» (Alisher, 22.10): the list itself or one
 * solved task on review. A state of the window, not a route — the host's
 * history and the system «back» stay as they were.
 */
export type TaskListView =
  | { screen: 'list' }
  | { screen: 'review'; taskId: string }
  | null

/**
 * Unsent chat text (2.5.6): on the phone the chat is a sheet that unmounts on
 * close, so its input lost the text. The draft lives with the window, bound to
 * the task it was typed on: another task («Далее», the list) reads it empty.
 */
export type ChatDraftKind = 'ai' | 'mentor'
export interface ChatDraft {
  taskId: string | null
  ai: string
  mentor: string
}
const EMPTY_DRAFT: ChatDraft = { taskId: null, ai: '', mentor: '' }

interface State {
  // task loading
  isTaskLoaded: boolean
  setIsTaskLoaded: (isLoading: boolean) => void

  // answer
  answer: string
  setAnswer: (answer: string) => void

  // prev answer
  prevAnswer: string | null
  setPrevAnswer: (answer: string | null) => void

  // state
  state: TaskModalState | null
  setState: (state: Partial<TaskModalState>) => void

  // available tasks
  availableTasks: Record<string, boolean> | null
  setAvailableTasks: (availableTasks: Record<string, boolean>) => void

  // is answer changed
  isAnswerChanged: boolean
  setIsAnswerChanged: (isAnswerChanged: boolean) => void

  isTransitioning: boolean
  setIsTransitioning: (isTransitioning: boolean) => void

  // task list over the task (null — the task itself)
  taskList: TaskListView
  setTaskList: (taskList: TaskListView) => void

  // unsent chat text of the current task
  chatDraft: ChatDraft
  setChatDraft: (
    kind: ChatDraftKind,
    text: string,
    taskId: string | null,
  ) => void
  resetChatDraft: () => void
}

export const useStore = create<State>((set) => ({
  // task loading
  isTaskLoaded: false,
  setIsTaskLoaded: (isTaskLoaded: boolean) => {
    // console.log('SET IS TASK LOADED', isTaskLoaded)
    set({
      isTaskLoaded,
    })
  },

  // answer
  answer: '',
  setAnswer: (answer) => set({ answer }),

  // prev answer
  prevAnswer: null,
  setPrevAnswer: (prevAnswer) => set({ prevAnswer }),

  // app state
  state: null,
  setState: (state) => {
    // console.log('SET STATE', state)
    set((prev) => ({
      state: { ...prev.state, ...(state as TaskModalState) },
    }))
  },

  // available tasks
  availableTasks: null,
  setAvailableTasks: (availableTasks) =>
    set({
      availableTasks,
    }),

  // is answer changed
  isAnswerChanged: false,
  setIsAnswerChanged: (isAnswerChanged) =>
    set({
      isAnswerChanged,
    }),

  // is transitioning
  isTransitioning: false,
  setIsTransitioning: (isTransitioning) =>
    set({
      isTransitioning,
    }),

  // task list
  taskList: null,
  setTaskList: (taskList) => set({ taskList }),

  // chat draft: another task starts from an empty draft
  chatDraft: EMPTY_DRAFT,
  setChatDraft: (kind, text, taskId) =>
    set((prev) => ({
      chatDraft: {
        ...(prev.chatDraft.taskId === taskId ? prev.chatDraft : EMPTY_DRAFT),
        taskId,
        [kind]: text,
      },
    })),
  resetChatDraft: () => set({ chatDraft: EMPTY_DRAFT }),
}))

export const useAppState = () => {
  const state = useStore((s) => s.state)
  if (!state) throw new Error('state must be set')

  return state
}

export const getAppState = () => {
  const state = useStore.getState().state
  if (!state) throw new Error('state must be set')

  return state
}

export const useSetAppState = () => {
  return useStore((s) => s.setState)
}
