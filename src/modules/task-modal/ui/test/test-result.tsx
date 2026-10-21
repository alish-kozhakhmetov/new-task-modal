import clsx from 'clsx'
import type { ReactNode } from 'react'

import { Button, ButtonColor } from '@/ui/button/button'
import { TopBar } from '@/ui/top-bar/top-bar'

import { getAppState } from '../../model/store/task-modal-store'
import { useTestStore } from '../../model/test/test-store'
import type { TaskModalProps } from '../../model/types/props'

import s from './test.module.scss'
import { TEST_TEXTS } from './texts'

const R = 32
const C = 2 * Math.PI * R

const Ring = ({
  part,
  className,
  children,
}: {
  part: number
  className?: string
  children: ReactNode
}) => (
  <div className={s.ring}>
    <svg viewBox="0 0 72 72" aria-hidden>
      <circle
        className={s.ringTrack}
        cx="36"
        cy="36"
        r={R}
        fill="none"
        strokeWidth="6"
      />
      <circle
        className={clsx(s.ringFill, className)}
        cx="36"
        cy="36"
        r={R}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${C * Math.min(1, Math.max(0, part))} ${C}`}
        transform="rotate(-90 36 36)"
      />
    </svg>
    <b>{children}</b>
  </div>
)

/**
 * Result of the attempt, by App 14312:653941 (passed) and 18106:116452 (not
 * passed): title, status, metrics, two actions. The web gets only the percent
 * (`resultProgress`), so no «Баллы 24/28», coins or time, and no character
 * until the package has the real assets.
 */
export const TestResult = ({ props }: { props: TaskModalProps }) => {
  const { hostProps } = props
  const progress = Math.round(useTestStore((st) => st.resultProgress) ?? 0)
  const answered = useTestStore((st) => st.answeredIds.length)
  const total = getAppState().tasks?.length ?? 0
  const pass = hostProps.testPassPercent ?? 75
  const passed = progress >= pass
  const lessonTitle = getAppState().lesson?.title
  const title =
    hostProps.lessonTitle ??
    (lessonTitle
      ? props.deps.global.translate(
          lessonTitle as unknown as Record<string, string>,
        )
      : '')

  const retake = hostProps.onRetakeTest && (
    <Button
      key="retake"
      color={passed ? undefined : ButtonColor.White}
      onClick={hostProps.onRetakeTest}
    >
      {TEST_TEXTS.retake}
    </Button>
  )
  const practice = hostProps.onRepeatPractice && (
    <Button
      key="practice"
      color={passed ? ButtonColor.White : undefined}
      onClick={hostProps.onRepeatPractice}
    >
      {TEST_TEXTS.repeatPractice}
    </Button>
  )

  return (
    <div className={clsx('task-modal', s.result)} data-testid="test-result">
      <TopBar deps={props.deps} onClose={props.closeModal}>
        {''}
      </TopBar>
      <div className={s.resultBody}>
        {title ? <h2 className={s.resultTitle}>{title}</h2> : null}
        <p className={s.resultText}>
          {passed ? TEST_TEXTS.passed : TEST_TEXTS.failed(pass)}
        </p>
        <div className={s.metrics}>
          <div className={s.metric}>
            <Ring part={progress / 100} className={passed ? undefined : s.fail}>
              {progress}%
            </Ring>
            <span>{TEST_TEXTS.result}</span>
          </div>
          <div className={s.metric}>
            <Ring part={total ? answered / total : 0} className={s.brand}>
              {answered}/{total}
            </Ring>
            <span>{TEST_TEXTS.answered}</span>
          </div>
        </div>
      </div>
      <div className={s.resultButtons}>
        {passed ? [retake, practice] : [practice, retake]}
      </div>
    </div>
  )
}
