/**
 * Stream CX, the check by execution: every corpus example of every new
 * layout in the real TaskModal (harness page, MathQuill fields, the
 * window's own check request) on a vite server this script starts and
 * stops itself.
 *
 *   1. the form on screen: the task routes to the layout (the package's
 *      classifier), it has the layout's number of fields, its labels are on
 *      screen, no raw LaTeX, nothing sticks out;
 *   2. the reference typed as a pupil types it → Enter → the answer the
 *      window sends is judged by the port of the backend's check
 *      (scripts/cx/judge.mjs): it must be accepted;
 *   3. the reference with its last value changed → must be rejected.
 *
 *   node scripts/cx/verify.mjs [--only=<layout id>] [--workers=4] [--shots]
 *     [--viewport=390x844] [--layout=phone|wide] [--route=layout|chapters]
 *     [--probe-only] [--ids=Task_3_5_4_19,…] [--tag=<results suffix>] [--port=5197]
 *     [--shots=all]
 *
 * --viewport: the window; the phone frame takes its width (390 px phone),
 *   from 1100 px the site's wide layout. Every visible field's bounding box
 *   is measured against the window's width (fieldOut) and against the
 *   nearest ancestor that clips (fieldClipped): a field past the edge is an
 *   issue, whatever the template's own box says.
 * --route=chapters: the window's own resolver (the grades' chapter maps), not
 *   the classifier — the regression run of a grade that is already live.
 * --probe-only: the form on screen only, no typing (the wide pass).
 *
 * Results: scripts/cx/verify-results.json; with --shots one PNG per layout
 * (and per grade-3 example) in scripts/cx/shots/ (not in git).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import { judge } from './judge.mjs'
import { LAYOUTS } from './layouts.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=')
    return [k, v.length ? v.join('=') : 'true']
  }),
)
const WORKERS = Number(args.workers ?? 4)
const SHOTS = Boolean(args.shots)
// --shots=all: one PNG per example (the regression's pixel comparison)
const SHOT_ALL = args.shots === 'all'
const [VW, VH] = String(args.viewport ?? '390x844').split('x').map(Number)
const LAYOUT = args.layout ?? (VW >= 1100 ? 'wide' : 'phone')
const ROUTE = args.route ?? 'layout'
const PROBE_ONLY = Boolean(args['probe-only'])
const IDS = args.ids ? new Set(String(args.ids).split(',')) : null
const SHOT_DIR = path.join(HERE, 'shots', args.tag ?? `${VW}`)
if (SHOTS) fs.mkdirSync(SHOT_DIR, { recursive: true })

// ---------- the server: the package's dev config without stylelint's --fix
const OVERRIDE = path.join(HERE, 'harness/resolve-by-layout.ts')
const server = await createServer({
  configFile: false,
  root: ROOT,
  mode: 'development',
  logLevel: 'error',
  plugins: [
    {
      name: 'cx-route-by-layout',
      enforce: 'pre',
      resolveId(source, importer) {
        if (ROUTE !== 'layout') return null
        if (!importer || importer === OVERRIDE) return null
        if (/(^|\/)get-task-component$/.test(source)) return OVERRIDE
        return null
      },
    },
    react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
    tsconfigPaths(),
    svgr({ include: '**/*.svg' }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: { '@': path.join(ROOT, 'src') },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "/src/styles/lib/functions" as *;
          @use "/src/styles/lib/mixins" as *;
          @use "/src/styles/design-system/typography" as *;`,
      },
    },
  },
  server: { port: Number(args.port ?? 5197), host: '127.0.0.1', strictPort: true },
})
await server.listen()
const BASE = `http://127.0.0.1:${Number(args.port ?? 5197)}`

