// One harness page in headless Chromium: screenshot + what is on it.
//   node scripts/pilot/probe.mjs <grade> <lesson> <task> [out.png]
import { chromium } from 'playwright'
const [grade, lesson, task, out = '.pilot-cache/probe.png'] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`${m.type()}: ${m.text().slice(0, 200)}`) })
p.on('pageerror', (e) => logs.push(`pageerror: ${String(e).slice(0, 300)}`))
await p.goto(`http://127.0.0.1:5191/scripts/pilot/harness/index.html?grade=${grade}&lesson=${lesson}&task=${task}`)
await p.waitForSelector('[data-template-id], [role=dialog] input[type=radio], [data-testid=task-unavailable]', { timeout: 30000 }).catch(() => logs.push('no template on screen in 30 s'))
await p.waitForTimeout(800)
const info = await p.evaluate(() => ({
  tpl: [...document.querySelectorAll('[data-template-id]')].map((e) => e.getAttribute('data-template-id')),
  inputs: document.querySelectorAll('[role=dialog] [data-input]').length,
  radios: document.querySelectorAll('[role=dialog] input[type=radio]').length,
  checkboxes: document.querySelectorAll('[role=dialog] input[type=checkbox]').length,
  active: document.activeElement?.outerHTML.slice(0, 120),
  text: (document.querySelector('[role=dialog]')?.innerText ?? document.body.innerText).slice(0, 400),
  pilot: window.__pilot,
}))
await p.screenshot({ path: out })
console.log(JSON.stringify(info, null, 1)); console.log(logs.join('\n'))
await b.close()
