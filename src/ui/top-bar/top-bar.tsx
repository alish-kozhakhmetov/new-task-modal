import clsx from 'clsx'
import type { ReactNode, RefObject } from 'react'

import CloseIcon from '@/assets/icons/close.svg'
import ArrowBackIcon from '@/assets/icons/header/arrow-back.svg'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'
import { FlexRow } from '@/ui/layout/flex-row/flex-row'

import s from './top-bar.module.scss'

interface Props {
  children: ReactNode
  deps: TaskModalDependencies
  ref?: RefObject<HTMLDivElement | null>
  className?: string
  titleClassName?: string
  onGoBack?: () => void
  /** Accessible name of the back button (it shows only an arrow). */
  goBackLabel?: string
  /** Without it there is no close button (a pinned column has nothing to close). */
  onClose?: () => void
}

/**
 * The close button shows only a cross: its name, in the lesson's language,
 * through the host's translate as the chat's strings (chat-text.tsx); the
 * site's own word in Kazakh is «Жабу» (Localization.js).
 */
const CLOSE = { rus: 'Закрыть', kaz: 'Жабу', eng: 'Close' }

const closeName = (deps: TaskModalDependencies) => {
  const translate = deps.global?.translate
  return (typeof translate === 'function' && translate(CLOSE)) || CLOSE.rus
}

export const TopBar = ({
  children,
  deps,
  ref,
  className,
  titleClassName,
  onGoBack,
  goBackLabel,
  onClose,
}: Props) => {
  const isArabic = deps.helpers.ArabicNumeralUtils.isArabic()
  const direction = deps.helpers.ArabicNumeralUtils.getDirection()

  return (
    <FlexRow ref={ref} className={clsx(s.container, className)} dir={direction}>
      {onGoBack ? (
        <Button
          color={ButtonColor.White}
          layout={ButtonLayout.Icon}
          onClick={onGoBack}
          className={s.button}
          aria-label={goBackLabel}
        >
          <ArrowBackIcon />
        </Button>
      ) : (
        // Invisible twin of the close button: keeps the title centred when
        // there is no back button (task header, chat).
        <span className={clsx(s.button, s.spacer)} aria-hidden>
          <CloseIcon width={20} height={20} />
        </span>
      )}

      <h1 className={clsx(s.title, isArabic && s.rtl, titleClassName)}>
        {children}
      </h1>

      {onClose ? (
        <Button
          color={ButtonColor.White}
          layout={ButtonLayout.Icon}
          onClick={onClose}
          className={s.button}
          aria-label={closeName(deps)}
        >
          <CloseIcon width={20} height={20} />
        </Button>
      ) : (
        <span className={clsx(s.button, s.spacer)} aria-hidden>
          <CloseIcon width={20} height={20} />
        </span>
      )}
    </FlexRow>
  )
}
