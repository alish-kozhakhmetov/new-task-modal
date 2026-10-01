import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useMemo, useRef, useState } from 'react'
import { expect, within } from 'storybook/test'

import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import { TaskModalProviders } from '@/modules/task-modal/providers'
import { getTaskComponent } from '@/modules/tasks/model/component/get-task-component'
import {
  makeTrainerProps,
  resetTrainerSession,
} from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import formulaFixture from '@/modules/tasks/ui/templates/formula/ui/plain/data/task.json'
import beforeFixture from '@/modules/tasks/ui/templates/text/ui/before/data/task.json'
import fixture from '@/modules/tasks/ui/templates/text/ui/plain/data/task.json'
import { applyTrainerState } from '@/modules/trainer/lib/apply-trainer-state'
import { runPlayStep } from '@/testing/play-step'
import { withTrackedPlay } from '@/testing/with-tracked-play'
import type { Task } from '@/types/api/task'

import { TaskModalContainer } from './container'
import { ContainerSkeleton } from './container-skeleton'

injectFonts()

const defaultTask = fixture as unknown as TextTask

const frameStyle = {
  width: 375,
  maxWidth: '100%',
  height: 420,
  margin: '0 auto',
  background: 'var(--bg-subtle, #f5f5f5)',
  borderRadius: 12,
  overflow: 'hidden',
} as const

const waitForTemplateMap = async (activeTask: Task) => {
  for (let i = 0; i < 50; i += 1) {
    if (getTaskComponent(activeTask)) return
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

const cleanupStore = () => {
  useStore.setState({
    state: null,
    answer: '',
    prevAnswer: null,
    isTaskLoaded: false,
    isAnswerChanged: false,
    isTransitioning: false,
    availableTasks: null,
  })
}

interface HostProps {
  mode: 'input' | 'solution'
  isAdjusting?: boolean
  /** After mount, move to a second task of the same template (as «Далее» does). */
  switchToNext?: 'formula' | 'before'
}

/**
 * «Далее» to the next task of the same formula template, whose formula comes
 * with TeX delimiters — the case in alish-kozhakhmetov/qalan#20, where the
 * tester saw «\(64 \approx\)» raw after moving on, but not on opening the
 * task directly.
 */
const formulaTask = formulaFixture as unknown as TextTask
const nextFormulaTask = {
  ...formulaTask,
  id: 'next-task-same-template',
  solution: null,
  result: null,
  position: (formulaTask.position ?? 0) + 1,
  description: { ...formulaTask.description, content: '\\(64 \\approx\\)' },
} as unknown as TextTask

/** Same, but the TeX sits in the label before the field (text.before). */
const beforeTask = beforeFixture as unknown as TextTask
const LANGS = ['rus', 'kaz', 'eng', 'uzb', 'aze', 'kgz']
const nextBeforeTask = {
  ...beforeTask,
  id: 'next-before-same-template',
  solution: null,
  result: null,
  position: (beforeTask.position ?? 0) + 1,
  answerInput: {
    ...(beforeTask as unknown as { answerInput: object }).answerInput,
    before: Object.fromEntries(LANGS.map((l) => [l, '\\(64 \\approx\\)'])),
  },
} as unknown as TextTask

const TaskContainerHost = ({
  mode,
  isAdjusting = false,
  switchToNext,
}: HostProps) => {
  const task =
    switchToNext === 'formula'
      ? formulaTask
      : switchToNext === 'before'
        ? beforeTask
        : defaultTask
  const next = switchToNext === 'formula' ? nextFormulaTask : nextBeforeTask
  const props = useMemo(() => makeTrainerProps(task), [task])
  const [ready, setReady] = useState(false)
  const mathInput = useRef(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const setAnswer = useStore((s) => s.setAnswer)
  const setIsAnswerChanged = useStore((s) => s.setIsAnswerChanged)
  const activeTask = useStore((s) => s.state?.activeTask)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      await waitForTemplateMap(task as unknown as Task)
      if (cancelled) return

      if (mode === 'solution') {
        applyTrainerState('solution', task)
      } else {
        resetTrainerSession(task)
      }

      useStore.getState().setAvailableTasks({
        [task.type.replace('Elixir.Task_', '')]: true,
      })

      if (!cancelled) setReady(true)

      if (switchToNext) {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        const state = useStore.getState().state
        if (!cancelled && state) {
          useStore.getState().setState({
            activeTask: next as unknown as Task,
            tasks: [task as unknown as Task, next as unknown as Task],
          })
        }
      }
    })()

    return () => {
      cancelled = true
      cleanupStore()
    }
  }, [mode, switchToNext, task, next])

  if (!ready || !activeTask) return null

  return (
    <TaskModalProviders>
      <div style={frameStyle}>
        <TaskModalContainer
          props={props}
          ref={containerRef}
          isAdjusting={isAdjusting}
          taskProps={{
            mathInput,
            onChange: (value) => {
              setAnswer(value)
              setIsAnswerChanged(true)
            },
          }}
        />
      </div>
    </TaskModalProviders>
  )
}

const PLAY_CASES = [
  { id: 'rendersTask', label: 'Renders task content' },
] as const

const meta = {
  title: 'Trainer/TaskContainer',
  component: TaskModalContainer,
  parameters: {
    docs: {
      description: {
        component:
          'Область задания в модалке тренажёра: условие, поле ответа и подсказки. При нехватке высоты скроллится и может спрятать калькулятор.',
      },
    },
  },
} satisfies Meta<typeof TaskModalContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    playCases: [...PLAY_CASES],
  },
  render: () => <TaskContainerHost mode="input" />,
  play: withTrackedPlay([...PLAY_CASES], async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await runPlayStep('rendersTask', 'Renders task content', async () => {
      await expect(
        await canvas.findByText(/десять тысяч|10000|Запишите/i),
      ).toBeVisible()
    })
  }),
}

export const WithSolution: Story = {
  name: 'With solution',
  parameters: {
    docs: {
      description: {
        story:
          'Режим после показа решения: в контейнере рендерится solution-вариант шаблона (панель ответа + объяснение).',
      },
    },
  },
  render: () => <TaskContainerHost mode="solution" />,
}

export const Loading: Story = {
  name: 'Loading skeleton',
  parameters: {
    docs: {
      description: {
        story:
          '`ContainerSkeleton` — плейсхолдер на время загрузки / adjust layout.',
      },
    },
  },
  render: () => (
    <div style={frameStyle}>
      <ContainerSkeleton />
    </div>
  ),
}

/** «Далее» to a task of the same template: the condition must be typeset again. */
export const SwitchToNextFormula: Story = {
  args: {} as never,
  render: () => <TaskContainerHost mode="input" switchToNext="formula" />,
}

/** «Далее» to a text.before task whose label before the field is TeX. */
export const SwitchToNextBefore: Story = {
  args: {} as never,
  render: () => <TaskContainerHost mode="input" switchToNext="before" />,
}
