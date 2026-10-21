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
  /** Without it there is no close button (a pinned column has nothing to close). */
  onClose?: () => void
  /**
   * A control at the start instead of the back button (lesson test: «Завершить»).
   * The bar becomes a 1fr · title · 1fr grid so the title stays centred.
   */
  start?: ReactNode
}

export const TopBar = ({
  children,
  deps,
  ref,
  className,
  titleClassName,
  onGoBack,
  onClose,
  start,
}: Props) => {
  const isArabic = deps.helpers.ArabicNumeralUtils.isArabic()
  const direction = deps.helpers.ArabicNumeralUtils.getDirection()

  return (
    <FlexRow
      ref={ref}
      className={clsx(s.container, start != null && s.withStart, className)}
      dir={direction}
    >
      {start != null ? (
        <div className={s.start}>{start}</div>
      ) : onGoBack ? (
        <Button
          color={ButtonColor.White}
          layout={ButtonLayout.Icon}
          onClick={onGoBack}
          className={s.button}
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
