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
 * Result of the attempt — the look of App 14312:653941 / 18106:116452: title,
 * metrics, two actions. No «passed / not passed»: the site has no such rule
 * (the server returns only `resultProgress`; 75 % is the rating threshold, not
 * a verdict — lead session, 21.10). No «Баллы 24/28», coins, time or
 * character: the web gets only the percent, the package has no characters.
 */
export const TestResult = ({ props }: { props: TaskModalProps }) => {
  const { hostProps } = props
  const progress = Math.round(useTestStore((st) => st.resultProgress) ?? 0)
  const answered = useTestStore((st) => st.answeredIds.length)
  const total = getAppState().tasks?.length ?? 0
  const lessonTitle = getAppState().lesson?.title
  const title =
    hostProps.lessonTitle ??
    (lessonTitle
      ? props.deps.global.translate(
          lessonTitle as unknown as Record<string, string>,
        )
      : '')

  const retake = hostProps.onRetakeTest && (
    <Button key="retake" onClick={hostProps.onRetakeTest}>
      {TEST_TEXTS.retake}
    </Button>
  )
  const practice = hostProps.onRepeatPractice && (
    <Button
      key="practice"
      color={ButtonColor.White}
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
        <p className={s.resultText}>{TEST_TEXTS.done}</p>
        <div className={s.metrics}>
          <div className={s.metric}>
            <Ring part={progress / 100}>{progress}%</Ring>
            <span>{TEST_TEXTS.result}</span>
          </div>
          <div className={s.metric}>
            <Ring part={total ? answered / total : 0}>
              {answered}/{total}
            </Ring>
            <span>{TEST_TEXTS.answered}</span>
          </div>
        </div>
      </div>
      <div className={s.resultButtons}>
        {retake}
        {practice}
      </div>
    </div>
  )
}
