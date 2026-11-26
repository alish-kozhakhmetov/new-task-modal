import {
  anyOfVariants,
  type ExpectedListAnswer,
} from './check-calculate-by-image'
import { buildCatalog } from './parse-calculate-by-image'
import type { CalculateByImageDescription } from './types.task'

/**
 * For tests, stories and the coverage audit: which row items (catalog
 * indexes, in tap order) the pupil has to tap so that the zone matches the
 * backend's reference. `null` — the reference cannot be built in this
 * template (an id missing from the row, too few one-time items, capacity).
 *
 * The reference is taken literally: for money it is the backend's own
 * combination; any other combination with the same sum is correct too.
 */
export const solveCalculateByImage = (
  description: CalculateByImageDescription,
  expected: ExpectedListAnswer | null | undefined,
): number[] | null => {
  if (!expected) return null

  const variants = anyOfVariants(expected)
  if (variants) {
    for (const answer of variants) {
      const plan = solveCalculateByImage(
        description,
        answer as ExpectedListAnswer,
      )
      if (plan) return plan
    }
    return null
  }

  const list = expected.list
  if (!Array.isArray(list) || list.length === 0) return null
  if (Array.isArray(list[0])) {
    for (const variant of list) {
      const plan = solveCalculateByImage(description, {
        list: variant,
        'sortable?': expected['sortable?'],
      })
      if (plan) return plan
    }
    return null
  }

  const { catalog, preplacedCount } = buildCatalog(description)
  const key = (value: unknown) => JSON.stringify(value)
  const preplaced = catalog.slice(0, preplacedCount).map((item) => key(item.id))
  const sortable = expected['sortable?'] !== false
  const wanted = list.map(key)
  const declared = Number(description.itemsMaxQuantity)
  const capacity =
    Number.isFinite(declared) && declared > 0
      ? Math.max(declared, preplacedCount)
      : 20
  if (wanted.length > capacity) {
    return isCoin(list[0]) ? solveCoinSum(description, list, capacity) : null
  }

  // What the pupil adds: the reference minus what is already there.
  let toAdd: string[]
  if (sortable) {
    const rest = [...wanted]
    for (const id of preplaced) {
      const at = rest.indexOf(id)
      if (at < 0) return null
      rest.splice(at, 1)
    }
    toAdd = rest
  } else {
    if (!preplaced.every((id, index) => wanted[index] === id)) return null
    toAdd = wanted.slice(preplaced.length)
  }

  const pool = catalog.slice(preplacedCount)
  const used = new Set<number>()
  const plan: number[] = []
  for (const id of toAdd) {
    const item = pool.find(
      (it) =>
        key(it.id) === id && !(description.isChangable && used.has(it.index)),
    )
    if (!item) {
      return isCoin(list[0]) ? solveCoinSum(description, list, capacity) : null
    }
    used.add(item.index)
    plan.push(item.index)
  }
  return plan
}

const isCoin = (id: unknown) => typeof id === 'string' && id.startsWith('coin')
const coinValue = (id: unknown) => Number(String(id).replace(/^coin/, '')) || 0

/**
 * Money: the backend compares sums, so when its own combination does not fit
 * the zone (11 coins, `itemsMaxQuantity: 10`) the fewest coins for the same
 * sum are tried — largest first, optimal for tenge denominations.
 */
const solveCoinSum = (
  description: CalculateByImageDescription,
  list: unknown[],
  capacity: number,
): number[] | null => {
  const { catalog, preplacedCount } = buildCatalog(description)
  const preplacedSum = catalog
    .slice(0, preplacedCount)
    .reduce((sum, item) => sum + coinValue(item.id), 0)
  let rest =
    list.reduce<number>((sum, id) => sum + coinValue(id), 0) - preplacedSum
  const coins = catalog
    .slice(preplacedCount)
    .filter((item) => isCoin(item.id) && coinValue(item.id) > 0)
    .sort((a, b) => coinValue(b.id) - coinValue(a.id))
  const used = new Set<number>()
  const plan: number[] = []
  for (const coin of coins) {
    const value = coinValue(coin.id)
    while (
      rest >= value &&
      !(description.isChangable && used.has(coin.index))
    ) {
      used.add(coin.index)
      plan.push(coin.index)
      rest -= value
    }
  }
  if (rest !== 0 || preplacedCount + plan.length > capacity) return null
  return plan
}
