import type { RefObject } from 'react'

import type { useLessonTest } from '@/modules/task-modal/model/test/use-lesson-test'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { TestTimer } from '@/modules/task-modal/ui/test/test-timer'
import { TopBar } from '@/ui/top-bar/top-bar'

import s from './header.module.scss'
import { LivesIndicator } from './lives-indicator/lives-indicator'
import { TasksNum } from './tasks-num/tasks-num'

interface Props {
  props: TaskModalProps
  ref: RefObject<HTMLDivElement | null>
  /** Lesson test: timer instead of lives (no attempts in a test). */
  testFlow?: ReturnType<typeof useLessonTest>
}

export const TaskModalHeader = ({ props, ref, testFlow }: Props) => {
  const { closeModal } = props

  return (
    <TopBar
      ref={ref}
      titleClassName={s.title}
      deps={props.deps}
      onClose={closeModal}
    >
      <TasksNum />
      {testFlow ? (
        <TestTimer onElapsed={() => void testFlow.finish()} />
      ) : (
        <LivesIndicator props={props} />
      )}
    </TopBar>
  )
}
