import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'
import { type ComponentProps, type ReactNode } from 'react'

import {
  groupDigitsInTex,
  splitDigitGroups,
  useDigitGrouping,
} from './group-digits'
import styles from './math-text.module.scss'
import { normalizeFractionStyle } from './normalize-fraction-style'
import {
  MATH_ISLAND_RE,
  normalizeOperatorSigns,
} from './normalize-operator-signs'
import { scheduleMathStretch } from './stretch-tall-glyphs'

type Props = ComponentProps<typeof MathJax> & {
  inline?: boolean
}

/**
 * `-webkit-touch-callout` (`@supports` feature-query) only reliably detects
 * iOS Safari, not desktop macOS Safari — UA sniffing is what the rest of the
 * codebase uses for this (see `src/ui/spoiler/spoiler.tsx`).
 */
const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

/**
 * Rule 100: numbers in text become unbreakable spans with a fixed gap between
 * classes (no character — copying gives «35784»); numbers in math get a fixed
 * `\hspace`. Math islands stay whole text nodes, so MathJax still finds them.
 */
const withDigitGroups = (text: string, from: number | null): ReactNode => {
  if (from === null) return text
  let grouped = false
  const nodes: ReactNode[] = []
  text.split(MATH_ISLAND_RE).forEach((part, index) => {
    if (index % 2 === 1) {
      nodes.push(groupDigitsInTex(part, from))
      return
    }
    for (const piece of splitDigitGroups(part, from)) {
      if (typeof piece === 'string') {
        nodes.push(piece)
        continue
      }
      grouped = true
      const [head, ...rest] = piece.classes
      nodes.push(
        <span key={nodes.length} className={styles.digits}>
          {head}
          {rest.map((cls, i) => (
            <span key={i} className={styles.digitClass}>
              {cls}
            </span>
          ))}
        </span>,
      )
    }
  })
  // Nothing grouped: every node is a string — keep one string for MathJax.
  return grouped ? nodes : (nodes as string[]).join('')
}

export const MathText = ({ children, className, inline, onTypeset }: Props) => {
  const { from } = useDigitGrouping()
  const content =
    typeof children === 'string'
      ? withDigitGroups(
          normalizeFractionStyle(normalizeOperatorSigns(children)),
          from,
        )
      : children

  const handleTypeset = () => {
    scheduleMathStretch()
    onTypeset?.()
  }

  return (
    <MathJax
      className={clsx(styles.mathText, IS_SAFARI && styles.safari, className)}
      inline={inline}
      onInitTypeset={handleTypeset}
      onTypeset={handleTypeset}
    >
      {content}
    </MathJax>
  )
}
