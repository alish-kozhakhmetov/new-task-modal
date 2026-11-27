// The task column of several harness tasks, for a look: node tools/pilot/pilot/shots.mjs 5 1516-0 1520-0 …
// (an id starting with «v» is an offline pseudo-lesson: v7-0)
import { chromium } from 'playwright'
const [grade, ...ids] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
for (const id of ids) {
  const [lesson, task] = id.split('-')
  await p.goto(`http://127.0.0.1:5191/tools/pilot/pilot/harness/index.html?grade=${grade}&lesson=${lesson}&task=${task}${lesson.startsWith('v') ? '&dir=offline' : ''}`)
  await p.waitForSelector('[data-template-id]', { timeout: 20000 }).catch(() => {})
  await p.waitForTimeout(700)
  await p.screenshot({ path: `.pilot-cache/shots/${grade}-${id}.png`, clip: { x: 340, y: 0, width: 780, height: 460 } })
}
await b.close()
