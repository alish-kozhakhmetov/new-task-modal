import type { TaskSolutionValue } from '@/modules/tasks/lib/solution-types'
import type { Translation } from '@/types/api/task'

/**
 * `description.figure` of a `coordinatePlane` task: Figures.CoordinatePlane
 * camelized by CoordinatePlane.new (matheducator_task_common,
 * task_models/figures/coordinate_plane.ex). Nested figures keep the keys of
 * their own module — `point1`/`point2`, `centerPoint`, `formula`.
 */
export interface CoordinatePlaneFigure {
  type: 110
  minPosition: number
  maxPosition: number
  tickStep: number
  stepSize: number
  tickStepXMultiply?: number
  tickStepYMultiply?: number
  xAxisLabel?: string
  yAxisLabel?: string
  showAxis?: boolean
  showCells?: boolean
  reduceHeight?: number
  drawingFigure: number
  allowedFigures?: number[]
  canDrawMultipleFigures?: boolean
  canFill?: boolean
  /** The shaded region is bounded by the axes too (Task_7_3_50_*). */
  isFillingLimitedByAxis?: boolean
  notClickableDots?: boolean
  isLine?: boolean
  points?: unknown[]
  figures?: Record<string, unknown>[]
  intervals?: unknown[]
  fillingFunctions?: unknown[]
}

export interface CoordinatePlaneTaskDescription {
  type: 'coordinatePlane'
  content: Translation | string
  figure: CoordinatePlaneFigure
}

export interface CoordinatePlaneTask {
  id: string
  type: string
  title: Translation | string | null
  description: CoordinatePlaneTaskDescription
  solution?: TaskSolutionValue
  answerInput?: unknown
  [key: string]: unknown
}
