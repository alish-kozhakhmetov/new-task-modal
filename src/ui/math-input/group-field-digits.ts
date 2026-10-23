/**
 * Digit grouping in the answer field (rule 100, Alisher 23.10): the pupil's
 * «50000» reads «50 000», as the numbers of the condition do. Only the look:
 * the gap is a margin on the last digit of a class — no character goes into
 * the field, so `latex()`, the store and the check request keep «50000», and
 * the caret, ⌫, selection and paste step over digits as if there were no gap.
 *
 * Same rule as the text (`ui/math-text/group-digits.ts`): an integer of
 * `from` digits or more (5) is split into classes of three from the right;
 * the fraction part after «,» or «.» stays solid; `from: null` (column
 * arithmetic, GROUPING_OFF_TASKS) switches it off.
 */

/** Set on a digit followed by a class gap; the gap itself is CSS. */
export const DIGIT_GAP_ATTR = 'data-ntm-digit-gap'

/** MathQuill (0.10 and our fork) marks every rendered command and block. */
const COMMAND_ID = 'mathquill-command-id'
const BLOCK_ID = 'mathquill-block-id'

const DECIMAL_MARKS = new Set([',', '.'])

/**
 * Indexes of the symbols a gap follows, for a run of one-character symbols
 * as typed in one MathQuill block («12345,678» → [1]: 12 345,678). A symbol
 * that is neither a digit nor a decimal mark is any other character.
 */
export const classGapsAfter = (symbols: string, from: number): number[] => {
  const out: number[] = []
  for (const match of symbols.matchAll(/\d+/g)) {
    const start = match.index
    const run = match[0]
    if (run.length < from) continue
    if (DECIMAL_MARKS.has(symbols[start - 1] ?? '')) continue
    for (let rest = run.length - 3; rest > 0; rest -= 3)
      out.push(start + rest - 1)
  }
  return out.sort((a, b) => a - b)
}

/** The run as it reads on screen, gaps as spaces — for tests. */
export const showClassGaps = (symbols: string, from: number): string => {
  const gaps = new Set(classGapsAfter(symbols, from))
  return [...symbols].map((ch, i) => (gaps.has(i) ? `${ch} ` : ch)).join('')
}

/**
 * The commands of one block, left to right. The selection wrapper is
 * see-through (MathQuill moves the selected symbols into it), the caret
 * and anything that is not a command are skipped.
 */
const blockCommands = (block: Element): Element[] => {
  const out: Element[] = []
  for (const child of block.children) {
    if (child.classList.contains('mq-selection'))
      out.push(...blockCommands(child))
    else if (child.hasAttribute(COMMAND_ID)) out.push(child)
  }
  return out
}

/** A command as one character: its digit or mark, any other symbol as «x». */
const symbolOf = (command: Element): string => {
  if (command.childElementCount > 0) return 'x'
  const text = command.textContent ?? ''
  return /^\d$/.test(text) || DECIMAL_MARKS.has(text) ? text : 'x'
}

/**
 * Marks the digits that end a class in every block of a MathQuill field
 * (the root and the floors of fractions, exponents, roots). Idempotent;
 * touches only the attributes that change.
 */
export const groupFieldDigits = (field: Element, from: number | null) => {
  const blocks = field.querySelectorAll(`[${BLOCK_ID}]`)
  for (const block of blocks) {
    const commands = blockCommands(block)
    const gaps =
      from === null
        ? new Set<number>()
        : new Set(classGapsAfter(commands.map(symbolOf).join(''), from))
    commands.forEach((command, i) => {
      const has = command.hasAttribute(DIGIT_GAP_ATTR)
      if (gaps.has(i) && !has) command.setAttribute(DIGIT_GAP_ATTR, '')
      if (!gaps.has(i) && has) command.removeAttribute(DIGIT_GAP_ATTR)
    })
  }
}

/**
 * Keeps a field grouped while MathQuill edits it: typing, ⌫, paste, the
 * calculator, `latex()`. A mutation observer, not the `edit` handler —
 * MathQuill re-renders on `latex()` too, and its callback runs before the
 * frame is painted, so the gap never lags a keystroke. Our own attribute
 * changes are not observed.
 */
export const observeFieldDigits = (
  field: Element,
  getFrom: () => number | null,
): (() => void) => {
  const regroup = () => {
    groupFieldDigits(field, getFrom())
  }
  const observer = new MutationObserver(regroup)
  observer.observe(field, { childList: true, subtree: true })
  regroup()
  return () => {
    observer.disconnect()
  }
}
