import { useLayoutEffect, useRef, useState } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type { ComplexCoordinatePlanePart } from '../../lib/types.task'
import styles from '../complex.module.scss'

import {
  PlaneAxes,
  PlaneDot,
  PlaneFigure,
} from './coordinate-plane/plane-figures'
import {
  fitOptionsToContent,
  planeLength,
  type PlaneOptions,
  type PlanePoint,
} from './coordinate-plane/plane-math'

interface Props {
  part: ComplexCoordinatePlanePart
  deps: TaskModalDependencies
  /**
   * Size the canvas to what is drawn instead of the declared coordinate field.
   *
   * On by default since 2.1.0. A figure spanning half a unit inside a field
   * declared -10..10 no longer sits in a large empty grid. Pass `false` to get
   * the Matheducator pixel-for-pixel size back — that parity is still covered
   * by a test with the prop set explicitly.
   */
  fitToContent?: boolean
}

const toOptions = (part: ComplexCoordinatePlanePart): PlaneOptions => ({
  minPosition: part.minPosition ?? -5,
  maxPosition: part.maxPosition ?? 5,
  tickStep: part.tickStep ?? 1,
  stepSize: part.stepSize ?? 20,
  showAxis: part.showAxis !== false,
  showCells: part.showCells !== false,
  tickStepXMultiply: part.tickStepXMultiply ?? 1,
  tickStepYMultiply: part.tickStepYMultiply ?? 1,
  xAxisLabel: part.xAxisLabel ?? 'x',
  yAxisLabel: part.yAxisLabel ?? 'y',
  reduceHeight: part.reduceHeight,
})

/** Display-only CoordinatePlane (no click / draw for grade 4). */
export const CoordinatePlanePart = ({
  part,
  deps,
  fitToContent = true,
}: Props) => {
  const declared = toOptions(part)
  const translate = (value: unknown) => deps.global.translateTasks(value)

  const points = Array.isArray(part.points)
    ? (part.points as PlanePoint[]).filter(
        (p) => typeof p?.x === 'number' && typeof p?.y === 'number',
      )
    : []
  const figures = Array.isArray(part.figures)
    ? (part.figures as Record<string, unknown>[])
    : []

  const options = fitToContent
    ? fitOptionsToContent(declared, points, figures)
    : declared
  const length = planeLength(options)
  const reduce = options.reduceHeight ?? 0
  const height = Math.max(40, length - reduce)

  // A plane with neither axes nor cells is invisible: only the figure and its
  // labels show. fitOptionsToContent keeps it square, so a wide, low figure
  // (4_7_16_4: x −4…4, y −1.5…2.5) sat in a 300×300 field with 159px of
  // blank paper above and below. Here the canvas is the drawing's own box.
  const bare = !options.showAxis && !options.showCells
  const contentRef = useRef<SVGGElement>(null)
  const [box, setBox] = useState<Box | null>(null)
  useLayoutEffect(() => {
    if (!bare) return
    setBox(croppedBox(contentRef.current, length, height))
  }, [bare, length, height, part])

  const view = box ?? { x: 0, y: 0, width: length, height }

  return (
    <svg
      className={styles.planeSvg}
      data-figure-type="110"
      data-testid="complex-coordinate-plane-part"
      width={view.width}
      height={view.height}
      viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
    >
      <PlaneAxes options={options} />
      <g ref={contentRef}>
        {figures.map((figure, index) => (
          <PlaneFigure
            key={`fig-${index}`}
            options={options}
            figure={figure}
            translate={translate}
          />
        ))}
        {points.map((point, index) => (
          <PlaneDot key={`pt-${index}`} options={options} point={point} />
        ))}
      </g>
    </svg>
  )
}

type Box = { x: number; y: number; width: number; height: number }

/** Air around a cropped drawing, so strokes and labels are not cut. */
const CROP_MARGIN = 12

/**
 * The drawn box plus a margin, kept inside the declared canvas. `null` — keep
 * the full canvas — when there is nothing to measure (no layout, as in jsdom).
 */
const croppedBox = (
  content: SVGGElement | null,
  length: number,
  height: number,
): Box | null => {
  if (!content || typeof content.getBBox !== 'function') return null
  let b: DOMRect
  try {
    b = content.getBBox()
  } catch {
    return null
  }
  if (!b.width || !b.height) return null
  const x = Math.max(0, Math.floor(b.x - CROP_MARGIN))
  const y = Math.max(0, Math.floor(b.y - CROP_MARGIN))
  return {
    x,
    y,
    width: Math.min(length, Math.ceil(b.x + b.width + CROP_MARGIN)) - x,
    height: Math.min(height, Math.ceil(b.y + b.height + CROP_MARGIN)) - y,
  }
}
