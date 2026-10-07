import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState, type ComponentType } from 'react'
import { expect, fireEvent, userEvent, within } from 'storybook/test'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { CubeCalculatorPlain } from '@/modules/tasks/ui/templates/calculate-by-image/ui/cube'
import cubeFixtures from '@/modules/tasks/ui/templates/calculate-by-image/ui/cube/data/tasks.json'
import { CalculateByImagePlain } from '@/modules/tasks/ui/templates/calculate-by-image/ui/plain'
import plainFixtures from '@/modules/tasks/ui/templates/calculate-by-image/ui/plain/data/tasks.json'
import { CalculateByImageWithCell } from '@/modules/tasks/ui/templates/calculate-by-image/ui/with-cell'
import withCellFixtures from '@/modules/tasks/ui/templates/calculate-by-image/ui/with-cell/data/tasks.json'
import {
  fromPointToDot,
  planeLength,
} from '@/modules/tasks/ui/templates/complex/shared/figures/coordinate-plane/plane-math'
import { planeOptions } from '@/modules/tasks/ui/templates/coordinate-plane/lib/plane-answer'
import type { CoordinatePlaneTask } from '@/modules/tasks/ui/templates/coordinate-plane/lib/types.task'
import { CoordinatePlanePoint } from '@/modules/tasks/ui/templates/coordinate-plane/ui/point'
import planeFixtures from '@/modules/tasks/ui/templates/coordinate-plane/ui/point/data/tasks.json'
import { CoordinatePlaneSegment } from '@/modules/tasks/ui/templates/coordinate-plane/ui/segment'
import segmentFixtures from '@/modules/tasks/ui/templates/coordinate-plane/ui/segment/data/tasks.json'
import { makeTaskModalDeps } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'
import type { MathInputRef } from '@/ui/math-input/types'

type AnyTask = { type: string; _expected?: unknown }

/**
 * One form of the new type: a real payload, what the pupil does, and the
 * taps that turn «before» into «after». The counts come from
 * qalan-assets `qalan-docs/trainer/new-task-types.md`.
 */
interface Entry {
  id: string
  grade: number
  mechanic: string
  forms: number
  does: string
  // the gallery holds every template family; each entry knows its own
  Template: ComponentType<TaskComponentProps<never>>
  task: AnyTask
  act: (root: HTMLElement, task: AnyTask) => Promise<void>
}

const pick = (file: unknown, id: string): AnyTask => {
  const tasks = (file as { tasks: AnyTask[] }).tasks
  const found = tasks.find((t) => t.type === `Elixir.Task_${id}`)
  if (!found) throw new Error(`no fixture ${id}`)
  return found
}

const tap = async (root: HTMLElement, testId: string, order: number[]) => {
  const items = within(root).getAllByTestId(testId)
  for (const index of order) await userEvent.click(items[index])
}

const tapPoint = (root: HTMLElement, task: AnyTask) => {
  const plane = task as unknown as CoordinatePlaneTask & {
    _expected: { x: number; y: number }
  }
  const options = planeOptions(plane.description.figure ?? {})
  const board = within(root).getByTestId('plane-board')
  const rect = board.getBoundingClientRect()
  const scale = rect.width / planeLength(options)
  const dot = fromPointToDot(options, plane._expected.x, plane._expected.y)
  void fireEvent.pointerDown(board, {
    clientX: rect.left + dot.x * scale,
    clientY: rect.top + dot.y * scale,
  })
  return Promise.resolve()
}

type End = { x: number; y: number }

/** Two taps at the reference ends: the segment is drawn between them. */
const tapSegment = async (root: HTMLElement, task: AnyTask) => {
  const plane = task as unknown as CoordinatePlaneTask & {
    _expected: { point1: End; point2: End }
  }
  const options = planeOptions(plane.description.figure ?? {})
  for (const end of [plane._expected.point1, plane._expected.point2]) {
    const board = within(root).getByTestId('plane-board')
    const rect = board.getBoundingClientRect()
    const scale = rect.width / planeLength(options)
    const dot = fromPointToDot(options, end.x, end.y)
    void fireEvent.pointerDown(board, {
      clientX: rect.left + dot.x * scale,
      clientY: rect.top + dot.y * scale,
    })
    await new Promise((done) => setTimeout(done, 50))
  }
}

const asTemplate = (Template: unknown) =>
  Template as ComponentType<TaskComponentProps<never>>

