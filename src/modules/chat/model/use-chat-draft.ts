import {
  useStore,
  type ChatDraftKind,
} from '@/modules/task-modal/model/store/task-modal-store'

/**
 * The chat input's text kept by the task window (2.5.6): closing the chat
 * sheet on the phone no longer drops it. Bound to the active task — on another
 * task the draft reads empty, the old text is not carried over.
 */
export const useChatDraft = (
  kind: ChatDraftKind,
): [string, (text: string) => void] => {
  const taskId = useStore((s) => s.state?.activeTask?.id ?? null)
  const draft = useStore((s) => s.chatDraft)
  const setChatDraft = useStore((s) => s.setChatDraft)
  const value = draft.taskId === taskId ? draft[kind] : ''
  return [value, (text) => setChatDraft(kind, text, taskId)]
}
