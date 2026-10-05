import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { Translation } from '@/types/api/task'

import { scopeSvg } from './scope-svg'
import type { CalculateByImageDescription, SelectableItem } from './types.task'

export type ItemId = SelectableItem['id'] | Translation

/**
 * One item of the task's catalog: everything in the zone at start, then one
 * entry per tappable kind in the row. The store keeps catalog indexes, not
 * ids — several kinds share an id (Task_1_13_8_4: every family member is
 * `family_member`, the pictures differ), so ids alone cannot say which
 * picture the pupil put into the zone.
 */
export interface CatalogItem {
  index: number
  id: ItemId
  image: unknown
}

export interface PoolItem extends CatalogItem {
  html: string
}

export interface CalculateByImageModel {
  pool: PoolItem[]
  /** Items in the zone when the task opens. */
  preplaced: PoolItem[]
  catalog: PoolItem[]
  capacity: number
  /** SVG picture the zone sits on; `null` for the plain box. */
  zonePicture: string | null
  textBefore: string
  textAfter: string
  imageBefore: string
}

type Translate = (value: Translation | string) => string

const toText = (value: unknown, translate: Translate): string => {
  if (value == null) return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

const rawItems = (raw: unknown): SelectableItem[] =>
  (Array.isArray(raw) ? raw : []).filter(
    (item): item is SelectableItem =>
      item != null && typeof item === 'object' && 'id' in item,
  )

/*
 * The row repeats one picture per unit at times (five identical chicks).
 * Only exact duplicates — same id and same picture — collapse into one
 * button; tapping it again takes another one.
 */
const sameKind = (item: SelectableItem) => JSON.stringify([item.id, item.image])

/** Order and indexes the store relies on; needs no translation. */
export const buildCatalog = (
  description: CalculateByImageDescription,
): { catalog: CatalogItem[]; preplacedCount: number } => {
  const preplaced = rawItems(description.items)
  const seen = new Set<string>()
  const pool = rawItems(description.selectableItems).filter((item) => {
    const kind = sameKind(item)
    if (seen.has(kind)) return false
    seen.add(kind)
    return true
  })
  const catalog = [...preplaced, ...pool].map((item, index) => ({
    index,
    id: item.id as ItemId,
    image: item.image,
  }))
  return { catalog, preplacedCount: preplaced.length }
}

/*
 * A background made only of rectangles is the old zone's frame or fill
 * (`<rect fill="lightcyan">`, a black 3px border) — the zone draws its own
 * frame from tokens. A real picture (basket, meadow, scales) has paths.
 */
const PICTURE_TAGS =
  /<(path|circle|ellipse|polygon|polyline|line|image|text)\b/i

const zonePictureFrom = (background: string): string | null =>
  background.includes('<svg') && PICTURE_TAGS.test(background)
    ? background
    : null

const DEFAULT_CAPACITY = 20

export const parseCalculateByImage = (
  description: CalculateByImageDescription,
  translate: Translate,
): CalculateByImageModel => {
  const { catalog: raw, preplacedCount } = buildCatalog(description)
  const catalog = raw.map((item) => ({
    ...item,
    html: scopeSvg(toText(item.image, translate), `cbi${item.index}-`),
  }))
  const preplaced = catalog.slice(0, preplacedCount)
  const declared = Number(description.itemsMaxQuantity)
  const capacity =
    Number.isFinite(declared) && declared > 0
      ? Math.max(declared, preplaced.length)
      : DEFAULT_CAPACITY

  return {
    pool: catalog.slice(preplacedCount),
    preplaced,
    catalog,
    capacity,
    zonePicture: zonePictureFrom(
      scopeSvg(toText(description.backgroundImage, translate), 'cbiz-'),
    ),
    textBefore: toText(description.textBefore, translate),
    textAfter: toText(description.textAfter, translate),
    imageBefore: scopeSvg(toText(description.imageBefore, translate), 'cbib-'),
  }
}

/*
 * Store format: JSON array of catalog indexes in tap order. `''` means
 * nothing was touched yet, which keeps «Проверить» disabled.
 */
export const encodeZone = (items: CatalogItem[]): string =>
  JSON.stringify(items.map((item) => item.index))

export const decodeZone = (answer: string): number[] | null => {
  if (!answer) return null
  try {
    const parsed: unknown = JSON.parse(answer)
    return Array.isArray(parsed) && parsed.every(Number.isInteger)
      ? (parsed as number[])
      : null
  } catch {
    return null
  }
}

/**
 * Wire format: `{ list: [{ image: '', id }] }` with raw ids — strings, numbers or
 * Translation objects (units «мм» in grade 3), repeats and tap order kept.
 * The backend rejects every string form (trainer-rebuild-context, «Ответ не
 * всегда строка»).
 */
export const toCalculateByImageApiAnswer = (
  answer: string,
  description: CalculateByImageDescription,
): { list: { image: ''; id: ItemId }[] } | null => {
  const indexes = decodeZone(answer)
  if (!indexes) return null
  const { catalog } = buildCatalog(description)
  const ids = indexes.map((index) => catalog[index]?.id)
  if (ids.some((id) => id === undefined)) return null
  // Same item shape as the old screen sends (test.qalan.kz, 05.10):
  // `{ image: "", id }`.
  return { list: ids.map((id) => ({ image: '' as const, id: id as ItemId })) }
}
