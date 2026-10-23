import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import {
  nextAfterMillions,
  writeEightyThousand,
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

/**
 * Three wrong answers bring the answer panel (2.5.7): the pupil's number and
 * the correct one read with the class gap of the field and the condition
 * (0.14em from five digits) and whole — on a phone «50068» was cut to
 * «500…»: the panel measured the TeX source before MathJax typeset it. The
 * labels are in the lesson's language.
 */
const answerPanel =
  (labels: { yours: string; correct: string }) =>
  async ({
    canvasElement,
    args,
  }: {
    canvasElement: HTMLElement
    args: { onCheck?: (answer: string) => void }
  }) => {
    const canvas = within(canvasElement)
    // «500», «5006», «50068»: each a new wrong answer, typed on the keys
    let typed = ''
    for (const keys of ['500', '6', '8']) {
      await findField(canvasElement)
      await pressKeys(canvasElement, keys)
      typed += keys
      const check = canvasElement.querySelector<HTMLButtonElement>(
        '.task-modal button[class*="primary"]',
      )
      if (!check) throw new Error('no check button')
      await waitFor(() => expect(check).toBeEnabled())
      await userEvent.click(check)
      await waitFor(() => expect(args.onCheck).toHaveBeenLastCalledWith(typed))
    }

    const yours = await canvas.findByTestId('user-answer-highlight')
    await expect(within(yours).getByText(labels.yours)).toBeVisible()
    // typeset: «50», the class gap, «068» — whole, no «…»
    await waitFor(() =>
      expect(typesetPieces(yours)).toEqual(['50', '_', '068']),
    )
    await expect(yours).not.toHaveTextContent('…')

    const correct = canvas.getByText(labels.correct).parentElement
    if (!correct) throw new Error('no correct answer row')
    await waitFor(() =>
      expect(typesetPieces(correct)).toEqual(['80', '_', '000']),
    )
  }

/** A typeset number as MathJax reads it out: digits, «_» for a class gap. */
const typesetPieces = (row: HTMLElement) => {
  const math = row.querySelector('mjx-assistive-mml math')
  if (!math) throw new Error('not typeset yet')
  return [...math.children].map((node) =>
    node.localName === 'mspace' ? '_' : (node.textContent ?? ''),
  )
}

const RU = { yours: 'Ваш ответ:', correct: 'Правильный ответ:' }
const KK = { yours: 'Сіздің жауабыңыз:', correct: 'Дұрыс жауап:' }

export const AnswerPanelPhone: Story = {
  args: {
    lesson: writeEightyThousand(),
    language: 'russian',
    layout: 'phone',
    onCheck: fn(),
  },
  play: withOnDemandPlay(answerPanel(RU)),
}

export const AnswerPanelPhoneKk: Story = {
  args: {
    ...AnswerPanelPhone.args,
    lesson: writeEightyThousand(),
    language: 'kk-cyrillic',
  },
  play: withOnDemandPlay(answerPanel(KK)),
}

export const AnswerPanelWide: Story = {
  args: {
    ...AnswerPanelPhone.args,
    lesson: writeEightyThousand(),
    layout: 'wide',
  },
  play: withOnDemandPlay(answerPanel(RU)),
}

export const AnswerPanelWideKk: Story = {
  args: {
    ...AnswerPanelWide.args,
    lesson: writeEightyThousand(),
    language: 'kk-cyrillic',
  },
  play: withOnDemandPlay(answerPanel(KK)),
}