const ENTRIES: Entry[] = [
  {
    id: 'money',
    grade: 4,
    mechanic: 'набрать предметы',
    forms: 95,
    does: 'нажимает на монету или купюру, она ложится в рамку; в ответ — то, что в рамке',
    Template: asTemplate(CalculateByImagePlain),
    task: pick(plainFixtures, '4_6_6_8'),
    act: (root) => tap(root, 'cbi-pool-item', [0, 0, 0, 0, 1, 2, 2]),
  },
  {
    id: 'family',
    grade: 1,
    mechanic: 'набрать предметы',
    forms: 95,
    does: 'нажимает на карточки членов семьи, они переходят в рамку',
    Template: asTemplate(CalculateByImagePlain),
    task: pick(plainFixtures, '1_13_8_4'),
    act: (root) => tap(root, 'cbi-pool-item', [0, 5]),
  },
  {
    id: 'rulers',
    grade: 0,
    mechanic: 'набрать предметы',
    forms: 95,
    does: 'к трём линейкам в рамке добавляет ещё три, до шести',
    Template: asTemplate(CalculateByImagePlain),
    task: pick(plainFixtures, '0_1_38_9'),
    act: (root) => tap(root, 'cbi-pool-item', [0, 0, 0]),
  },
  {
    id: 'rabbits',
    grade: 0,
    mechanic: 'предметы, затем число',
    forms: 37,
    does: 'даёт кроликам морковки нажатием, потом вводит в поле, сколько раздал',
    Template: asTemplate(CalculateByImageWithCell),
    task: pick(withCellFixtures, '0_3_11_6'),
    act: (root) => tap(root, 'cbi-pool-item', [0, 0, 0]),
  },
  {
    id: 'cubes',
    grade: 1,
    mechanic: 'кубики',
    forms: 6,
    does: 'добавляет кубики в рамку на 20 мест, потом заполняет два поля равенства',
    Template: asTemplate(CubeCalculatorPlain),
    task: pick(cubeFixtures, '1_8_4_11'),
    act: (root) => tap(root, 'cube-add', [0, 0, 0, 0, 0, 0, 0, 0]),
  },
  ...['6_6_20_2', '2_18_6_7', '6_6_18_1'].map(
    (key): Entry => ({
      id: `point-${key}`,
      grade: Number(key.split('_')[0]),
      mechanic: 'отметить точку на плоскости',
      forms: 6,
      does: 'нажимает в узел сетки, там встаёт точка с подписью координат',
      Template: asTemplate(CoordinatePlanePoint),
      task: (planeFixtures as unknown as { tasks: AnyTask[] }).tasks.find(
        (t) => t.type === `Elixir.Task_${key}`,
      ) as AnyTask,
      act: tapPoint,
    }),
  ),
  ...['1_5_2_16', '3_3_7_17'].map(
    (key): Entry => ({
      id: `segment-${key}`,
      grade: Number(key.split('_')[0]),
      mechanic: 'провести отрезок на плоскости',
      forms: 4,
      does: 'нажимает два узла сетки — концы, между ними появляется отрезок',
      Template: asTemplate(CoordinatePlaneSegment),
      task: (segmentFixtures as unknown as { tasks: AnyTask[] }).tasks.find(
        (t) => t.type === `Elixir.Task_${key}`,
      ) as AnyTask,
      act: tapSegment,
    }),
  ),
]

const Live = ({ entry }: { entry: Entry }) => {
  const [answer, setAnswer] = useState('')
  const mathInput = useRef<Map<string, MathInputRef> | null>(new Map())
  const { Template } = entry
  return (
    <Template
      task={entry.task as never}
      deps={makeTaskModalDeps()}
      answer={answer}
      onChange={setAnswer}
      mathInput={mathInput}
    />
  )
}

const caption = (entry: Entry) =>
  `${entry.grade} класс · ${entry.task.type.replace('Elixir.', '')} · ${entry.mechanic} — ${entry.forms} форм · ${entry.does}`

/** Phone column: 375 with 16px gutters. */
const Column = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => (
  <div
    data-gallery={id}
    style={{
      boxSizing: 'border-box',
      width: 375,
      padding: 'var(--space-16)',
      background: 'var(--bg-surface)',
    }}
  >
    {children}
  </div>
)

const meta = {
  title: 'Templates/NewTypes/Gallery',
  parameters: { skipRunPlayButton: true, layout: 'fullscreen' },
} satisfies Meta

export default meta

/**
 * Every new-type form at 375: «before» as the task opens, «after» once the
 * play has tapped what a pupil would. Captions: grade · key · mechanic and
 * how many forms share it · what the pupil does.
 */
export const Gallery: StoryObj = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-48)',
        padding: 'var(--space-16)',
      }}
    >
      {ENTRIES.map((entry) => (
        <section key={entry.id} data-gallery-entry={entry.id}>
          <p
            data-gallery={`${entry.id}-caption`}
            style={{ maxWidth: 760, margin: '0 0 var(--space-8)' }}
          >
            {caption(entry)}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-16)',
            }}
          >
            <Column id={`${entry.id}-before`}>
              <Live entry={entry} />
            </Column>
            <Column id={`${entry.id}-after`}>
              <Live entry={entry} />
            </Column>
          </div>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const entry of ENTRIES) {
      const after = canvasElement.querySelector(
        `[data-gallery="${entry.id}-after"]`,
      )
      if (!(after instanceof HTMLElement)) throw new Error(entry.id)
      await entry.act(after, entry.task)
    }
    ;(document.activeElement as HTMLElement | null)?.blur()
    // three points plus two segments of two ends each
    await expect(
      await within(canvasElement).findAllByTestId('plane-picked'),
    ).toHaveLength(7)
    await expect(
      await within(canvasElement).findAllByTestId('plane-segment'),
    ).toHaveLength(2)
  },
}
