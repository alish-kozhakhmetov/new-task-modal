import type { Meta, StoryObj } from '@storybook/react-vite'

import { NumberLinePart } from './number-line-part'

/**
 * The number line of `complex` (part type 20). Grade 4 has two such tasks,
 * 4_12_3_1 and 4_12_3_2, both from 0; the negative line is the case from
 * rule 34 — labels below zero carry a real minus, not a hyphen.
 */
const meta = {
  title: 'Figures/NumberLine',
  component: NumberLinePart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NumberLinePart>

export default meta
type Story = StoryObj<typeof meta>

/** 4_12_3_1: 0…7, numbers under every tick. */
export const FromZero: Story = {
  args: {
    part: {
      type: 20,
      tickStep: 1,
      stepSize: 20,
      minPosition: 0,
      maxPosition: 7,
      numbers: [1, 2, 3, 4, 5, 6, 7].map((position) => ({ position })),
      letters: [],
      dots: [],
      divisionsIsVisible: true,
    },
  },
}

/** Below zero: numbers and a dot with its number. */
export const BelowZero: Story = {
  args: {
    part: {
      type: 20,
      tickStep: 1,
      stepSize: 20,
      minPosition: -5,
      maxPosition: 3,
      numbers: [-5, -4, -3, -2, -1, 1, 2, 3].map((position) => ({
        position,
      })),
      letters: [{ position: -4, letter: 'A' }],
      dots: [{ position: -2, letter: 'B', withNumber: true }],
      divisionsIsVisible: true,
    },
  },
}
