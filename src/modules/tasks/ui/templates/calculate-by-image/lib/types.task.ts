import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `calculateByImage` and `calculateByImageWithCell`.
 *
 * Fields are listed only as far as the template reads them. The rest
 * (`topPosition`, `isFromLeft`, `leftPosition`, `nextItemStartAfter`, …)
 * place items in absolute pixels on the old 600px screen and are ignored on
 * purpose: on a 343px column they push items off the zone.
 */

export interface SelectableItem {
  /** Inline SVG (sometimes an HTML `<div>` card). */
  image: string
  /** Goes to the backend as is; repeats are meaningful (`["lego", "lego"]`). */
  id: string | number
}

export interface CalculateByImageDescription {
  type: 'calculateByImage' | 'calculateByImageWithCell'
  /** The pool the pupil taps. */
  selectableItems?: SelectableItem[]
  /** Already in the zone when the task opens; counted in the answer. */
  items?: SelectableItem[]
  /** Zone capacity. */
  itemsMaxQuantity?: number
  maxItemsPerRow?: number
  textBefore?: Translation | string | null
  textAfter?: Translation | string | null
  imageBefore?: string | Translation | null
  /** Either a picture (`<svg`) the items lie on, or a bordered `<div>` box. */
  backgroundImage?: string | Translation | null
  /** withCell: the zone holds these «before» items; the row has the «after» ones. */
  constItem?: SelectableItem | null
  /** withCell: the pupil only counts, items in the zone stay put. */
  withoutRemoveItem?: boolean
  [key: string]: unknown
}

export interface CalculateByImageTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_0_10_5_2`. */
  type: string
  title: Translation | string | null
  description: CalculateByImageDescription
  fields?: Record<string, unknown>
  answerInput?: {
    type?: number
    before?: string | Translation
    after?: string | Translation
  }
  answer?: string | null
  solution?: TaskSolution | string | null
}
