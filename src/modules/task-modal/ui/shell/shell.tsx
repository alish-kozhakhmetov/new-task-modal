import clsx from 'clsx'
import type { ReactNode } from 'react'

import s from './shell.module.scss'

interface Props {
  /** Host passed `layout="wide"`: marks the shell for the wide rules. */
  isWide?: boolean
  isChatOpen: boolean
  isDraftOpen: boolean
  className?: string
  children: ReactNode
}

/**
 * Grid of the wide desktop layout: chat, task, draft as columns. With
 * `isWide` it carries `data-ntm-layout="wide"` — the package's wide rules and
 * the site skin's full-window rule key on it. Without it (and on touch
 * screens) it renders no box.
 */
export const TaskModalShell = ({
  isWide = false,
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
    data-ntm-layout={isWide ? 'wide' : undefined}
  >
    {children}
  </div>
)
