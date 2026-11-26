/**
 * Keys check in the real window (scripts/keys/harness): every task of
 * .cache/tasks.json at phone 390 and desktop 1280 — a shot as it opens, its
 * reference typed with the task's own keys (and, for the interval tasks,
 * once more from the computer's keyboard: brackets, digits, ; typed, the
 * signs from our keys), «Проверить», the answer the window sends.
 *
 *   npx vite --port 5287 --host 127.0.0.1 &
 *   node scripts/keys/drive.mjs [--out=<dir>]
 *
 * Writes <out>/answers.json and <out>/*.png.
 */
import fs from 'node:fs'
import path from 'node:path'

import { chromium } from 'playwright'

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')))
const OUT = args.out ?? 'scripts/keys/.cache/drive'
const BASE = args.base ?? 'http://127.0.0.1:5287'
fs.mkdirSync(OUT, { recursive: true })
const tasks = JSON.parse(fs.readFileSync('scripts/keys/.cache/tasks.json', 'utf8'))

const TYPED = { Minus: '-', Plus: '+', ';': ';', ',': ',', '(': '(', ')': ')', '[': '[', ']': ']' }
const typable = (label) => /^[0-9]$/.test(label) || label in TYPED

const only = args.only ? new Set(args.only.split(',').map(Number)) : null
const layouts = args.layouts ? new Set(args.layouts.split(',')) : null
const b = await chromium.launch()
const answers = []
for (const [layout, viewport] of [['phone', { width: 390, height: 844 }], ['wide', { width: 1280, height: 800 }]]) {
  if (layouts && !layouts.has(layout)) continue
  for (let i = 0; i < tasks.length; i++) {
    if (only && !only.has(i)) continue
    const ref = tasks[i].ref ?? ''
    // the computer's keyboard: an interval's brackets typed; a root as the
    // letters «sqrt» (MathQuill's own command), the rest from our keys
    const modes = [
      'keys',
      ...(/Interval|\\cup|\\infty/.test(ref) ? ['computer'] : []),
      ...(/^[^\\]*(\\sqrt\{[^{}]*\}[^\\]*)+$/.test(ref) ? ['sqrt'] : []),
    ]
    for (const mode of modes) {
      const p = await b.newPage({ viewport })
      p.setDefaultTimeout(8000)
      const errors = []
      p.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))
      await p.goto(`${BASE}/scripts/keys/harness/index.html?task=${i}&layout=${layout}`, { timeout: 90000 })
      await p.waitForFunction(() => window.__keys?.ready, null, { timeout: 30000 })
      await p.waitForSelector('[data-calc]', { timeout: 30000 }).catch(() => errors.push('no keyboard'))
      await p.waitForTimeout(1500)
      const name = `${String(i).padStart(2, '0')}-${tasks[i].taskType.replace('Elixir.Task_', '')}-${layout}`
      if (mode === 'keys') await p.screenshot({ path: path.join(OUT, `${name}-open.png`) })
      const plan = await p.evaluate(() => window.__keys.plan)
      const row = { i, task: tasks[i].taskType, layout, mode, ref: tasks[i].ref, plan: plan ? plan.length : null, errors }
      if (mode === 'sqrt') try {
        await p.locator('[data-input]').first().click()
        await p.waitForTimeout(300)
        // 0;-\sqrt{19} → «0;-» «sqrt» «19» →: every character from the keyboard
        for (const part of ref.split(/(\\sqrt\{[^{}]*\})/).filter(Boolean)) {
          const m = /^\\sqrt\{([^{}]*)\}$/.exec(part)
          if (m) {
            await p.keyboard.type('sqrt')
            await p.keyboard.type(m[1])
            await p.keyboard.press('ArrowRight')
          } else await p.keyboard.type(part)
        }
        await p.waitForTimeout(300)
        await p.screenshot({ path: path.join(OUT, `${name}-sqrt-typed.png`) })
        await p.getByRole('button', { name: 'Проверить' }).click().catch((e) => errors.push(`check: ${String(e).slice(0, 120)}`))
        await p.waitForTimeout(600)
        row.sent = await p.evaluate(() => window.__keys.checks.at(-1) ?? null)
      } catch (e) {
        errors.push(String(e).slice(0, 160))
      }
      else if (plan) try {
        // a task that overflows keeps the keyboard closed until the field is tapped
        if (!(await p.locator('[data-calc]').first().isVisible().catch(() => false))) {
          await p.locator('[data-input]').first().click()
          await p.waitForTimeout(500)
        }
        let page = 'Цифры'
        for (const k of plan) {
          if (k.page === null) {
            await p.keyboard.press(k.label)
            continue
          }
          if (mode === 'computer' && typable(k.label)) {
            await p.keyboard.type(TYPED[k.label] ?? k.label)
            continue
          }
          if (k.page !== page) {
            await p.click(`button[aria-label="${k.page}"]`)
            await p.waitForTimeout(450)
            page = k.page
          }
          await p.click(`.keen-slider__slide:not([inert]) button[aria-label="${k.label}"]`)
          if (mode === 'computer' && i === 0) {
            // first key of an interval from the computer: the field must have focus
          }
        }
        await p.waitForTimeout(300)
        if (mode === 'keys') await p.screenshot({ path: path.join(OUT, `${name}-typed.png`) })
        const check = p.getByRole('button', { name: 'Проверить' })
        await check.click().catch((e) => errors.push(`check: ${String(e).slice(0, 120)}`))
        await p.waitForTimeout(600)
        row.sent = await p.evaluate(() => window.__keys.checks.at(-1) ?? null)
      } catch (e) {
        errors.push(String(e).slice(0, 160))
        await p.screenshot({ path: path.join(OUT, `${name}-${mode}-error.png`) })
      }
      answers.push(row)
      console.log(JSON.stringify(row).slice(0, 220))
      await p.close()
    }
  }
}
await b.close()
fs.writeFileSync(path.join(OUT, args.only ? `answers-${args.only}.json` : 'answers.json'), JSON.stringify(answers, null, 1))
