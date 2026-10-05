
import { Canvas } from '../canvas/canvas'
import { Chat } from '../chat/chat'

import { useInitialSetup } from './model/hooks/use-initial-setup'
import { useOpenState, type OpenState } from './model/hooks/use-open-state'
import { useStore } from './model/store/task-modal-store'
import type { TaskModalProps } from './model/types/props'
import { TaskModalProviders } from './providers'
import { TaskModalContent } from './ui/content/content'

export interface TaskModalModals {
  chat: OpenState
  canvas: OpenState
}

export const TaskModal = (props: TaskModalProps) => {
  const chat = useOpenState()
  const canvas = useOpenState()
  const isSetupDone = useInitialSetup(props)
  const activeTaskId = useStore((s) => s.state?.activeTask?.id)

  if (!isSetupDone) return null

  return (
    <>
      <TaskModalProviders>
        <TaskModalContent props={props} modals={{ chat, canvas }} />

        {/* One draft per task (Alisher, 05.10): the board is keyed by task
            and mounted on open, so «Далее» never shows the previous task's
            drawing. Same reason as the chat below — a hidden Activity tree
            would keep the old task id. */}
        {canvas.isOpen && (
          <Canvas
            key={activeTaskId ?? 'none'}
            taskId={activeTaskId}
            onClose={canvas.close}
          />
        )}

        {/* Mounted on open, not kept under ReactActivity: a hidden Activity
            tree misses store updates made while hidden, so after «Далее» the
            chat still held the previous task — its buttons asked the backend
            for that task's answer (alish-kozhakhmetov/qalan#14). Messages
            live in the chat store and mentor messages in the query cache, so
            remounting loses only an unsent draft. */}
        {chat.isOpen && <Chat props={props} onClose={chat.close} />}
      </TaskModalProviders>
    </>
  )
}
