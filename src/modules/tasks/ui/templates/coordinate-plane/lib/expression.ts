/**
 * A small arithmetic evaluator for the formulas a coordinate plane carries.
 *
 * Two dialects reach us and both are read here:
 *
 * - figures of the condition (type 120) — expr-eval syntax the old window
 *   parsed: `5 - (x + (1))^2`, `-abs(x + 2)`;
 * - answers of the backend — `graph_function` strings it evaluates with
 *   `Code.eval_string` after `normalize_expression`: `y = x^2`, `y=5x^2`
 *   (implicit multiplication), `y = :math.sqrt(5.0 * (x - (0))) + (0)`,
 *   `x=0*y`.
 *
 * No `eval`, no `Function`: a recursive-descent parser over a closed list of
 * names. Anything else throws, and callers treat a throw as «not drawable».
 */

type Vars = Record<string, number>

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  abs: Math.abs,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  exp: Math.exp,
  log: Math.log,
  ln: Math.log,
  pow: Math.pow,
}

const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E }

type Token =
  | { t: 'num'; v: number }
  | { t: 'id'; v: string }
  | { t: 'op'; v: string }

const tokenize = (source: string): Token[] => {
  // `:math.sqrt` → `sqrt`; `\cdot` → `*`; a decimal comma is not expected.
  let s = source.replace(/:math\./g, '').replace(/\\cdot/g, '*')
  // LaTeX the answers carry: `y=\frac{1}{2}x^2`, `\sqrt{x}`
  for (let guard = 0; guard < 8 && /\\(?:d?frac|sqrt)\{/.test(s); guard += 1) {
    s = s
      .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
      .replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)')
  }
  s = s.replace(/[{}]/g, (c) => (c === '{' ? '(' : ')'))
  const out: Token[] = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c)) {
      i += 1
    } else if (/[0-9.]/.test(c)) {
      const m = /^\d*\.?\d+(?:e[+-]?\d+)?|^\d+\.?/.exec(s.slice(i))
      if (!m) throw new Error(`bad number at ${i}`)
      out.push({ t: 'num', v: Number(m[0]) })
      i += m[0].length
    } else if (/[a-z_]/i.test(c)) {
      const m = /^[a-z_][a-z0-9_]*/i.exec(s.slice(i))!
      out.push({ t: 'id', v: m[0].toLowerCase() })
      i += m[0].length
    } else if ('+-*/^(),'.includes(c)) {
      out.push({ t: 'op', v: c })
      i += 1
    } else {
      throw new Error(`unexpected «${c}»`)
    }
  }
  return out
}

/**
 * Splits a known name glued to a variable or a number, as the backend writes
 * them: `5x` is fine already (number then id), `xy` is not expected.
 */
const parse = (tokens: Token[]) => {
  let pos = 0
  const peek = () => tokens[pos]
  const isOp = (v: string) => peek()?.t === 'op' && peek().v === v
  const expectOp = (v: string) => {
    if (!isOp(v)) throw new Error(`expected «${v}»`)
    pos += 1
  }

  // expr := term (('+'|'-') term)*
  const expr = (vars: Vars): number => {
    let value = term(vars)
    while (isOp('+') || isOp('-')) {
      const op = tokens[pos++].v
      const rhs = term(vars)
      value = op === '+' ? value + rhs : value - rhs
    }
    return value
  }

  // term := unary (('*'|'/'|implicit) unary)*
  const startsFactor = () => {
    const t = peek()
    return (
      t != null &&
      (t.t === 'num' || t.t === 'id' || (t.t === 'op' && t.v === '('))
    )
  }
  const term = (vars: Vars): number => {
    let value = unary(vars)
    for (;;) {
      if (isOp('*') || isOp('/')) {
        const op = tokens[pos++].v
        const rhs = unary(vars)
        value = op === '*' ? value * rhs : value / rhs
      } else if (startsFactor()) {
        value *= unary(vars) // 5x, 2(x - 1), (x + 1)(x - 1)
      } else {
        return value
      }
    }
  }

  // unary := '-' unary | power   (−x^2 = −(x^2), as in expr-eval)
  const unary = (vars: Vars): number => {
    if (isOp('-')) {
      pos += 1
      return -unary(vars)
    }
    if (isOp('+')) {
      pos += 1
      return unary(vars)
    }
    return power(vars)
  }

  // power := primary ('^' unary)?   right-associative
  const power = (vars: Vars): number => {
    const base = primary(vars)
    if (isOp('^')) {
      pos += 1
      return Math.pow(base, unary(vars))
    }
    return base
  }

  const primary = (vars: Vars): number => {
    const t = tokens[pos]
    if (!t) throw new Error('unexpected end')
    if (t.t === 'num') {
      pos += 1
      return t.v
    }
    if (t.t === 'op' && t.v === '(') {
      pos += 1
      const v = expr(vars)
      expectOp(')')
      return v
    }
    if (t.t === 'id') {
      pos += 1
      const fn = FUNCTIONS[t.v]
      if (fn && isOp('(')) {
        pos += 1
        const args = [expr(vars)]
        while (isOp(',')) {
          pos += 1
          args.push(expr(vars))
        }
        expectOp(')')
        return fn(...args)
      }
      if (t.v in vars) return vars[t.v]
      if (t.v in CONSTANTS) return CONSTANTS[t.v]
      throw new Error(`unknown name «${t.v}»`)
    }
    throw new Error(`unexpected «${t.v}»`)
  }

  return (vars: Vars) => {
    pos = 0
    const v = expr(vars)
    if (pos !== tokens.length) throw new Error('trailing input')
    return v
  }
}

export type Compiled = (vars: Vars) => number

/** Compile once, evaluate many times (a curve is sampled hundreds of times). */
export const compileExpression = (source: string): Compiled => {
  const run = parse(tokenize(source))
  // a dry run: syntax errors and unknown names throw here, not mid-curve
  // (arithmetic never throws — a root of a negative is NaN, not an error)
  run({ x: 0.5, y: 0.5 })
  return run
}

/**
 * A backend `graph_function`: `y = …` or `x = …`. Returns which variable it
 * defines and the right-hand side compiled.
 */
export const compileGraphFunction = (
  source: string,
): { defines: 'x' | 'y'; rhs: Compiled } => {
  const m = /^\s*([xy])\s*=(.*)$/s.exec(source)
  if (!m) return { defines: 'y', rhs: compileExpression(source) }
  return { defines: m[1] as 'x' | 'y', rhs: compileExpression(m[2]) }
}
