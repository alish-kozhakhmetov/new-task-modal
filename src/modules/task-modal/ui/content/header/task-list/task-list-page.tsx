import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import ArrowBackIcon from '@/assets/icons/header/arrow-back.svg'

import styles from './task-list-page.module.scss'
import { isOpenable, STATUS_LABEL, type TaskStatus } from './task-status'

export interface TaskListRow {
  /** 1-based number shown to the child */
  num: number
  status: TaskStatus
  /** first line of the condition, plain text */
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
 * Lesson tasks on a full screen, opened by tapping «№N/M» (Alisher, 05.10):
 * a separate page, back arrow returns to the current task. Strict order —
 * solved tasks open for review, the current one opens, tasks ahead are locked.
 * DRAFT for review in Storybook; not wired to the modal yet.
 */
export const TaskListPage = ({ rows, onSelect, onBack }: Props) => {
  const currentRef = useRef<HTMLButtonElement>(null)

  // Open on the current task, not on №1: in a long lesson it is far down.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  const solved = rows.filter(
    (r) =>
      r.status === 'correct' || r.status === 'error' || r.status === 'shown',
  ).length

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
        <div className={styles.titles}>
          <h2 className={styles.title}>Задачи урока</h2>
          <p className={styles.sub}>
            Решено {solved} из {rows.length}
          </p>
        </div>
        <span className={styles.iconBtn} aria-hidden />
      </header>

      <ol className={styles.list}>
        {rows.map((row) => {
          const open = isOpenable(row.status)
          return (
            <li key={row.num}>
              <button
                type="button"
                className={clsx(styles.row, styles[row.status])}
                disabled={!open}
                aria-current={row.status === 'current' ? 'step' : undefined}
                ref={row.status === 'current' ? currentRef : undefined}
                onClick={() => onSelect(row.num)}
              >
                <span className={styles.num}>{row.num}</span>
                <span className={styles.text}>
                  <span className={styles.preview}>{row.preview}</span>
                  <span className={styles.state}>
                    {STATUS_LABEL[row.status]}
                    {row.isPenalty && ' · дополнительная после ошибки'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
