/**
 * Stream CX harness only: stands in for
 * `@/modules/tasks/model/component/get-task-component` on the harness page.
 * The new layouts are not in any grade's chapter map yet (that is stream G3
 * and wave 2), so the task is routed the way a chapter map would route it
 * after connection: the package's own classifier of its answerInput → the
 * id → `TEMPLATE_MAP[id]`. Nothing else of the window is replaced.
 */
import { lazy, type LazyExoticComponent } from 'react'

import { TEMPLATE_MAP, type TemplateType } from '@/modules/tasks/model/template-map'
import { classifyAnswerCellTemplate } from '@/modules/tasks/ui/templates/answer-cell/lib/classify-answer-cell-template'
import { classifyComplexTemplate } from '@/modules/tasks/ui/templates/complex/lib/classify-complex-template'
import { classifyTextTemplate } from '@/modules/tasks/ui/templates/text/lib/classify-text-template'
import type { Task } from '@/types/api/task'

const CLASSIFY: Record<string, (task: never) => string | null> = {
  complex: classifyComplexTemplate as never,
  answerCell: classifyAnswerCellTemplate as never,
  text: classifyTextTemplate as never,
}

export const resolveLayoutId = (task: Task | null): string | null => {
  const type = (task?.description as { type?: string } | undefined)?.type
  const fn = type ? CLASSIFY[type] : undefined
  return fn ? fn(task as never) : null
}

const cache = new Map<string, LazyExoticComponent<TemplateType>>()

export const isTemplateMapReady = () => true

export const hasTaskTemplate = (task: Task): boolean | null => {
  const id = resolveLayoutId(task)
  return id !== null && id in TEMPLATE_MAP
}

export const getTaskComponent = (activeTask: Task | null) => {
  const id = resolveLayoutId(activeTask)
  if (!id) return null
  const loader = (TEMPLATE_MAP as Record<string, () => Promise<{ default: TemplateType }>>)[id]
  if (!loader) return null
  if (!cache.has(id)) cache.set(id, lazy(loader))
  return cache.get(id)!
}
