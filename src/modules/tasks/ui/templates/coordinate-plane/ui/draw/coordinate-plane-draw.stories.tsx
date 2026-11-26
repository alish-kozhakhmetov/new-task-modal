import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, type ComponentType } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TextTemplateTrainer } from '@/modules/tasks/ui/templates/text/lib/storybook/text-template-trainer'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import { planeModeOf } from '../../lib/drawing-figure'

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
 * Координатная плоскость — прототип на одобрение Алишера (26.11).
 *
 * Каждая история — настоящая задача бэка (генератор указан в названии),
 * решаемая: «Проверить» сверяет ответ портом проверки бэка
 * (lib/check-plane-answer.ts). Порт сверен с настоящим TaskChecker локального
 * бэка на 553 ответах, а ответ, который окно шлёт по решению, бэк принял у 104
 * генераторов из уроков (data/backend-verdicts.json, тест рядом). Кубическую
 * параболу и y = ax² (11 генераторов 7 класса) локальный бэк не судит: на
 * OTP 29 падает регулярка в ExpressionTaskAnswer.replace_powers. Три ошибки —
 * показ решения.
 *
 * Корень (тип 180) здесь не показан: в уроках он встречается только в задачах
 * «нарисуй несколько графиков на выбор» (сценарий E), их прототип не берёт.
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
