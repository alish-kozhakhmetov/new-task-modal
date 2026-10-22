import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { withOnDemandPlay } from '@/testing/with-on-demand-play'

import { midLesson, secondTask } from './storybook/lesson-fixture'
import { LessonTrainer } from './storybook/lesson-trainer'

/**
 * The lesson's task list, opened by «№N/M» in the task header (Alisher,
 * 22.10). The real TaskModal on lesson 2121: «Phone» and «Wide» — the task
 * screen itself (the header baselines of task-list.visual.spec.ts), «…List»
 * — the list open, «Review…» — a solved task on review, «ScenarioFlow» — the
 * whole way: №2/15 → list → №1 → back → the current task.
 */
const meta = {
  title: 'Trainer/TaskList',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

const mid = midLesson()
const LIST = { screen: 'list' } as const
const review = (num: number) =>
  ({ screen: 'review', taskId: mid.tasks[num - 1].id }) as const

export const Phone: Story = {
  args: { lesson: mid, language: 'russian', layout: 'phone' },
}

export const PhoneKk: Story = {
  args: { lesson: mid, language: 'kk-cyrillic', layout: 'phone' },
}

export const Wide: Story = {
  args: { lesson: mid, language: 'russian', layout: 'wide' },
}

export const WideKk: Story = {
  args: { lesson: mid, language: 'kk-cyrillic', layout: 'wide' },
}

export const Scenario: Story = {
  args: { lesson: secondTask(), language: 'russian', layout: 'phone' },
}

/** 16 tasks of 15: three solved on an earlier visit, four now, an extra one. */
export const PhoneList: Story = {
  args: { ...Phone.args, lesson: mid, view: LIST },
}

export const PhoneListKk: Story = {
  args: { ...PhoneKk.args, lesson: mid, view: LIST },
}

/** The task's column: the chat and the draft columns stay. */
export const WideList: Story = {
  args: { ...Wide.args, lesson: mid, view: LIST },
}

export const WideListKk: Story = {
  args: { ...WideKk.args, lesson: mid, view: LIST },
}

/** №7: wrong after three attempts — the pupil's answer and the solution. */
export const ReviewError: Story = {
  args: { ...Phone.args, lesson: mid, view: review(7) },
}

/** №6: right on the first try — the fields as the pupil filled them. */
export const ReviewCorrect: Story = {
  args: { ...Phone.args, lesson: mid, view: review(6) },
}

/** №5: answer shown — the solution, no answer of the pupil's. */
export const ReviewShown: Story = {
  args: { ...Phone.args, lesson: mid, view: review(5) },
}

/** №2: solved on an earlier visit — the backend sends no condition. */
export const ReviewEarlier: Story = {
  args: { ...Phone.args, lesson: mid, view: review(2) },
}

export const ReviewErrorKk: Story = {
  args: { ...PhoneKk.args, lesson: mid, view: review(7) },
}

export const WideReview: Story = {
  args: { ...Wide.args, lesson: mid, view: review(7) },
}

/** Tap «№2/15» → the list → №1 → back → the current task. */
export const ScenarioFlow: Story = {
  args: { lesson: secondTask(), language: 'russian', layout: 'phone' },
  play: withOnDemandPlay(async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const counter = await canvas.findByRole('button', { name: 'Список задач' })
    await expect(counter).toHaveTextContent('№2/15')
    await userEvent.click(counter)

    const list = await canvas.findByTestId('task-list')
    await expect(within(list).getByText('Решено: 1/15')).toBeVisible()
    await expect(
      within(list).getByRole('button', { name: /^№3 — Впереди$/ }),
    ).toBeDisabled()

    await userEvent.click(
      within(list).getByRole('button', { name: /^№1 — Решена верно$/ }),
    )
    await expect(
      await canvas.findByTestId('task-review-status'),
    ).toHaveTextContent('Решена верно')

    await userEvent.click(
      canvas.getByRole('button', { name: 'К списку задач' }),
    )
    await userEvent.click(
      await canvas.findByRole('button', { name: /^№2 — Сейчас решаешь$/ }),
    )

    await waitFor(() =>
      expect(canvas.queryByTestId('task-list')).not.toBeInTheDocument(),
    )
    await expect(
      canvas.getByRole('button', { name: 'Список задач' }),
    ).toHaveTextContent('№2/15')
  }),
}