// ---------- the pupil's keys (scripts/pilot/solve.mjs of feat/grade-5-pilot)
const stripLatex = (s) =>
  String(s)
    .replace(/\\\(|\\\)/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .trim()

function keysOf(part) {
  const acts = []
  let i = 0
  const s = part
  const readBraced = (k) => {
    if (s[k] !== '{') return { v: s[k] ?? '', next: k + 1 }
    let depth = 0
    for (let j = k; j < s.length; j++) {
      if (s[j] === '{') depth++
      if (s[j] === '}' && --depth === 0) return { v: s.slice(k + 1, j), next: j + 1 }
    }
    throw new Error(`unclosed { in ${s}`)
  }
  while (i < s.length) {
    if (s.startsWith('\\frac', i) || s.startsWith('\\dfrac', i)) {
      i += s.startsWith('\\dfrac', i) ? 6 : 5
      const num = readBraced(i)
      const den = readBraced(num.next)
      acts.push({ frac: [num.v, den.v] })
      i = den.next
      continue
    }
    if (s.startsWith('\\sqrt', i)) {
      // MathQuill's autoCommands turn the typed word into √ with the caret inside
      const arg = readBraced(i + 5)
      acts.push({ type: 'sqrt' }, ...keysOf(arg.v), { press: 'ArrowRight' })
      i = arg.next
      continue
    }
    const cmd = /^\\([a-zA-Z]+)/.exec(s.slice(i))
    if (cmd) {
      const map = { cdot: '*', times: '*', div: ':', le: '≤', ge: '≥', neq: '≠', ne: '≠', pi: 'π' }
      if (!(cmd[1] in map)) throw new Error(`no key for \\${cmd[1]}`)
      acts.push({ type: map[cmd[1]] })
      i += cmd[0].length
      continue
    }
    if (s[i] === '{' || s[i] === '}' || s[i] === ' ') {
      i++
      continue
    }
    acts.push({ type: s[i] === '.' ? ',' : s[i] })
    i++
  }
  return acts
}

const mutate = (parts) => {
  const out = [...parts]
  const last = out.length - 1
  const num = /^(-?)(\d+)([.,]\d+)?$/.exec(out[last])
  // a number: its whole part plus one (an appended digit may vanish in a float);
  // else its last digit changed — «\frac{3}{4}» + «1» reads as ×1 and the
  // checker rightly accepts it (27.11: 30 false «wrong answer accepted»); never
  // to 0 — a zero denominator crashes the checker instead of rejecting
  const lastDigit = /(\d)(?!.*\d)/s
  out[last] = num
    ? `${num[1]}${Number(num[2]) + 1}${num[3] ?? ''}`
    : lastDigit.test(out[last])
      ? out[last].replace(lastDigit, (d) => (d === '9' ? '8' : String(Number(d) + 1)))
      : `${out[last]}1`
  return out
}

// ---------- jobs: the layouts' corpus (variants.json examples in data/), or
// --corpus=<local-corpus.json> (scripts/cx/local-corpus.mjs: whole tasks from
// the local backend, the sandbox's answerString as the reference)
const jobs = []
const LAYOUT_BY_ID = new Map(LAYOUTS.map((l) => [l.id, l]))
const fieldsOf = (task) => {
  const ai = task.answerInput ?? {}
  const n = Object.keys(ai).filter((k) => /^input\d+$/.test(k)).length
  return n || 1
}
if (args.corpus) {
  const corpus = JSON.parse(fs.readFileSync(path.resolve(ROOT, args.corpus), 'utf8')).filter(
    (e) => e.task && (e.layout || ROUTE === 'chapters'),
  )
  // one small file per example: the page fetches it, not the whole corpus
  const hdir = path.join(ROOT, '.cx-local/h', path.basename(args.corpus, '.json'))
  fs.mkdirSync(hdir, { recursive: true })
  const seen = new Set()
  for (const e of corpus) {
    if (args.only && args.only !== e.layout) continue
    if (IDS && !IDS.has(e.generator) && !IDS.has(e.id)) continue
    const file = path.relative(ROOT, path.join(hdir, `${e.id}.json`))
    fs.writeFileSync(path.join(ROOT, file), JSON.stringify({ byGrade: { [e.grade]: [e] } }))
    const l = (ROUTE === 'layout' && LAYOUT_BY_ID.get(e.layout)) || { id: e.layout ?? '(chapter map)', n: fieldsOf(e.task), existing: true }
    const ref = e.answerString == null ? null : String(e.answerString).split(' || ')[0]
    jobs.push({ layout: l, file, entry: { ...e, accepted: ref == null ? null : [ref] }, first: !seen.has(e.layout) })
    seen.add(e.layout)
  }
} else {
  for (const l of LAYOUTS) {
    if (args.only && args.only !== l.id) continue
    const file = `src/modules/tasks/ui/templates/${l.familyDir}/${l.folder}/data/all-tasks.json`
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'))
    let i = 0
    for (const [g, list] of Object.entries(data.byGrade))
      for (const e of list) jobs.push({ layout: l, file, entry: { ...e, grade: Number(g) }, first: i++ === 0 })
  }
}

// ---------- the judge: the local backend's TaskChecker (stream G3's build of
// the monolith, be.sh) for grades it has, else the port (scripts/cx/judge.mjs)
const BE = process.env.CX_BE ?? '/Users/alisher/Documents/Projects/qalan/ntm-g3/scripts/pilot/local-backend/be.sh'
const HS = process.env.CX_HS ?? '/Users/alisher/Documents/Projects/qalan/local-backend/hs'
const hsReady = (() => {
  try {
    return /round \d+: ok/.test(fs.readFileSync(path.join(path.dirname(HS), 'hs.log'), 'utf8'))
  } catch {
    return false
  }
})()
const LOCAL_JUDGE = args.judge !== 'port'
const judgedLocally = (grade) => LOCAL_JUDGE && (grade <= 4 || grade === 19 || hsReady)

const RAW = /\\(frac|cdot|left|right|begin|text|times|div|sqrt|over|mathrm|dfrac)\b|\\\(|\\\)|\$\$|\\\\/

async function openForm(page, job, lang = 'russian') {
  await page.goto(
    `${BASE}/scripts/cx/harness/index.html?file=${encodeURIComponent(job.file)}&id=${encodeURIComponent(job.entry.id)}&lang=${lang}&layout=${LAYOUT}&fill=1`,
  )
  const shown = await page.waitForSelector('[data-template-id]', { timeout: 30000 }).catch(() => null)
  await page.waitForTimeout(600)
  return shown
}

async function probe(page) {
  return page.evaluate(() => {
    const tpl = document.querySelector('[data-template-id]')
    const vis = (el) => !!el && el.getClientRects().length > 0
    const text = (tpl?.innerText ?? '').replace(/\s+/g, ' ').trim()
    // what sticks out of the template, not counting what sits in a scroller
    // made to scroll (a wide table, a row of figures)
    let overflow = 0
    if (tpl) {
      const box = tpl.getBoundingClientRect()
      const scrolls = (el) => {
        for (let a = el.parentElement; a && a !== tpl; a = a.parentElement) {
          const o = getComputedStyle(a).overflowX
          if (o !== 'visible') return true
        }
        return false
      }
      for (const el of tpl.querySelectorAll('*')) {
        const r = el.getBoundingClientRect()
        if (r.width && r.right - box.right > overflow && !scrolls(el)) overflow = r.right - box.right
      }
    }
    // the window itself slid sideways (a focused field past the edge)
    let slid = 0
    for (let a = tpl; a; a = a.parentElement) slid = Math.max(slid, a.scrollLeft)
    // every visible field's box against the window and against the nearest
    // ancestor that clips it (a scroller: the field is out of sight there)
    const W = window.innerWidth
    let fieldOut = 0
    let fieldClipped = 0
    const fieldBoxes = []
    for (const f of document.querySelectorAll('.task-modal [data-input]')) {
      if (!vis(f)) continue
      const r = f.getBoundingClientRect()
      fieldBoxes.push([Math.round(r.left), Math.round(r.right)])
      fieldOut = Math.max(fieldOut, r.right - W, -r.left)
      for (let a = f.parentElement; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).overflowX === 'visible') continue
        const ar = a.getBoundingClientRect()
        fieldClipped = Math.max(fieldClipped, r.right - ar.right, ar.left - r.left)
        break
      }
    }
    return {
      innerWidth: W,
      fieldOut: Math.round(fieldOut),
      fieldClipped: Math.round(fieldClipped),
      fieldBoxes,
      pageOverflow: Math.max(0, document.documentElement.scrollWidth - W),
      templateId: tpl?.getAttribute('data-template-id') ?? null,
      resolved: window.__cx?.resolved ?? null,
      inputs: [...document.querySelectorAll('.task-modal [data-input]')].filter(vis).length,
      text: text.slice(0, 1500),
      overflow: Math.round(overflow),
      slid: Math.round(slid),
      error: window.__cx?.error ?? null,
    }
  })
}

