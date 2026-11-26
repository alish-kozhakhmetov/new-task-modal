/**
 * Port of the backend check, for Storybook and tests only — the live window
 * always asks the backend. Source: matheducator_task_common,
 * `TaskAnswers.CalculateByImageTaskAnswer.correct?/2` and
 * `TaskChecker.answer_correct?/3` (map answer → calculate_by_image? or
 * any_of_them?). Three rules, picked by the expected list:
 *
 * 1. a list of lists — any of them matches (sorted first when `sortable?`);
 * 2. ids starting with `coin` — the sums of the numbers after `coin` match
 *    (money: any combination with the right sum is correct);
 * 3. otherwise — the lists match as multisets (`sortable?: true`) or in
 *    order (`sortable?: false`). Repeats count: six rulers are not one.
 *
 * Ids are compared by value, as JSON: strings, numbers and translation maps
 * alike. Whether the backend also matches translation maps sent back as JSON
 * (`Task_3_15_*`, units «мм») is not checked live.
 */

export interface ExpectedListAnswer {
  list?: unknown
  'sortable?'?: boolean
  answers?: unknown
  _struct?: string
}

export interface WireListAnswer {
  list: { id: unknown }[]
}

const key = (value: unknown) => JSON.stringify(value)

const sortedKeys = (values: unknown[]) => values.map(key).sort()

const sameList = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index])

const coinValue = (id: unknown) => Number(String(id).replace(/^coin/, '')) || 0

/**
 * Variants when the reference is «any of them»: AnyOfThemTaskAnswer (tagged
 * `_struct` in the fixtures, a bare `{ answers }` from the generator itself)
 * or a plain list of answers (Task_2_3_44_24). `null` — a single answer.
 */
export const anyOfVariants = (expected: unknown): unknown[] | null => {
  if (Array.isArray(expected)) return expected as unknown[]
  if (!expected || typeof expected !== 'object') return null
  const { _struct, answers, list } = expected as ExpectedListAnswer
  const tagged =
    typeof _struct === 'string' && _struct.endsWith('AnyOfThemTaskAnswer')
  if (tagged || (list === undefined && Array.isArray(answers))) {
    return Array.isArray(answers) ? (answers as unknown[]) : []
  }
  return null
}

export const isCalculateByImageCorrect = (
  expected: ExpectedListAnswer | null | undefined,
  wire: WireListAnswer | null | undefined,
): boolean => {
  if (!expected || !wire || !Array.isArray(wire.list)) return false

  const variants = anyOfVariants(expected)
  if (variants) {
    return variants.some((answer) =>
      isCalculateByImageCorrect(answer as ExpectedListAnswer, wire),
    )
  }

  const list = expected.list
  // `list: 2`, `list: "frogfrog…"`: the backend's `hd/1` raises on these
  // (Task_3_7_*, Task_1_6_10_2) — no answer can be correct.
  if (!Array.isArray(list) || list.length === 0) return false

  const sortable = expected['sortable?'] !== false
  const user = wire.list.map((item) => item?.id)
  const userKeys = sortable ? sortedKeys(user) : user.map(key)

  if (Array.isArray(list[0])) {
    return list.some((variant) => {
      const values = Array.isArray(variant) ? variant : []
      const keys = sortable ? sortedKeys(values) : values.map(key)
      return sameList(keys, userKeys)
    })
  }

  // `String.starts_with?/2` on a number or a translation map raises on the
  // backend (units «мм», «мг»: Task_3_15_1_4, 3_15_2_3) — read from the code,
  // not seen live; mirrored as «never correct».
  if (typeof list[0] !== 'string') return false

  if (list[0].startsWith('coin')) {
    const sum = (ids: unknown[]) =>
      ids.reduce<number>((total, id) => total + coinValue(id), 0)
    return sum(list) === sum(user)
  }

  const expectedKeys = sortable ? sortedKeys(list) : list.map(key)
  return sameList(expectedKeys, userKeys)
}

/** withCell: the answer is an integer typed into the field. */
export const isCountCorrect = (expected: unknown, typed: string): boolean => {
  const value = typed.replace(/\s+/g, '')
  return value !== '' && value === String(expected)
}
