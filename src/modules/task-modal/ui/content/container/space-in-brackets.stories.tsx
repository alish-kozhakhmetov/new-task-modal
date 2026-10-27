import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import { withOnDemandPlay } from '@/testing/with-on-demand-play'

import { lessonOf } from './storybook/live-fixtures'

/**
 * A space inside brackets (2.5.8, live test 27.10, lesson 2141 №6, 8, 12):
 * «(a + b) : 25» from the computer's keyboard became «((a)+b):25» and was
 * checked wrong — MathQuill's space left the brackets right after «a». Now
 * the answer is the same as typed without spaces. (A space still steps out
 * of a fraction — MathQuill's own key, which the synthetic keyboard here
 * doesn't reach; space-leaves-block.test.ts.)
 */
const meta = {
  title: 'Trainer/SpaceInBrackets',
  component: LessonTrainer,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', noPadding: true },
} satisfies Meta<typeof LessonTrainer>

export default meta
type Story = StoryObj<typeof meta>

const field = () =>
  waitFor(
    () => {
      const el = document.querySelector<HTMLElement>('.task-modal [data-input]')
      if (!el?.contains(document.activeElement))
        throw new Error('the keys go elsewhere, not to the field')
      return el
    },
    { timeout: 10000 },
  )

const fieldText = (el: HTMLElement) =>
  (el.querySelector('.mq-root-block')?.textContent ?? '').replace(/\u200b/g, '')

/** Empties the field as its own API does — the pupil would erase it. */
const clear = (el: HTMLElement) => {
  const MQ = window.MathQuill.getInterface(2) as unknown as (
    el: HTMLElement,
  ) => { latex: (tex: string) => void; focus: () => void } | null
  const mathField = MQ(el)
  mathField?.latex('')
  mathField?.focus()
}

const typeAnswer = async (keys: string) => {
  const el = await field()
  clear(el)
  await waitFor(() => expect(fieldText(el)).toBe(''))
  await userEvent.keyboard(keys)
  return { text: fieldText(el), answer: useStore.getState().answer }
}

/** 4_3_2_6 «Сумму букв … разделите на …» — text.plain */
export const SumDivided: Story = {
  args: {
    lesson: lessonOf('4_3_2_6'),
    language: 'russian',
    layout: 'wide',
    onCheck: fn(),
  },
  play: withOnDemandPlay(async ({ args }) => {
    const solid = await typeAnswer('(z+x):73')
    await expect(solid.text).toBe('(z+x):73')

    const spaced = await typeAnswer('(z + x) : 73')
    await expect(spaced.text).toBe('(z+x):73')
    await expect(spaced.answer).toBe(solid.answer)

    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(args.onCheck).toHaveBeenLastCalledWith(solid.answer),
    )
  }),
}
