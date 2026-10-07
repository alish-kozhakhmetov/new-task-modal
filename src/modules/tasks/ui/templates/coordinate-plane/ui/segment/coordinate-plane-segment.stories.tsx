import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { expect, fireEvent, within } from 'storybook/test'

import {
  fromPointToDot,
  planeLength,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import type { MathInputRef } from '@/ui/math-input/types'

import { templateDocs } from '../../../shared/storybook/story-docs'
import { planeOptions, toPlaneWireAnswer } from '../../lib/plane-answer'
import type { CoordinatePlaneTask } from '../../lib/types.task'

import fixtures from './data/tasks.json'
import readme from './README.md?raw'

import { CoordinatePlaneSegment as Template } from '.'

type Fixture = CoordinatePlaneTask & { _expected: unknown; _source: string }
const { tasks } = fixtures as unknown as { tasks: Fixture[] }
const ids = tasks.map((task) => task.id)
const byId = (id: string) => tasks.find((task) => task.id === id) ?? tasks[0]

const Frame = ({ task, panel }: { task: Fixture; panel: boolean }) => {
  const [answer, setAnswer] = useState('')
  const mathInput = useRef<Map<string, MathInputRef> | null>(new Map())
  return (
    <div style={{ maxWidth: 'calc(375px - 2 * var(--space-16))' }}>
      <Template
        key={task.type}
        task={task}
        deps={makeTaskModalDeps()}
        answer={answer}
        onChange={setAnswer}
        mathInput={mathInput}
      />
      {panel ? (
        <p
          data-testid="plane-review"
          style={{
            font: '12px/16px ui-monospace, monospace',
            color: 'var(--text-secondary)',
          }}
        >
          {task.type} · в сторе: {answer || '—'} · на бэк:{' '}
          {answer ? JSON.stringify(toPlaneWireAnswer(answer, 30)) : '—'} ·
          эталон бэка: {JSON.stringify(task._expected)}
        </p>
      ) : null}
    </div>
  )
}

interface Args {
  taskId: string
  panel: boolean
}

const meta = {
  title: 'Templates/CoordinatePlane/segment',
  args: { taskId: ids[0], panel: true },
  argTypes: { taskId: { control: 'select', options: ids } },
  parameters: templateDocs(readme),
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {
  render: ({ taskId, panel }) => <Frame task={byId(taskId)} panel={panel} />,
}

type End = { x: number; y: number }

/** Tap both reference ends, as a pupil draws the segment; the line appears. */
export const Filled: Story = {
  args: { taskId: '1_5_2_16' },
  parameters: { skipRunPlayButton: true },
  render: ({ taskId, panel }) => <Frame task={byId(taskId)} panel={panel} />,
  play: async ({ canvasElement, args }) => {
    const task = byId(args.taskId)
    const { point1, point2 } = task._expected as { point1: End; point2: End }
    const options = planeOptions(task.description.figure ?? {})
    for (const end of [point1, point2]) {
      const board = within(canvasElement).getByTestId('plane-board')
      const rect = board.getBoundingClientRect()
      const scale = rect.width / planeLength(options)
      const dot = fromPointToDot(options, end.x, end.y)
      void fireEvent.pointerDown(board, {
        clientX: rect.left + dot.x * scale,
        clientY: rect.top + dot.y * scale,
      })
      await new Promise((done) => setTimeout(done, 50))
    }
    await expect(
      await within(canvasElement).findByTestId('plane-segment'),
    ).toBeInTheDocument()
  },
}
