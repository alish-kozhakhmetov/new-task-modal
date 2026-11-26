/**
 * Grade pilot harness: the real TaskModal (LessonTrainer, as the stories mount
 * it) on one live lesson task from .pilot-cache, with the check's answer put
 * on `window.__pilot` for the driver (scripts/pilot/solve.mjs).
 *
 *   /scripts/pilot/harness/index.html?grade=5&lesson=1511&task=3
 */
import '../../../.storybook/mathquill-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/_index.scss'
import '../../../.storybook/buttons-reset.css'

import { MathJaxContext } from 'better-react-mathjax'
import { createRoot } from 'react-dom/client'

import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { MATH_JAX_CONFIG } from '@/modules/task-modal/providers'
import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import type { Task } from '@/types/api/task'

declare global {
  interface Window {
    __pilot: { checks: string[]; ready: boolean; error?: string }
  }
}

window.__pilot = { checks: [], ready: false }
window.addEventListener('unhandledrejection', (event) => {
  const message =
    event.reason instanceof Error ? event.reason.message : String(event.reason ?? '')
  if (message.startsWith('Typesetting failed:')) event.preventDefault()
})

injectFonts()

const q = new URLSearchParams(location.search)
const grade = q.get('grade') ?? '5'
const lessonId = q.get('lesson')
const index = Number(q.get('task') ?? 0)
const layout = (q.get('layout') as 'wide' | 'phone') ?? 'wide'
/** lessons (live, from test) or offline (the fixtures' examples) */
const dir = q.get('dir') === 'offline' ? 'offline' : 'lessons'
/** a cache of its own under .pilot-cache (solve.mjs --cache), else the grade's */
const cacheParam = q.get('cache')
const cache = cacheParam && /^[\w.-]+$/.test(cacheParam) ? cacheParam : `grade-${grade}`

const run = async () => {
  const data = (await fetch(
    `/.pilot-cache/${cache}/${dir}/${lessonId}.json`,
  ).then((r) => r.json())) as { tasks: Task[] }
  const tasks = data.tasks.map((t) => ({ ...t }))
  const activeTask = tasks[index]
  if (!activeTask) {
    window.__pilot.error = `no task ${index} in lesson ${lessonId}`
    return
  }
  createRoot(document.getElementById('root')!).render(
    <MathJaxContext config={MATH_JAX_CONFIG}>
      <LessonTrainer
        lesson={{ tasks, activeTask, initialTasksCount: tasks.length }}
        language="russian"
        layout={layout}
        onCheck={(answer) => window.__pilot.checks.push(answer)}
      />
    </MathJaxContext>,
  )
  window.__pilot.ready = true
}

run().catch((e) => {
  window.__pilot.error = String(e?.stack ?? e)
})
