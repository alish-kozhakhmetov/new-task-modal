import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useMemo, useState } from 'react'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import { useTestStore } from '@/modules/task-modal/model/test/test-store'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { TaskModal } from '@/modules/task-modal/task-modal'
import { makeTrainerProps } from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import { withoutSolution } from '@/modules/tasks/ui/templates/text/lib/storybook/text-template-story'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import groups from '@/modules/tasks/ui/templates/text/ui/plain/data/groups.json'

/**
 * Lesson test (`mode="test"`): the package loads the attempt, answers are not
 * checked, «Завершить» returns the percent. API calls are mocked here with the
 * site's response shapes (package-parity.md, «Тест урока на сайте»).
 */
type Args = {
  /** Server's resultProgress after «Завершить». */
  resultProgress: number
  /** Open straight on: the task, the finish question or the result. */
  at: 'task' | 'confirm' | 'result'
  layout: 'phone' | 'wide'
}

const TASKS = (groups as unknown as { task: TextTask }[])
  .slice(0, 6)
  .map((g) => withoutSolution(g.task))

const LessonTestStory = ({ resultProgress, at, layout }: Args) => {
  const [key, setKey] = useState(0)
  const props = useMemo<TaskModalProps>(() => {
    const base = makeTrainerProps(TASKS[0])
    useStore.getState().setState({ ...base.state, tasks: null })
    return {
      ...base,
      mode: 'test',
      layout: layout === 'wide' ? 'wide' : undefined,
      state: { ...base.state, tasks: null },
      hostProps: {
        ...base.hostProps,
        lessonId: 2101,
        lessonTitle: 'Порядковый счёт',
        onRetakeTest: () => setKey((k) => k + 1),
        onRepeatPractice: () => {},
      },
      closeModal: () => setKey((k) => k + 1),
      deps: {
        ...base.deps,
        api: {
          ...base.deps.api,
          getCheckTasksByLessonId: () =>
            Promise.resolve({
              tasks: TASKS.map((t, i) =>
                at !== 'task' && i < 4 ? { ...t, answer: '1' } : t,
              ),
              timeLeft: 15 * 60,
              checkLessonId: 501,
            }),
          saveCheckLessonTaskUserAnswer: () => Promise.resolve({}),
          setCheckLessonAsFinished: () => Promise.resolve({ resultProgress }),
        },
      },
    }
  }, [resultProgress, at, layout])

  useEffect(() => {
    if (at === 'task') return
    // Jump straight to the state under review once the attempt is loaded.
    const unsub = useTestStore.subscribe((st, prev) => {
      if (prev.phase !== 'loading' || st.phase !== 'running') return
      if (at === 'confirm') st.set({ phase: 'confirm' })
      if (at === 'result') st.set({ phase: 'result', resultProgress })
    })
    return unsub
  }, [at, resultProgress, key])

  return (
    <div
      id="task-modal-root"
      style={{
        height: '100vh',
        position: 'relative',
        background: 'var(--bg-canvas)',
      }}
    >
      <TaskModal key={`${key}:${at}:${resultProgress}:${layout}`} {...props} />
    </div>
  )
}

const meta: Meta<Args> = {
  title: 'Trainer/Lesson test',
  component: LessonTestStory,
  parameters: { layout: 'fullscreen' },
  args: { resultProgress: 92, at: 'task', layout: 'phone' },
  argTypes: {
    at: { control: 'inline-radio', options: ['task', 'confirm', 'result'] },
    layout: { control: 'inline-radio', options: ['phone', 'wide'] },
    resultProgress: { control: { type: 'range', min: 0, max: 100 } },
  },
}
export default meta
type Story = StoryObj<Args>

export const Task: Story = {}
export const TaskWide: Story = { args: { layout: 'wide' } }
export const FinishQuestion: Story = { args: { at: 'confirm' } }
export const Result: Story = {
  args: { at: 'result', resultProgress: 92 },
}
export const ResultLow: Story = {
  args: { at: 'result', resultProgress: 45 },
}
