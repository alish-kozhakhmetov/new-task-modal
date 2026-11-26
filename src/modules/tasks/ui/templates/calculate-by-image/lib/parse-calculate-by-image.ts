import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { Translation } from '@/types/api/task'

import type { ComplexTablePart } from '../../complex/lib/types.task'

import type { CalculateByImageDescription, SelectableItem } from './types.task'

export type ItemId = SelectableItem['id']

/**
 * One item of the task's catalog: everything in the zone at start, then one
 * entry per tappable item in the row. The store keeps catalog indexes, not
 * ids — several pictures share an id (Task_1_13_8_4: every family member is
 * `family_member`), so ids alone cannot say which picture is in the zone.
 */
export interface CatalogItem {
  index: number
  id: ItemId
  image: unknown
}

export interface PoolItem extends CatalogItem {
  html: string
  /**
   * Picture height against the tallest item of the task, from the SVGs' own
   * `height` (balls of 53, 68 and 90px in «от меньшего к большему»,
   * Task_0_6_3_9): the box stays the tap size, the picture keeps its size.
   */
  scale: number
  /**
   * Pyramid (`vertical`): the picture's width in px for the zone, its own
   * width times the task's one factor — rings keep their proportions.
   */
  columnWidth?: number
  /** Picture on the row button when it differs from the item (withCell `button`). */
  buttonHtml?: string
}

/** How items sit in the zone. */
export type ZoneLayout = 'row' | 'lego' | 'column'

export interface ZonePlacement {
  /** Items start at this share of the picture's height; `null` — centred. */
  top: string | null
  left: string | null
  right: string | null
}

export interface CalculateByImageModel {
  pool: PoolItem[]
  /** Items in the zone when the task opens. */
  preplaced: PoolItem[]
  catalog: PoolItem[]
  /** Zone capacity (plain) or tap limit (withCell). */
  capacity: number
  /** Each row item can be taken once (`isChangable`). */
  oneTime: boolean
  layout: ZoneLayout
  separator: boolean
  perRow: number
  /** SVG picture the zone sits on; `null` for the plain box. */
  zonePicture: string | null
  placement: ZonePlacement
  textBefore: string
  textAfter: string
  imageBefore: string
  tableBefore: ComplexTablePart | null
  tableAfter: ComplexTablePart | null
}

type Translate = (value: Translation | string) => string

