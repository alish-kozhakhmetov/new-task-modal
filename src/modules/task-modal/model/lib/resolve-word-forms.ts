import type { TaskModalProps } from '../types/props'

/**
 * Word forms that agree with a number, written by the task authors as one
 * token: «год|года|лет», «тысяч|а|и», «цвет|ок|ка|ков», «сот(ня|ни|ен)».
 * Neither the backend nor the host picks the form, so the child saw the raw
 * token next to the field (4_1_8 on 2.2.2, 05.10).
 *
 * The text first gets the «many» form — right for an empty field and the one
 * the neighbouring labels use («десятков тысяч»): «лет», «тысяч», «сотен».
 * The word is followed by an invisible WORD JOINER so the screen can find it
 * again: next to a field it agrees with the number the child types
 * (`useWordFormAgreement`). Words without the mark are never touched.
 */

export interface WordForms {
  /** 1, 21, 101 — «год» */
  one: string
  /** 2–4, 22–24, fractions — «года» */
  few: string
  /** 0, 5–20, 25… and an empty field — «лет» */
  many: string
}

/** Invisible, default-ignorable: no glyph, no width. */
export const WORD_FORM_MARK = '⁠'

const registry = new Map<string, WordForms>()

/** Forms of a word the text resolved earlier, by its «many» form. */
export const wordFormsOf = (many: string) => registry.get(many.toLowerCase())

const LETTERS = 'А-Яа-яЁё'

// «сот(ня|ни|ен)», «месяц(а|ов)» — stem with alternatives in brackets.
const BRACKETS = new RegExp(
  `([${LETTERS}]*[а-яё])\\(([а-яё]+(?:\\|[а-яё]+)+)\\)`,
  'g',
)

// «год|года|лет», «тысяч|а|и». The stem has a lowercase letter, so a segment
// written as «|АВ|» is not taken for a word.
const PIPES = new RegExp(
  `([${LETTERS}]*[а-яё][${LETTERS}]*)((?:\\|[а-яё]*){2,3})(?![${LETTERS}|])`,
  'g',
)

const fromBrackets = (stem: string, alts: string[]): WordForms =>
  alts.length >= 3
    ? { one: stem + alts[0], few: stem + alts[1], many: stem + alts[2] }
    : { one: stem, few: stem + alts[0], many: stem + alts[1] }

const fromPipes = (stem: string, rest: string[]): WordForms => {
  // Whole words start like the stem and are about as long: «год|года|лет»,
  // «день|дня|дней». Endings are short: «тысяч|а|и», «цвет|ок|ка|ков».
  const wholeWords =
    rest[0].length >= stem.length - 1 && rest[0][0] === stem[0].toLowerCase()
  if (wholeWords)
    return { one: stem, few: rest[0], many: rest[rest.length - 1] }
  // Two endings — the bare stem is «many» (тысяч|а|и); three — the last one
  // (цвет|ок|ка|ков).
  return rest.length === 2
    ? { one: stem + rest[0], few: stem + rest[1], many: stem }
    : { one: stem + rest[0], few: stem + rest[1], many: stem + rest[2] }
}

const emit = (forms: WordForms) => {
  registry.set(forms.many.toLowerCase(), forms)
  return forms.many + WORD_FORM_MARK
}

export const resolveWordForms = (text: string): string => {
  if (!text.includes('|')) return text
  return text
    .replace(BRACKETS, (_, stem: string, alts: string) =>
      emit(fromBrackets(stem, alts.split('|'))),
    )
    .replace(PIPES, (_, stem: string, tail: string) =>
      emit(fromPipes(stem, tail.split('|').slice(1))),
    )
}

/**
 * The form for what the field holds. Russian agreement: 1 (not 11) → one;
 * 2–4 (not 12–14) → few; a decimal or a fraction → few («2,5 года»);
 * anything else, including an empty field, → many.
 */
export const pickWordForm = (forms: WordForms, value: string): string => {
  const v = value.replace(/[\s\u00a0\u200b-\u200d\u2060\ufeff]/g, '')
  if (/^\d+$/.test(v)) {
    const n = Number(v.slice(-2))
    const last = n % 10
    if (last === 1 && n !== 11) return forms.one
    if (last >= 2 && last <= 4 && (n < 12 || n > 14)) return forms.few
    return forms.many
  }
  if (/^\d+[.,]\d+$/.test(v) || v.includes('\\frac')) return forms.few
  return forms.many
}

/**
 * Every task text goes through the host's `translateTasks`; word forms the
 * host leaves raw («год|года|лет») are resolved on its result. The host's
 * `global` is extended, not copied: it may be a class instance whose other
 * methods need their prototype.
 */
export const withWordForms = (props: TaskModalProps): TaskModalProps => {
  const host = props.deps.global
  const global = Object.create(host) as typeof host
  global.translateTasks = (text, language) =>
    resolveWordForms(host.translateTasks(text, language))
  return { ...props, deps: { ...props.deps, global } }
}
