import { useEffect, useRef } from 'react'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'

import styles from './task-list-layer.module.scss'
import { TaskListPage } from './task-list-page'
import { getTaskListStrings } from './task-list-strings'
import { TaskReview } from './task-review'
import {
  resultStatus,
  taskListRows,
  taskListSummary,
  type SolvedStatus,
  type TaskListRow,
} from './task-status'

interface Props {
  props: TaskModalProps
}

/**
 * The task list over the task, opened by «№N/M» in the header (Alisher,
 * 22.10). A sheet like the chat and the draft: over the whole task on the
 * phone, the task's column in the wide layout — the chat and the draft
 * columns stay. The task under it stays mounted: its fields, answer and
 * calculator are as they were when the pupil comes back.
 *
 * A state of the window (store `taskList`), not a route: the host's history
 * and the system «back» are not touched. Back: the arrow in the bar, Escape
 * on a computer.
 */
export const TaskListLayer = ({ props }: Props) => {
  const view = useStore((s) => s.taskList)
  const setTaskList = useStore((s) => s.setTaskList)
  const tasks = useStore((s) => s.state?.tasks)
  const activeTaskId = useStore((s) => s.state?.activeTask?.id)
  const layer = useRef<HTMLElement>(null)

  const screen = view?.screen
  const reviewId = view?.screen === 'review' ? view.taskId : undefined

  // Escape steps back like the arrow: from a task to the list, from the list
  // to the task. Caught before the task's own key handlers.
  useEffect(() => {
    if (!screen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.isComposing) return
      event.preventDefault()
      event.stopPropagation()
      setTaskList(screen === 'review' ? { screen: 'list' } : null)
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [screen, setTaskList])

  // A new screen takes the focus, so a keyboard or a screen reader starts
  // on it; nothing scrolls. iOS ignores it — opening does not rely on it.
  useEffect(() => {
    if (screen) layer.current?.focus({ preventScroll: true })
  }, [screen, reviewId])

  if (!view || !tasks?.length) return null

  const strings = getTaskListStrings(props.deps)
  const rows = taskListRows(tasks, activeTaskId)
  const reviewed = reviewId ? solvedRow(rows, reviewId) : null
  const toTask = () => setTaskList(null)
  const toList = () => setTaskList({ screen: 'list' })

  const onSelect = (row: TaskListRow) => {
    if (row.status === 'current') toTask()
    else if (resultStatus(row.task.result))
      setTaskList({ screen: 'review', taskId: row.task.id })
  }

  return (
    <section
      ref={layer}
      className={styles.layer}
      aria-label={reviewed ? strings.reviewTitle(reviewed.num) : strings.title}
      tabIndex={-1}
      data-testid="task-list"
    >
      {reviewed ? (
        <TaskReview
          key={reviewed.task.id}
          row={reviewed}
          strings={strings}
          deps={props.deps}
          onBack={toList}
          onCurrent={toTask}
        />
      ) : (
        <TaskListPage
          rows={rows}
          summary={taskListSummary(tasks)}
          strings={strings}
          deps={props.deps}
          onSelect={onSelect}
          onBack={toTask}
        />
      )}
    </section>
  )
}

/** The row on review, if it is still a solved task of this lesson. */
const solvedRow = (rows: TaskListRow[], taskId: string) => {
  const row = rows.find((r) => r.task.id === taskId)
  if (!row || row.status === 'current' || row.status === 'ahead') return null
  return row as TaskListRow & { status: SolvedStatus }
}
