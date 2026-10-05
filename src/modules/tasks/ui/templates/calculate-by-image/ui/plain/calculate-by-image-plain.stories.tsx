import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

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

/**
 * Review shots: real taps, then the zone and the wire answer are checked.
 * Money (4_6_6_8): 200 × 4 + 1000 + 2000 × 2 = 5800, as asked.
 */
export const FilledMoney: Story = {
  // Review shot: the play runs on load, no «Run interaction» overlay.
  parameters: { skipRunPlayButton: true },
  args: { taskId: '4_6_6_8' },
  render: ({ taskId }) => (
    <StoryFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [coin200, note1000, note2000] = canvas.getAllByTestId('cbi-pool-item')
    for (const button of [
      coin200,
      coin200,
      coin200,
      coin200,
      note1000,
      note2000,
      note2000,
    ]) {
      await userEvent.click(button)
    }
    await expect(canvas.getAllByTestId('cbi-zone-item')).toHaveLength(7)
    ;(document.activeElement as HTMLElement | null)?.blur()
    await expect(canvas.getByTestId('cbi-review')).toHaveTextContent(
      '{"image":"","id":"coin2000"},{"image":"","id":"coin2000"}]}',
    )
  },
}

/** Family members share one id; the zone keeps the pictures that were tapped. */
export const FilledFamily: Story = {
  // Review shot: the play runs on load, no «Run interaction» overlay.
  parameters: { skipRunPlayButton: true },
  args: { taskId: '1_13_8_4' },
  render: ({ taskId }) => (
    <StoryFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pool = canvas.getAllByTestId('cbi-pool-item')
    await userEvent.click(pool[0])
    await userEvent.click(pool[5])
    await expect(canvas.getAllByTestId('cbi-zone-item')).toHaveLength(2)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
