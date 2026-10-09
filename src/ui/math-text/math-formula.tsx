import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'

import { groupDigitsInTex, useDigitGrouping } from './group-digits'
import styles from './math-text.module.scss'
import { normalizeFractionStyle } from './normalize-fraction-style'
import { timesInMath } from './normalize-operator-signs'
import { scheduleMathStretch } from './stretch-tall-glyphs'

const WRAPPED = /^\s*\\\(([\s\S]*)\\\)\s*$/

/**
 * Drop one outer `\( … \)` pair when the whole formula is wrapped in it.
 * «\(a\) + \(b\)» is two islands, not one wrap — left as is.
 */
export const unwrapMath = (formula: string) => {
  const inner = WRAPPED.exec(formula)?.[1]
  if (inner === undefined || /\\[()]/.test(inner)) return formula
  return inner
}

interface Props {
  children: string
  className?: string
  onTypeset?: () => void
}

export const MathFormula = ({ children, className, onTypeset }: Props) => {
  const { from } = useDigitGrouping()
  const tex = timesInMath(unwrapMath(children))
  // Wrap first — normalizeFractionStyle only rewrites islands inside `\(...\)`.
  // Some generators already send the formula wrapped («\(64 \approx\)»);
  // wrapping it again made MathJax print a red «\(» error.
  const content = normalizeFractionStyle(
    `\\(${from === null ? tex : groupDigitsInTex(tex, from)}\\)`,
  )

  const handleTypeset = () => {
    scheduleMathStretch()
    onTypeset?.()
  }

  return (
    <MathJax
      className={clsx(styles.mathText, className)}
      inline
      onInitTypeset={handleTypeset}
      onTypeset={handleTypeset}
    >
      {content}
    </MathJax>
  )
}
