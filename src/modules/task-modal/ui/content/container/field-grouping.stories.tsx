import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import {
  nextAfterMillions,
  writeFiftyThousand,
} from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-fixture'
import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'
import { DIGIT_GAP_ATTR } from '@/ui/math-input/group-field-digits'

/**
 * Digit grouping in the answer field (rule 100, Alisher 23.10: «почему до
 * сих пор нет отбивки?»). The real TaskModal: «50000» typed on the keys
 * reads «50 000» in the field — the condition's 0.14em gap — while the
 * store and the check request get «50000». «Millions» — seven digits,
 * «3 000 005». Play types on the on-screen keys, as a pupil does.
 */
const meta = {
  title: 'Trainer/FieldGrouping',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

const findField = (canvasElement: HTMLElement) =>
  waitFor(() => {
    const field = canvasElement.querySelector<HTMLElement>(
      '.task-modal [data-input] .mq-root-block',
    )
    if (!field) throw new Error('no answer field yet')
    return field
  })

const pressKeys = async (canvasElement: HTMLElement, digits: string) => {
  const keyOf = (digit: string) =>
    canvasElement.querySelector<HTMLElement>(`[data-calc-key="${digit}"]`)
  // the keyboard comes up with the task, a moment after the field
  await waitFor(() => {
    if (!keyOf('0')) throw new Error('no keyboard yet')
  })
  for (const digit of digits) {
    const key = keyOf(digit)
    if (!key) throw new Error(`no key «${digit}»`)
    await userEvent.click(key)
  }
}

/** The field as it reads: digits, a space where a class gap is. */
const shown = (root: HTMLElement) =>
  [...root.querySelectorAll('[mathquill-command-id]')]
    .map((n) => `${n.textContent}${n.hasAttribute(DIGIT_GAP_ATTR) ? ' ' : ''}`)
    .join('')

const typeAndCheck =
  (digits: string, grouped: string) =>
  async ({
    canvasElement,
    args,
  }: {
    canvasElement: HTMLElement
    args: { onCheck?: (answer: string) => void }
  }) => {
    const field = await findField(canvasElement)
    await pressKeys(canvasElement, digits)

    await waitFor(() => expect(shown(field)).toBe(grouped))
    // the gap is a margin, not a character: the field's text is solid
    await expect(field.textContent?.replace(/\u200b/g, '')).toBe(digits)
    await expect(useStore.getState().answer).toBe(digits)

    const button = await within(canvasElement).findByRole('button', {
      name: 'Проверить',
    })
    await waitFor(() => expect(button).toBeEnabled())
    await userEvent.click(button)
    await waitFor(() => expect(args.onCheck).toHaveBeenCalledWith(digits))
  }

export const FiftyThousandPhone: Story = {
  args: {
    lesson: writeFiftyThousand(),
    language: 'russian',
    layout: 'phone',
    onCheck: fn(),
  },
  play: withOnDemandPlay(typeAndCheck('50000', '50 000')),
}

export const FiftyThousandWide: Story = {
  args: { ...FiftyThousandPhone.args, layout: 'wide' },
}

export const MillionsPhone: Story = {
  args: {
    lesson: nextAfterMillions(),
    language: 'russian',
    layout: 'phone',
    onCheck: fn(),
  },
  play: withOnDemandPlay(typeAndCheck('3000005', '3 000 005')),
}

export const MillionsWide: Story = {
  args: { ...MillionsPhone.args, layout: 'wide' },
}
