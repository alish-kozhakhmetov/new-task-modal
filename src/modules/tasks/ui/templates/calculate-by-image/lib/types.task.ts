import type { TaskSolution, Translation } from '@/types/api/task'

import type { ComplexTablePart } from '../../complex/lib/types.task'

/**
 * Backend payload for `calculateByImage` and `calculateByImageWithCell`
 * (`CalculateByImageTaskDescription`, matheducator_task_common).
 *
 * Fields are listed only as far as the template reads them. Pixel positions
 * made for the old 600px screen (`leftPosition: "0%"` aside: `afterLeftPosition`,
 * `nextItemStartAfter`, `itemsTopPositions`, `elementWidth`) are ignored on
 * purpose: on a 358px column they push items off the zone. Percent positions
 * over a picture are kept — they are relative to the picture itself.
 */

export interface SelectableItem {
  /** Inline SVG (sometimes an HTML `<div>` card or a Translation of one). */
  image: string | Translation
  /** Goes to the backend as is; repeats are meaningful (`["lego", "lego"]`). */
  id: string | number | Translation
}

export interface CalculateByImageDescription {
  type: 'calculateByImage' | 'calculateByImageWithCell'
  /** The row the pupil taps. */
  selectableItems?: SelectableItem[]
  /** Already in the zone when the task opens; counted in the answer. */
  items?: SelectableItem[]
  /**
   * plain: zone capacity (old screen hides the row at this size).
   * withCell: how many taps the row allows.
   */
  itemsMaxQuantity?: number
  /** Items per row in the zone on the old screen: sets the item size. */
  maxItemsPerRow?: number
  /**
   * `true` — each item of the row can be taken once (it leaves the row);
   * `false` — the row is a source, tap again for one more.
   */
  isChangable?: boolean
  /** `false` — lego bricks: items touch each other in the zone. */
  isNotLegoTask?: boolean
  /** Zone items bottom-up (rings of a pyramid). */
  vertical?: boolean
  isVertical?: boolean
  /** Commas between zone items («мм, см, дм»). The backend spells it so. */
  seperator?: boolean
  textBefore?: Translation | string | null
  textAfter?: Translation | string | null
  imageBefore?: string | Translation | null
  tableBefore?: ComplexTablePart | null
  tableAfter?: ComplexTablePart | null
  /** Either a picture (`<svg`) the items lie on, or a bordered `<div>` box. */
  backgroundImage?: string | Translation | null
  isFromTop?: boolean
  isFromLeft?: boolean
  isFromRight?: boolean
  topPosition?: string | number | null
  leftPosition?: string | number | null
  rightPosition?: string | number | null
  /** withCell: the zone holds these «before» items; the row has the «after» ones. */
  constItem?: SelectableItem | null
  /** withCell: the picture on the row button («carrot» for rabbit_with_carrot). */
  button?: SelectableItem | null
  /** withCell: the pupil only counts, items in the zone stay put. */
  withoutRemoveItem?: boolean
  /** withCell: the field is there from the start. */
  withInputBefore?: boolean
  /** withCell: the field appears once the zone holds this many items. */
  itemsCorrectQuantity?: number
  /** withCell: the row shows only while the zone holds fewer than this. */
  itemsMinQuantity?: number
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
