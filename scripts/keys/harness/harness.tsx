/**
 * Keys harness: the real TaskModal (LessonTrainer) on one task of a keys
 * generator, the task as the API gives it (exported from the backend into
 * scripts/keys/.cache/tasks.json), every check's answer on `window.__keys`.
 * `window.__keys.plan` — the presses that type the task's reference on its
 * own keyboard: which page, which key (its aria-label).
 *
 *   /scripts/keys/harness/index.html?task=3&layout=phone
 */
import '../../../.storybook/mathquill-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/_index.scss'
import '../../../.storybook/buttons-reset.css'

import { MathJaxContext } from 'better-react-mathjax'
import { createRoot } from 'react-dom/client'

import { injectFonts } from '@/modules/task-modal/model/lib/fonts/inject-fonts'
import { MATH_JAX_CONFIG } from '@/modules/task-modal/providers'
import { LETTERS } from '@/modules/task-modal/ui/content/controls/calculator/model/symbols/letters'
import { keyboardForTask } from '@/modules/task-modal/ui/content/controls/calculator/model/symbols/signs'
import { LessonTrainer } from '@/modules/task-modal/ui/content/header/task-list/storybook/lesson-trainer'
import type { Task } from '@/types/api/task'

import { referenceToKeys } from '../reference-to-keys'

type Press = { page: 'Буквы' | 'Цифры' | 'Знаки' | null; label: string }

declare global {
  interface Window {
    __keys: {
      checks: string[]
      ready: boolean
      error?: string
      ref?: string
      plan?: Press[] | null
    }
  }
}

window.__keys = { checks: [], ready: false }
injectFonts()

const q = new URLSearchParams(location.search)
const index = Number(q.get('task') ?? 0)
const layout = (q.get('layout') as 'wide' | 'phone') ?? 'phone'

/** A reference of several fields («a;;b», MultipleTaskAnswer): Tab between them. */
const plan = (type: string, ref: string): Press[] | null => {
  const parts = ref.split(';;')
  const plans = parts.map((p) => planOne(type, p))
  if (plans.some((p) => !p)) return null
  return plans.flatMap((p, i) =>
    i === 0 ? p! : [{ page: null, label: 'Tab' } as Press, ...p!],
  )
}

const planOne = (type: string, ref: string): Press[] | null => {
  const kb = keyboardForTask(type)
  const where = new Map<string, Press[]>()
  for (const l of LETTERS) {
    where.set(l.latex || l.title, [{ page: 'Буквы', label: l.label }])
    const up = { ...l, ...l.upperCased }
    if (up.title !== l.title)
      where.set(up.latex || up.title, [
        { page: 'Буквы', label: 'ArrowUp' },
        { page: 'Буквы', label: up.label },
        { page: 'Буквы', label: 'ArrowUp' },
      ])
  }
  for (const s of kb.main) where.set(s.latex || s.title, [{ page: 'Цифры', label: s.label }])
  for (const s of kb.extra ?? []) where.set(s.latex || s.title, [{ page: 'Знаки', label: s.label }])
  const single = where.has('(')
  const keys = referenceToKeys(ref, {
    singleBrackets: single,
    tg: 'key',
    has: (k) => where.has(k),
    pair: single ? '(' : '( )',
  })
  if (!keys) return null
  return keys.flatMap((k) =>
    k === 'Right' ? [{ page: null, label: 'ArrowRight' }] : where.get(k)!,
  )
}

const run = async () => {
  const data = (await fetch('/scripts/keys/.cache/tasks.json').then((r) =>
    r.json(),
  )) as { taskType: string; ref: string; [k: string]: unknown }[]
  const tasks = data.map(
    (v, i) =>
      ({
        id: `keys-${i}`,
        type: v.taskType,
        position: i,
        result: 'none',
        attemptsCount: null,
        isPrimary: false,
        hasVideoUrl: false,
        isPenalty: false,
        title: v.title,
        difficulty: null,
        description: v.description,
        fields: v.fields,
        answerInput: v.answerInput,
      }) as unknown as Task,
  )
  const activeTask = tasks[index]
  window.__keys.ref = data[index].ref
  window.__keys.plan = plan(data[index].taskType, data[index].ref)
  createRoot(document.getElementById('root')!).render(
    <MathJaxContext config={MATH_JAX_CONFIG}>
      <LessonTrainer
        lesson={{ tasks, activeTask, initialTasksCount: tasks.length }}
        language="russian"
        layout={layout}
        onCheck={(answer) => window.__keys.checks.push(answer)}
      />
    </MathJaxContext>,
  )
  window.__keys.ready = true
}

run().catch((e) => {
  window.__keys.error = String(e?.stack ?? e)
})
