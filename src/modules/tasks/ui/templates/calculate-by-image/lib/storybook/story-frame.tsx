import { useMemo, useRef, useState, type ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import { TextTemplateTrainer } from '@/modules/tasks/ui/templates/text/lib/storybook/text-template-trainer'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import type { MathInputRef } from '@/ui/math-input/types'

import {
  isCalculateByImageCorrect,
  isCountCorrect,
  type ExpectedListAnswer,
  type WireListAnswer,
} from '../check-calculate-by-image'
import { toCalculateByImageApiAnswer } from '../parse-calculate-by-image'
import type { CalculateByImageTask } from '../types.task'

export interface FixtureTask extends CalculateByImageTask {
  /** Where the payload came from (fixture file, variants.json + restored SVG). */
  _source: string
  /** Backend `answer/1` — the reference the check runs against. */
  _expected: unknown
  /** Backend `solution/1`, shown after the third mistake. */
  _solution: unknown
  /** Generators of the same shape (`sig`) in coverage.json. */
  _generators?: number
}

export interface FixtureFile {
  _note: string
  tasks: FixtureTask[]
}

type Template = ComponentType<TaskComponentProps<CalculateByImageTask>>

const isWithCell = (task: CalculateByImageTask) =>
  task.description.type === 'calculateByImageWithCell'

/** The backend's verdict for what the window would send, computed locally. */
export const verdictFor = (task: FixtureTask, storeAnswer: string): boolean => {
  if (isWithCell(task)) return isCountCorrect(task._expected, storeAnswer)
  return isCalculateByImageCorrect(
    task._expected as ExpectedListAnswer,
    toCalculateByImageApiAnswer(storeAnswer, task.description),
  )
}

const show = (value: unknown) =>
  value === undefined || value === null ? '—' : JSON.stringify(value)

/**
 * One task without the window, with a review panel under it: what the store
 * holds, what goes to the backend, the backend's reference and the verdict.
 * The template never sees `_expected`.
 */
export const StoryFrame = ({
  Template,
  task,
  withSolution,
  panel = true,
}: {
  Template: Template
  task: FixtureTask
  withSolution?: boolean
  panel?: boolean
}) => {
  const [answer, setAnswer] = useState('')
  const mathInput = useRef<Map<string, MathInputRef> | null>(new Map())
  const deps = useMemo(() => makeTaskModalDeps(), [])
  const shown = withSolution
    ? ({ ...task, solution: task._solution } as CalculateByImageTask)
    : { ...task, solution: null }
  const wire = isWithCell(task)
    ? answer
    : toCalculateByImageApiAnswer(answer, task.description)
  const verdict = answer
    ? verdictFor(task, answer)
      ? 'верно'
      : 'неверно'
    : '—'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
        maxWidth: 'calc(390px - 2 * var(--space-16))',
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
          <dt>
            {task.type.replace('Elixir.', '')}
            {task._generators
              ? ` · генераторов этой формы: ${task._generators}`
              : ''}
          </dt>
          <dd style={{ margin: 0 }}>источник: {task._source}</dd>
          <dd style={{ margin: 0 }}>на бэк: {show(wire || undefined)}</dd>
          <dd style={{ margin: 0 }}>эталон бэка: {show(task._expected)}</dd>
          <dd style={{ margin: 0 }} data-testid="cbi-verdict">
            проверка: {verdict}
          </dd>
        </dl>
      ) : null}
    </div>
  )
}

/**
 * The task in the real window: header with lives, «Проверить», keyboard.
 * The mock backend answers with the ported check (`check-calculate-by-image`),
 * three mistakes show the backend's solution.
 */
export const TrainerFrame = ({
  Template,
  task,
  layout,
}: {
  Template: Template
  task: FixtureTask
  layout?: 'wide'
}) => {
  const fixture = useMemo(
    () =>
      ({
        ...task,
        id: task.id ?? task.type,
        solution: task._solution ?? null,
      }) as unknown as TextTask,
    [task],
  )
  const trainerOptions = useMemo(
    () => ({
      isCorrect: (submitted: { answer?: unknown }) =>
        isWithCell(task)
          ? isCountCorrect(
              task._expected,
              typeof submitted.answer === 'string' ? submitted.answer : '',
            )
          : isCalculateByImageCorrect(
              task._expected as ExpectedListAnswer,
              submitted.answer as WireListAnswer,
            ),
    }),
    [task],
  )

  return (
    <TextTemplateTrainer
      key={task.type}
      Template={
        Template as unknown as ComponentType<TaskComponentProps<TextTask>>
      }
      task={fixture}
      trainerOptions={trainerOptions}
      forceCalcOpen={isWithCell(task)}
      layout={layout}
    />
  )
}
