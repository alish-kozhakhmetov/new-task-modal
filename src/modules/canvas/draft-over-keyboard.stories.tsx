import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, type CSSProperties } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'

import { TextTemplateTrainer } from '@/modules/tasks/ui/templates/text/lib/storybook'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import { TextPlain } from '@/modules/tasks/ui/templates/text/ui/plain'
import fixture from '@/modules/tasks/ui/templates/text/ui/plain/data/task.json'
import { isAutomatedInteractionRun } from '@/testing/with-on-demand-play'

import type { DraftGrid } from './lib/key-row'

const task = fixture as unknown as TextTask

interface Args {
  /** `current` — the panel of 2.5.3, for comparison. */
  grid: DraftGrid | 'current'
  /** The keyboard page under the draft. */
  page: 'digits' | 'letters'
  /** `folded` — the calculator folded away (long condition, no field). */
  keyboard: 'open' | 'folded'
  /** `wide` — the site's wide layout: the draft is a column, its own panel. */
  layout?: 'phone' | 'wide'
  /** The pencil tapped while the keyboard still slides to the page. */
  midSwipe?: boolean
}

/** Next frame. */
const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

/** Polls `find` once a frame until it gives a value (~5 s). */
const until = async <T,>(
  find: () => T | null | undefined | false,
  isCancelled: () => boolean,
): Promise<T | null> => {
  for (let i = 0; i < 300 && !isCancelled(); i += 1) {
    const value = find()
    if (value) return value
    await frame()
  }
  return null
}

/**
 * As a pupil does it: the keyboard page first (the dot «Буквы»), then the
 * pencil once the slide stopped, so the story opens on its final frame. (The
 * panel would follow a keyboard still moving too — canvas.tsx.)
 */
const openDraft = async (
  root: HTMLElement,
  page: Args['page'],
  midSwipe: boolean,
  isCancelled: () => boolean,
) => {
  const pencil = await until(
    () => root.querySelector<HTMLElement>('[aria-label="Открыть доску"]'),
    isCancelled,
  )
  if (!pencil) return

  if (page === 'letters') {
    const dot = await until(
      () => root.querySelector<HTMLElement>('[aria-label="Буквы"]'),
      isCancelled,
    )
    dot?.click()
    if (midSwipe) {
      pencil.click()
      return
    }
    let last = Number.NaN
    let still = 0
    await until(() => {
      const letters = root.querySelector('[data-calc-page="letters"]')
      if (!letters || letters.closest('[inert]')) return false
      const x = letters.getBoundingClientRect().left
      still = x === last ? still + 1 : 0
      last = x
      return still >= 5
    }, isCancelled)
  }

  if (!isCancelled()) pencil.click()
}

/** The host's whole window, as the Trainer story's wide stage. */
const WIDE_STAGE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
}

const DraftOverKeyboard = ({
  grid,
  page,
  keyboard,
  layout = 'phone',
  midSwipe = false,
}: Args) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    let cancelled = false
    void openDraft(root, page, midSwipe, () => cancelled)
    return () => {
      cancelled = true
    }
  }, [page, midSwipe])

  return (
    <div
      ref={ref}
      data-ntm-layout={layout === 'wide' ? 'wide' : undefined}
      style={layout === 'wide' ? WIDE_STAGE : undefined}
    >
      <TextTemplateTrainer
        Template={TextPlain}
        task={task}
        frame="viewport"
        calcHidden={keyboard === 'folded'}
        draftGrid={grid === 'current' ? undefined : grid}
        layout={layout === 'wide' ? 'wide' : undefined}
      />
    </div>
  )
}

