import clsx from 'clsx'
import { Fragment, type CSSProperties } from 'react'

import type {
  PoolItem,
  ZoneLayout,
  ZonePlacement,
} from '../lib/parse-calculate-by-image'

import styles from './calculate-by-image.module.scss'

interface Labels {
  add: string
  remove: string
  zone: string
}

export interface ZoneEntry {
  item: PoolItem
  /** Locked items (already there when the task opened) do not go back. */
  removable: boolean
}

interface Props {
  zone: ZoneEntry[]
  pool: PoolItem[]
  /** One-time row: these catalog indexes are in the zone, their place stays empty. */
  taken?: Set<number>
  /** `false` disables the row (zone full, taps used up). */
  canAdd: boolean
  layout: ZoneLayout
  separator: boolean
  perRow: number
  zonePicture: string | null
  placement: ZonePlacement
  labels: Labels
  /** No handlers — the solution view and «count only» tasks. */
  onAdd?: (item: PoolItem) => void
  onRemove?: (zoneIndex: number) => void
}

const ItemImage = ({ html }: { html: string }) => (
  <span
    className={styles.itemImage}
    aria-hidden
    dangerouslySetInnerHTML={{ __html: html }}
  />
)

/**
 * The zone and the row of items under it, as on the old screen: tap an item
 * in the row to put it into the zone, tap an item in the zone to take it
 * back. Tapping, not dragging — the conditions say so themselves
 * («нажимая на нужные фигуры», Task_3_1_4_1).
 */
export const ItemBoard = ({
  zone,
  pool,
  taken,
  canAdd,
  layout,
  separator,
  perRow,
  zonePicture,
  placement,
  labels,
  onAdd,
  onRemove,
}: Props) => {
  const vars = { '--cbi-per-row': perRow } as CSSProperties
  const placed: CSSProperties = zonePicture
    ? {
        ...(placement.top ? { top: placement.top, bottom: 'auto' } : {}),
        ...(placement.left ? { left: placement.left, right: 'auto' } : {}),
        ...(placement.right ? { right: placement.right, left: 'auto' } : {}),
      }
    : {}

  return (
    <div className={styles.board} style={vars}>
      <div
        className={clsx(
          styles.zone,
          zone.length === 0 && !zonePicture && styles.zoneEmpty,
          zonePicture && styles.zoneWithPicture,
        )}
        role="group"
        aria-label={labels.zone}
        data-testid="cbi-zone"
      >
        {zonePicture ? (
          <div
            className={styles.zonePicture}
            aria-hidden
            dangerouslySetInnerHTML={{ __html: zonePicture }}
          />
        ) : null}
        <div
          className={clsx(
            styles.zoneItems,
            layout === 'lego' && styles.zoneItemsLego,
            layout === 'column' && styles.zoneItemsColumn,
            placement.top && styles.zoneItemsFromTop,
          )}
          style={placed}
        >
          {zone.map(({ item, removable }, index) => (
            <Fragment key={`${item.index}-${index}`}>
              {separator && index > 0 ? (
                <span className={styles.separator} aria-hidden>
                  ,
                </span>
              ) : null}
              {onRemove && removable ? (
                <button
                  type="button"
                  className={clsx(styles.zoneItem, styles.zoneItemButton)}
                  aria-label={labels.remove}
                  data-testid="cbi-zone-item"
                  data-index={item.index}
                  onClick={() => onRemove(index)}
                >
                  <ItemImage html={item.html} />
                </button>
              ) : (
                <span
                  className={styles.zoneItem}
                  data-testid="cbi-zone-item"
                  data-index={item.index}
                  data-locked={removable ? undefined : 'true'}
                >
                  <ItemImage html={item.html} />
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {onAdd && pool.length > 0 ? (
        <div className={styles.pool} data-testid="cbi-pool">
          {pool.map((item) =>
            taken?.has(item.index) ? (
              <span
                key={item.index}
                className={clsx(styles.poolItem, styles.poolItemTaken)}
                data-testid="cbi-pool-slot"
                aria-hidden
              >
                <span className={styles.poolGhost}>
                  <ItemImage html={item.buttonHtml ?? item.html} />
                </span>
              </span>
            ) : (
              <button
                key={item.index}
                type="button"
                className={styles.poolItem}
                aria-label={labels.add}
                disabled={!canAdd}
                data-testid="cbi-pool-item"
                data-index={item.index}
                onClick={() => onAdd(item)}
              >
                <ItemImage html={item.buttonHtml ?? item.html} />
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  )
}
