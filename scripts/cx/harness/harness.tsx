/**
 * Stream CX harness: the real TaskModal (LessonTrainer, as the stories mount
 * it) on one corpus example of a new layout, the check's answer put on
 * `window.__cx` for the driver (scripts/cx/verify.mjs).
 *
 *   /scripts/cx/harness/index.html?file=<all-tasks.json path>&id=<example id>&lang=russian
 */
import '../../../.storybook/mathquill-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/_index.scss'
import '../../../.storybook/buttons-reset.css'

import { MathJaxContext } from 'better-react-mathjax'
import { createRoot } from 'react-dom/client'

import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { MATH_JAX_CONFIG } from '@/modules/task-modal/providers'
import {
  LessonTrainer,
  type StoryLanguage,
} from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import type { Task } from '@/types/api/task'

import { resolveLayoutId } from './resolve-by-layout'

declare global {
  interface Window {
    __cx: { checks: string[]; ready: boolean; resolved?: string | null; error?: string }
  }
}

window.__cx = { checks: [], ready: false }
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason instanceof Error ? event.reason.message : String(event.reason ?? '')
  if (message.startsWith('Typesetting failed:')) event.preventDefault()
})

injectFonts()

const q = new URLSearchParams(location.search)
const file = q.get('file') ?? ''
const id = q.get('id') ?? ''
const language = (q.get('lang') as StoryLanguage) ?? 'russian'
const layout = (q.get('layout') as 'wide' | 'phone') ?? 'phone'
// fill=1: the phone frame takes the window's width (a 390 px phone, not the
// stories' 375 px frame), as the app's web view gives the window to the site
if (q.get('fill') === '1') {
  const style = document.createElement('style')
  style.textContent = '[data-testid="lesson-frame"]{width:100vw !important}'
  document.head.append(style)
}

const run = async () => {
  const data = (await fetch(`/${file}`).then((r) => r.json())) as {
    byGrade: Record<string, Array<{ id: string; task: Task }>>
  }
  const entry = Object.values(data.byGrade)
    .flat()
    .find((e) => e.id === id)
  if (!entry) {
    window.__cx.error = `no example ${id} in ${file}`
    return
  }
  const activeTask = { ...entry.task, solution: null } as Task
  window.__cx.resolved = resolveLayoutId(activeTask)
  createRoot(document.getElementById('root')!).render(
    <MathJaxContext config={MATH_JAX_CONFIG}>
      <LessonTrainer
        lesson={{ tasks: [activeTask], activeTask, initialTasksCount: 1 }}
        language={language}
        layout={layout}
        onCheck={(answer) => window.__cx.checks.push(answer)}
      />
    </MathJaxContext>,
  )
  window.__cx.ready = true
}

run().catch((e: unknown) => {
  window.__cx.error = String((e as Error)?.stack ?? e)
})
