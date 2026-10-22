import { expect, test, type Locator, type Page } from '@playwright/test'

import { STORYBOOK_BASE, templateCatalogStoryUrl } from './story-url'

/**
 * Task list (Alisher, 22.10): «№N/M» in the header opens the lesson's task
 * list. The counter becomes a button and must not move by a pixel — the
 * header baselines below were taken on 2.5.1, before the button, and are
 * compared with no tolerance. The list itself has its own frames.
 *
 * Requires Storybook at STORYBOOK_BASE (default http://localhost:6006).
 */

let storybookIsRunning = false

test.beforeAll(async () => {
  try {
    const response = await fetch(STORYBOOK_BASE, {
      signal: AbortSignal.timeout(5000),
    })
    storybookIsRunning = response.status < 500
  } catch {
    storybookIsRunning = false
  }
})

const quiet = async (page: Page) => {
  await page.addStyleTag({
    content: `
      [aria-label="Interaction controls"] { display: none !important; }
      .sb-preparing-story, .sb-preparing-docs { display: none !important; }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  })
}

const open = async (page: Page, storyId: string) => {
  await page.goto(templateCatalogStoryUrl(storyId), {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForLoadState('networkidle').catch(() => undefined)
  await quiet(page)
  const counter = page.getByTestId('tasks-num')
  await expect(counter).toBeVisible({ timeout: 20_000 })
  // Fonts and MathJax settle the header's height.
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(500)
  return counter
}

/** The task header: back spacer, «№N/M ❤», close. */
const header = (counter: Locator) => counter.locator('xpath=../..')

const HEADER_CASES = [
  { storyId: 'trainer-trainer--idle', name: 'header-trainer-idle' },
  { storyId: 'trainer-trainer--wide-desktop', name: 'header-trainer-wide' },
  { storyId: 'trainer-tasklist--phone', name: 'header-lesson-phone' },
  { storyId: 'trainer-tasklist--phone-kk', name: 'header-lesson-phone-kk' },
  { storyId: 'trainer-tasklist--wide', name: 'header-lesson-wide' },
  { storyId: 'trainer-tasklist--scenario', name: 'header-lesson-scenario' },
]

for (const { storyId, name } of HEADER_CASES) {
  test(`[task list] counter unchanged › ${name}`, async ({ page }) => {
    test.skip(
      !storybookIsRunning,
      `Storybook is not reachable at ${STORYBOOK_BASE}`,
    )
    const counter = await open(page, storyId)
    // Not a pixel, not a shade: no count and no colour tolerance.
    await expect(header(counter)).toHaveScreenshot(`${name}.png`, {
      maxDiffPixels: 0,
      threshold: 0,
    })
  })
}

/** The list and the review themselves: new frames, baselines from this branch. */
const LIST_CASES = [
  { storyId: 'trainer-tasklist--phone-list', name: 'list-phone' },
  { storyId: 'trainer-tasklist--phone-list-kk', name: 'list-phone-kk' },
  { storyId: 'trainer-tasklist--wide-list', name: 'list-wide' },
  { storyId: 'trainer-tasklist--review-error', name: 'review-error' },
  { storyId: 'trainer-tasklist--review-correct', name: 'review-correct' },
  { storyId: 'trainer-tasklist--review-earlier', name: 'review-earlier' },
]

for (const { storyId, name } of LIST_CASES) {
  test(`[task list] screen › ${name}`, async ({ page }) => {
    test.skip(
      !storybookIsRunning,
      `Storybook is not reachable at ${STORYBOOK_BASE}`,
    )
    await open(page, storyId)
    const layer = page.getByTestId('task-list')
    await expect(layer).toBeVisible({ timeout: 20_000 })
    await page.waitForTimeout(800)
    await expect(layer).toHaveScreenshot(`${name}.png`)
  })
}
