import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { DigitGroupingForTask } from '@/modules/tasks/lib/digit-grouping-for-task'
import { MathText } from '@/ui/math-text/math-text'
import { TopBar } from '@/ui/top-bar/top-bar'

import styles from './task-list-page.module.scss'
import type { TaskListStrings } from './task-list-strings'
import { taskPreview } from './task-preview'
import {
  isOpenable,
  type TaskListRow,
  type TaskListSummary,
  type TaskStatus,
} from './task-status'

interface Props {
  rows: TaskListRow[]
  summary: TaskListSummary
  strings: TaskListStrings
  deps: TaskModalDependencies
  onSelect: (row: TaskListRow) => void
  /** Back to the current task. */
  onBack: () => void
}

/**
 * Lesson tasks on a full screen, opened by tapping «№N/M» (Alisher, 05.10 and
 * 22.10). Built on the diagnostic report screen (App › Diagnostic — Part 1):
 * a summary with a bar and numbered rows with a status mark on the right — no
 * tabs («просто список»). Strict order: solved tasks open for review, the
 * current one opens, tasks ahead are locked.
 */
export const TaskListPage = ({
  rows,
  summary,
  strings,
  deps,
  onSelect,
  onBack,
}: Props) => {
  const { correct, errors, shown, solved, total } = summary
  const pct = (n: number) => `${total ? (n / total) * 100 : 0}%`

  return (
    <>
      <TopBar
        deps={deps}
        onGoBack={onBack}
        goBackLabel={strings.backToTask}
        titleClassName={styles.title}
      >
        {strings.title}
      </TopBar>

      <div className={styles.body}>
        <div className={styles.summary}>
          <p className={styles.headline}>{strings.solved(solved, total)}</p>
          <div className={styles.progress} aria-hidden>
            <span className={styles.pCorrect} style={{ width: pct(correct) }} />
            <span
              className={styles.pError}
              style={{ width: pct(errors + shown) }}
            />
          </div>
          <p className={styles.caption}>
            {strings.summary(correct, errors, shown)}
          </p>
        </div>

        <List rows={rows} strings={strings} deps={deps} onSelect={onSelect} />
      </div>
    </>
  )
}

const Mark = ({
  status,
  strings,
}: {
  status: TaskStatus
  strings: TaskListStrings
}) => {
  if (status === 'correct')
    return (
      <svg
        className={styles.markOk}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        aria-hidden
      >
        <path
          d="M4 10.5l4 4 8-9"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (status === 'error')
    return (
      <svg
        className={styles.markErr}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        aria-hidden
      >
        <path
          d="M5 5l10 10M15 5L5 15"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    )
  if (status === 'shown')
    return (
      <span className={styles.markShown} aria-hidden>
        {strings.markShown}
      </span>
    )
  if (status === 'current')
    return (
      <span className={styles.markNow} aria-hidden>
        {strings.markCurrent}
      </span>
    )
  return null
}

const List = ({
  rows,
  strings,
  deps,
  onSelect,
}: {
  rows: TaskListRow[]
  strings: TaskListStrings
  deps: TaskModalDependencies
  onSelect: (row: TaskListRow) => void
}) => {
  const listRef = useRef<HTMLOListElement>(null)
  const currentRef = useRef<HTMLButtonElement>(null)

  // Open on the current task, not on №1: in a long lesson it is far down.
  // The list alone scrolls — scrollIntoView would also move the host's page
  // and the modal around it to centre the row.
  useEffect(() => {
    const list = listRef.current
    const row = currentRef.current
    if (!list || !row) return
    const offset =
      row.getBoundingClientRect().top - list.getBoundingClientRect().top
    list.scrollTop += offset - (list.clientHeight - row.offsetHeight) / 2
  }, [])

  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)

  return (
    <ol ref={listRef} className={styles.list}>
      {rows.map((row) => {
        const preview =
          taskPreview(row.task, translate) ||
          (row.status === 'ahead' || row.status === 'current'
            ? strings.task
            : strings.solvedEarlier)
        return (
          <li key={row.task.id}>
            <button
              type="button"
              className={clsx(styles.row, styles[row.status])}
              disabled={!isOpenable(row.status)}
              aria-current={row.status === 'current' ? 'step' : undefined}
              aria-label={`№${row.num}${row.isPenalty ? `, ${strings.extra}` : ''} — ${strings.status[row.status]}`}
              ref={row.status === 'current' ? currentRef : undefined}
              onClick={() => onSelect(row)}
              data-testid={`task-list-row-${row.num}`}
            >
              <span className={styles.num}>{row.num}.</span>
              <span className={styles.text}>
                <span className={styles.preview}>
                  <DigitGroupingForTask taskType={row.task.type}>
                    <MathText inline>{preview}</MathText>
                  </DigitGroupingForTask>
                </span>
                {row.isPenalty && (
                  <span className={styles.extra}>{strings.extra}</span>
                )}
              </span>
              <Mark status={row.status} strings={strings} />
            </button>
          </li>
        )
      })}
    </ol>
  )
}
