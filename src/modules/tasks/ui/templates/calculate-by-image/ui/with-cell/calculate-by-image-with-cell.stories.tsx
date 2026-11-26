import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'

import { templateDocs } from '../../../shared/storybook/story-docs'
import { actUntilField, submit, typeNumber } from '../../lib/storybook/plays'
import {
  StoryFrame,
  TrainerFrame,
  type FixtureFile,
} from '../../lib/storybook/story-frame'
import readme from '../plain/README.md?raw'

import fixtures from './data/tasks.json'

import { CalculateByImageWithCell as Template } from '.'

const { tasks } = fixtures as unknown as FixtureFile
const ids = tasks.map((task) => task.type.replace('Elixir.Task_', ''))
const byId = (id: string) =>
  tasks.find((task) => task.type === `Elixir.Task_${id}`) ?? tasks[0]

interface Args {
  taskId: string
  panel: boolean
}

const meta = {
  title: 'Templates/CalculateByImage/withCell',
  args: { taskId: ids[0], panel: true },
  argTypes: {
    taskId: {
      control: 'select',
      options: ids,
      description: 'Реальный payload из data/tasks.json',
    },
  },
  parameters: templateDocs(readme),
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

/** Решить в окне: предметы, затем число на клавиатуре окна. */
export const Window: Story = {
  name: 'В окне — решить',
  parameters: { layout: 'fullscreen' },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
}

export const AllTasks: Story = {
  name: 'Все задачи',
  render: ({ panel }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-48)',
      }}
    >
      {tasks.map((task) => (
        <StoryFrame
          key={task.type}
          Template={Template}
          task={task}
          panel={panel}
        />
      ))}
    </div>
  ),
}

/** Действие сделано — появились вопрос и поле. */
export const StateFieldShown: Story = {
  name: 'Состояние: поле появилось',
  args: { taskId: '0_3_11_6' },
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement }) => {
    await actUntilField(canvasElement)
  },
}

export const StateCorrect: Story = {
  name: 'Состояние: верно',
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await actUntilField(canvasElement)
    await typeNumber(canvasElement, String(byId(args.taskId)._expected))
    await submit(canvasElement)
    const check = await within(canvasElement).findByRole('button', {
      name: 'Проверить',
    })
    await waitFor(() => expect(check).toBeDisabled())
  },
}

export const StateWrong: Story = {
  name: 'Состояние: неверно',
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await actUntilField(canvasElement)
    await typeNumber(
      canvasElement,
      String(Number(byId(args.taskId)._expected) + 1),
    )
    await submit(canvasElement)
    // one heart gone: the backend (port) answered «try again»
    await waitFor(() =>
      expect(useStore.getState().state?.activeTask.attemptsCount).toBe(1),
    )
  },
}

export const StateNoLives: Story = {
  name: 'Состояние: нет жизней',
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await actUntilField(canvasElement)
    const right = Number(byId(args.taskId)._expected)
    for (const delta of [1, 2, 3]) {
      await typeNumber(canvasElement, String(right + delta))
      await submit(canvasElement)
    }
    await waitFor(() =>
      expect(
        canvasElement.querySelector(
          '[data-template-id="calculateByImage.solution"]',
        ),
      ).not.toBeNull(),
    )
  },
}
