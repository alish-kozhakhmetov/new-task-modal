import { expect, userEvent, waitFor, within } from 'storybook/test'

import {
  isCalculateByImageCorrect,
  type ExpectedListAnswer,
} from '../check-calculate-by-image'
import {
  parseCalculateByImage,
  toCalculateByImageApiAnswer,
} from '../parse-calculate-by-image'
import { solveCalculateByImage } from '../solve-calculate-by-image'

import type { FixtureTask } from './story-frame'

type MathQuillField = { latex: (v?: string) => string; focus?: () => void }

const user = () => userEvent.setup({ delay: null })

const checkButton = (canvasElement: HTMLElement) =>
  within(canvasElement).findByRole('button', { name: 'Проверить' })

const tapRow = async (canvasElement: HTMLElement, index: number) => {
  const button = await waitFor(() => {
    const found = canvasElement.querySelector<HTMLButtonElement>(
      `[data-testid="cbi-pool-item"][data-index="${index}"]`,
    )
    if (!found) throw new Error(`no row item ${index}`)
    return found
  })
  await user().click(button)
}

/** Taps that build the backend's reference in the zone. */
export const fillReference = async (
  canvasElement: HTMLElement,
  task: FixtureTask,
) => {
  const plan = solveCalculateByImage(
    task.description,
    task._expected as ExpectedListAnswer,
  )
  if (!plan) throw new Error(`${task.type}: эталон не собрать`)
  for (const index of plan) await tapRow(canvasElement, index)
}

/**
 * The n-th wrong zone that the template can build: first k row items, then
 * one row item repeated — each checked against the ported backend rule, so
 * a «wrong» attempt never happens to be right.
 */
export const wrongPlan = (task: FixtureTask, n: number): number[] => {
  const model = parseCalculateByImage(task.description, String)
  const pool = model.pool.map((item) => item.index)
  const room = model.capacity - model.preplaced.length
  const candidates: number[][] = []
  for (let k = 1; k <= Math.min(pool.length, room); k += 1) {
    candidates.push(pool.slice(0, k))
  }
  if (!model.oneTime && pool[0] != null) {
    for (let k = 2; k <= room; k += 1)
      candidates.push(Array<number>(k).fill(pool[0]))
  }
  const preplaced = model.preplaced.map((item) => item.index)
  const wrong = candidates.filter((plan) => {
    const store = JSON.stringify([...preplaced, ...plan])
    return !isCalculateByImageCorrect(
      task._expected as ExpectedListAnswer,
      toCalculateByImageApiAnswer(store, task.description),
    )
  })
  return wrong[n % Math.max(1, wrong.length)] ?? []
}

export const clearZone = async (canvasElement: HTMLElement) => {
  for (;;) {
    const items = canvasElement.querySelectorAll<HTMLButtonElement>(
      'button[data-testid="cbi-zone-item"]',
    )
    const last = items[items.length - 1]
    if (!last) return
    await user().click(last)
  }
}

export const fillWrong = async (
  canvasElement: HTMLElement,
  task: FixtureTask,
  attempt = 0,
) => {
  await clearZone(canvasElement)
  for (const index of wrongPlan(task, attempt)) {
    await tapRow(canvasElement, index)
  }
}

export const submit = async (canvasElement: HTMLElement) => {
  const button = await checkButton(canvasElement)
  await waitFor(() => expect(button).toBeEnabled())
  await user().click(button)
}

/** withCell: do what the condition asks until the field shows up. */
export const actUntilField = async (canvasElement: HTMLElement) => {
  for (let step = 0; step < 25; step += 1) {
    if (canvasElement.querySelector('[data-testid="cbi-field"]')) return
    const row = canvasElement.querySelector<HTMLButtonElement>(
      '[data-testid="cbi-pool-item"]:not(:disabled)',
    )
    if (row) {
      await user().click(row)
      continue
    }
    const items = canvasElement.querySelectorAll<HTMLButtonElement>(
      'button[data-testid="cbi-zone-item"]',
    )
    const last = items[items.length - 1]
    if (!last) break
    await user().click(last)
  }
  await waitFor(() =>
    expect(
      canvasElement.querySelector('[data-testid="cbi-field"]'),
    ).not.toBeNull(),
  )
}

/** Type into the field through MathQuill's API (keystrokes miss its textarea). */
export const typeNumber = async (canvasElement: HTMLElement, value: string) => {
  const field = await waitFor(() => {
    const found = canvasElement.querySelector<HTMLElement>(
      '[data-testid="cbi-field"] [data-input]',
    )
    if (!found) throw new Error('no field')
    return found
  })
  const MQ = window.MathQuill?.getInterface(2) as unknown as
    | ((el: HTMLElement) => MathQuillField | undefined)
    | undefined
  const mathField = MQ?.(field)
  if (!mathField) throw new Error('MathQuill field not found')
  mathField.focus?.()
  mathField.latex(value)
}
