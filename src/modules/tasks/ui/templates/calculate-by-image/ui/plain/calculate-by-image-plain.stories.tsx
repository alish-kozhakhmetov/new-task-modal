import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'

import { templateDocs } from '../../../shared/storybook/story-docs'
import { fillReference, fillWrong, submit } from '../../lib/storybook/plays'
import {
  StoryFrame,
  TrainerFrame,
  type FixtureFile,
} from '../../lib/storybook/story-frame'

import fixtures from './data/tasks.json'
import readme from './README.md?raw'

import { CalculateByImagePlain as Template } from '.'

const { tasks } = fixtures as unknown as FixtureFile
const ids = tasks.map((task) => task.type.replace('Elixir.Task_', ''))
const byId = (id: string) =>
  tasks.find((task) => task.type === `Elixir.Task_${id}`) ?? tasks[0]

interface Args {
  taskId: string
  /** Review panel under the task; off for presentation shots. */
  panel: boolean
}

const meta = {
  title: 'Templates/CalculateByImage/plain',
  args: { taskId: ids[0], panel: true },
  argTypes: {
    taskId: {
      control: 'select',
      options: ids,
      description: 'Реальный payload из data/tasks.json',
    },
  },
  parameters: templateDocs(readme),
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

/**
 * Решить в окне: жизни, «Проверить», после трёх ошибок — решение бэка.
 * Проверка — порт правила бэка (`check-calculate-by-image.ts`).
 */
export const Window: Story = {
  name: 'В окне — решить',
  parameters: { layout: 'fullscreen' },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
}

/** Все реальные payload подряд, с панелью: что уходит на бэк и вердикт. */
export const AllTasks: Story = {
  name: 'Все задачи',
  render: ({ panel }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-48)',
      }}
    >
      {tasks.map((task) => (
        <StoryFrame
          key={task.type}
          Template={Template}
          task={task}
          panel={panel}
        />
      ))}
    </div>
  ),
}

export const Solution: Story = {
  name: 'Решение бэка',
  render: ({ taskId, panel }) => (
    <StoryFrame
      Template={Template}
      task={byId(taskId)}
      panel={panel}
      withSolution
    />
  ),
}

/** Состояние «пусто»: зона ждёт, «Проверить» неактивна. */
export const StateEmpty: Story = {
  name: 'Состояние: пусто',
  parameters: { layout: 'fullscreen' },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement }) => {
    const check = await within(canvasElement).findByRole('button', {
      name: 'Проверить',
    })
    await expect(check).toBeDisabled()
  },
}

/** Состояние «выбрано»: часть предметов в зоне. */
export const StateSelected: Story = {
  name: 'Состояние: выбрано',
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await fillWrong(canvasElement, byId(args.taskId), 2)
    const check = await within(canvasElement).findByRole('button', {
      name: 'Проверить',
    })
    await waitFor(() => expect(check).toBeEnabled())
  },
}

/** Состояние «верно»: эталон собран, бэк (порт) отвечает «верно». */
export const StateCorrect: Story = {
  name: 'Состояние: верно',
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await fillReference(canvasElement, byId(args.taskId))
    await submit(canvasElement)
    const check = await within(canvasElement).findByRole('button', {
      name: 'Проверить',
    })
    // accepted: the store is cleared, the button is disabled again
    await waitFor(() => expect(check).toBeDisabled())
  },
}

/** Состояние «неверно»: минус жизнь, предметы остаются — можно поправить. */
export const StateWrong: Story = {
  name: 'Состояние: неверно',
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await fillWrong(canvasElement, byId(args.taskId), 0)
    await submit(canvasElement)
    // one heart gone: the backend (port) answered «try again»
    await waitFor(() =>
      expect(useStore.getState().state?.activeTask.attemptsCount).toBe(1),
    )
  },
}

/** Состояние «нет жизней»: три ошибки — окно показывает решение бэка. */
export const StateNoLives: Story = {
  name: 'Состояние: нет жизней',
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    const task = byId(args.taskId)
    for (const attempt of [0, 1, 2]) {
      await fillWrong(canvasElement, task, attempt)
      await submit(canvasElement)
    }
    await waitFor(() =>
      expect(
        canvasElement.querySelector(
          '[data-template-id="calculateByImage.solution"]',
        ),
      ).not.toBeNull(),
    )
  },
}

/*
 * На взгляд Алишера — по истории на сценарий, в настоящем окне, без панели.
 * Плей доводит задачу до вида, ради которого история, и ставит
 * `data-review-ready`: по нему снимает скрипт
 * `scripts/calculate-by-image-review-shots.ts`. Задачи — реальные payload.
 */
const markReady = (canvasElement: HTMLElement) =>
  canvasElement.setAttribute('data-review-ready', 'true')

/** plain: «Дайте Шарику 15 булочек» — эталон собран, «Проверить» активна. */
export const ReviewPlain: Story = {
  name: 'Взгляд: plain',
  args: { taskId: '0_10_5_2' },
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await fillReference(canvasElement, byId(args.taskId))
    markReady(canvasElement)
  },
}

/** Крупная картинка: игрушки 150 px в корзинке 600 × 400. */
export const ReviewBigPicture: Story = {
  name: 'Взгляд: крупная картинка',
  args: { taskId: '0_5_12_9' },
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await fillReference(canvasElement, byId(args.taskId))
    markReady(canvasElement)
  },
}

/** Мелкая картинка: кольца пирамиды 15–32 px, порядок важен. */
export const ReviewSmallPicture: Story = {
  name: 'Взгляд: мелкая картинка',
  args: { taskId: '1_1_2_9' },
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await fillReference(canvasElement, byId(args.taskId))
    markReady(canvasElement)
  },
}

/** С ошибкой: монеты на другую сумму, «Проверить» — минус жизнь, монеты остались. */
export const ReviewError: Story = {
  name: 'Взгляд: с ошибкой',
  args: { taskId: '1_20_1_14' },
  parameters: { layout: 'fullscreen', skipRunPlayButton: true },
  render: ({ taskId }) => (
    <TrainerFrame Template={Template} task={byId(taskId)} />
  ),
  play: async ({ canvasElement, args }) => {
    await fillWrong(canvasElement, byId(args.taskId), 0)
    await submit(canvasElement)
    await waitFor(() =>
      expect(useStore.getState().state?.activeTask.attemptsCount).toBe(1),
    )
    markReady(canvasElement)
  },
}
