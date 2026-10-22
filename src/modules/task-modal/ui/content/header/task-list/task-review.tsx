import clsx from 'clsx'
import { Suspense, useRef, type RefObject } from 'react'

import { ErrorBoundary } from '@/lib/error-boundary/error-boundary'
import { useWordFormAgreement } from '@/modules/task-modal/model/hooks/layout/use-word-form-agreement'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { DigitGroupingForTask } from '@/modules/tasks/lib/digit-grouping-for-task'
import { TaskLoadingReport } from '@/modules/tasks/lib/with-task-loading'
import { useTaskComponent } from '@/modules/tasks/model/component/use-task-component'
import type { MathInputRefType } from '@/modules/tasks/model/types'
import { Button } from '@/ui/button/button'
import { TopBar } from '@/ui/top-bar/top-bar'

import { ContainerSkeleton } from '../../container/container-skeleton'
import containerStyles from '../../container/container.module.scss'

import type { TaskListStrings } from './task-list-strings'
import styles from './task-review.module.scss'
import {
  hasCondition,
  type SolvedStatus,
  type TaskListRow,
} from './task-status'

interface Props {
  row: TaskListRow & { status: SolvedStatus }
  strings: TaskListStrings
  deps: TaskModalDependencies
  /** Back to the list. */
  onBack: () => void
  /** Back to the task being solved. */
  onCurrent: () => void
}

const noop = () => undefined

/**
 * A solved task, for reading only (Alisher, 22.10): its status, its
 * condition and what the store kept from solving it here — the pupil's
 * answer, and the solution when the backend sent one (after a mistake or
 * «show»). Nothing is asked of the backend for it. A task solved on an
 * earlier visit comes without its condition, so only the status is shown.
 */
export const TaskReview = ({
  row,
  strings,
  deps,
  onBack,
  onCurrent,
}: Props) => {
  const { task, num, status, isPenalty } = row
  const dir = deps.helpers.ArabicNumeralUtils.getDirection()

  return (
    <>
      <TopBar
        deps={deps}
        onGoBack={onBack}
        goBackLabel={strings.backToList}
        titleClassName={styles.title}
      >
        {strings.reviewTitle(num)}
      </TopBar>

      <div className={styles.scroll}>
        <div className={styles.meta}>
          <span
            className={clsx(styles.badge, styles[status])}
            data-testid="task-review-status"
          >
            <StatusIcon status={status} />
            {strings.status[status]}
          </span>
          {isPenalty && <span className={styles.extra}>{strings.extra}</span>}
        </div>

        {hasCondition(task) ? (
          // `inert`: a picture of the task — no focus, no input, no taps.
          <div
            className={clsx(containerStyles.container, styles.task)}
            dir={dir}
            inert
          >
            <SolvedTask row={row} deps={deps} />
          </div>
        ) : (
          <p className={styles.note}>{strings.conditionGone}</p>
        )}
      </div>

      <div className={styles.footer}>
        <Button className={styles.current} onClick={onCurrent}>
          {strings.backToCurrent}
        </Button>
      </div>
    </>
  )
}

const SolvedTask = ({
  row,
  deps,
}: {
  row: TaskListRow
  deps: TaskModalDependencies
}) => {
  const { task } = row
  const TaskComponent = useTaskComponent({ activeTask: task })
  const root = useRef<HTMLDivElement>(null)
  // Its own field registry: the current task's fields stay the calculator's.
  const mathInput: MathInputRefType = useRef(new Map())

  return (
    <ErrorBoundary>
      <Suspense fallback={<ContainerSkeleton />}>
        <TaskLoadingReport value={false}>
          <div ref={root}>
            <DigitGroupingForTask taskType={task.type}>
              {/* eslint-disable-next-line react-hooks/static-components -- the
                template is resolved per task type, as in the task container */}
              <TaskComponent
                task={task}
                deps={deps}
                answer={task.answer ?? ''}
                onChange={noop}
                mathInput={mathInput}
              />
            </DigitGroupingForTask>
            <WordFormAgreement root={root} taskId={task.id} />
          </div>
        </TaskLoadingReport>
      </Suspense>
    </ErrorBoundary>
  )
}

/** The word after a field agrees with the number in it, as on the task. */
const WordFormAgreement = ({
  root,
  taskId,
}: {
  root: RefObject<HTMLDivElement | null>
  taskId: unknown
}) => {
  useWordFormAgreement(root, taskId)
  return null
}

const StatusIcon = ({ status }: { status: SolvedStatus }) => {
  if (status === 'shown') return null
  return (
    <svg
      className={styles.icon}
      width={16}
      height={16}
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        d={status === 'correct' ? 'M4 10.5l4 4 8-9' : 'M5 5l10 10M15 5L5 15'}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