async function typeParts(page, parts) {
  for (const [pi, part] of parts.entries()) {
    await page.locator('.task-modal [data-input]').nth(pi).click({ timeout: 3000 })
    await page.waitForTimeout(80)
    for (const a of keysOf(part)) {
      if (a.type != null) await page.keyboard.type(a.type)
      else if (a.press) await page.keyboard.press(a.press)
      else if (a.frac) {
        // a space in MathQuill leaves the floor: the reference's spaces are not keys
        await page.locator('.task-modal button[data-calc-key="Fraction"]').first().click({ timeout: 3000 })
        await page.keyboard.type(a.frac[0].replace(/\s+/g, ''))
        await page.keyboard.press('ArrowDown')
        await page.keyboard.type(a.frac[1].replace(/\s+/g, ''))
        await page.keyboard.press('ArrowRight')
      }
    }
  }
}

async function sendCheck(page) {
  await page.keyboard.press('Enter')
  let sent = null
  for (let t = 0; t < 25 && sent == null; t++) {
    await page.waitForTimeout(100)
    sent = await page.evaluate(() => window.__cx.checks[0] ?? null)
  }
  if (sent == null) {
    await page.getByRole('button', { name: 'Проверить' }).click({ timeout: 2000 }).catch(() => {})
    await page.waitForTimeout(500)
    sent = await page.evaluate(() => window.__cx.checks[0] ?? null)
  }
  return sent
}

