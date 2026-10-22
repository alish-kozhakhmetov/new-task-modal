import { useCallback, useEffect, useRef } from 'react'

import {
  useAppState,
  useStore,
} from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import { getTaskListStrings } from '../task-list/task-list-strings'

import styles from './tasks-num.module.scss'

interface Props {
  deps: TaskModalDependencies
}

/**
 * «№N/M» — and the way to the lesson's task list (Alisher, 22.10). A button
 * that looks exactly as the counter did: not one pixel moves. Opens on the
 * click itself, not on focus (iOS gives no programmatic focus).
 */
export const TasksNum = ({ deps }: Props) => {
  const { activeTask, tasks, initialTasksCount } = useAppState()
  const isListOpen = useStore((s) => s.taskList !== null)
  const setTaskList = useStore((s) => s.setTaskList)
  const button = useRef<HTMLButtonElement>(null)

  // Back from the list, the focus it held is gone with it: return it here,
  // where the keyboard left off. Elsewhere already — leave it.
  const wasOpen = useRef(isListOpen)
  useEffect(() => {
    if (wasOpen.current && !isListOpen) {
      const active = document.activeElement
      if (!active || active === document.body)
        button.current?.focus({ preventScroll: true })
    }
    wasOpen.current = isListOpen
  }, [isListOpen])

  // Enter on the counter opens the list, as on any button. The actions bar
  // hears Enter on the whole task to check the answer (actions.tsx) — that is
  // for the field, not for this button; stopped here, before it gets there.
  const attach = useCallback((el: HTMLButtonElement | null) => {
    button.current = el
    if (!el) return
    const keepEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter') event.stopPropagation()
    }
    el.addEventListener('keydown', keepEnter)
    return () => el.removeEventListener('keydown', keepEnter)
  }, [])

  if (!tasks?.length) return null

  const index = tasks.findIndex((task) => task.id === activeTask?.id)
  if (index === -1) return null

  const taskNum = `№${index + 1}`
  const tasksCount = tasks.length
  const hasAdditionalTasks = tasksCount > initialTasksCount

  return (
    <button
      ref={attach}
      type="button"
      className={styles.button}
      data-testid="tasks-num"
      aria-label={getTaskListStrings(deps).openList}
      onClick={() => setTaskList({ screen: 'list' })}
    >
      {taskNum}

      {'/'}

      {hasAdditionalTasks ? (
        <>
          <span className={styles.strikethrough}>{initialTasksCount}</span>{' '}
          {tasksCount}
        </>
      ) : (
        tasksCount
      )}
    </button>
  )
}
