import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import ArrowBackIcon from '@/assets/icons/header/arrow-back.svg'

import styles from './task-list-page.module.scss'
import { isOpenable, STATUS_LABEL, type TaskStatus } from './task-status'

export interface TaskListRow {
  /** 1-based number shown to the child */
  num: number
  status: TaskStatus
  /** the condition, plain text */
  preview: string
  /** extra task added after a mistake */
  isPenalty?: boolean
}

interface Props {
  rows: TaskListRow[]
  onSelect: (num: number) => void
  /** back to the current task */
  onBack: () => void
}

/**
 * Lesson tasks on a full screen, opened by tapping «№N/M» (Alisher, 05.10).
 * Built on the diagnostic report screen (App › Diagnostic — Part 1): summary
 * with a bar and numbered rows with a status mark on the right — no tabs
 * (Alisher, 05.10: «просто список»). Strict order — solved tasks open for review, the
 * current one opens, tasks ahead are locked. DRAFT, not wired to the modal.
 */
export const TaskListPage = ({ rows, onSelect, onBack }: Props) => {
  const count = (s: TaskStatus) => rows.filter((r) => r.status === s).length
  const correct = count('correct')
  const errors = count('error')
  const shown = count('shown')
  const solved = correct + errors + shown
  const total = rows.length
  const pct = (n: number) => `${(n / total) * 100}%`

  return (
    <section className={styles.page} aria-label="Задачи урока">
      <header className={styles.bar}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onBack}
          aria-label="Вернуться к задаче"
        >
          <ArrowBackIcon />
        </button>
        <h2 className={styles.barTitle}>Задачи урока</h2>
        <span className={styles.iconBtn} aria-hidden />
      </header>

      <div className={styles.body}>
        <div className={styles.summary}>
          <p className={styles.headline}>
            Решено: {solved}/{total}
          </p>
          <div className={styles.progress} aria-hidden>
            <span className={styles.pCorrect} style={{ width: pct(correct) }} />
            <span
              className={styles.pError}
              style={{ width: pct(errors + shown) }}
            />
          </div>
          <p className={styles.caption}>
            Верно {correct}, с ошибкой {errors}
            {shown ? `, ответ показан ${shown}` : ''}
          </p>
        </div>

        <List rows={rows} onSelect={onSelect} scrollToCurrent />
      </div>
    </section>
  )
}

const Mark = ({ status }: { status: TaskStatus }) => {
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
  if (status === 'shown') return <span className={styles.markShown}>ответ</span>
  if (status === 'current')
    return <span className={styles.markNow}>сейчас</span>
  return null
}

const List = ({
  rows,
  onSelect,
  scrollToCurrent,
}: {
  rows: TaskListRow[]
  onSelect: (num: number) => void
  scrollToCurrent?: boolean
}) => {
  const currentRef = useRef<HTMLButtonElement>(null)

  // Open on the current task, not on №1: in a long lesson it is far down.
  useEffect(() => {
    if (scrollToCurrent) currentRef.current?.scrollIntoView({ block: 'center' })
  }, [scrollToCurrent])

  return (
    <ol className={styles.list}>
      {rows.map((row) => (
        <li key={row.num}>
          <button
            type="button"
            className={clsx(styles.row, styles[row.status])}
            disabled={!isOpenable(row.status)}
            aria-current={row.status === 'current' ? 'step' : undefined}
            aria-label={`${row.num}. ${row.preview} — ${STATUS_LABEL[row.status]}`}
            ref={row.status === 'current' ? currentRef : undefined}
            onClick={() => onSelect(row.num)}
          >
            <span className={styles.text}>
              {row.num}. {row.preview}
              {row.isPenalty && (
                <span className={styles.extra}> · дополнительная</span>
              )}
            </span>
            <Mark status={row.status} />
          </button>
        </li>
      ))}
    </ol>
  )
}
