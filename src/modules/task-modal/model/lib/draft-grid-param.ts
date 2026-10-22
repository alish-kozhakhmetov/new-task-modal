import { DRAFT_GRIDS, type DraftGrid } from '@/modules/canvas/lib/key-row'

/**
 * `?draftGrid=keys|equal` — the draft's panel in the keyboard's cells, В1 or
 * В2 (Alisher, 23.10), on the test site without a site release: the choice
 * is his, then one stays and the flag goes. The host's `draftGrid` prop wins.
 */
export const DRAFT_GRID_PARAM = 'draftGrid'

export const draftGridFromSearch = (
  search: string | undefined,
): DraftGrid | undefined => {
  const value = new URLSearchParams(search ?? '').get(DRAFT_GRID_PARAM)
  return DRAFT_GRIDS.find((grid) => grid === value)
}
