import type { TaskModalProps } from '../types/props'

/**
 * Word forms that agree with a number, written by the task authors as one
 * token: «год|года|лет», «тысяч|а|и», «цвет|ок|ка|ков», «сот(ня|ни|ен)».
 * Neither the backend nor the host picks the form, so the child saw the raw
 * token next to the field (4_1_8 on 2.2.2, 05.10).
 *
 * The number is the one the child is about to type, unknown here, so the
 * label takes the «many» form — the one the neighbouring labels already use
 * («десятков тысяч»): «лет», «тысяч», «цветков», «сотен».
 */

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

const manyFromPipes = (stem: string, rest: string[]) => {
  // Whole words start like the stem and are about as long: «год|года|лет»,
  // «день|дня|дней». Endings are short: «тысяч|а|и», «цвет|ок|ка|ков».
  const wholeWords =
    rest[0].length >= stem.length - 1 && rest[0][0] === stem[0].toLowerCase()
  if (wholeWords) return rest[rest.length - 1]
  // Endings: two — the bare stem is «many» (тысяч|а|и); three — the last one
  // (цвет|ок|ка|ков).
  return rest.length === 2 ? stem : stem + rest[rest.length - 1]
}

export const resolveWordForms = (text: string): string => {
  if (!text.includes('|')) return text
  return text
    .replace(BRACKETS, (_, stem: string, alts: string) => {
      const forms = alts.split('|')
      return stem + forms[forms.length - 1]
    })
    .replace(PIPES, (_, stem: string, tail: string) =>
      manyFromPipes(stem, tail.split('|').slice(1)),
    )
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
