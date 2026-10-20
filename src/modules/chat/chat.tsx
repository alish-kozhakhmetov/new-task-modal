import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { Tabs } from '@/ui/tabs/tabs'
import { TopBar } from '@/ui/top-bar/top-bar'

import s from './chat.module.scss'
import { AiChat } from './ui/ai-chat/ai-chat'
import { MentorChat } from './ui/mentor-chat/mentor-chat'

export interface ChatProps {
  onClose: () => void
  /** Permanent column of the wide layout: no close button. */
  isPinned?: boolean
  props: TaskModalProps
}

export const Chat = ({ props, onClose, isPinned = false }: ChatProps) => {
  const tabs = [
    {
      title: 'AI-чат',
      subtitle: '24/7',
      content: () => <AiChat props={props} isPinned={isPinned} />,
    },
    {
      title: 'Ментор',
      subtitle: '10 — 23',
      content: () => <MentorChat props={props} />,
    },
  ]

  return (
    <div className={s.chat}>
      <TopBar
        titleClassName={s.title}
        deps={props.deps}
        onClose={isPinned ? undefined : onClose}
      >
        AI-чат
      </TopBar>

      <Tabs tabs={tabs} />
    </div>
  )
}
