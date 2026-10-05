import type { Meta, StoryObj } from '@storybook/react-vite'

import { templateDocs } from '../../../shared/storybook/story-docs'
import { StoryFrame, type FixtureFile } from '../../lib/storybook/story-frame'
import readme from '../plain/README.md?raw'

import fixtures from './data/tasks.json'

import { CalculateByImageWithCell as Template } from '.'

const { tasks } = fixtures as unknown as FixtureFile
const ids = tasks.map((task) => task.type.replace('Elixir.Task_', ''))
const byId = (id: string) =>
  tasks.find((task) => task.type === `Elixir.Task_${id}`) ?? tasks[0]

interface Args {
  taskId: string
}

const meta = {
  title: 'Templates/CalculateByImage/withCell',
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
    <StoryFrame Template={Template} task={byId(taskId)} numeric />
  ),
}

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
        <StoryFrame key={task.type} Template={Template} task={task} numeric />
      ))}
    </div>
  ),
}
