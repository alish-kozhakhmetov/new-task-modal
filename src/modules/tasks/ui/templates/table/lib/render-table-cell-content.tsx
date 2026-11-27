import clsx from 'clsx'
import { Fragment } from 'react'

import { stripEmptyMathIslands } from '@/modules/tasks/ui/templates/text/lib/strip-empty-math-islands'
import { uprightUnitsInTex } from '@/modules/tasks/ui/templates/text/lib/upright-math-units'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

import styles from '../shared/table.module.scss'

/** ME parity: SVG / HTML markup must not go through MathText (escaped). */
export const isHtmlTableCellContent = (content: string): boolean =>
  content.includes('svg') || content.includes('<div')

const CYRILLIC_RE = /[а-яА-ЯёЁ]/

/** A math island holding only `\\` — the backend's line break inside a cell. */
const LINE_BREAK_ISLAND_RE = /\\\(\s*\\\\\s*\\\)/

/** A math island `\(…\)` is typeset as one unit: its inner spaces are no place to wrap. */
const MATH_ISLAND_RE = /\\\([\s\S]*?\\\)/g

/**
 * A line of several words («Площадь выращивания», «(\(S\)) (га)»), not one
 * word («сот.», «3-ий»). A header may wrap such a line between its words
 * (rule 59а); a one-word line stays whole.
 */
export const isSeveralWords = (line: string): boolean =>
  /\S\s+\S/.test(line.replace(MATH_ISLAND_RE, 'x').trim())

/**
 * MathJax math mode italicizes letters and `\text{…}` uses MJX text fonts
 * (not Halvar). Cyrillic prose labels in `\(…\)` are unwrapped to plain text
 * so they stay upright and inherit the UI font. Islands with `^` / `_`
 * (e.g. `дм^3`) stay in math mode with upright units via `\mathrm`.
 * Empty spacer islands from ME answer cells are dropped (they break typesetting).
 * Latin math like `\(v\)` / `\(t\)` is left unchanged.
 */
export const uprightCyrillicMath = (content: string): string => {
  const withUnits = content.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (match, inner: string) => {
      if (!CYRILLIC_RE.test(inner)) return match
      // Powers / subscripts must stay typeset (complex_5: `дм^3` → дм³).
      if (/[\^_]/.test(inner)) {
        return `\\(${uprightUnitsInTex(inner)}\\)`
      }
      let forText = inner.trim()
      const textWrapped = /^\\text\{([\s\S]*)\}$/.exec(forText)
      if (textWrapped) forText = textWrapped[1]
      // `\ ` is a LaTeX control space — drop the backslash
      return forText.replace(/\\ /g, ' ').replace(/\s+/g, ' ').trim()
    },
  )
  return stripEmptyMathIslands(withUnits)
}

interface StaticCellProps {
  content: string
  /** Solution row uses MathFormula for consistency with locked answers nearby. */
  asFormula?: boolean
}

/** Non-input cell: HTML injection for svg/div, else MathText/MathFormula. */
export const TableStaticCellContent = ({
  content,
  asFormula = false,
}: StaticCellProps) => {
  if (isHtmlTableCellContent(content)) {
    return (
      <div
        className={styles.htmlCell}
        data-testid="table-html-cell"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  /*
   * `\(\\\)` is the backend's line break inside a cell: headers of the
   * place-value grid arrive as `сот.\(\\\)6-й`, meaning «сот.» over «6-й».
   * MathJax drops a `\\` in inline math, so the header rendered as one long
   * «сот.6-й» and six such columns pushed the table past a phone screen.
   * Honouring the break halves the column width.
   */
  const lines = content.split(LINE_BREAK_ISLAND_RE)
  if (lines.length > 1) {
    return (
      <>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {/* A line the backend broke on purpose keeps its words: «3-ий»
                must not wrap again at its hyphen once headers are allowed to
                wrap. A line of several words may wrap between them in a
                header (rule 59а, `.cellHeader .cellLineWords`). */}
            <span
              className={clsx(
                styles.cellLine,
                isSeveralWords(line) && styles.cellLineWords,
              )}
            >
              <TableStaticCellContent content={line} asFormula={asFormula} />
            </span>
          </Fragment>
        ))}
      </>
    )
  }

  const normalized = uprightCyrillicMath(content)

  if (asFormula) {
    return <MathFormula>{normalized}</MathFormula>
  }

  return <MathText>{normalized}</MathText>
}
