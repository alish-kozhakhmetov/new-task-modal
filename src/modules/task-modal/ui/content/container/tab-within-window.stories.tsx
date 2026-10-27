import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import ReactModal from 'react-modal'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'

import { lessonOf } from './storybook/live-fixtures'

/**
 * Tab from the computer's keyboard (2.5.8, live test 27.10, lesson 2120
 * №22–25, `answerCell.multi.stack.n2.plain`): Tab from the first field went
 * to «Список задач», then «Закрыть», and stuck. The site wraps the window in
 * react-modal, whose Tab trap counts MathQuill's 1px textarea as hidden; on
 * Safari (and a headless Chrome) it then jumped to its first button. Inside
 * the same react-modal here: Tab walks the fields round, Shift+Tab back, and
 * from a button the focus never leaves the window.
 */
const meta = {
  title: 'Trainer/TabWithinWindow',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
  render: (args) => <InHostModal {...args} />,
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

/** The site's TaskModalWrapper: a react-modal around the window. */
const InHostModal = (props: ComponentProps<typeof LessonTrainer>) => (
  <ReactModal
    isOpen
    ariaHideApp={false}
    style={{ content: { inset: 0, padding: 0 } }}
  >
    <LessonTrainer {...props} />
  </ReactModal>
)

const fields = () => [
  ...document.querySelectorAll<HTMLElement>('.task-modal [data-input]'),
]

/** The field the keys go to now. */
const fieldWithKeys = () =>
  fields().findIndex((field) => field.contains(document.activeElement))

const fieldText = (field: HTMLElement) =>
  (field.querySelector('.mq-root-block')?.textContent ?? '').replace(
    /\u200b/g,
    '',
  )

const isInWindow = () =>
  Boolean(document.activeElement?.closest('[data-ntm-root]'))

export const TwoFields: Story = {
  args: {
    lesson: lessonOf('4_1_70', '4_1_71'),
    language: 'russian',
    layout: 'wide',
    onCheck: fn(),
  },
  play: withOnDemandPlay(async () => {
    await waitFor(() => expect(fieldWithKeys()).toBe(0), { timeout: 10000 })
    await userEvent.keyboard('47599')

    await userEvent.keyboard('{Tab}')
    await waitFor(() => expect(fieldWithKeys()).toBe(1))
    await userEvent.keyboard('91072')

    // round: from the last field to the first, and back
    await userEvent.keyboard('{Tab}')
    await waitFor(() => expect(fieldWithKeys()).toBe(0))
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    await waitFor(() => expect(fieldWithKeys()).toBe(1))
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    await waitFor(() => expect(fieldWithKeys()).toBe(0))

    const [first, second] = fields()
    await expect(fieldText(first)).toBe('47599')
    await expect(fieldText(second)).toBe('91072')

    // from a button of the window Tab stays in it
    document.querySelector<HTMLElement>('[aria-label="Закрыть"]')?.focus()
    for (let i = 0; i < 4; i += 1) {
      await userEvent.keyboard('{Tab}')
      await expect(isInWindow()).toBe(true)
    }
    for (let i = 0; i < 4; i += 1) {
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
      await expect(isInWindow()).toBe(true)
    }
  }),
}
