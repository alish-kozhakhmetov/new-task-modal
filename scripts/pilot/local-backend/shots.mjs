// The task column of several harness tasks, for a look by eye:
//   node scripts/pilot/local-backend/shots.mjs <grade> <base> <lesson>-<index> …
// → .pilot-cache/shots/<grade>-<lesson>-<index>.png
import fs from 'node:fs'

import { chromium } from 'playwright'

const [grade, base, ...ids] = process.argv.slice(2)
fs.mkdirSync('.pilot-cache/shots', { recursive: true })
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
for (const id of ids) {
  const [lesson, task] = id.split('-')
  await p.goto(`${base}/scripts/pilot/harness/index.html?grade=${grade}&lesson=${lesson}&task=${task}`)
  await p.waitForSelector('[data-template-id]', { timeout: 20000 }).catch(() => {})
  await p.waitForTimeout(900)
  await p.screenshot({ path: `.pilot-cache/shots/${grade}-${id}.png`, clip: { x: 340, y: 0, width: 780, height: 560 } })
}
await b.close()
