/**
 * Review shots of count-by-image for Alisher: one «Взгляд: …» story per
 * scenario, in the real window, at 390 and 1280, light and dark —
 * `<scenario>-<390|1280>-<light|dark>.png`.
 *
 *   npx storybook dev -p 6111 --ci --no-open
 *   npx tsx scripts/calculate-by-image-review-shots.ts http://127.0.0.1:6111 review
 *
 * Any Storybook with these stories will do; 27.11 the shots came from a
 * local config narrowed to `calculate-by-image/**` (lighter, not in git).
 *
 * The story's play brings the task to its state and sets
 * `data-review-ready`; a shot without it is not taken.
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { chromium, type Page } from 'playwright'

const [base, out] = process.argv.slice(2)
mkdirSync(out, { recursive: true })

// `-top`: the same state with the window scrolled back to the condition
// (typing scrolls the field into view and the condition goes under the header)
const SCENARIOS: [string, string][] = [
  ['plain', 'templates-calculatebyimage-plain--review-plain'],
  ['withcell', 'templates-calculatebyimage-withcell--review-with-cell'],
  ['withcell-top', 'templates-calculatebyimage-withcell--review-with-cell'],
  ['big-picture', 'templates-calculatebyimage-plain--review-big-picture'],
  ['small-picture', 'templates-calculatebyimage-plain--review-small-picture'],
  ['error', 'templates-calculatebyimage-plain--review-error'],
]

/** The package's dark theme: `[data-theme='dark']` (colors.scss). */
const theme = (page: Page, dark: boolean) =>
  page.evaluate(
    `document.documentElement.dataset.theme = '${dark ? 'dark' : 'light'}';` +
      `document.body.style.background = 'var(--bg-canvas)'`,
  )

const browser = await chromium.launch()
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 768 ? 844 : 900 },
      deviceScaleFactor: 2,
    })
    for (const [scenario, id] of SCENARIOS) {
      await page.goto(
        `${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
      )
      await page
        .locator('[data-review-ready="true"]')
        .waitFor({ state: 'attached', timeout: 60_000 })
      await page.waitForFunction('document.fonts.status === "loaded"')
      await page.mouse.move(0, 0)
      // the heart's «minus one» animation settles in about a second
      await page.waitForTimeout(scenario === 'error' ? 2000 : 400)
      if (scenario.endsWith('-top')) {
        await page.evaluate(
          `for (const el of document.querySelectorAll('*'))` +
            ` if (el.scrollTop > 0) el.scrollTop = 0`,
        )
        await page.waitForTimeout(200)
      }
      for (const dark of [false, true]) {
        await theme(page, dark)
        await page.waitForTimeout(200)
        const name = `${scenario}-${width}-${dark ? 'dark' : 'light'}`
        await page.screenshot({
          path: join(out, `${name}.png`),
          fullPage: true,
        })
        console.log(name)
      }
      await theme(page, false)
    }
    await page.close()
  }
} finally {
  await browser.close()
}
