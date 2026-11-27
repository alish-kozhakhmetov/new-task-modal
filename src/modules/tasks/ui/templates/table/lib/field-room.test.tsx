/* eslint-disable testing-library/no-node-access -- the rule is about which <td> of the table carries which class */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import styles from '../shared/table.module.scss'
import { TableGrid } from '../ui/grid'
import gridTasks from '../ui/grid/data/all-tasks.json'
import { TableMultiRow } from '../ui/multi-row'
import multiRowTasks from '../ui/multi-row/data/all-tasks.json'
import { TableMultiRowSvg } from '../ui/multi-row-svg'
import multiRowSvgTasks from '../ui/multi-row-svg/data/all-tasks.json'

import { getCellClassName } from './get-table-classnames'
import { hasWrappingLine, isSeveralWords } from './render-table-cell-content'
import { renderTemplate } from './testing/test-utils'
import type { TableTask } from './types.task'

vi.mock(
  '@/ui/math-input/math-input',
  () => import('../../text/lib/testing/mocks/math-input'),
)
vi.mock(
  '@/ui/math-text/math-text',
  () => import('../../text/lib/testing/mocks/math-text'),
)
vi.mock(
  '@/ui/math-text/math-formula',
  () => import('../../text/lib/testing/mocks/math-formula'),
)

/*
 * Rule 12 (14.08): a field shows the room its answer needs. Rule 59а lets a
 * header line of several words wrap (header-line-wrap.test.tsx), and then the
 * header no longer holds its column open. In 4_10_9_9 «Общая масса» (an
 * answer of 100..1500, master `task_4_10_9_9.ex`) came out 62px: an empty
 * field too small for four digits, which widened to 72 as the pupil typed
 * «1500» and shifted the table. The field under such a header keeps 80px
 * itself; a column whose header does not wrap keeps the width it had.
 */

type Fixture = { byGrade: Record<string, { id: string; task: unknown }[]> }

const grade4 = (data: unknown) => (data as Fixture).byGrade['4']

/** «r1c3»-style addresses of the field cells that keep room for the answer. */
const roomyCells = (container: HTMLElement) =>
  [...container.querySelectorAll('tr')].flatMap((tr, r) =>
    [...tr.querySelectorAll('td')]
      .map((td, c) =>
        td.className.split(' ').includes(styles.inputCellAnswerRoom)
          ? `r${r}c${c}`
          : null,
      )
      .filter((cell): cell is string => cell !== null),
  )

describe('a field under a wrapping header keeps room for its answer (rule 12)', () => {
  it('the stylesheet gives such a field 80px, and only such a field', () => {
    // CSS modules are not compiled under vitest, so the rule is read from
    // the source: without it «1500» does not fit the empty field.
    const tableScss = readFileSync(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../shared/table.module.scss',
      ),
      'utf8',
    )
    expect(tableScss).toMatch(
      /\.inputCellAnswerRoom \.input \{\s*min-width: 80px;\s*\}/,
    )
  })

  it('tells a header that wraps from one that does not', () => {
    expect(hasWrappingLine('Площадь выращивания\\(\\\\\\)(\\(S\\)) (га)')).toBe(
      true,
    )
    // one word a line: «сот.» over «6-й» never wraps
    expect(hasWrappingLine('сот.\\(\\\\\\)6-й')).toBe(false)
    // no backend break: the header was free to wrap before 59а, nothing changed
    expect(hasWrappingLine('Выращиваемая культура')).toBe(false)
    expect(hasWrappingLine('<svg><text>a b</text></svg>')).toBe(false)
  })

  it('reads a Cyrillic island as the words it shows', () => {
    // `\(\text{…}\)` is unwrapped to plain text (uprightCyrillicMath)
    expect(isSeveralWords('\\(\\text{Площадь выращивания}\\)')).toBe(true)
    expect(isSeveralWords('\\(Площадь\\ выращивания\\)')).toBe(true)
    // Latin math stays one typeset unit
    expect(isSeveralWords('\\(a + b\\)')).toBe(false)
  })

  it('the class goes on field cells of bordered tables only', () => {
    const base = {
      mode: 'input' as const,
      isFirstCell: false,
      isLastCell: false,
      isHeaderRow: false,
      isLastRow: false,
      inWrappingColumn: true,
    }
    for (const id of ['table.grid', 'table.multiRow', 'table.multiRowSvg']) {
      expect(getCellClassName({ ...base, id, isInput: true })).toContain(
        styles.inputCellAnswerRoom,
      )
      expect(getCellClassName({ ...base, id, isInput: false })).not.toContain(
        styles.inputCellAnswerRoom,
      )
    }
    for (const id of [
      'table.plain',
      'table.inline',
      'table.list',
      'table.mixed',
    ])
      expect(getCellClassName({ ...base, id, isInput: true })).not.toContain(
        styles.inputCellAnswerRoom,
      )
  })

  it('grade 4: the three fields of 4_10_9_9, no field of the other bordered tables', () => {
    const found: Record<string, string[]> = {}
    const fields: Record<string, number> = {}
    const cases = [
      [TableGrid, grade4(gridTasks)],
      [TableMultiRow, grade4(multiRowTasks)],
      [TableMultiRowSvg, grade4(multiRowSvgTasks)],
    ] as const
    for (const [Template, tasks] of cases) {
      for (const { id, task } of tasks) {
        const view = renderTemplate(Template, {
          ...(task as TableTask),
          solution: null,
        })
        const table = screen.getByTestId('task-table')
        fields[id] = [...table.querySelectorAll('td')].filter((td) =>
          td.className.split(' ').includes(styles.inputCell),
        ).length
        const cells = roomyCells(table)
        if (cells.length > 0) found[id] = cells
        view.unmount()
      }
    }
    // 13 grid + 1 multiRow + 1 multiRowSvg fixtures went through
    expect(cases.reduce((n, [, tasks]) => n + tasks.length, 0)).toBe(15)
    // no empty sample: every fixture rendered its fields — 32 in all
    // (4_1_56 5, 4_4_57_1 6, 4_1_56_1/4_4_57/4_7_18_13/4_10_9_9 3, the rest 1)
    expect(Object.values(fields).every((n) => n > 0)).toBe(true)
    expect(Object.values(fields).reduce((a, b) => a + b, 0)).toBe(32)
    expect(found).toEqual({ '4_10_9_9': ['r1c3', 'r2c2', 'r3c1'] })
  })
})
