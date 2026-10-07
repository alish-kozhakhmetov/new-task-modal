import type { PointerEvent } from 'react'

import {
  PlaneAxes,
  PlaneDot,
  PlaneFigure,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-figures'
import {
  fromPointToDot,
  planeLength,
  type PlaneOptions,
  type PlanePoint,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'

import {
  labelPlace,
  nearestNode,
  nodeLabel,
  type Node,
} from '../lib/plane-answer'

import styles from './coordinate-plane.module.scss'

interface Props {
  options: PlaneOptions
  figures: Record<string, unknown>[]
  points: PlanePoint[]
  selected: Node[]
  /** Draw the pupil's two picks as a segment (`drawingFigure` 30). */
  segment?: boolean
  translate: (value: unknown) => string
  /** No handler — the solution view. */
  onPick?: (node: Node) => void
  label: string
}

/**
 * The plane at its real pixel size (math-illustrations §1) with a tap layer:
 * a tap anywhere snaps to the nearest grid node. What the pupil marked is the
 * interactive layer — brand, white ring, its coordinates beside it (§5).
 */
export const PointBoard = ({
  options,
  figures,
  points,
  selected,
  segment = false,
  translate,
  onPick,
  label,
}: Props) => {
  const length = planeLength(options)

  const handlePointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!onPick) return
    const rect = event.currentTarget.getBoundingClientRect()
    // The SVG may be scaled down to the column (max-width: 100%).
    const scale = length / rect.width
    onPick(
      nearestNode(
        options,
        (event.clientX - rect.left) * scale,
        (event.clientY - rect.top) * scale,
      ),
    )
  }

  return (
    <svg
      className={styles.plane}
      role="img"
      aria-label={label}
      data-testid="plane-board"
      width={length}
      height={length}
      viewBox={`0 0 ${length} ${length}`}
      onPointerDown={handlePointer}
    >
      <PlaneAxes options={options} />
      {figures.map((figure, index) => (
        <PlaneFigure
          // figures are fixed for the task; their order is their identity
          // eslint-disable-next-line react-x/no-array-index-key
          key={`fig-${index}`}
          options={options}
          figure={figure}
          translate={translate}
        />
      ))}
      {points.map((point) => (
        <PlaneDot
          key={`pt-${point.x}-${point.y}`}
          options={options}
          point={point}
        />
      ))}
      {segment && selected.length === 2 ? (
        <line
          className={styles.pickedSegment}
          data-testid="plane-segment"
          {...(() => {
            const a = fromPointToDot(options, selected[0].x, selected[0].y)
            const b = fromPointToDot(options, selected[1].x, selected[1].y)
            return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
          })()}
        />
      ) : null}
      {selected.map((node) => {
        const at = fromPointToDot(options, node.x, node.y)
        const label = nodeLabel(node)
        const place = labelPlace({
          at,
          text: label,
          segmentTo:
            segment && selected.length === 2
              ? selected
                  .filter((other) => other !== node)
                  .map((other) => fromPointToDot(options, other.x, other.y))
              : [],
          axes: options.showAxis ? fromPointToDot(options, 0, 0) : null,
          size: length,
        })
        return (
          <g key={`sel-${node.x}-${node.y}`} data-testid="plane-picked">
            <circle className={styles.picked} cx={at.x} cy={at.y} r={6} />
            <text
              className={styles.pickedLabel}
              x={at.x + place.dx}
              y={at.y + place.dy}
              textAnchor={place.anchor}
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
