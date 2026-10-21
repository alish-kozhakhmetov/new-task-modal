import { useEffect, useEffectEvent } from 'react'

import { collectMultiInputValues } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { toWireMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import type { Task } from '@/types/api/task'

import { isAnswerEmpty } from '../helpers'
import type { TaskModalRefs } from '../hooks/layout/use-refs'
import {
  getAppState,
  useSetAppState,
  useStore,
} from '../store/task-modal-store'
import type { TaskModalProps } from '../types/props'

import { useTestStore } from './test-store'

interface CheckTasksResponse {
  tasks: (Task & { answer?: string | null })[]
  /** Seconds left for the attempt. */
  timeLeft?: number | null
  checkLessonId: number
}

const hasSavedAnswer = (task: { answer?: unknown }) =>
  task.answer != null && task.answer !== ''

/**
 * Loads the attempt once — the same request the site's old CheckTaskModal makes
 * (`GET /lessons/{id}/tasks?checkLesson=true`). First task — the first without
 * an answer, else the first (as the old modal).
 */
export const useLoadLessonTest = (props: TaskModalProps) => {
  const setState = useSetAppState()
  const setTest = useTestStore((s) => s.set)

  const load = useEffectEvent(async () => {
    const { deps, hostProps } = props
    useTestStore.getState().reset()
    try {
      const res = (await deps.api.getCheckTasksByLessonId(
        hostProps.lessonId as number,
        hostProps.selfWorkId,
        hostProps.preparationType,
      )) as CheckTasksResponse
      const tasks = res.tasks
      const first = tasks.find((t) => !hasSavedAnswer(t)) ?? tasks[0]
      setState({
        tasks,
        activeTask: first,
        initialTasksCount: tasks.length,
        isLoading: false,
      })
      setTest({
        phase: 'running',
        checkLessonId: res.checkLessonId,
        answeredIds: tasks.filter(hasSavedAnswer).map((t) => String(t.id)),
        deadline: res.timeLeft ? Date.now() + res.timeLeft * 1000 : null,
      })
    } catch (error) {
      deps.alert.showError(error)
      props.closeModal()
    }
  })

  useEffect(() => {
    void load()
  }, [])
}

/** The answer in the wire format the API takes — the same as practice's check. */
const toWireAnswer = (props: TaskModalProps, refs: TaskModalRefs) => {
  const { helpers } = props.deps
  let answer = useStore.getState().answer
  if (typeof answer !== 'string') return answer
  answer = helpers.CyrillicTo.default_numeral(answer)
  const separator = helpers.TaskHelper.multipleTaskAnswerSeparator
  const inputs = refs.mathInput.current
  const multi =
    inputs && inputs.size > 1 ? collectMultiInputValues(inputs) : null
  return multi ? multi.join(separator) : toWireMultiAnswer(answer, separator)
}

/**
 * Lesson test flow. Answers are not checked: «Далее» saves the answer if there
 * is one (`PUT /checkLessonTasks/{id}/answers`) and opens the next task; an
 * empty answer skips the task. «Завершить» — saves the current answer and
 * finishes the attempt (`PUT /userCheckLessons/{id}`), the server returns the
 * percent. The timer finishes the attempt by itself at zero.
 */
export const useLessonTest = (props: TaskModalProps, refs: TaskModalRefs) => {
  const setState = useSetAppState()
  const setAnswer = useStore((s) => s.setAnswer)
  const setPrevAnswer = useStore((s) => s.setPrevAnswer)
  const test = useTestStore()
  const { deps, hostProps } = props

  const clearInput = () => {
    setAnswer('')
    setPrevAnswer(null)
    refs.mathInput.current?.forEach((field) => field.setLatex(''))
  }

  /** Saves the current answer; true — saved or nothing to save. */
  const saveCurrent = async () => {
    const { activeTask } = getAppState()
    if (isAnswerEmpty(useStore.getState().answer, deps)) return true
    const answer = toWireAnswer(props, refs)
    try {
      await deps.api.saveCheckLessonTaskUserAnswer(
        String(activeTask.id),
        answer,
      )
      const id = String(activeTask.id)
      const answered = useTestStore.getState().answeredIds
      if (!answered.includes(id)) test.set({ answeredIds: [...answered, id] })
      setState({
        tasks: (getAppState().tasks ?? []).map((t) =>
          t.id === activeTask.id ? { ...t, answer } : t,
        ),
      })
      return true
    } catch (error) {
      deps.alert.showError(error)
      return false
    }
  }

  /** Next unanswered task after the current one, wrapping; null — all answered. */
  const nextOpenTask = () => {
    const { tasks, activeTask } = getAppState()
    const list = tasks ?? []
    const answered = useTestStore.getState().answeredIds
    const at = list.findIndex((t) => t.id === activeTask.id)
    for (let k = 1; k <= list.length; k++) {
      const t = list[(at + k) % list.length]
      if (!answered.includes(String(t.id)) && t.id !== activeTask.id) return t
    }
    return null
  }

  const next = async () => {
    if (!(await saveCurrent())) return
    const { tasks, activeTask } = getAppState()
    const list = tasks ?? []
    const at = list.findIndex((t) => t.id === activeTask.id)
    const isLast = at === list.length - 1
    // Straight through the list; after the last — back to the skipped ones,
    // and when none are left — the finish question.
    const target = isLast ? nextOpenTask() : list[at + 1]
    if (!target) {
      test.set({ phase: 'confirm' })
      return
    }
    clearInput()
    setState({ activeTask: target })
  }

  const goTo = (task: Task) => {
    clearInput()
    setState({ activeTask: task })
    test.set({ phase: 'running' })
  }

  const finish = async () => {
    const { checkLessonId } = useTestStore.getState()
    if (checkLessonId == null) return
    test.set({ phase: 'finishing' })
    await saveCurrent()
    try {
      const res = (await deps.api.setCheckLessonAsFinished(
        checkLessonId,
        hostProps.applicationType,
      )) as { resultProgress: number }
      test.set({ phase: 'result', resultProgress: res.resultProgress })
      hostProps.onTestFinish?.({
        resultProgress: res.resultProgress,
        checkLessonId,
      })
    } catch (error) {
      deps.alert.showError(error)
      test.set({ phase: 'running' })
    }
  }

  const unanswered = () => {
    const answered = test.answeredIds
    return (getAppState().tasks ?? []).filter(
      (t) => !answered.includes(String(t.id)),
    )
  }

  return {
    test,
    next,
    goTo,
    finish,
    unanswered,
    nextOpenTask,
    setPhase: (phase: typeof test.phase) => test.set({ phase }),
  }
}
