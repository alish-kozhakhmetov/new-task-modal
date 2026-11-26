/**
 * A label of the plane as SVG text: the backend puts TeX into `Text` figures
 * (`\(x\)`, `\(x^2 + 9x - 9\)`), and MathJax does not reach inside an SVG,
 * so the pupil saw the delimiters (CX, 26.11: Task_1_6_11…13, 10_6_4_1…3,
 * 5_5_4_9, 5_2_11_5). The small TeX of labels is set by hand instead: no
 * delimiters, an exponent raised, the operation signs of math-signs.md rule 1
 * (hyphen → U+2212, `*` and `\cdot` → ×).
 */

export interface LabelRun {
  text: string
  sup?: boolean
}

const COMMANDS: Record<string, string> = {
  cdot: '×',
  times: '×',
  pi: 'π',
  infty: '∞',
  le: '≤',
  ge: '≥',
  leq: '≤',
  geq: '≥',
  ne: '≠',
  pm: '±',
  circ: '°',
  degree: '°',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
}

const LETTER = /[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі]/
/** A hyphen between two letters is a word's hyphen; any other is a minus. */
const signs = (s: string) =>
  [...s]
    .map((c, i, all) => {
      if (c === '*') return '×'
      if (c !== '-') return c
      const word =
        LETTER.test(all[i - 1] ?? '') && LETTER.test(all[i + 1] ?? '')
      return word ? c : '−'
    })
    .join('')

/** `{…}` at `i` → its content and the index after it; a single char otherwise. */
const group = (s: string, i: number): [string, number] => {
  if (s[i] !== '{') return [s[i] ?? '', i + 1]
  let depth = 0
  for (let j = i; j < s.length; j += 1) {
    if (s[j] === '{') depth += 1
    if (s[j] === '}') depth -= 1
    if (depth === 0) return [s.slice(i + 1, j), j + 1]
  }
  return [s.slice(i + 1), s.length]
}

/** The TeX inside one pair of delimiters → runs. */
const fromTex = (tex: string): LabelRun[] => {
  const runs: LabelRun[] = []
  let text = ''
  const flush = () => {
    if (text) runs.push({ text })
    text = ''
  }
  for (let i = 0; i < tex.length; ) {
    const c = tex[i]
    if (c === '^') {
      const [sup, next] = group(tex, i + 1)
      flush()
      runs.push({
        text: fromTex(sup)
          .map((r) => r.text)
          .join(''),
        sup: true,
      })
      i = next
    } else if (c === '\\') {
      const name = /^[A-Za-z]+/.exec(tex.slice(i + 1))?.[0] ?? ''
      i += 1 + name.length
      if (name === 'frac') {
        const [num, a] = group(tex, i)
        const [den, b] = group(tex, a)
        text += `${fromTex(num)
          .map((r) => r.text)
          .join('')}/${fromTex(den)
          .map((r) => r.text)
          .join('')}`
        i = b
      } else if (name) {
        text += COMMANDS[name] ?? ''
      } else {
        // `\,` `\ ` `\{` — a space or the escaped char itself
        const ch = tex[i] ?? ''
        text += ch === ',' || ch === ';' || ch === ' ' ? ' ' : ch
        i += 1
      }
    } else if (c === '{' || c === '}') {
      i += 1
    } else {
      text += c
      i += 1
    }
  }
  flush()
  return runs
}

const DELIMITED = /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|\$([^$]+)\$/g

export const labelRuns = (label: string): LabelRun[] => {
  const runs: LabelRun[] = []
  let last = 0
  for (const m of label.matchAll(DELIMITED)) {
    if (m.index > last) runs.push({ text: label.slice(last, m.index) })
    runs.push(...fromTex(m[1] ?? m[2] ?? m[3] ?? ''))
    last = m.index + m[0].length
  }
  if (last < label.length) runs.push({ text: label.slice(last) })
  return runs
    .map((r) => ({ ...r, text: signs(r.text.replace(/\s+/g, ' ')) }))
    .filter((r) => r.text !== '')
}

/** Plain text of a label: what a fraction check or an aria name reads. */
export const labelText = (label: string) =>
  labelRuns(label)
    .map((r) => r.text)
    .join('')
    .trim()

/** The runs as the children of a `<text>`. */
export const SvgLabelRuns = ({ label }: { label: string }) => {
  const runs = labelRuns(label)
  if (runs.every((r) => !r.sup)) return <>{runs.map((r) => r.text).join('')}</>
  return (
    <>
      {runs.map((r, i) =>
        r.sup ? (
          // eslint-disable-next-line react-x/no-array-index-key -- a label's runs never reorder
          <tspan key={i} baselineShift="super" fontSize="0.7em">
            {r.text}
          </tspan>
        ) : (
          // eslint-disable-next-line react-x/no-array-index-key -- a label's runs never reorder
          <tspan key={i}>{r.text}</tspan>
        ),
      )}
    </>
  )
}
