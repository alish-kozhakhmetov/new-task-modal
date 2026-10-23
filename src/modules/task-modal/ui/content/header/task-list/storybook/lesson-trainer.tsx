import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  useStore,
  type TaskListView,
} from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { TaskModal } from '@/modules/task-modal/task-modal'
import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'
import { getTaskComponent } from '@/modules/tasks/model/component/get-task-component'
import { makeTrainerProps } from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import type { Language } from '@/types/enums'

import type { LessonFixture } from './lesson-fixture'
import styles from './lesson-trainer.module.scss'

export type StoryLanguage = 'russian' | 'kk-cyrillic'

const FIELD: Record<StoryLanguage, 'rus' | 'kaz'> = {
  russian: 'rus',
  'kk-cyrillic': 'kaz',
}

/** The host's `Global.translate`: the language's field, else any filled one. */
const translateTo = (language: StoryLanguage) => (value: unknown) => {
  if (value && typeof value === 'object') {
    const text = (value as Record<string, unknown>)[FIELD[language]]
    if (typeof text === 'string' && text) return text
  }
  return pickTranslationText(value)
}

interface Props {
  lesson: LessonFixture
  language?: StoryLanguage
  layout?: 'phone' | 'wide'
  /** Open on the list or on a task's review, as after a tap on «№N/M». */
  view?: Exclude<TaskListView, null>
  /** Sees the answer of every check request, as the backend would. */
  onCheck?: (answer: string) => void
}

/**
 * The real TaskModal (not the Storybook copy of its parts) on a lesson of
 * several tasks, as the site mounts it: in a `position: relative` box of the
 * full height (controller.tsx). Phone — a 375 × 812 frame; its transform
 * makes the fixed sheets (chat, draft, task list) fill the frame, not the
 * page. Wide — the whole window, as the site gives it with `layout="wide"`.
 */
export const LessonTrainer = ({
  lesson,
  language = 'russian',
  layout = 'phone',
  view,
  onCheck,
}: Props) => {
  const [session, setSession] = useState(0)
  const frame = useRef<HTMLDivElement>(null)

  // The template map loads once, asynchronously, with the package; a modal
  // mounted before it shows an empty task until the next task (the site
  // mounts the modal after the lesson's request, long after it). Wait.
  const [isMapReady, setIsMapReady] = useState(
    () => getTaskComponent(lesson.activeTask) !== null,
  )
  useEffect(() => {
    if (isMapReady) return
    const timer = window.setInterval(() => {
      if (getTaskComponent(lesson.activeTask) !== null) setIsMapReady(true)
    }, 50)
    return () => window.clearInterval(timer)
  }, [isMapReady, lesson])

  const props = useMemo<TaskModalProps>(() => {
    // The check's mock answers the last wrong attempt with this solution.
    const base = makeTrainerProps({
      ...lesson.activeTask,
      solution: lesson.solution ?? lesson.activeTask.solution,
    } as unknown as TextTask)
    const translate = translateTo(language)
    return {
      ...base,
      activeTask: lesson.activeTask,
      state: {
        ...base.state,
        activeTask: lesson.activeTask,
        tasks: lesson.tasks,
        initialTasksCount: lesson.initialTasksCount,
      },
      deps: {
        ...base.deps,
        api: {
          ...base.deps.api,
          checkAnswer: (
            ...args: Parameters<typeof base.deps.api.checkAnswer>
          ) => {
            onCheck?.(String(args[0].answer ?? ''))
            return base.deps.api.checkAnswer(...args)
          },
        },
        global: {
          ...base.deps.global,
          getLanguage: () => language as Language,
          translate,
          translateTasks: translate,
        },
      },
      // «Закрыть» starts the lesson over, so the story stays usable.
      closeModal: () => setSession((n) => n + 1),
      layout: layout === 'wide' ? 'wide' : undefined,
    }
  }, [lesson, language, layout, onCheck])

  // TaskModal reads its state from the shared store once, on mount.
  useEffect(
    () => () => {
      useStore.setState({ state: null, taskList: null })
    },
    [],
  )

  // The modal sets itself up asynchronously and closes the list while doing
  // so; open the asked screen once the task is on screen and the fonts are
  // in, as when a pupil taps «№N/M» (the answer panel measures its text
  // once, by the layout it finds). The task is on screen: its field, or —
  // a choice task has none — a second after the counter.
  useEffect(() => {
    if (!view) return
    let raf = 0
    let cancelled = false
    let counterSeenAt = 0
    const openWhenReady = () => {
      if (cancelled) return
      const root = frame.current
      if (root?.querySelector('[data-testid="tasks-num"]'))
        counterSeenAt ||= performance.now()
      const isTaskShown =
        Boolean(root?.querySelector('.task-modal [data-input]')) ||
        (counterSeenAt > 0 && performance.now() - counterSeenAt > 1000)
      if (isTaskShown) useStore.getState().setTaskList(view)
      else raf = requestAnimationFrame(openWhenReady)
    }
    void document.fonts.ready.then(() => {
      raf = requestAnimationFrame(openWhenReady)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [view, session])

  return (
    <div
      ref={frame}
      className={clsx(layout === 'wide' ? styles.wide : styles.phone)}
      data-testid="lesson-frame"
    >
      <div className={styles.root}>
        {isMapReady && <TaskModal key={session} {...props} />}
      </div>
    </div>
  )
}
