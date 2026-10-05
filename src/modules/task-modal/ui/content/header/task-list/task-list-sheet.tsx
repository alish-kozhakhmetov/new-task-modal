import clsx from 'clsx'

import CloseIcon from '@/assets/icons/close.svg'

import styles from './task-list-sheet.module.scss'
import { isOpenable, STATUS_LABEL, type TaskStatus } from './task-status'

export interface TaskListItem {
  /** 1-based number shown to the child */
  num: number
  status: TaskStatus
  /** extra task added after a mistake */
  isPenalty?: boolean
}

interface Props {
  items: TaskListItem[]
  onSelect: (num: number) => void
  onClose: () => void
}

const LEGEND: TaskStatus[] = ['correct', 'error', 'shown', 'current', 'ahead']

/**
 * Lesson tasks as a sheet over the task screen — opened by tapping «№N/M».
 * DRAFT for review in Storybook (Alisher, 05.10); not wired to the modal yet.
 */
export const TaskListSheet = ({ items, onSelect, onClose }: Props) => {
  const solved = items.filter(
    (i) =>
      i.status === 'correct' || i.status === 'error' || i.status === 'shown',
  ).length

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.scrim}
        aria-label="Закрыть список задач"
        onClick={onClose}
      />
      <section className={styles.sheet} role="dialog" aria-label="Задачи урока">
        <span className={styles.handle} aria-hidden />
        <header className={styles.head}>
          <div className={styles.titles}>
            <h2 className={styles.title}>Задачи урока</h2>
            <p className={styles.sub}>
              Решено {solved} из {items.length}
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </header>

        <ol className={styles.grid}>
          {items.map((item) => {
            const open = isOpenable(item.status)
            return (
              <li key={item.num}>
                <button
                  type="button"
                  className={clsx(styles.cell, styles[item.status])}
                  disabled={!open}
                  aria-current={item.status === 'current' ? 'step' : undefined}
                  aria-label={`Задача ${item.num}: ${STATUS_LABEL[item.status]}`}
                  onClick={() => onSelect(item.num)}
                >
                  {item.num}
                  {item.isPenalty && (
                    <span className={styles.penalty} aria-hidden />
                  )}
                </button>
              </li>
            )
          })}
        </ol>

        <ul className={styles.legend}>
          {LEGEND.map((s) => (
            <li key={s}>
              <span className={clsx(styles.dot, styles[s])} aria-hidden />
              {STATUS_LABEL[s]}
            </li>
          ))}
          {items.some((i) => i.isPenalty) && (
            <li>
              <span className={styles.penaltyNote} aria-hidden />
              Дополнительная — после ошибки
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
