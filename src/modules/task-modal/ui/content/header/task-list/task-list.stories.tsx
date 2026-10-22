import type { Meta, StoryObj } from '@storybook/react-vite'

import { midLesson, secondTask } from './storybook/lesson-fixture'
import { LessonTrainer } from './storybook/lesson-trainer'

const meta = {
  title: 'Trainer/TaskList',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

export const Phone: Story = {
  args: { lesson: midLesson(), language: 'russian', layout: 'phone' },
}

export const PhoneKk: Story = {
  args: { lesson: midLesson(), language: 'kk-cyrillic', layout: 'phone' },
}

export const Wide: Story = {
  args: { lesson: midLesson(), language: 'russian', layout: 'wide' },
}

export const WideKk: Story = {
  args: { lesson: midLesson(), language: 'kk-cyrillic', layout: 'wide' },
}

export const Scenario: Story = {
  args: { lesson: secondTask(), language: 'russian', layout: 'phone' },
}
