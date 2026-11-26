/**
 * Snapshots of the coordinate-plane prototype for review, from the static
 * Storybook.
 *
 *   npx storybook build -c .storybook-cp -o <dir>
 *   python3 -m http.server 6107 -d <dir>        (or any static server)
 *   tsx scripts/coordinate-plane/shots.ts http://127.0.0.1:6107 review [point,triangle]
 *
 * One story per scenario, solved the way a pupil without a mouse solves it
 * (arrows + Enter; the panel's buttons for several figures and «Закрасить»),
 * then shot at 390 and 1280, light and dark: `<scenario>-<width>-<theme>.png`,
 * and the four on one sheet: `sheet-<scenario>.png`.
 */
/* eslint-disable testing-library/prefer-screen-queries -- Playwright's page, not testing-library */
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium, type Page } from 'playwright'

import { planeModeOf } from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/drawing-figure'
import type { Pt } from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/plane-answer'
import {
  solveFigures,
  solveFill,
  solvePlaneAnswer,
} from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/solve-plane-answer'

const [base, out, only] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const DATA = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../src/modules/tasks/ui/templates/coordinate-plane/ui/draw/data/all-tasks.json',
)
type Fixture = {
  _backend: { id: string; answer: unknown }
  description: {
    figure: Parameters<typeof planeModeOf>[0] & Record<string, number>
  }
}
const tasks = JSON.parse(readFileSync(DATA, 'utf8')) as Fixture[]
// the story's task: the generator's first seed (fixtures.ts planeTask)
const byGen = new Map<string, Fixture>()
for (const t of tasks)
  if (!byGen.has(t._backend.id)) byGen.set(t._backend.id, t)

/** Scenario → generator → the story's export (index.json ids by export name). */
const ALL_SCENARIOS: [string, string, string][] = [
  ['point', 'Task_6_6_18_1', 'point-symmetry'],
  ['segment', 'Task_6_6_19_1', 'segment'],
  ['parabola', 'Task_8_3_6_1', 'parabola'],
  ['sinus', 'Task_10_2_1_1', 'sinus'],
  ['two-lines', 'Task_7_3_54_1', 'two-lines'],
  ['triangle', 'GeoTask_9_2_9', 'triangle'],
  ['pick-graph', 'Task_8_3_13_1', 'pick-graph'],
  ['exponent', 'Task_11_6_1_6', 'exponent'],
  ['logarithm', 'Task_11_6_4_2', 'logarithm'],
  ['shade-lines', 'Task_7_3_50_1', 'shade-lines'],
  ['shade-ring', 'Task_5_8_8_6', 'shade-ring'],
  ['read-graph', 'Task_10_2_7_1', 'read-graph'],
]

// a third argument picks scenarios: `point,triangle`
const SCENARIOS = ALL_SCENARIOS.filter(
  ([name]) => !only || only.split(',').includes(name),
)

const index = (await (await fetch(`${base}/index.json`)).json()) as {
  entries: Record<
    string,
    { id: string; name: string; title: string; type: string }
  >
}
const stories = Object.values(index.entries).filter(
  (e) =>
    e.type === 'story' && e.title.startsWith('Templates/CoordinatePlane/draw'),
)

