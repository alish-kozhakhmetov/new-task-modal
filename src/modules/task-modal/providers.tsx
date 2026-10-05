import { MathJaxContext, type MathJax3Config } from 'better-react-mathjax'

import { ReactQueryProvider } from '@/lib/providers/query-provider'

interface Props {
  children: React.ReactNode
}

/** Shared with Storybook so stories render formulas the way the child sees them. */
export const MATH_JAX_CONFIG: MathJax3Config = {
  loader: { load: ['input/tex', 'output/chtml'] },
  // `matchFontHeight` off: one size for the task (rule 1). MathJax glyphs are
  // drawn in Halvar (math-text.module.scss), so scaling them to Halvar's
  // ex-height made formulas 20.2px next to 18px text (measured 05.10 in
  // Formula/plain and ColumnOperation/plain).
  chtml: { matchFontHeight: false },
  // Multiplication is `×` everywhere, MathJax included (Alisher, 05.10).
  // Generators write `\\cdot`; outside MathJax normalizeOperatorSigns already
  // turns `·` into `×`, so the two halves of one condition used to disagree.
  tex: { macros: { cdot: '\\times' } },
  options: {
    renderActions: {
      addMenu: [], // disables MathJax context menu
    },
  },
}

export const TaskModalProviders = ({ children }: Props) => {
  return (
    <ReactQueryProvider>
      <MathJaxContext config={MATH_JAX_CONFIG}>{children}</MathJaxContext>
    </ReactQueryProvider>
  )
}
