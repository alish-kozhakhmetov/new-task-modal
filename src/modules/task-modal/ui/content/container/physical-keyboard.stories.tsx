import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { twoFieldTasks } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-fixture'
import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'

/**
 * The computer's keyboard (2.5.7, test.qalan.kz 23.10): the window opens with
 * its field lit, and the keys went nowhere until a click — a single-field
 * template's input was never focused. With a mouse the keys go to the first
 * field on entry and after «Далее»; Enter checks. On a phone nothing changes:
 * its own keyboard, no system one.
 */
const meta = {
  title: 'Trainer/PhysicalKeyboard',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

const fieldWithKeys = (canvasElement: HTMLElement) =>
  waitFor(() => {
    const field = canvasElement.querySelector<HTMLElement>(
      '.task-modal [data-input]',
    )
    if (!field) throw new Error('no answer field yet')
    if (!field.contains(document.activeElement))
      throw new Error('the keys go elsewhere, not to the field')
    return field
  })

/** The field as it reads, without MathQuill's zero-width placeholders. */
const fieldText = (field: HTMLElement) =>
  (field.querySelector('.mq-root-block')?.textContent ?? '').replace(
    /\u200b/g,
    '',
  )

export const Wide: Story = {
  args: {
    lesson: twoFieldTasks(),
    language: 'russian',
    layout: 'wide',
    onCheck: fn(),
  },
  play: withOnDemandPlay(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // three wrong answers from the keyboard, each checked with Enter
    let typed = ''
    for (const keys of ['50068', '1', '2']) {
      const field = await fieldWithKeys(canvasElement)
      await userEvent.keyboard(keys)
      typed += keys
      await waitFor(() => expect(fieldText(field)).toBe(typed))
      await userEvent.keyboard('{Enter}')
      await waitFor(() => expect(args.onCheck).toHaveBeenLastCalledWith(typed))
    }

    await userEvent.click(await canvas.findByRole('button', { name: 'Далее' }))
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Список задач' }),
      ).toHaveTextContent('№2/2'),
    )

    // the next task: the keys go to its field, no click
    const next = await fieldWithKeys(canvasElement)
    await userEvent.keyboard('3000005')
    await waitFor(() => expect(fieldText(next)).toBe('3000005'))
  }),
}
