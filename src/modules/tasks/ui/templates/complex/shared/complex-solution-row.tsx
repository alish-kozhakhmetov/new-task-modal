import type { ReactNode } from 'react'

import { useLayoutFlag } from '@/modules/tasks/ui/common/task-solution/use-layout-flag'

import styles from './complex.module.scss'

const child = (row: HTMLElement, className: string) =>
  Array.from(row.children).find((el) => el.classList.contains(className))

/**
 * The unit stands on a line below its value: «Общая площадь
 * прямоугольника: 60» and «см²» alone under it (3_10_15_4 on a phone). The
 * row wraps by items, and the value fits beside a long label where the unit
 * does not.
 */
const unitDropped = (row: HTMLElement) => {
  const value = child(row, styles.answerFormula)
  const unit = child(row, styles.suffix)
  if (!value || !unit) return false
  return (
    unit.getBoundingClientRect().top >= value.getBoundingClientRect().bottom - 1
  )
}

/**
 * A row of the solution: label, the correct value, its unit. A row whose unit
 * fell under the value gets `data-unit-down`: the label takes a line of its
 * own and the value goes down together with its unit, as the field with its
 * unit does in the task (complex.module.scss). A row that fits is not touched.
 */
export const ComplexSolutionRow = ({ children }: { children: ReactNode }) => {
  const ref = useLayoutFlag<HTMLDivElement>('data-unit-down', unitDropped)
  return (
    <div ref={ref} className={`${styles.inputRow} ${styles.solutionRow}`}>
      {children}
    </div>
  )
}
