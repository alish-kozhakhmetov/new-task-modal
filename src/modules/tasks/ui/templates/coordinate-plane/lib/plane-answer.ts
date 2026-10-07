import type { PlaneOptions } from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'

import type { CoordinatePlaneFigureConfig } from './types.task'

export interface Node {
  x: number
  y: number
}

/** Drawing-figure ids that ask the pupil for points. */
export const DRAW_POINT = 10
export const DRAW_POINTS = 15
export const DRAW_SEGMENT = 30

/**
 * The whole declared field, not fitted to the drawing: the answer may lie
 * where nothing is drawn yet (`Task_2_18_6_7`: move a point two right, one up).
 */
export const planeOptions = (
  figure: CoordinatePlaneFigureConfig,
): PlaneOptions => ({
  minPosition: figure.minPosition ?? -5,
  maxPosition: figure.maxPosition ?? 5,
  tickStep: figure.tickStep ?? 1,
  stepSize: figure.stepSize ?? 30,
  showAxis: figure.showAxis !== false,
  showCells: figure.showCells !== false,
  tickStepXMultiply: 1,
  tickStepYMultiply: 1,
  xAxisLabel: figure.xAxisLabel ?? 'x',
  yAxisLabel: figure.yAxisLabel ?? 'y',
})

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/**
 * Pixel inside the plane → nearest grid node. A tap anywhere in a cell
 * counts, not only on the 8px dot (math-illustrations §5: the target is
 * larger than what is drawn).
 */
export const nearestNode = (
  options: PlaneOptions,
  px: number,
  py: number,
): Node => {
  const size = options.stepSize / options.tickStep
  const start = options.stepSize
  const snap = (value: number) =>
    Math.round(value / options.tickStep) * options.tickStep
  return {
    x: clamp(
      snap((px - start) / size + options.minPosition),
      options.minPosition,
      options.maxPosition,
    ),
    y: clamp(
      snap(options.maxPosition - (py - start) / size),
      options.minPosition,
      options.maxPosition,
    ),
  }
}

const sameNode = (a: Node, b: Node) => a.x === b.x && a.y === b.y

/**
 * Answer string: «(x;y)», several joined by the multi-answer separator,
 * in a stable order — the order of taps was never asked for. The form is
 * the one the backend accepted for points (qalan-assets trainer/,
 * checkAnswer.ts: `Task_5_3_4_8` «(1;0.5)» → result 30).
 */
export const encodeNodes = (nodes: Node[], separator: string): string =>
  [...nodes]
    .sort((a, b) => a.x - b.x || a.y - b.y)
    .map((node) => `(${node.x};${node.y})`)
    .join(separator)

export const decodeNodes = (answer: string, separator: string): Node[] =>
  answer
    .split(separator)
    .map((part) => /^\((-?[\d.]+);(-?[\d.]+)\)$/.exec(part.trim()))
    .filter((match): match is RegExpExecArray => match != null)
    .map((match) => ({ x: Number(match[1]), y: Number(match[2]) }))

/** One point: a new tap moves it, a tap on it clears. Several: toggle. */
export const toggleNode = (
  nodes: Node[],
  node: Node,
  multiple: boolean,
): Node[] => {
  const present = nodes.some((it) => sameNode(it, node))
  if (present) return nodes.filter((it) => !sameNode(it, node))
  return multiple ? [...nodes, node] : [node]
}

/**
 * A segment has two ends. A tap on an end takes it back; with both ends set,
 * a new tap moves the second one — the pupil adjusts, not starts over.
 */
export const toggleSegmentNode = (nodes: Node[], node: Node): Node[] => {
  if (nodes.some((it) => sameNode(it, node)))
    return nodes.filter((it) => !sameNode(it, node))
  if (nodes.length < 2) return [...nodes, node]
  return [nodes[0], node]
}

/** Every «(x;y)» in the stored answer, whatever joins them. */
const nodesIn = (answer: string): Node[] =>
  [...answer.matchAll(/\((-?[\d.]+);(-?[\d.]+)\)/g)].map((match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
  }))

