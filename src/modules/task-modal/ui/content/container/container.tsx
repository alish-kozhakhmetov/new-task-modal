/* eslint-disable react-hooks/static-components */
import clsx from 'clsx'
import { Fragment, Suspense, type RefObject } from 'react'

import { ErrorBoundary } from '@/lib/error-boundary/error-boundary'
import { useWordFormAgreement } from '@/modules/task-modal/model/hooks/layout/use-word-form-agreement'
import {
  useAppState,
  useStore,
} from '@/modules/task-modal/model/store/task-modal-store'
import { LegacyTaskRoot } from '@/modules/task-modal/ui/legacy-task-root'
import { DigitGroupingForTask } from '@/modules/tasks/lib/digit-grouping-for-task'
import { useTaskComponent } from '@/modules/tasks/model/component/use-task-component'
import type { TaskComponentProps } from '@/modules/tasks/model/types'

import type { TaskModalProps } from '../../../model/types/props'
import { TaskHints } from '../task-hints/task-hints'

import { ContainerSkeleton } from './container-skeleton'
import s from './container.module.scss'

interface Props {
  props: TaskModalProps
  isAdjusting: boolean
  taskProps: Omit<TaskComponentProps, 'task' | 'state' | 'deps' | 'answer'>
  ref: RefObject<HTMLDivElement | null>
}

export const TaskModalContainer = ({
  props,
  isAdjusting,
  taskProps,
  ref,
}: Props) => {
  const answer = useStore((s) => s.answer)
  const { activeTask } = useAppState()
  const { deps } = props

  const TaskComponent = useTaskComponent({
    activeTask,
  })

  // «5 лет» → «1 год» as the child types (4_1_8 and other word forms).
  useWordFormAgreement(ref, activeTask?.id)

  const availableTasks = useStore((s) => s.availableTasks)

  const isAzerbaijan = deps.global.isLanguageAzerbaijanSelected()

  const dir = deps.helpers.ArabicNumeralUtils.getDirection()

  const isTaskSupported = (() => {
    if (!activeTask) return true
    try {
      const key = activeTask.type.replace('Elixir.Task_', '')
      return Boolean(availableTasks?.[key])
    } catch {
      return true
    }
  })()

  return (
    <ErrorBoundary>
      <Suspense fallback={<ContainerSkeleton />}>
        {isAdjusting && <ContainerSkeleton />}

        <div
          className={clsx(
            s.container,
            isAzerbaijan && s.azerbaijani,
            isAdjusting && s.adjusting,
          )}
          ref={ref}
          dir={dir}
        >
          {!isTaskSupported && props.renderLegacyTask ? (
            <LegacyTaskRoot props={props} />
          ) : (
            // Keyed by task: «Далее» to a task of the same template used to
            // reuse the mounted template — MathJax kept the old typeset (raw
            // TeX on screen, alish-kozhakhmetov/qalan#20) and keyboard input
            // went to the previous task's field (#19). A fresh mount per task
            // typesets and registers fields from scratch.
            <Fragment key={activeTask.id}>
              <DigitGroupingForTask taskType={activeTask.type}>
                <TaskComponent
                  {...taskProps}
                  answer={answer}
                  deps={deps}
                  task={activeTask}
                />
              </DigitGroupingForTask>
              <TaskHints />
            </Fragment>
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
