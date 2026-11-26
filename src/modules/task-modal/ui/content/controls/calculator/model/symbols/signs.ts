import EmptySetIcon from '@/assets/icons/calc/empty-set.svg'
import UnionIcon from '@/assets/icons/calc/union.svg'

import { MAIN } from './main'
import { TASK_KEY_SETS } from './task-keys'
import type { MainPanelSymbol } from './types'

/**
 * Signs beyond the released keyboard (2.5.8) — for grades 5–13: intervals,
 * unions, trigonometry, π, a vector, degrees, a root, a logarithm. What each key writes is
 * what the backend's TaskChecker accepts (scripts/keys/README.md): every
 * sampled reference of these generators typed with these keys into
 * MathQuill and judged by the backend's own checker.
 *
 * A task shows them only when its type is in TASK_KEY_SETS (generated from
 * the backend's answer type of each generator). Every other task — grade 4
 * all of it — keeps the released keyboard key for key.
 */

export type KeySetName = keyof typeof TASK_KEY_SETS

/** `fn` — a word on the key (sin, arcsin): the smaller type of the DS «Additional» page. */
export type SignSymbol = MainPanelSymbol

// Brackets one by one: an interval mixes them — (−∞; 5]. The released «( )»
// key writes a closed pair: «( )», −∞; 5, then «]» gives «(−∞;5])».
const OPEN_ROUND: SignSymbol = { title: '(', latex: '(', label: '(' }
const OPEN_SQUARE: SignSymbol = { title: '[', latex: '[', label: '[' }
const CLOSE_SQUARE: SignSymbol = { title: ']', latex: ']', label: ']' }
const CLOSE_ROUND: SignSymbol = { title: ')', latex: ')', label: ')' }

const INFINITY: SignSymbol = { title: '∞', latex: '\\infty', label: '∞' }
// ∪ drawn, as ÷ × − + are: the key font has no ∪, its fallback came out
// half the size of ∞ beside it, ⋃ too (shots 26.11)
const UNION: SignSymbol = {
  title: '∪',
  latex: '\\cup',
  label: '∪',
  icon: UnionIcon,
}
const PI: SignSymbol = { title: 'π', latex: '\\pi', label: 'π' }
const ROOT: SignSymbol = { title: '√', latex: '\\sqrt', label: '√' }
const NTH_ROOT: SignSymbol = { title: 'ⁿ√', latex: '\\nthroot', label: 'ⁿ√' }
const DEGREE: SignSymbol = { title: '°', latex: '^{\\circ}', label: '°' }
const POWER: SignSymbol = { title: 'xⁿ', latex: '^{}', label: 'xⁿ' }
// a point in a union: (−∞; −1] ∪ {2} ∪ [4; 5]
const OPEN_BRACE: SignSymbol = { title: '{', latex: '\\{', label: '{' }
const CLOSE_BRACE: SignSymbol = { title: '}', latex: '\\}', label: '}' }
const LOG: SignSymbol = { title: 'log', latex: '\\log', label: 'log', fn: true }
// no solutions: «x ∈ ∅» — the backend takes \varnothing only, not \emptyset.
// Drawn, as ∪: the key font has no ∅ either
const EMPTY_SET: SignSymbol = {
  title: '∅',
  latex: '\\varnothing',
  label: 'Empty set',
  icon: EmptySetIcon,
}
const VECTOR: SignSymbol = {
  title: 'a⃗',
  latex: '\\overrightarrow',
  label: 'Vector',
}

// tg and ctg as letters: the backend reads «tg» itself (MathQuill turns
// «ctg» into \operatorname{ctg} on its own). \operatorname{tg} and \tan
// failed its check on 37 and 32 of 130 sampled tg references.
const SIN: SignSymbol = { title: 'sin', latex: '\\sin', label: 'sin', fn: true }
const COS: SignSymbol = { title: 'cos', latex: '\\cos', label: 'cos', fn: true }
const TG: SignSymbol = { title: 'tg', latex: 'tg', label: 'tg', fn: true }
const CTG: SignSymbol = { title: 'ctg', latex: 'ctg', label: 'ctg', fn: true }
const ARCSIN: SignSymbol = {
  title: 'arcsin',
  latex: '\\arcsin',
  label: 'arcsin',
  fn: true,
}
const ARCCOS: SignSymbol = {
  title: 'arccos',
  latex: '\\arccos',
  label: 'arccos',
  fn: true,
}
const ARCTG: SignSymbol = {
  title: 'arctg',
  latex: '\\operatorname{arctg}',
  label: 'arctg',
  fn: true,
}
const ARCCTG: SignSymbol = {
  title: 'arcctg',
  latex: '\\operatorname{arcctg}',
  label: 'arcctg',
  fn: true,
}

