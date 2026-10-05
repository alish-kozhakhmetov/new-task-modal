import type { Meta, StoryObj } from '@storybook/react-vite'

import { templateDocs } from '../../../shared/storybook/story-docs'
import { StoryFrame, type FixtureFile } from '../../lib/storybook/story-frame'

import fixtures from './data/tasks.json'
import readme from './README.md?raw'

import { CalculateByImagePlain as Template } from '.'

const { tasks } = fixtures as unknown as FixtureFile
const ids = tasks.map((task) => task.type.replace('Elixir.Task_', ''))
const byId = (id: string) =>
  tasks.find((task) => task.type === `Elixir.Task_${id}`) ?? tasks[0]

interface Args {
  taskId: string
}

const meta = {
  title: 'Templates/CalculateByImage/plain',
  args: { taskId: ids[0] },
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

export const Default: Story = {
  render: ({ taskId }) => (
    <StoryFrame Template={Template} task={byId(taskId)} />
  ),
}

/** Every real payload on one page — the review sheet. */
export const AllTasks: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-48)',
      }}
    >
      {tasks.map((task) => (
        <StoryFrame key={task.type} Template={Template} task={task} />
      ))}
    </div>
  ),
}

export const WithSolution: Story = {
  render: ({ taskId }) => (
    <StoryFrame Template={Template} task={byId(taskId)} withSolution />
  ),
}
