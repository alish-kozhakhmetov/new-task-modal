/* eslint-disable testing-library/no-node-access -- the rule is about the markup of a cell's lines: which <span> carries which class */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import styles from '../shared/table.module.scss'
import { TableMultiRow } from '../ui/multi-row'
import fixture from '../ui/multi-row/data/task.json'

import {
  isSeveralWords,
  TableStaticCellContent,
} from './render-table-cell-content'
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
 * Rule 59а (package-parity.md, 09.10): a header of a framed table wraps
 * between words. 4_10_9_9 (master, 27.11, and the package's own multiRow
 * fixture) breaks each header with `\(\\\)`: «Площадь выращивания» over
 * «(S) (га)». In 2.5.9 every such line was `nowrap`, so «Площадь
 * выращивания» held one line, the table came out 637px on a 362px phone
 * column (49px past the 592px column at 1280) and the header was cut under
 * the fade.
 */
const lineSpans = (container: HTMLElement) =>
  [...container.querySelectorAll('span')].filter((span) =>
    span.className.split(' ').includes(styles.cellLine),
  )

describe('a header line of several words wraps between them (rule 59а)', () => {
  it('tells several words from one', () => {
    expect(isSeveralWords('Площадь выращивания')).toBe(true)
    expect(isSeveralWords('(\\(S\\)) (га)')).toBe(true)
    expect(isSeveralWords('Общая масса уражая')).toBe(true)
    // one word, also with a hyphen: never split
    expect(isSeveralWords('сот.')).toBe(false)
    expect(isSeveralWords('3-ий')).toBe(false)
    expect(isSeveralWords('')).toBe(false)
    // a space inside a math island is not a place to wrap
    expect(isSeveralWords('\\(a\\ b\\)')).toBe(false)
  })

  it('the stylesheet lets such a line wrap in a header, and only there', () => {
    // CSS modules are not compiled under vitest (any class name resolves),
    // so the rule is read from the source.
    const tableScss = readFileSync(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../shared/table.module.scss',
      ),
      'utf8',
    )
    const rule = /\.cellHeader \.cellLineWords \{\s*white-space: normal;\s*\}/
    expect(tableScss).toMatch(rule)
    expect(tableScss).toMatch(/\.cellLine \{[^}]*white-space: nowrap;/)
  })

  it('a line of several words gets it, a one-word line («3-ий») does not', () => {
    const { container } = render(
      <TableStaticCellContent
        content={'Площадь выращивания\\(\\\\\\)(\\(S\\)) (га)\\(\\\\\\)'}
      />,
    )
    const lines = lineSpans(container)
    expect(lines).toHaveLength(3)
    expect(lines[0].className).toContain(styles.cellLineWords)
    expect(lines[1].className).toContain(styles.cellLineWords)
    // the trailing break leaves an empty line: nothing to wrap
    expect(lines[2].className).not.toContain(styles.cellLineWords)

    const view = render(
      <TableStaticCellContent content={'сот.\\(\\\\\\)3-ий'} />,
    )
    for (const line of lineSpans(view.container)) {
      expect(line.className).not.toContain(styles.cellLineWords)
    }
  })

  it('4_10_9_9: every header line of several words may wrap in the window', () => {
    const task = { ...(fixture as unknown as TableTask), solution: null }
    renderTemplate(TableMultiRow, task)

    const header = screen.getByTestId('task-table').querySelector('tr')!
    const lines = lineSpans(header)
    const wrapping = lines
      .filter((line) => line.className.includes(styles.cellLineWords))
      .map((line) => line.textContent?.replace(/\s+/g, ' ').trim())

    // «Урожайность» is one word and stays whole
    expect(wrapping).toEqual([
      '(\\(m\\)) (ц/га)',
      'Площадь выращивания',
      '(\\(S\\)) (га)',
      'Общая масса уражая',
      '(\\(M\\)) (ц)',
    ])
    // and they sit in header cells, where `.cellHeader .cellLineWords` applies
    for (const line of lines) {
      expect(line.closest('td')!.className).toContain(styles.cellHeader)
    }
  })
})