const DELETE = MAIN.find((s) => s.label === 'Delete')!

/**
 * Interval page = the digits page with its function cells swapped (the way
 * the DS turns Basic into Advanced): everything an interval or a union is
 * typed with sits on one page, no swiping mid-answer. Digits, the operator
 * column, x/y, «;» and «,» stay where they were.
 *
 *   (   [   ]   )   ⌫          was  <   >   ≠   =   ⌫
 *   x/y 7   8   9   ÷
 *   ∞   4   5   6   ×               x²
 *   ∪   1   2   3   −               x³
 *   π   ;   0   ,   +               ( )
 */
const INTERVAL_CELLS: Record<string, SignSymbol> = {
  '<': OPEN_ROUND,
  '>': OPEN_SQUARE,
  '≠': CLOSE_SQUARE,
  '=': CLOSE_ROUND,
  'x²': INFINITY,
  'x³': UNION,
  '( )': PI,
}

/** The DS «Additional» page, its first row as drawn: sin cos tan ctg ⌫. */
const TRIGONOMETRY_PAGE: SignSymbol[] = [
  SIN,
  COS,
  TG,
  CTG,
  DELETE,
  ARCSIN,
  ARCCOS,
  ARCTG,
  ARCCTG,
  POWER,
  PI,
  ROOT,
  NTH_ROOT,
  DEGREE,
]

export interface TaskKeyboard {
  set: KeySetName | null
  /** The digits page. */
  main: SignSymbol[]
  /** A page after the digits: the task's signs that don't fit there. */
  extra: SignSymbol[] | null
}

const swap = (cells: Record<string, SignSymbol>) =>
  MAIN.map((s) => cells[s.title] ?? s)

const KEYBOARDS: Record<KeySetName, Omit<TaskKeyboard, 'set'>> = {
  // the rare ones of an interval answer: a point {2}, no solutions ∅,
  // √2 and log₂5 as an end
  interval: {
    main: swap(INTERVAL_CELLS),
    extra: [OPEN_BRACE, CLOSE_BRACE, EMPTY_SET, ROOT, DELETE, LOG],
  },
  // (−π/4 + πk; arctg 7 + πk): the interval page, the functions after it
  intervalTrig: { main: swap(INTERVAL_CELLS), extra: TRIGONOMETRY_PAGE },
  trigonometry: { main: MAIN, extra: TRIGONOMETRY_PAGE },
  pi: { main: MAIN, extra: [PI, DELETE] },
  vector: { main: MAIN, extra: [VECTOR, DELETE] },
  degree: { main: MAIN, extra: [DEGREE, DELETE] },
  root: { main: MAIN, extra: [ROOT, NTH_ROOT, POWER, DELETE] },
  // a system's pairs: (2log₃2; log₇5), (log₃5; 2log₇2)
  log: { main: MAIN, extra: [LOG, DELETE] },
}

const SET_BY_TASK = new Map<string, KeySetName>(
  (Object.keys(TASK_KEY_SETS) as KeySetName[]).flatMap((set) =>
    TASK_KEY_SETS[set].map((key) => [key, set] as const),
  ),
)

/** «Elixir.Task_10_1_10_1» / «Task_10_1_10_1» / «10_1_10_1» → «10_1_10_1». */
export const taskKey = (taskType: string | undefined) =>
  (taskType ?? '').replace(/^Elixir\./, '').replace(/^Task_/, '')

export const keySetForTask = (taskType: string | undefined) =>
  SET_BY_TASK.get(taskKey(taskType)) ?? null

export const keyboardForTask = (taskType: string | undefined): TaskKeyboard => {
  const set = keySetForTask(taskType)
  if (!set) return { set: null, main: MAIN, extra: null }
  return { set, ...KEYBOARDS[set] }
}