// one spelling for what MathJax and the window print their own way
const flatText = (t) =>
  stripLatex(t)
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .replace(/₸/g, 'тг')
    .replace(/[−–—]/g, '-')
    .replace(/[⋅∙·]/g, '·')
    .replace(/[❋✱∗]/g, '*')
    .replace(/×/g, '·')
const tr = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? v.rus || v.kaz || '' : '')
const labelsOf = (task) => {
  const ai = task.answerInput ?? {}
  const out = []
  for (const [k, v] of Object.entries(ai)) {
    if (k === 'before' || k === 'after') out.push(tr(v))
    if (k.startsWith('input') && v && typeof v === 'object') out.push(tr(v.before), tr(v.after))
  }
  // word forms «год|года|лет» are the package's to resolve: not compared
  return out
    .map(flatText)
    .filter((a) => a && !/[\\{}^_$|]/.test(a) && a.length <= 30)
}

async function verifyOne(page, job) {
  const { layout, entry } = job
  const res = { layout: layout.id, id: entry.id, generator: entry.task.type.replace(/^Elixir\./, ''), grade: entry.grade, issues: [] }
  if (layout.existing) res.existingLayout = true
  if (entry.truncated) res.truncated = true
  const errors = []
  const onConsole = (m) => {
    if (m.type() === 'error' && !/Typesetting failed|favicon|Failed to load resource/.test(m.text()))
      errors.push(m.text().slice(0, 1500))
  }
  const onPageError = (e) => errors.push(`pageerror ${String(e).slice(0, 200)}`)
  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  try {
    const shown = await openForm(page, job)
    const p = await probe(page)
    Object.assign(res, {
      templateId: p.templateId,
      resolved: p.resolved,
      inputs: p.inputs,
      innerWidth: p.innerWidth,
      fieldBoxes: p.fieldBoxes,
    })
    if (!p.innerWidth) res.issues.push('window width 0: the measure is void')
    if (p.error) res.issues.push(`harness: ${p.error.slice(0, 160)}`)
    if (!shown || !p.templateId) {
      res.issues.push('nothing on screen')
      if (SHOTS) {
        const shot = path.join(SHOT_DIR, `${layout.id}__${entry.id}.png`)
        await page.screenshot({ path: shot, animations: 'disabled', caret: 'hide' })
        res.shot = path.relative(ROOT, shot)
      }
      res.verdict = 'broken'
      return res
    }
    if (ROUTE === 'layout' && p.templateId !== layout.id) res.issues.push(`template ${p.templateId}, expected ${layout.id}`)
    const hidden = entry.task.description?.isAnswerCellHidden === true
    if (!entry.truncated && !hidden && p.inputs !== layout.n) res.issues.push(`${p.inputs} fields, layout has ${layout.n}`)
    const raw = RAW.exec(p.text)
    if (raw) res.issues.push(`raw latex: «${p.text.slice(Math.max(0, raw.index - 40), raw.index + 40)}»`)
    if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(p.text)) res.issues.push('undefined/NaN on screen')
    if (p.overflow > 4) res.issues.push(`overflow ${p.overflow}px`)
    if (p.fieldOut > 2) res.issues.push(`field past the window's edge by ${p.fieldOut}px (window ${p.innerWidth})`)
    if (p.fieldClipped > 2) res.issues.push(`field clipped by its scroller by ${p.fieldClipped}px`)
    if (p.pageOverflow > 2) res.issues.push(`page scrolls sideways by ${p.pageOverflow}px`)
    const flat = flatText(p.text)
    for (const a of labelsOf(entry.task)) if (!flat.includes(a)) res.issues.push(`label not on screen: «${a}»`)
    const shoot = async () => {
      if (!SHOTS || res.shot) return
      const shot = path.join(SHOT_DIR, `${layout.id}__${entry.id}.png`)
      await page.screenshot({ path: shot, animations: 'disabled', caret: 'hide' })
      res.shot = path.relative(ROOT, shot)
    }
    if (res.issues.length) await shoot()
    if (PROBE_ONLY) {
      if (SHOT_ALL) await page.waitForTimeout(600)
      if (SHOT_ALL || job.first || entry.grade === 3 || IDS) await shoot()
      res.verdict = res.issues.length ? 'broken' : 'rendered'
      return res
    }

    // ---- the answer
    const ref = entry.accepted?.[0] ?? null
    if (ref == null) {
      if (job.first || entry.grade === 3) await shoot()
      res.verdict = res.issues.length ? 'broken' : 'rendered, answer rule not ours'
      res.answerElixirType = entry.answerElixirType
      return res
    }
    // a MultipleTaskAnswer without its separator prints «2;0;2»: the wire is «;;»
    let parts = String(ref).split(';;').map(stripLatex)
    if (parts.length === 1 && p.inputs > 1 && String(ref).split(';').length === p.inputs)
      parts = String(ref).split(';').map(stripLatex)
    if (parts.length !== p.inputs) {
      res.issues.push(`reference has ${parts.length} parts, ${p.inputs} fields`)
      res.verdict = 'broken'
      return res
    }
    try {
      await typeParts(page, parts)
    } catch (e) {
      res.issues.push(`typing: ${String(e.message ?? e).slice(0, 120)}`)
      res.verdict = 'solver cannot type'
      return res
    }
    const after = await probe(page)
    if (after.slid > 0) res.issues.push(`window slid ${after.slid}px sideways on typing`)
    if (after.fieldOut > 2 && !(p.fieldOut > 2))
      res.issues.push(`typed answer pushes a field past the edge by ${after.fieldOut}px`)
    if (job.first || entry.grade === 3 || after.slid > 0 || after.fieldOut > 2 || IDS) await shoot()
    res.sent = await sendCheck(page)
    const local = judgedLocally(entry.grade)
    res.judge = local ? 'TaskChecker (local backend)' : 'port of task_checker.ex'
    res.accepted = res.sent == null || local ? null : judge(entry.task.type, entry.backendAnswer, res.sent)

    // ---- a wrong answer must not pass
    await openForm(page, job)
    const wrong = mutate(parts)
    await typeParts(page, wrong)
    res.sentWrong = await sendCheck(page)
    res.wrongAccepted = res.sentWrong == null || local ? null : judge(entry.task.type, entry.backendAnswer, res.sentWrong)
    if (local) {
      res.pending = { id: entry.task.type.replace(/^Elixir\./, ''), fields: JSON.stringify(entry.task.fields) }
      return res
    }
    return finish(res)
  } finally {
    if (errors.length) res.consoleErrors = errors.slice(0, 5)
    page.off('console', onConsole)
    page.off('pageerror', onPageError)
  }
}

