import type { ReactNode } from 'react'

import {
  DIGIT_GROUP_FROM,
  DigitGroupingContext,
} from '@/ui/math-text/group-digits'

/**
 * Tasks where the classes of a number are the question (rule 100): which
 * digit is in a given place, place-value tables and composition, rounding to
 * a place. Grouping would answer for the pupil, so their numbers stay solid.
 * Grade 4, from the package task data (20.08): «разряд» in the condition with
 * a number of five digits or more.
 */
export const GROUPING_OFF_TASKS = new Set([
  '4_1_3',
  '4_1_4',
  '4_1_5',
  '4_1_6',
  '4_1_7',
  '4_1_56',
  '4_1_56_1',
  '4_4_3',
  '4_4_4',
  '4_4_5',
  '4_4_6',
  '4_4_7',
  '4_4_8',
  '4_4_13',
  '4_4_14',
  '4_4_17',
  '4_4_18',
  '4_4_19',
  '4_4_20',
  '4_4_55',
  '4_4_56',
  '4_4_57',
  '4_4_57_1',
  '4_8_2_1',
  '4_8_2_2',
  '4_8_2_3',
  '4_8_2_4',
  '4_8_2_5',
  '4_8_2_6',
  '4_8_2_7',
  '4_8_2_8',
  '4_8_2_9',
  '4_8_5_1',
  '4_8_5_2',
  '4_8_5_3',
  '4_8_5_4',
  '4_8_5_5',
  '4_8_5_6',
  '4_8_5_7',
  '4_8_5_8',
])

const ON = { from: DIGIT_GROUP_FROM }
const OFF = { from: null }

export const DigitGroupingForTask = ({
  taskType,
  children,
}: {
  taskType: string | undefined
  children: ReactNode
}) => {
  const key = (taskType ?? '').replace('Elixir.Task_', '')
  return (
    <DigitGroupingContext value={GROUPING_OFF_TASKS.has(key) ? OFF : ON}>
      {children}
    </DigitGroupingContext>
  )
}
