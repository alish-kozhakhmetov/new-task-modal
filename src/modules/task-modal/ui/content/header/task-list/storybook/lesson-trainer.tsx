import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { TaskModal } from '@/modules/task-modal/task-modal'
import { pickTranslationText } from '@/modules/tasks/lib/translation-utils'
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
}: Props) => {
  const [session, setSession] = useState(0)

  const props = useMemo<TaskModalProps>(() => {
    const base = makeTrainerProps(lesson.activeTask as unknown as TextTask)
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
  }, [lesson, language, layout])

  // TaskModal reads its state from the shared store once, on mount.
  useEffect(
    () => () => {
      useStore.setState({ state: null })
    },
    [],
  )

  return (
    <div className={clsx(layout === 'wide' ? styles.wide : styles.phone)}>
      <div className={styles.root}>
        <TaskModal key={session} {...props} />
      </div>
    </div>
  )
}
