/**
 * The phone width: harness tasks at 390 px (the site's `layout="wide"` fills the
 * screen of the phone), the answer's place measured inside the window and the
 * screen, and a picture of each for a look.
 *
 *   node tools/pilot/pilot/phone-check.mjs --grade=5 --cache=<dir> --jobs=<file.json> [--width=390] [--out=phone]
 *
 * jobs: [{ "lesson": 501100, "index": 3, "key": "5_1_56_4", "template": "answerCell.plain" }]
 * Writes <cache>/phone/<lesson>-<index>.png and <cache>/phone/result.json.
 * A measure is valid only when the page's innerWidth is the asked width.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 5)
const CACHE_DIR = args.cache && /^[\w.-]+$/.test(args.cache) ? args.cache : `grade-${GRADE}`
const CACHE = path.join(ROOT, '.pilot-cache', CACHE_DIR)
const WIDTH = Number(args.width ?? 390)
const BASE = args.base ?? 'http://127.0.0.1:5191'
const OUT = path.join(CACHE, args.out && /^[\w.-]+$/.test(args.out) ? args.out : 'phone')
fs.mkdirSync(OUT, { recursive: true })
const jobs = JSON.parse(fs.readFileSync(args.jobs, 'utf8'))

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 844 }, locale: 'ru-RU', deviceScaleFactor: 1 })
const page = await ctx.newPage()
const results = []
for (const job of jobs) {
  const url = `${BASE}/tools/pilot/pilot/harness/index.html?grade=${GRADE}&lesson=${job.lesson}&task=${job.index}&cache=${encodeURIComponent(CACHE_DIR)}&layout=wide`
  const res = { ...job }
  try {
    await page.goto(url)
    await page.waitForSelector('[data-template-id]', { timeout: 20000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(700)
    Object.assign(
      res,
      await page.evaluate(() => {
        const vis = (el) => !!el && el.getClientRects().length > 0
        const modal = document.querySelector('.task-modal')?.getBoundingClientRect()
        const tpl = document.querySelector('[data-template-id]')
        const vw = window.innerWidth
        const right = Math.min(modal?.right ?? vw, vw)
        const left = Math.max(modal?.left ?? 0, 0)
        const boxes = [
          ...[...document.querySelectorAll('.task-modal [data-input]')].filter(vis).map((el) => ['field', el]),
          ...[...document.querySelectorAll('.task-modal input[type=radio], .task-modal input[type=checkbox]')].map((el) => ['option', el.closest('label') ?? el.parentElement]),
        ].map(([kind, el]) => {
          const r = el.getBoundingClientRect()
          return { kind, left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), out: Math.round(Math.max(0, r.right - right, left - r.left)) }
        })
        return {
          innerWidth: vw,
          modal: modal ? { left: Math.round(modal.left), right: Math.round(modal.right), width: Math.round(modal.width) } : null,
          templateId: tpl?.getAttribute('data-template-id') ?? null,
          pageScrollsSideways: document.documentElement.scrollWidth > vw,
          templateScrollsSideways: tpl ? tpl.scrollWidth > tpl.clientWidth + 1 : false,
          boxes,
          worstOut: boxes.reduce((m, b) => Math.max(m, b.out), 0),
        }
      }),
    )
    res.valid = res.innerWidth === WIDTH
    const file = path.join(OUT, `${job.lesson}-${job.index}.png`)
    await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: 0, width: WIDTH, height: 1100 } }).catch(() => page.screenshot({ path: file }))
    res.shot = path.relative(ROOT, file)
  } catch (e) {
    res.error = String(e.message ?? e).slice(0, 200)
  }
  results.push(res)
}
await ctx.close()
await browser.close()
fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(results, null, 1))
const bad = results.filter((r) => r.error || !r.valid || r.worstOut > 0 || r.pageScrollsSideways)
console.log(`phone ${WIDTH}px: ${results.length} tasks, answer place out of the window or the page scrolls sideways: ${bad.length}`)
for (const r of bad) console.log(`  ${r.key} ${r.template} ${r.lesson}-${r.index}: ${r.error ?? `out ${r.worstOut}px, page sideways ${r.pageScrollsSideways}, valid ${r.valid}`}`)
