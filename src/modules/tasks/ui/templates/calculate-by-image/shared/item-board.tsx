import clsx from 'clsx'

import type { PoolItem } from '../lib/parse-calculate-by-image'

import styles from './calculate-by-image.module.scss'

interface Labels {
  add: string
  remove: string
  zone: string
}

interface Props {
  zone: PoolItem[]
  pool: PoolItem[]
  capacity: number
  /** Overrides the capacity rule when adding means something else (transform). */
  canAdd?: boolean
  zonePicture: string | null
  labels: Labels
  /** No handlers — the solution view and «count only» tasks. */
  onAdd?: (item: PoolItem) => void
  onRemove?: (index: number) => void
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
 * in the row to put one more into the zone, tap an item in the zone to take
 * it back. Tapping, not dragging — the conditions say so themselves
 * («нажимая на нужные фигуры», Task_3_1_4_1).
 */
export const ItemBoard = ({
  zone,
  pool,
  capacity,
  canAdd,
  zonePicture,
  labels,
  onAdd,
  onRemove,
}: Props) => {
  const isFull = canAdd === undefined ? zone.length >= capacity : !canAdd

  return (
    <div className={styles.board}>
      <div
        className={clsx(
          styles.zone,
          zone.length === 0 && styles.zoneEmpty,
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
        <div className={styles.zoneItems}>
          {zone.map((item, index) =>
            onRemove ? (
              <button
                key={`${item.index}-${index}`}
                type="button"
                className={styles.zoneItem}
                aria-label={labels.remove}
                data-testid="cbi-zone-item"
                onClick={() => onRemove(index)}
              >
                <ItemImage html={item.html} />
              </button>
            ) : (
              <span
                key={`${item.index}-${index}`}
                className={styles.zoneItem}
                data-testid="cbi-zone-item"
              >
                <ItemImage html={item.html} />
              </span>
            ),
          )}
        </div>
      </div>

      {onAdd && pool.length > 0 ? (
        <div className={styles.pool} data-testid="cbi-pool">
          {pool.map((item) => (
            <button
              key={item.index}
              type="button"
              className={styles.poolItem}
              aria-label={labels.add}
              disabled={isFull}
              data-testid="cbi-pool-item"
              onClick={() => onAdd(item)}
            >
              <ItemImage html={item.html} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
