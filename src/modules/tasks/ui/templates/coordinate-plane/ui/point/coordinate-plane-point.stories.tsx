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
import { planeOptions } from '../../lib/plane-answer'
import type { CoordinatePlaneTask } from '../../lib/types.task'

import fixtures from './data/tasks.json'
import readme from './README.md?raw'

import { CoordinatePlanePoint as Template } from '.'

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
          {task.type} · в сторе: {answer || '—'} · эталон бэка:{' '}
          {JSON.stringify(task._expected)}
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
  title: 'Templates/CoordinatePlane/point',
  args: { taskId: ids[0], panel: true },
  argTypes: { taskId: { control: 'select', options: ids } },
  parameters: templateDocs(readme),
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {
  render: ({ taskId, panel }) => <Frame task={byId(taskId)} panel={panel} />,
}

/** Tap the plane where the backend expects the point; the answer must match. */
export const Filled: Story = {
  args: { taskId: '6_6_20_2' },
  parameters: { skipRunPlayButton: true },
  render: ({ taskId, panel }) => <Frame task={byId(taskId)} panel={panel} />,
  play: async ({ canvasElement, args }) => {
    const task = byId(args.taskId)
    const expected = task._expected as { x: number; y: number }
    const options = planeOptions(task.description.figure ?? {})
    const board = within(canvasElement).getByTestId('plane-board')
    const rect = board.getBoundingClientRect()
    const scale = rect.width / planeLength(options)
    const dot = fromPointToDot(options, expected.x, expected.y)
    void fireEvent.pointerDown(board, {
      clientX: rect.left + dot.x * scale,
      clientY: rect.top + dot.y * scale,
    })
    await expect(
      await within(canvasElement).findAllByTestId('plane-picked'),
    ).toHaveLength(1)
  },
}
