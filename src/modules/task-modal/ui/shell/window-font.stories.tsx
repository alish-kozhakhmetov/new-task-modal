import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'

import { lessonOf } from '@/modules/task-modal/ui/content/container/storybook/live-fixtures'
import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'

/**
 * The window's own font for the chat too (2.5.8): the chat is the task's
 * neighbour inside the shell, not its child, and took the host's — Gilroy on
 * the old site. Here the page is on a serif; the chat's title and its
 * message read Halvar, as the task does.
 */
const meta = {
  title: 'Trainer/WindowFont',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

const fontOf = (el: Element) => getComputedStyle(el).fontFamily

export const ChatOnHostFont: Story = {
  args: {
    lesson: lessonOf('4_1_70'),
    language: 'russian',
    layout: 'wide',
    onCheck: fn(),
  },
  play: withOnDemandPlay(async ({ canvasElement }) => {
    const hostFont = document.createElement('style')
    hostFont.textContent = 'html, body { font-family: Georgia, serif; }'
    document.head.append(hostFont)
    try {
      const canvas = within(canvasElement)
      const message = await canvas.findByText(
        /Трудности с задачей/,
        undefined,
        {
          timeout: 10000,
        },
      )
      await waitFor(() => expect(fontOf(document.body)).toContain('Georgia'))
      await expect(fontOf(message)).toContain('Halvar Mittel')
      for (const title of canvas.getAllByText('AI-чат'))
        await expect(fontOf(title)).toContain('Halvar Mittel')
    } finally {
      hostFont.remove()
    }
  }),
}
