/**
 * Snapshots of the coordinate-plane prototype from the static Storybook.
 *
 *   npx storybook build -o storybook-static
 *   python3 -m http.server 6107 -d storybook-static   (or any static server)
 *   tsx scripts/coordinate-plane/shots.ts http://127.0.0.1:6107 <out-dir>
 *
 * Every story at 390 and 1280 as it opens, then the states on the parabola at
 * 390: half a figure, entered, wrong, correct, and the solution after three
 * mistakes. Points are put with the keyboard (arrows + Enter), the same path a
 * pupil without a mouse takes.
 */
/* eslint-disable testing-library/prefer-screen-queries -- Playwright's page, not testing-library */
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium, type Page } from 'playwright'

import type { Pt } from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/plane-answer'
import { solvePlaneAnswer } from '../../src/modules/tasks/ui/templates/coordinate-plane/lib/solve-plane-answer'

const [base, out] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const DATA = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../src/modules/tasks/ui/templates/coordinate-plane/ui/draw/data/all-tasks.json',
)
type Fixture = {
  _backend: { id: string; answer: unknown }
  description: { figure: { tickStep?: number } }
}
const tasks = JSON.parse(readFileSync(DATA, 'utf8')) as Fixture[]
const byGen = new Map(tasks.map((t) => [t._backend.id, t]))

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

const open = async (page: Page, id: string) => {
  await page.goto(
    `${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
  )
  await page
    .locator('[data-testid=coordinate-plane-interactive]')
    .waitFor({ timeout: 20000 })
  await page.waitForFunction('document.fonts.status === "loaded"')
  await page.waitForTimeout(300)
}

const put = async (page: Page, from: Pt, to: Pt, step: number) => {
  const plane = page.locator('[data-testid=coordinate-plane-interactive]')
  await plane.focus()
  const n = (d: number) => Math.round(Math.abs(d) / step)
  for (let i = 0; i < n(to.x - from.x); i++)
    await page.keyboard.press(to.x > from.x ? 'ArrowRight' : 'ArrowLeft')
  for (let i = 0; i < n(to.y - from.y); i++)
    await page.keyboard.press(to.y > from.y ? 'ArrowUp' : 'ArrowDown')
  await page.keyboard.press('Enter')
}

const generatorOf = (name: string) => /· (\S+)$/.exec(name)?.[1]

const browser = await chromium.launch()
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 768 ? 844 : 900 },
      deviceScaleFactor: 1,
    })
    for (const s of stories) {
      if (s.name.startsWith('Все задачи')) continue
      await open(page, s.id)
      await page.screenshot({
        path: join(out, `${width}-${generatorOf(s.name) ?? s.id}.png`),
        fullPage: true,
      })
    }
    await page.close()
  }

  // states on one task: the parabola, phone width
  const parabola = stories.find((s) => s.name.includes('Task_8_3_6_1'))!
  const task = byGen.get('Task_8_3_6_1')!
  const pts = solvePlaneAnswer(task._backend.answer)!
  const step = task.description.figure.tickStep || 1
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  })
  await open(page, parabola.id)
  await put(page, { x: 0, y: 0 }, pts[0], step)
  await page.screenshot({ path: join(out, 'state-1-half.png'), fullPage: true })
  // a wrong second point, then check
  const wrong = { x: pts[1].x, y: pts[1].y + 1 }
  await put(page, pts[0], wrong, step)
  await page.screenshot({
    path: join(out, 'state-2-entered-wrong.png'),
    fullPage: true,
  })
  const check = page.getByRole('button', { name: 'Проверить' })
  await check.click()
  await page.waitForTimeout(600)
  await page.screenshot({
    path: join(out, 'state-3-wrong.png'),
    fullPage: true,
  })
  // fix it: the third press moves the nearer point
  await put(page, wrong, pts[1], step)
  await page.waitForTimeout(200)
  await page.screenshot({
    path: join(out, 'state-4-fixed.png'),
    fullPage: true,
  })
  if (await check.isEnabled()) await check.click()
  await page.waitForTimeout(800)
  await page.screenshot({
    path: join(out, 'state-5-correct.png'),
    fullPage: true,
  })

  // three mistakes → the solution
  await open(page, parabola.id)
  const bad = [
    { x: pts[0].x + step, y: pts[0].y },
    { x: pts[1].x + step, y: pts[1].y + step },
  ]
  await put(page, { x: 0, y: 0 }, bad[0], step)
  await put(page, bad[0], bad[1], step)
  for (let i = 0; i < 3; i++) {
    const c = page.getByRole('button', { name: 'Проверить' })
    if (!(await c.isVisible()) || !(await c.isEnabled())) break
    await c.click()
    await page.waitForTimeout(700)
  }
  await page.screenshot({
    path: join(out, 'state-6-no-lives.png'),
    fullPage: true,
  })
  await page.close()
} finally {
  await browser.close()
}
console.log(`shots → ${out}`)
