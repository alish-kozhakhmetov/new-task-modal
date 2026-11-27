/**
 * A backend reference (the LaTeX `to_string(answer)` gives) → the presses a
 * pupil makes on our keyboard to type it. Each press is a key's `latex`
 * value, exactly what the keyboard hands `insertSymbolToMathField`, or a
 * caret move ('Right'). `null` — the reference needs a key we don't have.
 *
 * Used to type every sampled reference of the keys generators into a real
 * MathQuill field and judge what the field holds with the backend's own
 * TaskChecker (scripts/keys/README.md).
 */

export type TgMode = 'key' | 'operatorname' | 'tan' | 'letters'

export interface Options {
  /** Interval layout: single ( [ ] ) keys. Elsewhere — the «( )» pair key. */
  singleBrackets: boolean
  tg: TgMode
  /** Is this key (its `latex`, or the title of a letter) on the task's keyboard? */
  has: (key: string) => boolean
  /** The key that opens brackets around a function's argument. */
  pair: string
}

const GREEK = new Set([
  'alpha',
  'beta',
  'gamma',
  'delta',
  'theta',
  'lambda',
  'sigma',
  'upsilon',
  'phi',
])

const AS_IS = new Set([
  'infty',
  'cup',
  'pi',
  'cdot',
  'varnothing',
  'pm',
  'le',
  'ge',
])
const FUNCTIONS: Record<string, string> = {
  sin: '\\sin',
  cos: '\\cos',
  arcsin: '\\arcsin',
  arccos: '\\arccos',
}
const OPERATOR_NAMES: Record<string, string> = {
  arctg: '\\operatorname{arctg}',
  arcctg: '\\operatorname{arcctg}',
}

/**
 * The argument the backend reads without brackets (TrigonometryTaskAnswer,
 * `without_brackets`): a number and one letter, a degree, a fraction of π.
 * Anything longer a pupil types in brackets — sin(x² − x + 3).
 */
