import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import CloseIcon from '@/assets/icons/close.svg'
import HeartIcon from '@/assets/icons/header/heart.svg'

import { TaskListPage, type TaskListRow } from './task-list-page'
import { TaskListSheet, type TaskListItem } from './task-list-sheet'
import styles from './task-list.stories.module.scss'
import { STATUS_LABEL, type TaskStatus } from './task-status'

/**
 * DRAFT for Alisher's review (05.10): task list opened from «№N/M».
 * Static screen, not the live modal — the point is layout and states.
 * Lesson 20 tasks + 1 extra after a mistake; current is №14.
 */
const RESULTS: TaskStatus[] = [
  'correct',
  'correct',
  'correct',
  'correct',
  'correct',
  'correct',
  'correct',
  'correct',
  'correct',
  'error',
  'shown',
  'correct',
  'correct',
  'current',
  'ahead',
  'ahead',
  'ahead',
  'ahead',
  'ahead',
  'ahead',
  'ahead',
]
const ITEMS: TaskListItem[] = RESULTS.map((status, i) => ({
  num: i + 1,
  status,
  isPenalty: i === 20,
}))

// Real conditions of lesson 2120 (grade 4, «Чтение и запись чисел до 100 000»).
const PREVIEWS = [
  'Запишите цифрами число шестьдесят тысяч.',
  'Запишите цифрами число восемьдесят тысяч девять.',
  'Запишите цифрами число девяносто тысяч пятнадцать.',
  'Запишите цифрами число пятьдесят тысяч сто пятьдесят один.',
  'Запишите цифрами число двадцать две тысячи сто семьдесят четыре.',
  'Запишите цифрами число шестьдесят тысяч.',
  'Запишите цифрами число девяносто тысяч семь.',
  'Запишите цифрами число сорок тысяч восемьдесят четыре.',
  'Запишите цифрами число сорок тысяч двести тридцать семь.',
  'Запишите цифрами число сорок шесть тысяч восемьсот сорок шесть.',
  'Укажите правильное чтение числа 30000.',
  'Укажите правильное чтение числа 10009.',
  'Укажите правильное чтение числа 30075.',
  'Укажите правильное чтение числа 90797.',
  'Укажите правильное чтение числа 23249.',
  'Укажите правильное чтение числа 30000.',
  'Укажите правильное чтение числа 70001.',
  'Укажите правильное чтение числа 60026.',
  'Укажите правильное чтение числа 90771.',
  'Укажите правильное чтение числа 15427.',
  'Укажите правильное чтение числа 30075.',
]
const ROWS: TaskListRow[] = RESULTS.map((status, i) => ({
  num: i + 1,
  status,
  preview: PREVIEWS[i] ?? '',
  isPenalty: i === 20,
}))

const Header = ({ num, onOpen }: { num: number; onOpen?: () => void }) => (
  <div className={styles.header}>
    <span className={styles.side} aria-hidden />
    <button type="button" className={styles.num} onClick={onOpen}>
      №{num}/{ITEMS.length}
      <span className={styles.chevron} aria-hidden />
    </button>
    <span className={styles.lives}>
      <HeartIcon width={24} height={24} />
      <span className={styles.livesNum}>3</span>
    </span>
    <span className={styles.closeBtn}>
      <CloseIcon width={20} height={20} />
    </span>
  </div>
)

const CurrentTask = () => (
  <div className={styles.body}>
    <p className={styles.text}>
      Верблюд может выпить 11 061 л воды за неделю. Сколько литров воды
      останется из 99 430 л, если верблюд будет пить воду в течение 7 недель?
    </p>
    <div className={styles.row}>
      <span className={styles.field} />
      <span>л</span>
    </div>
  </div>
)

const Phone = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.phone}>{children}</div>
)

const Interactive = () => {
  const [open, setOpen] = useState(false)
  const [viewing, setViewing] = useState<number | null>(null)
  const current = 14
  if (viewing) {
    const status = RESULTS[viewing - 1]
    return (
      <Phone>
        <Header num={viewing} onOpen={() => setOpen(true)} />
        <ReviewBody
          num={viewing}
          status={status}
          onBack={() => setViewing(null)}
          current={current}
        />
        {open && (
          <TaskListPage
            rows={ROWS}
            onBack={() => setOpen(false)}
            onSelect={(n) => {
              setOpen(false)
              setViewing(n === current ? null : n)
            }}
          />
        )}
      </Phone>
    )
  }
  return (
    <Phone>
      <Header num={current} onOpen={() => setOpen(true)} />
      <CurrentTask />
      {open && (
        <TaskListSheet
          items={ITEMS}
          onClose={() => setOpen(false)}
          onSelect={(n) => {
            setOpen(false)
            setViewing(n === current ? null : n)
          }}
        />
      )}
    </Phone>
  )
}

const ReviewBody = ({
  num,
  status,
  current,
  onBack,
}: {
  num: number
  status: TaskStatus
  current: number
  onBack: () => void
}) => (
  <div className={styles.body}>
    <span className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
    <p className={styles.text}>Запишите цифрами число шестьдесят тысяч:</p>
    <p className={styles.note}>
      Просмотр решённой задачи — ответ здесь не вводится.
    </p>
    <button type="button" className={styles.back} onClick={onBack}>
      Вернуться к задаче №{current}
    </button>
    <span hidden>{num}</span>
  </div>
)

const meta = {
  title: 'Trainer/TaskList (draft)',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj

export const Closed: Story = {
  render: () => (
    <Phone>
      <Header num={14} />
      <CurrentTask />
    </Phone>
  ),
}

export const ListPage: Story = {
  render: () => (
    <Phone>
      <TaskListPage rows={ROWS} onBack={() => {}} onSelect={() => {}} />
    </Phone>
  ),
}

/** First draft (sheet) — rejected 05.10 in favour of a full page. */
export const SheetRejected: Story = {
  render: () => (
    <Phone>
      <Header num={14} />
      <CurrentTask />
      <TaskListSheet items={ITEMS} onClose={() => {}} onSelect={() => {}} />
    </Phone>
  ),
}

export const ReviewSolved: Story = {
  render: () => (
    <Phone>
      <Header num={3} />
      <ReviewBody num={3} status="correct" current={14} onBack={() => {}} />
    </Phone>
  ),
}

export const ReviewWithError: Story = {
  render: () => (
    <Phone>
      <Header num={10} />
      <ReviewBody num={10} status="error" current={14} onBack={() => {}} />
    </Phone>
  ),
}

export const Playground: Story = { render: () => <Interactive /> }
