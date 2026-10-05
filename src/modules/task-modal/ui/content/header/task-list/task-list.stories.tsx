import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import CloseIcon from '@/assets/icons/close.svg'
import HeartIcon from '@/assets/icons/header/heart.svg'

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

export const Open: Story = {
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
