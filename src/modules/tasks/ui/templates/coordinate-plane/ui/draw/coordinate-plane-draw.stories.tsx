import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, type ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { ComplexPlain } from '@/modules/tasks/ui/templates/complex/ui/plain'
import { TextTemplateTrainer } from '@/modules/tasks/ui/templates/text/lib/storybook/text-template-trainer'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import { planeModeOf } from '../../lib/drawing-figure'

import readGraphJson from './data/read-graph-task.json'
import {
  ALL_PLANE_TASKS,
  asTrainerTask,
  gradeOf,
  isCorrectFor,
  planeTask,
  type PlaneFixture,
} from './fixtures'

import { CoordinatePlaneDraw } from '.'

/**
 * Координатная плоскость — прототип на одобрение Алишера (26.11, 27.11).
 *
 * Каждая история — настоящая задача локального бэка (генератор указан в
 * названии), решаемая: «Проверить» сверяет ответ портом проверки бэка
 * (lib/check-plane-answer.ts). Порт сверен с настоящим TaskChecker на всех
 * судимых ответах, а ответ, который окно шлёт по решению, бэк принял на трёх
 * сидах каждого генератора (data/backend-verdicts.json, тест рядом). Задачи
 * с «^» в формуле локальный бэк не судит: на OTP 29 падает регулярка в
 * ExpressionTaskAnswer.replace_powers. Три ошибки — показ решения.
 *
 * Сценарии: точка, несколько точек, фигура по двум точкам, тригонометрия
 * (оси с π), несколько фигур и выбор типа (панель фигур), штриховка
 * («Закрасить»), и «читай график» — плоскость в условии составной задачи.
 */
const Template = CoordinatePlaneDraw as unknown as ComponentType<
  TaskComponentProps<TextTask>
>

const Trainer = ({ task }: { task: PlaneFixture }) => {
  // one verdict function per task: a new one would rebuild the trainer state
  const trainerOptions = useMemo(
    () => ({ isCorrect: isCorrectFor(task) }),
    [task],
  )
  return (
    <TextTemplateTrainer
      key={task._backend.id}
      Template={Template}
      task={asTrainerTask(task)}
      trainerOptions={trainerOptions}
      forceCalcOpen={false}
    />
  )
}

const meta = {
  title: 'Templates/CoordinatePlane/draw (прототип)',
  component: Trainer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Trainer>

export default meta
type Story = StoryObj<typeof meta>

const story = (generator: string, name: string): Story => ({
  name: `${name} · ${generator}`,
  args: { task: planeTask(generator) },
})

// ── Точка ─────────────────────────────────────────────
export const PointSymmetry = story('Task_6_6_18_1', 'Точка: симметрия, 6 кл.')
export const PointNumberLine = story('Task_5_3_4_8', 'Точка на прямой, 5 кл.')

// ── Несколько точек ───────────────────────────────────
export const DotsMaximum = story('Task_10_1_16_2', 'Точки максимума, 10 кл.')
export const DotsComplex = story('Task_11_5_5_1', 'Комплексное число, 11 кл.')

// ── Фигура по двум точкам ─────────────────────────────
export const Segment = story('Task_6_6_19_1', 'Отрезок, 6 кл.')
export const Line = story('Task_7_3_38', 'Прямая, 7 кл.')
export const Vector = story('GeoTask_9_1_10', 'Вектор, 9 кл.')
export const Circle = story('GeoTask_8_4_9', 'Окружность, 8 кл.')
export const Parabola = story('Task_8_3_6_1', 'Парабола, 8 кл.')
export const CubicParabola = story(
  'Task_7_3_15_1',
  'Кубическая парабола, 7 кл.',
)
export const ModuleX = story('Task_7_3_21_1', 'График модуля, 7 кл.')
export const Hyperbola = story('Task_7_3_27_1', 'Гипербола, 7 кл.')

// ── Тригонометрия: оси с π ────────────────────────────
export const Sinus = story('Task_10_2_1_1', 'Синусоида, 10 кл.')

// ── Несколько фигур и выбор типа ──────────────────────
export const TwoLines = story('Task_7_3_54_1', 'Система: две прямые, 7 кл.')
export const Triangle = story('GeoTask_9_2_9', 'Треугольник отрезками, 9 кл.')
export const PickGraph = story('Task_8_3_13_1', 'Выбор графика: корень, 8 кл.')

// ── Штриховка ─────────────────────────────────────────
export const ShadeLines = story(
  'Task_7_3_50_1',
  'Штриховка: прямая и оси, 7 кл.',
)
export const ShadeRing = story('Task_5_8_8_6', 'Штриховка: кольцо, 5 кл.')

// ── Читай график: плоскость в условии ─────────────────
const readGraph = readGraphJson as unknown as TextTask
const Complex = ComplexPlain as unknown as ComponentType<
  TaskComponentProps<TextTask>
>
/**
 * Task_10_2_7_1: y = sin x на осях с π, ответ — промежуток в поле составной
 * задачи. До 27.11 общий рендер рисовал здесь пустую сетку −5…5.
 */
export const ReadGraph: StoryObj<Record<string, never>> = {
  name: 'Читай график: синусоида в условии · Task_10_2_7_1',
  render: () => (
    <TextTemplateTrainer
      Template={Complex}
      task={readGraph}
      forceCalcOpen={false}
    />
  ),
}

// ── Все задачи прототипа ──────────────────────────────
const catalog = ALL_PLANE_TASKS.filter(
  (t) => planeModeOf(t.description.figure).kind !== 'unsupported',
)
  .map((t) => t._backend.id)
  .sort(
    (a, b) =>
      gradeOf(a) - gradeOf(b) || a.localeCompare(b, 'en', { numeric: true }),
  )

export const Catalog: StoryObj<{ generator: string }> = {
  name: `Все задачи прототипа (${catalog.length})`,
  args: { generator: catalog[0] },
  argTypes: { generator: { control: 'select', options: catalog } },
  render: ({ generator }) => <Trainer task={planeTask(generator)} />,
}