export const toText = (value: unknown, translate: Translate): string => {
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
 * When the row is a source (`isChangable: false`), it may still repeat one
 * picture per unit (five identical chicks). Only exact duplicates — same id
 * and same picture — collapse into one button; tapping it again takes
 * another one. When each item can be taken once, every item stays.
 */
const sameKind = (item: SelectableItem) => JSON.stringify([item.id, item.image])

/** Order and indexes the store relies on; needs no translation. */
export const buildCatalog = (
  description: CalculateByImageDescription,
): { catalog: CatalogItem[]; preplacedCount: number } => {
  const preplaced = rawItems(description.items)
  const seen = new Set<string>()
  const oneTime = Boolean(description.isChangable)
  const pool = rawItems(description.selectableItems).filter((item) => {
    if (oneTime) return true
    const kind = sameKind(item)
    if (seen.has(kind)) return false
    seen.add(kind)
    return true
  })
  const catalog = [...preplaced, ...pool].map((item, index) => ({
    index,
    id: item.id,
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

/** Percent positions are relative to the picture; pixels are not kept. */
const percent = (value: unknown): string | null =>
  typeof value === 'string' &&
  /^\d+(\.\d+)?%$/.test(value.trim()) &&
  value.trim() !== '0%'
    ? value.trim()
    : null

const DEFAULT_CAPACITY = 20

const tablePart = (value: unknown): ComplexTablePart | null =>
  value != null &&
  typeof value === 'object' &&
  Array.isArray((value as { rows?: unknown }).rows)
    ? (value as ComplexTablePart)
    : null

/**
 * Drawn size of the picture's own `<svg>` in px, as the old screen shows it:
 * `height` (and `width`), less when they letterbox the viewBox (a butterfly
 * declared 50×310 over a square viewBox is drawn 50 high). `null` — no
 * height.
 */
const svgSize = (
  html: string,
): { width: number | null; height: number } | null => {
  const tag = /<svg\b[^>]*>/i.exec(html)?.[0]
  if (!tag) return null
  const attr = (name: string) => {
    const raw = new RegExp(`\\s${name}="\\s*([\\d.]+)\\s*(px)?\\s*"`, 'i').exec(
      tag,
    )
    const value = raw ? Number(raw[1]) : Number.NaN
    return Number.isFinite(value) && value > 0 ? value : null
  }
  const height = attr('height')
  if (!height) return null
  const width = attr('width')
  const box =
    /\sviewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(tag)
  if (!width || !box) return { width, height }
  const [vbWidth, vbHeight] = [Number(box[1]), Number(box[2])]
  if (!(vbWidth > 0 && vbHeight > 0)) return { width, height }
  const k = Math.min(width / vbWidth, height / vbHeight)
  return { width: vbWidth * k, height: vbHeight * k }
}

const svgHeight = (html: string): number | null => svgSize(html)?.height ?? null

/*
 * Pyramid rings lie on each other in their own proportions, as on the
 * picture of the task. One factor for the task: the thinnest ring becomes a
 * 44px tap target (Task_1_1_2_9: rings 15–32px high, ×2.9); the zone's width
 * caps the widest one.
 */
const TAP_MIN = 44

const columnFactor = (
  sizes: ({ width: number | null; height: number } | null)[],
) => {
  const heights = sizes.flatMap((size) => (size?.width ? [size.height] : []))
  if (heights.length === 0) return null
  return Math.max(1, TAP_MIN / Math.min(...heights))
}

/*
 * Sizes carry meaning (from smaller to bigger, a ten-rod against a cube), so
 * pictures keep their proportions — but not below 0.3 of the tallest: a
 * cube of 19px next to a rod of 160px would shrink to a speck in our box.
 */
const MIN_SCALE = 0.3

export const parseCalculateByImage = (
  description: CalculateByImageDescription,
  translate: Translate,
): CalculateByImageModel => {
  const { catalog: raw, preplacedCount } = buildCatalog(description)
  const button = description.button
    ? toText(description.button.image, translate)
    : ''
  const pictures = raw.map((item) => toText(item.image, translate))
  const heights = pictures.map(svgHeight)
  const tallest = Math.max(0, ...heights.map((h) => h ?? 0))
  const isColumn = Boolean(description.vertical || description.isVertical)
  const sizes = isColumn ? pictures.map(svgSize) : []
  const factor = isColumn ? columnFactor(sizes) : null
  const catalog = raw.map((item, index) => ({
    ...item,
    html: pictures[index],
    scale:
      heights[index] && tallest > 0
        ? Math.max(MIN_SCALE, heights[index] / tallest)
        : 1,
    columnWidth:
      factor && sizes[index]?.width
        ? Math.round((sizes[index]?.width ?? 0) * factor)
        : undefined,
    buttonHtml: index >= preplacedCount && button ? button : undefined,
  }))
  const preplaced = catalog.slice(0, preplacedCount)
  const declared = Number(description.itemsMaxQuantity)
  const capacity =
    Number.isFinite(declared) && declared > 0
      ? Math.max(declared, preplaced.length)
      : DEFAULT_CAPACITY
  const perRow = Number(description.maxItemsPerRow)

  const layout: ZoneLayout = isColumn
    ? 'column'
    : description.isNotLegoTask === false
      ? 'lego'
      : 'row'

  return {
    pool: catalog.slice(preplacedCount),
    preplaced,
    catalog,
    capacity,
    oneTime: Boolean(description.isChangable),
    layout,
    separator: Boolean(description.seperator),
    perRow: Number.isFinite(perRow) && perRow > 0 ? perRow : 5,
    zonePicture: zonePictureFrom(
      toText(description.backgroundImage, translate),
    ),
    placement: {
      top: description.isFromTop ? percent(description.topPosition) : null,
      left: description.isFromLeft ? percent(description.leftPosition) : null,
      right: description.isFromRight
        ? percent(description.rightPosition)
        : null,
    },
    textBefore: toText(description.textBefore, translate),
    textAfter: toText(description.textAfter, translate),
    imageBefore: toText(description.imageBefore, translate),
    tableBefore: tablePart(description.tableBefore),
    tableAfter: tablePart(description.tableAfter),
  }
}

/*
 * Store format: JSON array of catalog indexes in tap order, preplaced items
 * included. `''` means nothing was touched yet, which keeps «Проверить»
 * disabled.
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
 * Wire format: `{ list: [{ image: '', id }] }` with raw ids — strings, numbers
 * or translation objects, repeats and tap order kept. The old screen sends
 * the same: description items first, then the pupil's, `image` blanked
 * (`TaskModalActions.js`, calculateByImage branch). The backend rejects every
 * string form.
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
  return { list: ids.map((id) => ({ image: '' as const, id: id })) }
}
