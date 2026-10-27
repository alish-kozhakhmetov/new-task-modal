import { lazy, type LazyExoticComponent } from 'react'

import { type TemplateType } from '@/modules/tasks/model/template-map'
import type { Task } from '@/types/api/task'

import {
  generateModuleTemplateMap,
  type ModuleTemplateMap,
} from './generate-module-template-map'
import { getTaskTypeKey } from './get-task-type-key'

type TemplateCache = Map<string, LazyExoticComponent<TemplateType>>

const cache: TemplateCache = new Map()

let map: ModuleTemplateMap | null = null

void (async () => {
  map = await generateModuleTemplateMap()
})()

/** The chapters' map has loaded: a task it lacks has no template. */
export const isTemplateMapReady = () => map !== null

/**
 * The package has a template for the task: `null` while the chapters' map
 * is still loading — not known yet.
 */
export const hasTaskTemplate = (task: Task): boolean | null => {
  if (!map) return null
  const key = getTaskTypeKey(task.type)
  return key !== null && map.has(key)
}

export const getTaskComponent = (activeTask: Task | null) => {
  if (!activeTask || !map) return null

  const key = getTaskTypeKey(activeTask.type)

  if (!key) return null

  if (cache.has(key)) {
    return cache.get(key)!
  }

  const loader = map.get(key)

  if (!loader) {
    console.log(`Type not found for task key ${key}`)
    return null
  }

  const component = lazy(loader)

  cache.set(key, component)

  return component
}
