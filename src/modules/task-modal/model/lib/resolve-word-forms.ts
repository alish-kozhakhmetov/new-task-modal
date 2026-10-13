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

/**
 * The forms of one word, in the order the task's language counts them, and
 * the language that picks among them. «год|года|лет» in Russian is
 * one|few|many, «day|days» in English is one|other.
 */
export interface WordForms {
  locale: string
  forms: string[]
}

/** Invisible, default-ignorable: no glyph, no width. */
export const WORD_FORM_MARK = '\u2060'

/**
 * Host language → the locale whose plural rules pick a form, and the order of
 * forms the authors write («one|few|many» for Russian). An empty order: the
 * language puts a noun after a number in the singular (Kazakh, Kyrgyz, Uzbek,
 * Azerbaijani) — any forms written are read as one, the first. Arabic is not
 * resolved at all.
 */
const LANGUAGES: Record<string, { locale: string; order: string[] }> = {
  russian: { locale: 'ru', order: ['one', 'few', 'many'] },
  english: { locale: 'en', order: ['one', 'other'] },
  'kk-latyn': { locale: 'kk', order: [] },
  'kk-latin': { locale: 'kk', order: [] },
  'kk-cyrillic': { locale: 'kk', order: [] },
  'kk-latin_without_umlaut': { locale: 'kk', order: [] },
  kyrgyz: { locale: 'ky', order: [] },
  uzbek: { locale: 'uz', order: [] },
  azerbaijani: { locale: 'az', order: [] },
}

const DEFAULT_LANGUAGE = 'russian'

const registry = new Map<string, WordForms>()

/** Forms of a word the text resolved earlier, by the form it was shown in. */
export const wordFormsOf = (shown: string) => registry.get(shown.toLowerCase())

// Letters of every resolved language: Cyrillic with the Kazakh and Kyrgyz
// letters, Latin with the Uzbek and Azerbaijani ones and the Uzbek ʻ.
const L = "\\p{L}'ʻ’"
const LOWER = '\\p{Ll}'

// «сот(ня|ни|ен)», «месяц(а|ов)» — stem with alternatives in brackets. A
// bracket with no stem in front, «(год|года|лет)», is not this: its pipes are
// read by PIPES and the brackets stay — Alisher, 13.10: brackets on screen
// are not acceptable, the data has to change.
const BRACKETS = new RegExp(
  `([${L}]*${LOWER})\\((${LOWER}+(?:\\|${LOWER}+)+)\\)`,
  'gu',
)

// «год|года|лет», «тысяч|а|и», «day|days». The stem has a lowercase letter,
// so «|АВ|» is not a word. Three or four forms as before; two only as whole
// words of two letters or more, so a segment «|x|» or «a|b» stays as it is.
const PIPES = new RegExp(
  `([${L}]*${LOWER}[${L}]*)((?:\\|${LOWER}[${L}]*){1,3}|(?:\\|[${L}]*){2,3})(?![${L}|])`,
  'gu',
)

const fromBrackets = (stem: string, alts: string[]): string[] =>
  alts.length >= 3
    ? alts.map((a) => stem + a)
    : [stem, ...alts.map((a) => stem + a)]

const fromPipes = (stem: string, rest: string[]): string[] | null => {
  if (rest.length === 1) {
    // Two forms: whole words only («day|days»).
    return stem.length >= 2 && rest[0].length >= 2 ? [stem, rest[0]] : null
  }
  // Whole words start like the stem and are about as long: «год|года|лет»,
  // «день|дня|дней». Endings are short: «тысяч|а|и», «цвет|ок|ка|ков».
  const wholeWords =
    rest[0].length >= stem.length - 1 && rest[0][0] === stem[0].toLowerCase()
  if (wholeWords) return [stem, ...rest]
  // Two endings — the bare stem is the last form (тысяч|а|и); three — each
  // ending on the stem (цвет|ок|ка|ков).
  return rest.length === 2
    ? [stem + rest[0], stem + rest[1], stem]
    : rest.map((r) => stem + r)
}

/**
 * The form an empty field shows: the last one where the language counts forms
 * («лет», «days» — what the neighbouring labels use), the first otherwise.
 */
const restingForm = ({ locale, forms }: WordForms) =>
  orderOf(locale).length ? forms[forms.length - 1] : forms[0]

const orderOf = (locale: string) =>
  Object.values(LANGUAGES).find((l) => l.locale === locale)?.order ?? []

const emit = (forms: WordForms) => {
  const shown = restingForm(forms)
  registry.set(shown.toLowerCase(), forms)
  return shown + WORD_FORM_MARK
}

export const localeOf = (language?: string) =>
  LANGUAGES[language ?? DEFAULT_LANGUAGE]?.locale ?? null

export const resolveWordForms = (text: string, language?: string): string => {
  if (!text.includes('|')) return text
  const locale = localeOf(language)
  if (!locale) return text
  return text
    .replace(BRACKETS, (_, stem: string, alts: string) =>
      emit({ locale, forms: fromBrackets(stem, alts.split('|')) }),
    )
    .replace(PIPES, (whole, stem: string, tail: string) => {
      const forms = fromPipes(stem, tail.split('|').slice(1))
      return forms ? emit({ locale, forms }) : whole
    })
}

/** What the field holds as a number for plural rules; null — nothing yet. */
const numberOf = (value: string): number | null => {
  const v = value.replace(/[\s\u00a0\u200b-\u200d\u2060\ufeff]/g, '')
  if (/^\d+$/.test(v)) return Number(v)
  if (/^\d+[.,]\d+$/.test(v)) return Number(v.replace(',', '.'))
  // A fraction is counted as a non-integer: «½ года», «½ of a day».
  if (v.includes('\\frac')) return 0.5
  return null
}

/**
 * The form for what the field holds, by the plural rules of the task's
 * language (Intl.PluralRules). Russian «other» (fractions, 2,5) reads as few —
 * «2,5 года»; a category with no form of its own falls back to the last one.
 * A language that does not inflect after numbers takes the first form.
 */
export const pickWordForm = (word: WordForms, value: string): string => {
  const { locale, forms } = word
  const order = orderOf(locale)
  const n = numberOf(value)
  if (!order.length) return forms[0]
  if (n === null) return restingForm(word)
  let category = new Intl.PluralRules(locale).select(n)
  if (locale === 'ru' && category === 'other') category = 'few'
  // Forms that do not match the language's categories one to one: the first
  // still reads as «one», anything else falls back to the last form.
  if (forms.length !== order.length)
    return category === 'one' ? forms[0] : forms[forms.length - 1]
  return forms[order.indexOf(category)] ?? forms[forms.length - 1]
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
    resolveWordForms(
      host.translateTasks(text, language),
      language ?? host.getLanguage?.(),
    )
  return { ...props, deps: { ...props.deps, global } }
}
