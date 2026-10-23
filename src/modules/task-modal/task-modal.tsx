import { useMemo } from 'react'

import { Canvas } from '../canvas/canvas'
import { Chat } from '../chat/chat'

import { usePinnedColumns } from './model/hooks/layout/use-pinned-columns'
import { useInitialSetup } from './model/hooks/use-initial-setup'
import { useOpenState, type OpenState } from './model/hooks/use-open-state'
import { withWordForms } from './model/lib/resolve-word-forms'
import { useStore } from './model/store/task-modal-store'
import type { TaskModalProps } from './model/types/props'
import { TaskModalProviders } from './providers'
import { TaskModalContent } from './ui/content/content'
import { TaskListLayer } from './ui/content/header/task-list/task-list-layer'
import { TaskModalShell } from './ui/shell/shell'

export interface TaskModalModals {
  chat: OpenState
  canvas: OpenState
}

export const TaskModal = (hostProps: TaskModalProps) => {
  const props = useMemo(() => withWordForms(hostProps), [hostProps])
  const chat = useOpenState()
  const canvas = useOpenState()
  const isSetupDone = useInitialSetup(props)
  const activeTaskId = useStore((s) => s.state?.activeTask?.id)
  // Wide layout: the chat (from 1100) and the draft (from 1280) are permanent
  // columns, shown without a button press (Alisher, 20.10, 17:52).
  const isWide = props.layout === 'wide'
  const { isChatPinned, isDraftPinned } = usePinnedColumns(isWide)
  const isChatShown = chat.isOpen || isChatPinned
  const isDraftShown = canvas.isOpen || isDraftPinned

  if (!isSetupDone) return null

  return (
    <>
      <TaskModalProviders>
        <TaskModalShell
          isWide={isWide}
          isChatOpen={isChatShown}
          isDraftOpen={isDraftShown}
        >
          <TaskModalContent props={props} modals={{ chat, canvas }} />

          {/* One draft per task (Alisher, 05.10): the board is keyed by task
            and mounted on open, so «Далее» never shows the previous task's
            drawing. Same reason as the chat below — a hidden Activity tree
            would keep the old task id. */}
          {isDraftShown && (
            <Canvas
              key={activeTaskId ?? 'none'}
              taskId={activeTaskId}
              onClose={canvas.close}
              isPinned={isDraftPinned}
              global={props.deps.global}
            />
          )}

          {/* Mounted on open, not kept under ReactActivity: a hidden Activity
            tree misses store updates made while hidden, so after «Далее» the
            chat still held the previous task — its buttons asked the backend
            for that task's answer (alish-kozhakhmetov/qalan#14). Messages
            live in the chat store and mentor messages in the query cache, so
            remounting loses only an unsent draft. */}
          {isChatShown && (
            <Chat props={props} onClose={chat.close} isPinned={isChatPinned} />
          )}

          {/* Opened by «№N/M» in the header (Alisher, 22.10). */}
          <TaskListLayer props={props} />
        </TaskModalShell>
      </TaskModalProviders>
    </>
  )
}
