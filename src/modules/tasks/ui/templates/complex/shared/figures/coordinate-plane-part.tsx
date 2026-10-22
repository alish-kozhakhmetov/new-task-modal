import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type { ComplexCoordinatePlanePart } from '../../lib/types.task'
import styles from '../complex.module.scss'

import { fitLabelFactors } from './coordinate-plane/fit-labels'
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
import { LABEL_PX, useLabelScale } from './use-label-scale'

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

  const svgRef = useRef<SVGSVGElement>(null)
  const [viewBox, setViewBox] = useState<string>()
  // A plane wider than the column shrinks to it; its labels keep their size
  // (row 57) — text sizes are in viewBox units, multiplied by this factor.
  const labelScale = useLabelScale(svgRef, viewBox)

  const fitted = fitToContent
    ? fitOptionsToContent(declared, points, figures)
    : declared
  const options = { ...fitted, labelScale }
  const length = planeLength(options)
  const reduce = options.reduceHeight ?? 0
  const height = Math.max(40, length - reduce)

  // A plane with neither axes nor cells is invisible: only the figure and its
  // labels show. fitOptionsToContent keeps it square, so a wide, low figure
  // (4_7_16_4: x −4…4, y −1.5…2.5) sat in a 300×300 field with 159px of
  // blank paper above and below. Here the canvas is the drawing's own box.
  const bare = !options.showAxis && !options.showCells
  const contentRef = useRef<SVGGElement>(null)

  // Text figures grown to 18px must not run into the drawing: each gets the
  // largest size that crosses no line (fit-labels.ts). Measured at the full
  // factor, then drawn with the fitted ones; measured again once the fonts
  // are in — a fallback font is narrower than Halvar and hides the overlap.
  const fontsEpoch = useFontsEpoch()
  const [fit, setFit] = useState<{
    scale: number
    epoch: number
    factors: Record<string, number>
  } | null>(null)
  const isFitted = fit?.scale === labelScale && fit.epoch === fontsEpoch
  const labelFactor = (index: number) =>
    (isFitted ? fit.factors[String(index)] : undefined) ?? labelScale
  useLayoutEffect(() => {
    if (isFitted) return
    setFit({
      scale: labelScale,
      epoch: fontsEpoch,
      factors: fitLabelFactors(contentRef.current, labelScale),
    })
  }, [isFitted, labelScale, fontsEpoch])

  const [box, setBox] = useState<Box | null>(null)
  useLayoutEffect(() => {
    if (!bare) return
    setBox(croppedBox(contentRef.current, length, height))
    // labels drawn bigger or smaller change the drawn box: crop again
  }, [bare, length, height, part, labelScale, fit])

  const view = box ?? { x: 0, y: 0, width: length, height }
  const viewBoxValue = `${view.x} ${view.y} ${view.width} ${view.height}`
  useLayoutEffect(() => {
    setViewBox(viewBoxValue)
  }, [viewBoxValue])

  return (
    <svg
      ref={svgRef}
      className={styles.planeSvg}
      data-figure-type="110"
      data-testid="complex-coordinate-plane-part"
      width={view.width}
      height={view.height}
      viewBox={viewBoxValue}
      // texts without a size of their own (axis names, the origin, vector
      // labels) inherit the condition's 18px, kept at the plane's scale
      fontSize={LABEL_PX * labelScale}
    >
      <PlaneAxes options={options} />
      <g ref={contentRef}>
        {figures.map((figure, index) => (
          <PlaneFigure
            key={`fig-${index}`}
            options={{ ...options, labelScale: labelFactor(index) }}
            figure={figure}
            translate={translate}
            labelKey={String(index)}
          />
        ))}
        {points.map((point, index) => (
          <PlaneDot key={`pt-${index}`} options={options} point={point} />
        ))}
      </g>
    </svg>
  )
}

/** Bumps when the page's fonts finish loading: text boxes change then. */
const useFontsEpoch = () => {
  const [epoch, setEpoch] = useState(0)
  useEffect(() => {
    const fonts = typeof document === 'undefined' ? undefined : document.fonts
    if (!fonts) return
    let alive = true
    const bump = () => {
      if (alive) setEpoch((n) => n + 1)
    }
    void fonts.ready.then(bump)
    fonts.addEventListener?.('loadingdone', bump)
    return () => {
      alive = false
      fonts.removeEventListener?.('loadingdone', bump)
    }
  }, [])
  return epoch
}

type Box = { x: number; y: number; width: number; height: number }

/** Air around a cropped drawing, so strokes and labels are not cut. */
const CROP_MARGIN = 12

/** Air around a label that reaches past the canvas. */
const LABEL_MARGIN = 4

/**
 * The drawn box plus a margin, kept inside the declared canvas. `null` — keep
 * the full canvas — when there is nothing to measure (no layout, as in jsdom).
 *
 * A label is never cut: one that reaches past the canvas widens the box to
 * itself. Labels keep 18px on a plane that shrinks to the column, so in
 * viewBox units they grow (useLabelScale) — 4_7_18_6: «6 см» at the right
 * edge of a 423-wide drawing ran past it.
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
  let left = Math.max(0, Math.floor(b.x - CROP_MARGIN))
  let top = Math.max(0, Math.floor(b.y - CROP_MARGIN))
  let right = Math.min(length, Math.ceil(b.x + b.width + CROP_MARGIN))
  let bottom = Math.min(height, Math.ceil(b.y + b.height + CROP_MARGIN))
  for (const text of content.querySelectorAll('text')) {
    let t: DOMRect
    try {
      t = text.getBBox()
    } catch {
      continue
    }
    if (!t.width) continue
    left = Math.min(left, Math.floor(t.x - LABEL_MARGIN))
    top = Math.min(top, Math.floor(t.y - LABEL_MARGIN))
    right = Math.max(right, Math.ceil(t.x + t.width + LABEL_MARGIN))
    bottom = Math.max(bottom, Math.ceil(t.y + t.height + LABEL_MARGIN))
  }
  return { x: left, y: top, width: right - left, height: bottom - top }
}
