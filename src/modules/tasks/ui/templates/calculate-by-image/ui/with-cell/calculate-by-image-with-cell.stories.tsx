import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

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
  /** Review panel under the task; off for presentation shots. */
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

export const Default: Story = {
  render: ({ taskId, panel }) => (
    <StoryFrame Template={Template} task={byId(taskId)} panel={panel} numeric />
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

/** Three rabbits get a carrot, then the field waits for the number. */
export const FilledRabbits: Story = {
  // Review shot: the play runs on load, no «Run interaction» overlay.
  parameters: { skipRunPlayButton: true },
  args: { taskId: '0_3_11_6' },
  render: ({ taskId, panel }) => (
    <StoryFrame Template={Template} task={byId(taskId)} panel={panel} numeric />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const give = canvas.getByTestId('cbi-pool-item')
    for (let i = 0; i < 3; i += 1) await userEvent.click(give)
    await expect(canvas.getAllByTestId('cbi-zone-item')).toHaveLength(5)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
