import clsx from 'clsx'
import type { ReactNode } from 'react'

import s from './shell.module.scss'

interface Props {
  isChatOpen: boolean
  isDraftOpen: boolean
  className?: string
  children: ReactNode
}

/**
 * Grid of the wide desktop layout: chat, task, draft as columns. Without the
 * host's `data-ntm-layout="wide"` (and on touch screens) it renders no box.
 */
export const TaskModalShell = ({
  isChatOpen,
  isDraftOpen,
  className,
  children,
}: Props) => (
  <div
    className={clsx(
      s.shell,
      isChatOpen && s.withChat,
      isDraftOpen && s.withDraft,
      className,
    )}
  >
    {children}
  </div>
)