const open = async (page: Page, id: string, plane: string) => {
  await page.goto(
    `${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
  )
  await page.locator(`[data-testid=${plane}]`).waitFor({ timeout: 20000 })
  await page.waitForFunction('document.fonts.status === "loaded"')
  await page.waitForTimeout(300)
}

const PLANE = '[data-testid=coordinate-plane-interactive]'

/** Focus the plane afresh and walk the cursor from the origin to each point. */
const put = async (page: Page, pts: Pt[], step: number) => {
  await page.locator(PLANE).blur()
  await page.locator(PLANE).focus()
  // After a mouse click on a panel button a script focus is not
  // :focus-visible, so the plane shows no cursor (a pupil Tabs back and gets
  // one): step out and back to put the cursor at the origin.
  if (!(await page.locator(PLANE).getAttribute('data-cursor'))) {
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')
  }
  const at = await page.locator(PLANE).getAttribute('data-cursor')
  if (at !== '0;0') throw new Error(`cursor at ${at}, not the origin`)
  let from: Pt = { x: 0, y: 0 }
  const n = (d: number) => Math.round(Math.abs(d) / step)
  for (const to of pts) {
    for (let i = 0; i < n(to.x - from.x); i++)
      await page.keyboard.press(to.x > from.x ? 'ArrowRight' : 'ArrowLeft')
    for (let i = 0; i < n(to.y - from.y); i++)
      await page.keyboard.press(to.y > from.y ? 'ArrowUp' : 'ArrowDown')
    await page.keyboard.press('Enter')
    from = to
  }
}

const pointsOf = (pts: Pt[]) => pts.map((p) => `${p.x};${p.y}`).join(' ')

/** The plane must show what was put: a shot of an unsolved plane is no proof. */
const expectPoints = async (page: Page, pts: Pt[]) => {
  const shown = await page.locator(PLANE).getAttribute('data-points')
  if (shown !== pointsOf(pts))
    throw new Error(`plane shows «${shown}», put «${pointsOf(pts)}»`)
}

const solve = async (page: Page, task: Fixture) => {
  const f = task.description.figure
  const step = f.tickStep || 1
  const mode = planeModeOf(f)
  if (mode.kind !== 'multi') {
    const pts = solvePlaneAnswer(task._backend.answer, f) ?? []
    await put(page, pts, step)
    await expectPoints(page, pts)
    return
  }
  const field = {
    lo: (f.minPosition ?? -5) - step,
    hi: (f.maxPosition ?? 5) + step,
  }
  const figures = solveFigures(task._backend.answer, field) ?? []
  for (const [i, g] of figures.entries()) {
    if (i > 0 || mode.fixed == null)
      await page.getByTestId(`coordinate-plane-add-${g.type}`).click()
    await put(page, g.points, step)
    await expectPoints(page, g.points)
  }
  const drawn = await page.getByTestId('coordinate-plane-figure').count()
  if (drawn !== figures.length)
    throw new Error(`${drawn} figures on the panel, ${figures.length} solved`)
  const fill = mode.fill
    ? solveFill(task._backend.answer, {
        lo: field.lo + step,
        hi: field.hi - step,
        step,
      })
    : null
  if (fill) {
    await page.getByTestId('coordinate-plane-fill').click()
    await put(page, [fill], step / 2)
    await expectPoints(page, [fill])
  }
}

/** The package's dark theme: `[data-theme='dark']` (colors.scss), on the page's canvas. */
const theme = (page: Page, dark: boolean) =>
  page.evaluate(
    `document.documentElement.dataset.theme = '${dark ? 'dark' : 'light'}';` +
      `document.body.style.background = 'var(--bg-canvas)'`,
  )

const browser = await chromium.launch()
try {
  const shots: Record<string, Record<string, string>> = {}
  for (const width of [390, 1280]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 768 ? 844 : 900 },
      deviceScaleFactor: 1,
    })
    for (const [scenario, generator, slug] of SCENARIOS) {
      const story = stories.find((s) => s.id.endsWith(`--${slug}`))
      if (!story) throw new Error(`no story for ${generator}`)
      const readOnly = scenario === 'read-graph'
      await open(
        page,
        story.id,
        readOnly
          ? 'complex-coordinate-plane-part'
          : 'coordinate-plane-interactive',
      )
      if (!readOnly) await solve(page, byGen.get(generator)!)
      await page.mouse.move(0, 0)
      await page.waitForTimeout(200)
      for (const dark of [false, true]) {
        await theme(page, dark)
        await page.waitForTimeout(150)
        const name = `${scenario}-${width}-${dark ? 'dark' : 'light'}`
        const path = join(out, `${name}.png`)
        await page.screenshot({ path, fullPage: true })
        ;(shots[scenario] ??= {})[`${width} ${dark ? 'dark' : 'light'}`] =
          readFileSync(path).toString('base64')
      }
      await theme(page, false)
    }
    await page.close()
  }

  // a sheet per scenario: the four shots side by side, to look at in one go
  const sheet = await browser.newPage({
    viewport: { width: 2000, height: 900 },
    deviceScaleFactor: 1,
  })
  for (const [scenario, generator] of SCENARIOS) {
    const cells = Object.entries(shots[scenario])
      .map(
        ([label, b64]) =>
          `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${b64}"></figure>`,
      )
      .join('')
    await sheet.setContent(
      `<style>body{margin:0;padding:16px;background:#888;font:16px sans-serif;display:flex;gap:16px;align-items:flex-start}
      figure{margin:0}figcaption{color:#fff;margin-bottom:6px}img{display:block;max-height:1400px;outline:1px solid #555}</style>
      <h1 style="position:absolute;left:16px;bottom:0;margin:0;color:#fff;font-size:14px">${scenario} · ${generator}</h1>${cells}`,
    )
    await sheet.waitForTimeout(200)
    await sheet.screenshot({
      path: join(out, `sheet-${scenario}.png`),
      fullPage: true,
    })
  }
  await sheet.close()
} finally {
  await browser.close()
}
console.log(`shots → ${out}`)
