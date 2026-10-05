import type { PlaneOptions } from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'

import type { CoordinatePlaneFigureConfig } from './types.task'

export interface Node {
  x: number
  y: number
}

/** Drawing-figure ids that ask the pupil for points. */
export const DRAW_POINT = 10
export const DRAW_POINTS = 15

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
 * On-screen label of a picked node: a real minus, U+2212 (parity rule 27).
 * The answer string keeps the hyphen — answers are not normalised (rule 44).
 */
export const nodeLabel = (node: Node): string => {
  const signed = (value: number) =>
    value < 0 ? `\u2212${Math.abs(value)}` : String(value)
  return `(${signed(node.x)}; ${signed(node.y)})`
}
