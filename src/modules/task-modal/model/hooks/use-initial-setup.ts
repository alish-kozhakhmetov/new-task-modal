import { useEffect, useEffectEvent, useState } from 'react'

import { getAvailableTasks } from '@/modules/tasks/lib/get-available-tasks'

import { useSetAppState, useStore } from '../store/task-modal-store'
import type { TaskModalProps } from '../types/props'

const availableTasks = getAvailableTasks()

export const useInitialSetup = (props: TaskModalProps) => {
  const [isSetupDone, setIsSetupDone] = useState(false)

  const setState = useSetAppState()
  const setAvailableTasks = useStore((s) => s.setAvailableTasks)
  const setAnswer = useStore((s) => s.setAnswer)
  const setPrevAnswer = useStore((s) => s.setPrevAnswer)
  const setIsAnswerChanged = useStore((s) => s.setIsAnswerChanged)
  const setTaskList = useStore((s) => s.setTaskList)
  const resetChatDraft = useStore((s) => s.resetChatDraft)

  const initialSetup = useEffectEvent(() => {
    void (async () => {
      setAvailableTasks(await availableTasks)
      setState(props.state)
      setAnswer('')
      setPrevAnswer(null)
      setIsAnswerChanged(false)
      setTaskList(null)
      resetChatDraft()
      setIsSetupDone(true)
    })()
  })

  useEffect(() => {
    initialSetup()
  }, [])

  return isSetupDone
}
