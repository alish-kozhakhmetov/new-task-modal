/**
 * Grade 4 on the real TaskModal, for the pixel check that its keyboard is the
 * released one: the same page served from this branch and from the 2.5.8 tag
 * (scripts/keys/README.md). Imports nothing this branch added.
 *
 *   /scripts/keys/harness/grade4.html?task=0&layout=phone
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

injectFonts()
const q = new URLSearchParams(location.search)
const index = Number(q.get('task') ?? 0)
const layout = (q.get('layout') as 'wide' | 'phone') ?? 'phone'

void (async () => {
  const data = (await fetch('/scripts/keys/.cache/grade4.json').then((r) =>
    r.json(),
  )) as Record<string, unknown>[]
  const tasks = data.map(
    (v, i) =>
      ({
        id: `g4-${i}`,
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
  createRoot(document.getElementById('root')!).render(
    <MathJaxContext config={MATH_JAX_CONFIG}>
      <LessonTrainer
        lesson={{ tasks, activeTask: tasks[index], initialTasksCount: tasks.length }}
        language="russian"
        layout={layout}
      />
    </MathJaxContext>,
  )
})()
