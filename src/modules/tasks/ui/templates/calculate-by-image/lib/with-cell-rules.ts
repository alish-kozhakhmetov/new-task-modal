import type { CalculateByImageModel } from './parse-calculate-by-image'
import type { CalculateByImageDescription } from './types.task'

/**
 * What the pupil does with the items before typing the number. Read from the
 * payload flags and the old screen (`TaskDescriptionAndAnswerInput.jsx`,
 * calculateByImageWithCell branch):
 * - transform — the zone holds `constItem`s (rabbit without a carrot); a tap
 *   on the row turns the next one into the row's item (rabbit with a carrot);
 * - add — the row adds items («Добавьте ему 3 морковки»);
 * - remove — no row, tap an item to take it out («Уберите 1 куб»);
 * - count — `withoutRemoveItem`, or `itemsMaxQuantity: 0` («Есть 2 кубика.
 *   Сколько будет, если не добавлять?», Task_0_8_1_4): items only to be
 *   counted. The old screen shows the field from the start there and hides
 *   the row when `withInput` is set; here the row is hidden always, adding
 *   would only be a trap.
 */
export type WithCellMode = 'transform' | 'add' | 'remove' | 'count'

/** `itemsMaxQuantity` as the old screen compares it: absent — no limit. */
const declaredMax = (description: CalculateByImageDescription): number =>
  description.itemsMaxQuantity == null
    ? Number.NaN
    : Number(description.itemsMaxQuantity)

export const withCellMode = (
  description: CalculateByImageDescription,
  model: CalculateByImageModel,
): WithCellMode => {
  if (description.withoutRemoveItem) return 'count'
  if (declaredMax(description) === 0) return 'count'
  const constKey = description.constItem
    ? JSON.stringify(description.constItem.id)
    : null
  const transforms =
    constKey != null &&
    model.pool.length > 0 &&
    model.preplaced.some((item) => JSON.stringify(item.id) === constKey)
  if (transforms) return 'transform'
  /*
   * Taking away, even with a row present: the target count is below the
   * start («В корзинке есть 2 апельсина. Уберите 1»: 2 → 1, Task_0_8_16_1;
   * «12 – 6 = ?», Task_2_3_41_8), or the old screen hides the row until the
   * zone drops under `itemsMinQuantity` (Task_0_8_12_1).
   */
  const start = model.preplaced.length
  const correct = Number(description.itemsCorrectQuantity) || 0
  const min = Number(description.itemsMinQuantity) || 0
  if (model.pool.length === 0) return 'remove'
  if (correct > 0 && correct < start) return 'remove'
  if (min > 0 && start >= min) return 'remove'
  return 'add'
}

/**
 * Old screen rule for showing the question and the field: from the start
 * with `withInputBefore` or `withoutRemoveItem`; otherwise once the pupil
 * used all taps (`itemsMaxQuantity`) or the zone holds
 * `itemsCorrectQuantity` items. Here it stays shown once it appeared, so it
 * does not blink while the pupil keeps tapping.
 */
export const isFieldDue = (
  description: CalculateByImageDescription,
  taps: number,
  zoneSize: number,
): boolean => {
  if (description.withInputBefore || description.withoutRemoveItem) return true
  // old screen: `size(selectedIndexes) === itemsMaxQuantity`, so 0 — at once
  const max = declaredMax(description)
  const correct = Number(description.itemsCorrectQuantity)
  if (Number.isFinite(max) && taps >= max) return true
  return Number.isFinite(correct) && zoneSize === correct
}
