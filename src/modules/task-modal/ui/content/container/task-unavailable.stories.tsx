import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'

import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'
import type { Task } from '@/types/api/task'

import lesson2205 from './storybook/data/lesson-2205.json'

/**
 * A task the package has no template for (2.5.8, lesson 2205 «Тенге»: its
 * Task_4_6_6_8…15 «calculateByImage» — collect the banknotes). The window
 * stayed empty with «Проверить» waiting for an answer no field could give.
 * Now: a plain word, «Открыть в прежнем окне» (the host's `?old=true`) and
 * «Закрыть»; no check, no calculator.
 */
const meta = {
  title: 'Trainer/TaskUnavailable',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

const tasks = () =>
  (lesson2205.tasks as unknown as Task[]).map((t) => ({ ...t }))

/** Lesson 2205, the current task — 4_6_6_8, no template. */
const onCollectBanknotes = () => {
  const all = tasks()
  const current = all.find((t) => String(t.type) === 'Elixir.Task_4_6_6_8')!
  return { tasks: all, activeTask: current, initialTasksCount: all.length }
}

const play = withOnDemandPlay(async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await canvas.findByText(
    'Эта задача пока открывается только в прежнем окне',
    undefined,
    { timeout: 10000 },
  )
  const state = within(canvas.getByTestId('task-unavailable'))
  await expect(
    state.getByRole('button', { name: 'Открыть в прежнем окне' }),
  ).toBeVisible()
  await expect(state.getByRole('button', { name: 'Закрыть' })).toBeVisible()
  // nothing to check, nothing to type
  await waitFor(() =>
    expect(
      canvas.queryByRole('button', { name: 'Проверить' }),
    ).not.toBeInTheDocument(),
  )
  await expect(
    canvas.queryByRole('button', { name: 'Plus' }),
  ).not.toBeInTheDocument()
})

export const Wide: Story = {
  args: {
    lesson: onCollectBanknotes(),
    language: 'russian',
    layout: 'wide',
    onCheck: fn(),
  },
  play,
}

export const Phone: Story = {
  args: {
    lesson: onCollectBanknotes(),
    language: 'russian',
    onCheck: fn(),
  },
  play,
}
