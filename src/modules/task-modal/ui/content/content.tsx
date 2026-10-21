import '@/styles/_index.scss'
import clsx from 'clsx'

import { useCalcSetup } from '../../model/hooks/layout/use-calc-setup'
import { useInputFocus } from '../../model/hooks/layout/use-input-focus'
import { useTaskModalRefs } from '../../model/hooks/layout/use-refs'
import { isCalcForceHidden } from '../../model/lib/calc-visibility-param'
import { useAppState, useStore } from '../../model/store/task-modal-store'
import { useLessonTest } from '../../model/test/use-lesson-test'
import type { TaskModalProps } from '../../model/types/props'
import type { TaskModalModals } from '../../task-modal'
import { FinishSheet } from '../test/finish-sheet'
import { TestResult } from '../test/test-result'

import { TaskModalContainer } from './container/container'
import styles from './content.module.scss'
import { TaskModalControls } from './controls/controls'
import { TaskModalHeader } from './header/header'

interface Props {
  props: TaskModalProps
  modals: TaskModalModals
}

export const TaskModalContent = ({ props, modals }: Props) => {
  const { activeTask } = useAppState()
  const setAnswer = useStore((s) => s.setAnswer)
  const setIsAnswerChanged = useStore((s) => s.setIsAnswerChanged)

  const refs = useTaskModalRefs()
  const rawCalcState = useCalcSetup({
    refs,
    activeTask,
    isTesting: props.hostProps.isTesting,
  })
  const calcState = isCalcForceHidden(props.hostProps.location.search)
    ? { ...rawCalcState, isEnabled: false, isOpen: false }
    : rawCalcState
  const lastFocusedInput = useInputFocus({ refs, activeTask, calcState })
  const isTest = props.mode === 'test'
  const testFlow = useLessonTest(props, refs)

  const onChange = (value: string) => {
    setAnswer(value)
    setIsAnswerChanged(true)
  }

  const { root, header, mathInput, taskContainer } = refs

  const isAdjusting = false //isTransitioning || !calcState.isSetupFinished
  // useEffect(() => {
  //   console.log(
  //     `tasks, chapter: ${new URLSearchParams(window.location.search).get('chapterId')}, lesson: ${new URLSearchParams(window.location.search).get('lessonId')}`,
  //     tasks,
  //   )
  // }, [])

  // console.log({
  //   isAdjusting,
  //   isTaskLoaded,
  //   isTransitioning,
  // })
  if (isTest && testFlow.test.phase === 'result')
    return <TestResult props={props} />

  return (
    <>
      <div ref={root} className={clsx('task-modal', styles.container)}>
        <TaskModalHeader
          props={props}
          ref={header}
          testFlow={isTest ? testFlow : undefined}
        />

        <TaskModalContainer
          props={props}
          ref={taskContainer}
          taskProps={{ onChange, mathInput }}
          isAdjusting={isAdjusting}
        />

        <TaskModalControls
          props={props}
          lastFocusedInput={lastFocusedInput}
          refs={refs}
          calcState={calcState}
          modals={modals}
          isAdjusting={isAdjusting}
          testFlow={isTest ? testFlow : undefined}
        />

        {isTest &&
          (testFlow.test.phase === 'confirm' ||
            testFlow.test.phase === 'finishing') && (
            <FinishSheet flow={testFlow} />
          )}
      </div>
    </>
  )
}
