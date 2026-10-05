import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `coordinatePlane` — as far as the point template reads
 * it. The same type also carries «draw a segment / circle / graph» tasks;
 * `figure.drawingFigure` tells them apart (10 — one point, 15 — points).
 */
export interface CoordinatePlaneFigureConfig {
  minPosition?: number
  maxPosition?: number
  stepSize?: number
  tickStep?: number
  showAxis?: boolean
  showCells?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  /** Drawn before the pupil acts: points, segments, polygons, circles. */
  figures?: Record<string, unknown>[]
  points?: { x: number; y: number; letter?: string }[]
  drawingFigure?: number
  [key: string]: unknown
}

export interface CoordinatePlaneTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_6_6_20_2`. */
  type: string
  title: Translation | string | null
  description: {
    type: 'coordinatePlane'
    content?: Translation | string | null
    figure?: CoordinatePlaneFigureConfig
    [key: string]: unknown
  }
  fields?: Record<string, unknown>
  answerInput?: unknown
  answer?: string | null
  solution?: TaskSolution | string | null
}
