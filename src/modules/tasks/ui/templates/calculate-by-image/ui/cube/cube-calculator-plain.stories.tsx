import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import type { CubeCalculatorTask } from '../../lib/create-cube-calculator-template'
import { templateDocs } from '../../../shared/storybook/story-docs'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import type { MathInputRef } from '@/ui/math-input/types'
import readme from '../plain/README.md?raw'

import fixtures from './data/tasks.json'

import { CubeCalculatorPlain as Template } from '.'

type Fixture = CubeCalculatorTask & { _expected: unknown; _source: string }
const { tasks } = fixtures as unknown as { tasks: Fixture[] }
const ids = tasks.map((task) => task.type.replace('Elixir.Task_', ''))
const byId = (id: string) =>
  tasks.find((task) => task.type === `Elixir.Task_${id}`) ?? tasks[0]

const Frame = ({ task }: { task: Fixture }) => {
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
      <p
        data-testid="cbi-review"
        style={{
          font: '12px/16px ui-monospace, monospace',
          color: 'var(--text-secondary)',
        }}
      >
        {task.type} · в сторе: {answer || '—'} · эталон бэка:{' '}
        {JSON.stringify(task._expected)}
      </p>
    </div>
  )
}

interface Args {
  taskId: string
}

const meta = {
  title: 'Templates/CalculateByImage/cube',
  args: { taskId: ids[0] },
  argTypes: {
    taskId: { control: 'select', options: ids },
  },
  parameters: templateDocs(readme),
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {
  render: ({ taskId }) => <Frame task={byId(taskId)} />,
}

/** «Есть 7 кубиков. Добавьте к ним 8»: eight taps fill the frame to 15. */
export const FilledAddition: Story = {
  args: { taskId: '1_8_4_11' },
  // Review shot: the play runs on load, no «Run interaction» overlay.
  parameters: { skipRunPlayButton: true },
  render: ({ taskId }) => <Frame task={byId(taskId)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const add = canvas.getByTestId('cube-add')
    for (let i = 0; i < 8; i += 1) await userEvent.click(add)
    await expect(canvas.getAllByTestId('cube-filled')).toHaveLength(15)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