/**
 * What goes to the backend (issue #23, Abduali 07.10). One point — the string
 * «(x;y)», `Point.correct` reads it. Several points — `PointListTaskAnswer`,
 * an object `{ points }`. A segment — `GraphUserAnswer` `{ figures }` with one
 * figure of type 30 and its two ends; the order of the ends is not checked.
 */
export const toPlaneWireAnswer = (
  answer: string,
  drawingFigure: number | undefined,
): unknown => {
  if (drawingFigure === DRAW_POINTS) return { points: nodesIn(answer) }
  if (drawingFigure === DRAW_SEGMENT)
    return {
      figures: [{ type: DRAW_SEGMENT, points: nodesIn(answer), dashed: false }],
    }
  return answer
}

export interface LabelPlace {
  dx: number
  dy: number
  anchor: 'start' | 'end'
}

/** Top-right first, as before; the rest only when it collides. */
const PLACES: LabelPlace[] = [
  { dx: 10, dy: -10, anchor: 'start' },
  { dx: -10, dy: -10, anchor: 'end' },
  { dx: 10, dy: 20, anchor: 'start' },
  { dx: -10, dy: 20, anchor: 'end' },
]

/** Width of a 14px tabular label, per character. */
const LABEL_CHAR = 7.2
const LABEL_HEIGHT = 14

interface Box {
  left: number
  right: number
  top: number
  bottom: number
}

const crossesSegment = (box: Box, a: Node, b: Node) => {
  // sampled: labels are small, segments are short
  for (let t = 0.1; t <= 0.9; t += 0.05) {
    const x = a.x + (b.x - a.x) * t
    const y = a.y + (b.y - a.y) * t
    if (x > box.left && x < box.right && y > box.top && y < box.bottom)
      return true
  }
  return false
}

/**
 * Where the coordinates of a picked node go (svg pixels): clear of the
 * pupil's own segment, of the axes with their tick numbers and of the edge.
 * Top-right stays the default — it moves only when it collides (6_6_19_1:
 * «(−1; 4)» sat on the «4» of the Y axis, «(−4; 1)» on the segment).
 */
export const labelPlace = ({
  at,
  text,
  segmentTo = [],
  axes,
  size,
}: {
  at: Node
  text: string
  /** Other ends of the segment the node belongs to. */
  segmentTo?: Node[]
  /** Origin in svg pixels, when axes are drawn. */
  axes: Node | null
  size: number
}): LabelPlace => {
  const width = text.length * LABEL_CHAR
  const score = (place: LabelPlace) => {
    const x = at.x + place.dx
    const y = at.y + place.dy
    const box: Box = {
      left: place.anchor === 'start' ? x : x - width,
      right: place.anchor === 'start' ? x + width : x,
      top: y - LABEL_HEIGHT + 3,
      bottom: y + 3,
    }
    let penalty = 0
    if (axes) {
      // the Y axis and its end-aligned numbers to the left of it
      if (box.left < axes.x + 3 && box.right > axes.x - 28) penalty += 10
      // the X axis and its numbers under it
      if (box.top < axes.y + 24 && box.bottom > axes.y - 3) penalty += 10
    }
    for (const other of segmentTo)
      if (crossesSegment(box, at, other)) penalty += 8
    if (box.left < 0 || box.right > size || box.top < 0 || box.bottom > size)
      penalty += 6
    return penalty
  }
  return PLACES.reduce((best, place) =>
    score(place) < score(best) ? place : best,
  )
}

/**
 * On-screen label of a picked node: a real minus, U+2212 (parity rule 27).
 * The answer string keeps the hyphen — answers are not normalised (rule 44).
 */
export const nodeLabel = (node: Node): string => {
  const signed = (value: number) =>
    value < 0 ? `\u2212${Math.abs(value)}` : String(value)
  return `(${signed(node.x)}; ${signed(node.y)})`
}