function finish(res) {
  {
    if (res.sent == null || res.sentWrong == null) res.issues.push('no check sent')
    if (res.accepted === false) res.issues.push('reference rejected')
    if (res.wrongAccepted === true) res.issues.push('wrong answer accepted')
    if (res.sent != null && res.sent === res.sentWrong) res.issues.push('same answer sent for right and wrong')
    res.verdict =
      res.accepted === true && res.wrongAccepted === false
        ? res.issues.length
          ? 'accepted, issues'
          : 'accepted'
        : res.accepted === null && res.sent != null
          ? 'sent, answer rule not ours'
          : 'rejected'
    return res
  }
}

console.log(`examples to verify: ${jobs.length}`)
const browser = await chromium.launch()
const results = []
let next = 0
const tally = new Map()
try {
  await Promise.all(
    Array.from({ length: Math.min(WORKERS, jobs.length) }, async () => {
      const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, locale: 'ru-RU' })
      const page = await ctx.newPage()
      while (next < jobs.length) {
        const job = jobs[next++]
        let res
        try {
          res = await verifyOne(page, job)
        } catch (e) {
          res = { layout: job.layout.id, id: job.entry.id, verdict: 'verifier error', issues: [String(e.message ?? e).slice(0, 200)] }
        }
        results.push(res)
        tally.set(res.verdict, (tally.get(res.verdict) ?? 0) + 1)
        if (results.length % 25 === 0) console.log(`  ${results.length}/${jobs.length}`, Object.fromEntries(tally))
      }
      await ctx.close()
    }),
  )
} finally {
  await browser.close()
  await server.close()
}
// ---------- the local TaskChecker on what the window sent
const pending = results.filter((r) => r.pending)
if (pending.length) {
  const { spawnSync } = await import('node:child_process')
  const dir = path.join(ROOT, '.cx-local')
  fs.mkdirSync(dir, { recursive: true })
  const casesFile = path.join(dir, 'check-cases.json')
  const outFile = path.join(dir, 'check-out.json')
  fs.writeFileSync(
    casesFile,
    JSON.stringify(
      pending.map((r) => ({
        id: r.pending.id,
        key: `${r.layout}|${r.id}`,
        fields: r.pending.fields,
        candidates: [
          { label: 'right', wire: r.sent },
          { label: 'wrong', wire: r.sentWrong },
        ].filter((c) => c.wire != null),
      })),
    ),
  )
  const pa = hsReady ? ['-pa', HS] : []
  const run = spawnSync(BE, [...pa, path.join(HERE, 'check.exs'), casesFile, outFile], { encoding: 'utf8' })
  if (run.status !== 0) console.log('TaskChecker run failed:', (run.stderr || run.stdout).slice(-600))
  const checked = run.status === 0 ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : []
  const byKey = new Map(checked.map((c) => [c.key, c]))
  for (const r of pending) {
    const c = byKey.get(`${r.layout}|${r.id}`)
    const v = (label) => c?.candidates.find((x) => x.label === label)?.ok
    const okRight = v('right')
    const okWrong = v('wrong')
    r.accepted = okRight === true ? true : okRight === false ? false : null
    r.wrongAccepted = okWrong === true ? true : okWrong === false ? false : null
    if (typeof okRight === 'string') r.issues.push(`TaskChecker: ${okRight}`)
    if (typeof okWrong === 'string') r.issues.push(`TaskChecker (wrong): ${okWrong}`)
    delete r.pending
    finish(r)
  }
  tally.clear()
  for (const r of results) tally.set(r.verdict, (tally.get(r.verdict) ?? 0) + 1)
}
results.sort((a, b) => (a.layout + a.id).localeCompare(b.layout + b.id))
const tag = [args.corpus ? path.basename(args.corpus, '.json') : null, args.only, args.tag].filter(Boolean).join('.')
const out = path.join(HERE, tag ? `verify-results.${tag}.json` : 'verify-results.json')
fs.writeFileSync(
  out,
  JSON.stringify(
    { at: new Date().toISOString(), viewport: `${VW}x${VH}`, layout: LAYOUT, route: ROUTE, tally: Object.fromEntries(tally), results },
    null,
    1,
  ),
)
console.log('done', Object.fromEntries(tally), '→', path.relative(ROOT, out))