const meta = {
  title: 'Canvas/Over keyboard',
  component: DraftOverKeyboard,
  parameters: {
    layout: 'fullscreen',
    noPadding: true,
    // The trainer fills the window; the play checks only under Vitest
    skipRunPlayButton: true,
    docs: {
      description: {
        component:
          'Панель черновика в ячейках нижнего ряда клавиатуры (Алишер, 23.10). ' +
          'В1 (`keys`) — ячейки клавиш: на цифрах «отменить» и «вернуть» делят одну. ' +
          'В2 (`equal`) — шесть равных ячеек на ширину ряда. `current` — панель 2.5.3. ' +
          'Окно тренажёра — во всю ширину, как в приложении: размеры клавиатуры в `vw`.',
      },
    },
  },
  args: { grid: 'keys', page: 'digits', keyboard: 'open' },
  argTypes: {
    grid: { control: 'inline-radio', options: ['keys', 'equal', 'current'] },
    page: { control: 'inline-radio', options: ['digits', 'letters'] },
    keyboard: { control: 'inline-radio', options: ['open', 'folded'] },
    layout: { control: 'inline-radio', options: ['phone', 'wide'] },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof DraftOverKeyboard>

export default meta
type Story = StoryObj<typeof meta>

type Rect = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom' | 'width'>

const rectOf = (el: Element): Rect => el.getBoundingClientRect()

/** Edges that differ by a hundredth of a pixel or more, as `name: Δ`. */
const edgeMisses = (
  name: string,
  actual: Rect,
  expected: Rect,
  edges: (keyof Rect)[],
) =>
  edges
    .map((edge) => [edge, actual[edge] - expected[edge]] as const)
    .filter(([, delta]) => Math.abs(delta) >= 0.01)
    .map(([edge, delta]) => `${name}.${edge} ${delta.toFixed(3)}`)

/** The shown keyboard page and its bottom row, left to right. */
const bottomRow = (root: HTMLElement) => {
  const page = [...root.querySelectorAll<HTMLElement>('[data-calc-page]')].find(
    (el) => !el.closest('[inert]'),
  )
  if (!page) return { page: null, keys: [] }
  const keys = [...page.querySelectorAll('[data-calc]')].map(rectOf)
  const top = Math.max(...keys.map((key) => key.top))
  return {
    page: page.dataset.calcPage ?? null,
    keys: keys
      .filter((key) => top - key.top < 0.5)
      .sort((a, b) => a.left - b.left),
  }
}

const PAGE_MODE = { digits: 'main', letters: 'letters' } as const

/**
 * Waits until the panel lies on the requested page's bottom row (the page
 * swipe and the draft's opening take a few frames), then checks it once more.
 */
const expectAligned = async (
  root: HTMLElement,
  page: Args['page'],
  misses: (panel: HTMLElement, keys: Rect[]) => string[],
) => {
  const check = () => {
    const panel = root.querySelector<HTMLElement>('[data-draft-grid]')
    if (!panel) return ['no key-row panel']
    const row = bottomRow(root)
    if (row.page !== PAGE_MODE[page]) return [`page ${row.page}`]
    return misses(panel, row.keys)
  }
  await waitFor(
    () => {
      const found = check()
      if (found.length > 0) throw new Error(found.join('; '))
    },
    { timeout: 15_000 },
  )
  await expect(check()).toEqual([])
}

const cellsOf = (panel: HTMLElement) =>
  [...panel.querySelectorAll('[data-draft-cell]')].map(rectOf)

/** В1: every cell is the key under it, the strip is the row. */
const keysMisses = (panel: HTMLElement, keys: Rect[]) => {
  const cells = cellsOf(panel)
  if (cells.length !== keys.length) {
    return [`${cells.length} cells over ${keys.length} keys`]
  }
  const row = { ...keys[0], right: keys[keys.length - 1].right }
  return [
    ...cells.flatMap((cell, i) =>
      edgeMisses(`cell${i}`, cell, keys[i], ['left', 'right', 'top', 'bottom']),
    ),
    ...edgeMisses('row', rectOf(panel), row, [
      'left',
      'right',
      'top',
      'bottom',
    ]),
  ]
}

/** В2: six equal cells — the row's top, bottom and outer edges. */
const equalMisses = (panel: HTMLElement, keys: Rect[]) => {
  const cells = cellsOf(panel)
  if (cells.length !== 6) return [`${cells.length} cells`]
  return [
    ...cells.flatMap((cell, i) =>
      edgeMisses(`cell${i}`, cell, keys[0], ['top', 'bottom']),
    ),
    ...edgeMisses('first', cells[0], keys[0], ['left']),
    ...edgeMisses('last', cells[5], keys[keys.length - 1], ['right']),
    ...cells
      .filter((cell) => Math.abs(cell.width - cells[0].width) > 0.05)
      .map((cell) => `width ${cell.width}`),
  ]
}

const playKeys: Story['play'] = async ({ canvasElement, args }) => {
  if (!isAutomatedInteractionRun()) return
  await expectAligned(canvasElement, args.page, keysMisses)

  const eraser = canvasElement.querySelector<HTMLElement>('[title="Ластик"]')
  await expect(eraser).toBeTruthy()
  await userEvent.click(eraser!)
  await expect(eraser).toHaveAttribute('aria-pressed', 'true')
}

const playEqual: Story['play'] = async ({ canvasElement, args }) => {
  if (!isAutomatedInteractionRun()) return
  await expectAligned(canvasElement, args.page, equalMisses)
}

/** Folded keyboard: the panel still stands, in the digits page's grid. */
const playFolded: Story['play'] = async ({ canvasElement }) => {
  if (!isAutomatedInteractionRun()) return
  const panel = await waitFor(
    () => {
      const found =
        canvasElement.querySelector<HTMLElement>('[data-draft-grid]')
      if (!found) throw new Error('no key-row panel')
      return found
    },
    { timeout: 15_000 },
  )
  await expect(canvasElement.querySelector('[data-calc-page]')).toBeNull()
  await expect(cellsOf(panel).length).toBeGreaterThanOrEqual(5)
}

export const KeysDigits: Story = {
  name: 'В1 · цифры',
  args: { grid: 'keys', page: 'digits' },
  play: playKeys,
}

export const KeysLetters: Story = {
  name: 'В1 · буквы',
  args: { grid: 'keys', page: 'letters' },
  play: playKeys,
}

/** The pencil tapped mid-swipe: the panel follows the keys to their place. */
export const KeysLettersMidSwipe: Story = {
  name: 'В1 · буквы, черновик открыт на ходу пролистывания',
  args: { grid: 'keys', page: 'letters', midSwipe: true },
  play: playKeys,
}

export const EqualDigits: Story = {
  name: 'В2 · цифры',
  args: { grid: 'equal', page: 'digits' },
  play: playEqual,
}

export const EqualLetters: Story = {
  name: 'В2 · буквы',
  args: { grid: 'equal', page: 'letters' },
  play: playEqual,
}

export const KeysFolded: Story = {
  name: 'В1 · клавиатура свёрнута',
  args: { grid: 'keys', keyboard: 'folded' },
  play: playFolded,
}

export const EqualFolded: Story = {
  name: 'В2 · клавиатура свёрнута',
  args: { grid: 'equal', keyboard: 'folded' },
  play: playFolded,
}

export const CurrentDigits: Story = {
  name: 'Сейчас (2.5.3) · цифры',
  args: { grid: 'current', page: 'digits' },
}

export const CurrentLetters: Story = {
  name: 'Сейчас (2.5.3) · буквы',
  args: { grid: 'current', page: 'letters' },
}

/**
 * Wide layout from 1280 (a screen with a mouse): the draft is a column right
 * of the task and keeps the panel of 2.5.3 whatever the grid.
 */
export const KeysWide: Story = {
  name: 'В1 · широкая раскладка (панель как сейчас)',
  args: { grid: 'keys', page: 'digits', layout: 'wide' },
}
