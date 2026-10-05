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

import { nearestNode, nodeLabel, type Node } from '../lib/plane-answer'

import styles from './coordinate-plane.module.scss'

interface Props {
  options: PlaneOptions
  figures: Record<string, unknown>[]
  points: PlanePoint[]
  selected: Node[]
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
      {selected.map((node) => {
        const { x, y } = fromPointToDot(options, node.x, node.y)
        return (
          <g key={`sel-${node.x}-${node.y}`} data-testid="plane-picked">
            <circle className={styles.picked} cx={x} cy={y} r={6} />
            <text className={styles.pickedLabel} x={x + 10} y={y - 10}>
              {nodeLabel(node)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
