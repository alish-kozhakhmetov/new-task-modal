import { useRef, useState, type ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import type { MathInputRef } from '@/ui/math-input/types'

import { toCalculateByImageApiAnswer } from '../parse-calculate-by-image'
import type { CalculateByImageTask } from '../types.task'

export interface FixtureTask extends CalculateByImageTask {
  _source: string
  _expected: unknown
  _solution: unknown
}

export interface FixtureFile {
  _note: string
  tasks: FixtureTask[]
}

interface Props {
  Template: ComponentType<TaskComponentProps<CalculateByImageTask>>
  task: FixtureTask
  /** `true` sends the store string as is (withCell); `false` wraps it in `{ list }`. */
  numeric?: boolean
  withSolution?: boolean
  /** `false` — presentation shot without the review panel. */
  panel?: boolean
}

const show = (value: unknown) =>
  value === undefined ? '—' : JSON.stringify(value, null, 0)

/**
 * One task with live answer wiring and a review panel under it: what the
 * store holds, what goes to the backend, what the backend expects. The panel
 * is for review only; the template never sees `_expected`.
 */
export const StoryFrame = ({
  Template,
  task,
  numeric,
  withSolution,
  panel = true,
}: Props) => {
  const [answer, setAnswer] = useState('')
  const mathInput = useRef<Map<string, MathInputRef> | null>(new Map())
  const deps = makeTaskModalDeps()
  const shown = withSolution
    ? ({ ...task, solution: task._solution } as CalculateByImageTask)
    : task

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
        maxWidth: 'calc(375px - 2 * var(--space-16))',
      }}
    >
      <Template
        key={task.type}
        task={shown}
        deps={deps}
        answer={answer}
        onChange={setAnswer}
        mathInput={mathInput}
      />
      {panel ? (
        <dl
          data-testid="cbi-review"
          style={{
            margin: 0,
            padding: 'var(--space-12)',
            font: '12px/16px ui-monospace, monospace',
            color: 'var(--text-secondary)',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-m)',
            overflowWrap: 'anywhere',
          }}
        >
          <dt>{task.type}</dt>
          <dd style={{ margin: 0 }}>источник: {task._source}</dd>
          <dd style={{ margin: 0 }}>в сторе: {answer || '—'}</dd>
          <dd style={{ margin: 0 }}>
            на бэк:{' '}
            {numeric
              ? answer || '—'
              : show(toCalculateByImageApiAnswer(answer, task.description))}
          </dd>
          <dd style={{ margin: 0 }}>эталон бэка: {show(task._expected)}</dd>
        </dl>
      ) : null}
    </div>
  )
}
