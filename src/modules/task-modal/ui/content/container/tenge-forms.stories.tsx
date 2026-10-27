import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'
import type { Task } from '@/types/api/task'

import lesson2205 from './storybook/data/lesson-2205.json'

/**
 * Lesson 2205 «Тенге. Монета и бумажные деньги» (2.5.8): four of its twelve
 * generators lie on the package's forms — «Какой стоимости данная купюра?»
 * (4_6_6_1, 4_6_6_2: text, the banknote, a field before «тг») is
 * complex.after; «Укажите бумажные деньги номиналом …» (4_6_6_3, 4_6_6_4:
 * banknotes as options) is test.plain. The other eight are «collect the
 * sum» (calculateByImage) — no form yet (Trainer/TaskUnavailable).
 */
const meta = {
  title: 'Trainer/Tenge',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

const lessonOn = (type: string) => {
  const tasks = (lesson2205.tasks as unknown as Task[]).map((t) => ({ ...t }))
  const current = tasks.find((t) => t.type === type)!
  return { tasks, activeTask: current, initialTasksCount: tasks.length }
}

/** 4_6_6_2 «Какой стоимости данная купюра?» — the 5000 banknote. */
export const BanknoteValue: Story = {
  args: {
    lesson: lessonOn('Elixir.Task_4_6_6_2'),
    language: 'russian',
    layout: 'wide',
    onCheck: fn(),
  },
  play: withOnDemandPlay(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Какой стоимости данная купюра?', undefined, {
      timeout: 10000,
    })
    await waitFor(() => {
      const field = canvasElement.querySelector('.task-modal [data-input]')
      if (!field?.contains(document.activeElement))
        throw new Error('the keys go elsewhere, not to the field')
    })
    await userEvent.keyboard('5000')
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(args.onCheck).toHaveBeenLastCalledWith('5000'))
  }),
}

/** 4_6_6_4 «Укажите бумажные деньги номиналом 2000 тенге» — four banknotes. */
export const PickBanknote: Story = {
  args: {
    lesson: lessonOn('Elixir.Task_4_6_6_4'),
    language: 'russian',
    layout: 'wide',
    onCheck: fn(),
  },
  play: withOnDemandPlay(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await canvas.findByText(
      /Укажите бумажные деньги номиналом 2000/,
      undefined,
      {
        timeout: 10000,
      },
    )
    // 5000, 2000, 20000, 10000: the second, by its letter
    await userEvent.keyboard('b')
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(args.onCheck).toHaveBeenLastCalledWith('B'))
  }),
}