const BARE_ARGUMENT =
  /^(\d+(,\d+)?)?(x|y|\\alpha|\\beta|\\gamma|\\theta|\^\{\\circ\}|\\frac\{\d*\\pi\}\{\d*\})$|^\d+\^\{\\circ\}$|^\(/

export const TG_KEY: Record<TgMode, { tg: string[]; ctg: string[] }> = {
  key: { tg: ['tg'], ctg: ['ctg'] },
  operatorname: { tg: ['\\operatorname{tg}'], ctg: ['\\operatorname{ctg}'] },
  tan: { tg: ['\\tan'], ctg: ['\\cot'] },
  letters: { tg: ['t', 'g'], ctg: ['c', 't', 'g'] },
}

const GLUED = /^(arcsin|arccos|sin|cos|tan|cot|ln|lg)([a-z]+)$/

/** Words the backend writes without a backslash: «tg{ β − θ }», «arctg7». */
const BARE_FUNCTION = /^(arcctg|arctg|arcsin|arccos|ctg|tg)(?![a-z])/

export const referenceToKeys = (
  reference: string,
  o: Options,
): string[] | null => {
  const ref = reference
    // left-to-right marks around the pairs of a system (EquationSystemsTaskAnswer)
    .replace(/\u200e/g, '')
    // ±√29 without a ± key is typed as its two answers: √29; −√29
    // (TwoAnswersTaskAnswer takes it, TrigonometryTaskAnswer doesn't)
    .replace(/^\\pm(.+)$/, (m, rest) =>
      o.has('\\pm') ? m : `${rest};-${rest}`,
    )
  const out: string[] = []
  let i = 0
  const parens: number[] = []

  const readGroup = (): boolean => {
    // `{…}` or a single token after \frac / \sqrt / \overrightarrow
    while (ref[i] === ' ') i++
    if (ref[i] !== '{') return step()
    i++
    while (i < ref.length && ref[i] !== '}') if (!step()) return false
    i++
    return true
  }

  const step = (): boolean => {
    const c = ref[i]
    if (c === ' ') {
      i++
      return true
    }
    if (c === '\\') {
      if (ref.startsWith('\\{', i) || ref.startsWith('\\}', i)) {
        out.push(ref.slice(i, i + 2))
        i += 2
        return true
      }
      const m = /^\\([a-zA-Z]+)/.exec(ref.slice(i))
      if (!m) return false
      let name = m[1]
      i += m[0].length
      // \lnx, \cosx: the backend glues a letter argument to the name
      const glued = GLUED.exec(name)
      if (glued) {
        name = glued[1]
        i -= glued[2].length
      }
      if (name === 'left' || name === 'right') return true
      // ∅: one key; the backend's generators spell it either way
      if (name === 'leq' || name === 'geq') {
        out.push(`\\${name.slice(0, 2)}`)
        return true
      }
      if (name === 'emptyset') {
        out.push('\\varnothing')
        return true
      }
      if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
        out.push('\\frac')
        if (!readGroup()) return false
        out.push('Right')
        if (!readGroup()) return false
        out.push('Right')
        return true
      }
      if (name === 'sqrt') {
        if (ref[i] === '[') {
          const n = /^\[(\d+)\]/.exec(ref.slice(i))
          if (!n) return false
          i += n[0].length
          out.push('\\nthroot', ...n[1].split(''), 'Right')
          if (!readGroup()) return false
          out.push('Right')
          return true
        }
        out.push('\\sqrt')
        if (!readGroup()) return false
        out.push('Right')
        return true
      }
      if (name === 'log') {
        const b = /^_(?:\{(\w+)\}|(\w))/.exec(ref.slice(i))
        if (b) {
          i += b[0].length
          out.push('\\log', ...(b[1] ?? b[2]).split(''), 'Right')
          return true
        }
        // a base that is itself a formula: log_{4/125} 125
        if (!ref.startsWith('_{', i)) return false
        out.push('\\log')
        i++
        if (!readGroup()) return false
        out.push('Right')
        return true
      }
      if (name === 'overrightarrow') {
        out.push('\\overrightarrow')
        if (!readGroup()) return false
        out.push('Right')
        return true
      }
      if (name === 'operatorname') {
        const g = /^\{(\w+)\}/.exec(ref.slice(i))
        if (!g) return false
        i += g[0].length
        if (g[1] === 'tg') return fn(TG_KEY[o.tg].tg)
        if (g[1] === 'ctg') return fn(TG_KEY[o.tg].ctg)
        if (OPERATOR_NAMES[g[1]]) return fn([OPERATOR_NAMES[g[1]]])
        return false
      }
      // ln, lg: typed from the letters — MathQuill makes \ln and \lg itself
      if (name === 'ln' || name === 'lg') return fn(name.split(''))
      if (name === 'tan') return fn(TG_KEY[o.tg].tg)
      if (name === 'cot') return fn(TG_KEY[o.tg].ctg)
      if (FUNCTIONS[name]) return fn([FUNCTIONS[name]])
      if (AS_IS.has(name) || GREEK.has(name)) {
        out.push(`\\${name}`)
        return true
      }
      return false
    }
    if (ref.startsWith('^{\\circ}', i) || ref.startsWith('^\\circ', i)) {
      out.push('^{\\circ}')
      i += ref.startsWith('^{', i) ? '^{\\circ}'.length : '^\\circ'.length
      return true
    }
    if (c === '^') {
      const m = /^\^(?:\{(\d+)\}|(\d))/.exec(ref.slice(i))
      if (m) {
        const p = m[1] ?? m[2]
        if ((p === '2' || p === '3') && o.has(`^${p}`)) out.push(`^${p}`)
        else out.push('^{}', ...p.split(''), 'Right')
        i += m[0].length
        return true
      }
      // any other power: xⁿ, then what the power holds — 2ˣ, (−1)ᵏ, e^{x²−4x}
      out.push('^{}')
      i++
      if (!readGroup()) return false
      out.push('Right')
      return true
    }
    if (c === '{') {
      i++
      while (i < ref.length && ref[i] !== '}') if (!step()) return false
      i++
      return true
    }
    if (c === '(' && !o.singleBrackets) {
      out.push('( )')
      parens.push(1)
      i++
      return true
    }
    if (c === ')' && !o.singleBrackets) {
      if (!parens.pop()) return false
      out.push('Right')
      i++
      return true
    }
    const word = /[a-z]/.test(ref[i - 1] ?? '')
      ? null
      : BARE_FUNCTION.exec(ref.slice(i))
    if (word) {
      i += word[0].length
      if (word[1] === 'tg') return fn(TG_KEY[o.tg].tg)
      if (word[1] === 'ctg') return fn(TG_KEY[o.tg].ctg)
      return fn([OPERATOR_NAMES[word[1]] ?? FUNCTIONS[word[1]]])
    }
    if (/[0-9a-zA-Z+\-;,()[\]=<>|]/.test(c)) {
      out.push(c)
      i++
      return true
    }
    return false
  }

  /** sin, tg… — then an optional power, then the argument, bare or in brackets. */
  function fn(keys: string[]): boolean {
    out.push(...keys)
    const pow = /^\^(\d)/.exec(ref.slice(i))
    if (pow) {
      out.push(o.has(`^${pow[1]}`) ? `^${pow[1]}` : '^{}')
      if (!o.has(`^${pow[1]}`)) out.push(pow[1], 'Right')
      i += pow[0].length
    }
    while (ref[i] === ' ') i++
    if (ref[i] !== '{') return true
    // the group's content, braces balanced
    let depth = 0
    let j = i
    for (; j < ref.length; j++) {
      if (ref[j] === '{') depth++
      else if (ref[j] === '}' && --depth === 0) break
    }
    const inner = ref.slice(i + 1, j).trim()
    const bare = BARE_ARGUMENT.test(inner.replace(/\s+/g, ''))
    if (!bare) out.push(o.pair)
    i++
    while (i < j) if (!step()) return false
    i = j + 1
    if (!bare) out.push(o.pair === '( )' ? 'Right' : ')')
    return true
  }

  while (i < ref.length) if (!step()) return null
  return out.every((k) => k === 'Right' || o.has(k)) ? out : null
}

/**
 * The same reference typed on a computer's keyboard: what it has (digits,
 * letters, + - ; , and the brackets) is typed, the rest comes from our keys.
 * `null` where a computer has no natural way (fractions, roots).
 */
export const referenceToTyping = (
  ref: string,
): ({ type: string } | { key: string })[] | null => {
  if (/\\(frac|dfrac|tfrac|sqrt|overrightarrow|begin)/.test(ref)) return null
  const keys = referenceToKeys(ref, {
    singleBrackets: true,
    tg: 'letters',
    has: () => true,
    pair: '(',
  })
  if (!keys) return null
  return keys.map((k) =>
    k.length === 1 && /[0-9a-zA-Z+\-;,()[\]=]/.test(k)
      ? { type: k }
      : { key: k },
  )
}
