/**
 * Grade pilot, step 3: the solver on the package itself. Every cached lesson
 * task in the real TaskModal (harness page on the package's vite server):
 * the form on screen is healthy → the reference typed as a pupil types it on
 * the computer's keyboard → Enter → the answer the window sends is judged by
 * the backend's sandbox (POST /tasks/testing<n>/answers, no progress written)
 * or, with --verify=local, against the reference itself.
 *
 *   node tools/pilot/pilot/solve.mjs --grade=5 [--chapters=170,171] [--lessons=1511]
 *        [--workers=4] [--verify=collect|sandbox|local] [--refs=<file>] [--force] [--cache=<dir>]
 *
 * Needs the vite dev server on :5191 (npx vite --port 5191 --host 127.0.0.1).
 * One result per task in .pilot-cache/grade-N/solve/<lesson>-<index>.json.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../../..')
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=')
    return [k, v.length ? v.join('=') : 'true']
  }),
)
const GRADE = Number(args.grade ?? 5)
// --cache=<dir>: a cache of its own under .pilot-cache (a local-backend run beside the live lessons)
const CACHE = path.join(ROOT, '.pilot-cache', args.cache && /^[\w.-]+$/.test(args.cache) ? args.cache : `grade-${GRADE}`)
const DIR = args.dir === 'offline' ? 'offline' : 'lessons'
const OUT = path.join(CACHE, DIR === 'offline' ? 'solve-offline' : 'solve')
const BASE = args.base ?? 'http://127.0.0.1:5191'
const WORKERS = Number(args.workers ?? 4)
// test.qalan.kz only when asked by name: by default the answers are collected for the local checker
const VERIFY = args.verify ?? 'collect'
const chapters = args.chapters ? new Set(args.chapters.split(',').map(Number)) : null
const lessonsOnly = args.lessons ? new Set(args.lessons.split(',').map(Number)) : null
fs.mkdirSync(OUT, { recursive: true })

// ---------- references: sandbox cache, or a { "<lesson>/<index>": answer } file
const refs = fs.existsSync(path.join(CACHE, 'reference.json'))
  ? JSON.parse(fs.readFileSync(path.join(CACHE, 'reference.json'), 'utf8'))
  : {}
const extraRefs = args.refs ? JSON.parse(fs.readFileSync(args.refs, 'utf8')) : {}
const mapping = fs.existsSync(path.join(CACHE, 'mapping.json'))
  ? new Map(JSON.parse(fs.readFileSync(path.join(CACHE, 'mapping.json'), 'utf8')).map((m) => [m.type, m]))
  : new Map()

// ---------- sandbox (test only, the test pupil; values never printed)
let TOKEN = ''
let API = ''
const secrets = []
const redact = (s) => secrets.reduce((acc, x) => (x ? acc.split(x).join('***') : acc), String(s))
async function sandboxLogin() {
  const file = path.join(os.homedir(), '.config', 'qalan', 'test-account.env')
  const env = Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^(["'])(.*)\1$/, '$2')]),
  )
  const base = new URL(env.QALAN_TEST_BASE || 'https://test.qalan.kz')
  if (!/(^|\.)test\./.test(base.hostname)) throw new Error('not a test host')
  API = `${base.origin}/api`
  secrets.push(env.QALAN_TEST_PASSWORD, env.QALAN_TEST_LOGIN)
  let d = String(env.QALAN_TEST_LOGIN).replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('8')) d = '7' + d.slice(1)
  if (d.length === 10) d = '7' + d
  const r = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-client-version': '1.8' },
    body: JSON.stringify({ phoneNumber: d, password: env.QALAN_TEST_PASSWORD, countryCode: env.QALAN_TEST_COUNTRY || 'kz' }),
  })
  let j = await r.json().catch(() => null)
  if (j?.message && typeof j.message === 'object') j = j.message
  if (!j?.token) throw new Error(`login: HTTP ${r.status}`)
  TOKEN = j.token
  secrets.push(TOKEN)
}
let sandboxN = 100000 + Math.floor(Math.random() * 1000)
async function sandboxJudge(task, answer) {
  // test goes down for minutes at a time (502): wait it out, the check is idempotent
  for (let attempt = 0; ; attempt++) {
    let r = null
    try {
      r = await fetch(`${API}/tasks/testing${sandboxN++}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-client-version': '1.8', Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({ type: task.type, fields: task.fields, answer, language: 'rus' }),
      })
    } catch {
      r = null
    }
    if ((!r || r.status === 502 || r.status === 503 || r.status === 504) && attempt < 45) {
      await new Promise((res) => setTimeout(res, 20000))
      continue
    }
    let j = await r.json().catch(() => null)
    if (j?.message && typeof j.message === 'object') j = j.message
    if (!j) return { ok: false, status: r.status, result: null }
    return { ok: j.result === 30, status: r.status, result: j.result ?? null, answerString: j.answerString ?? null }
  }
}

// ---------- the pupil's keys for a reference
const stripLatex = (s) =>
  String(s)
    .replace(/\\\(|\\\)/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .trim()

/** reference → parts per field (first «||» alternative, «;;» between fields) */
export const answerParts = (ref) =>
  String(ref)
    .split(' || ')[0]
    .split('||')[0]
    .split(';;')
    .map((p) => stripLatex(p))

/** one part → key actions; fractions through the window's own «x/y» key */
export function keysOf(part) {
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
    const cmd = /^\\([a-zA-Z]+)/.exec(s.slice(i))
    if (cmd) {
      const map = { cdot: '*', times: '*', div: ':', le: '≤', ge: '≥', neq: '≠', ne: '≠', pi: 'π', circ: '°', degree: '°', percent: '%' }
      // a command glued to a letter of the answer: «3\cdotc» is \cdot, then c
      const c = cmd[1] in map ? cmd[1] : ['cdot', 'times', 'div'].find((k) => cmd[1].startsWith(k))
      if (!c) throw new Error(`no key for \\${cmd[1]}`)
      acts.push({ type: map[c] })
      i += 1 + c.length
      continue
    }
    if (s.startsWith('\\%', i)) {
      acts.push({ type: '%' })
      i += 2
      continue
    }
    if (s[i] === '^') {
      const p = readBraced(i + 1)
      acts.push({ type: '^' }, { type: p.v }, { press: 'ArrowRight' })
      i = p.next
      continue
    }
    if (s[i] === '{' || s[i] === '}') {
      i++
      continue
    }
    if (s[i] === ' ') {
      i++
      continue
    }
    const ch = s[i] === '.' ? ',' : s[i] === '·' || s[i] === '×' ? '*' : s[i]
    acts.push({ type: ch })
    i++
  }
  return acts
}

// ---------- one task
const RAW = /\\(frac|cdot|left|right|begin|text|times|div|sqrt|over|mathrm|dfrac)\b|\\\(|\\\)|\$\$|\\\\/
async function solveOne(page, job) {
  const res = { lesson: job.lessonId, index: job.index, type: job.task.type, chapterId: job.chapterId, issues: [] }
  if (job.task.__truncated) res.truncated = true
  const m = mapping.get(job.task.type)
  res.mapped = m?.template ?? null
  const ref = extraRefs[`${job.lessonId}/${job.index}`] ?? refs[`${job.lessonId}/${job.task.id}`]?.answer ?? null
  res.reference = ref
  const errors = []
  const onConsole = (msg) => {
    if (msg.type() === 'error' && !/Typesetting failed|favicon|Failed to load resource/.test(msg.text())) errors.push(msg.text().slice(0, 200))
  }
  const onPageError = (e) => errors.push(`pageerror ${String(e).slice(0, 200)}`)
  if (!res.mapped && !args.all) {
    res.verdict = 'not mapped'
    res.reason = m?.reason ?? 'not in mapping.json'
    return res
  }
  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  try {
    await page.goto(`${BASE}/tools/pilot/pilot/harness/index.html?grade=${GRADE}&lesson=${job.lessonId}&task=${job.index}&dir=${DIR}${args.cache ? `&cache=${encodeURIComponent(args.cache)}` : ''}${args.layout ? `&layout=${args.layout}` : ''}`)
    const shown = await page
      .waitForSelector('[data-template-id], [data-testid="task-unavailable"], .task-modal [class*="unavailable"]', { timeout: 20000 })
      .catch(() => null)
    await page.waitForTimeout(400)
    const probe = await page.evaluate(() => {
      const tpl = document.querySelector('[data-template-id]')
      const vis = (el) => !!el && el.getClientRects().length > 0
      const area = tpl ?? document.querySelector('.task-modal')
      const text = (area?.innerText ?? '').replace(/\s+/g, ' ').trim()
      const overflow = (() => {
        if (!tpl) return 0
        const box = tpl.getBoundingClientRect()
        let worst = 0
        for (const el of tpl.querySelectorAll('*')) {
          const r = el.getBoundingClientRect()
          if (r.width && r.right - box.right > worst) worst = r.right - box.right
        }
        return Math.round(worst)
      })()
      return {
        templateId: tpl?.getAttribute('data-template-id') ?? null,
        inputs: [...document.querySelectorAll('.task-modal [data-input]')].filter(vis).length,
        radios: document.querySelectorAll('.task-modal input[type=radio]').length,
        checkboxes: document.querySelectorAll('.task-modal input[type=checkbox]').length,
        text: text.slice(0, 1500),
        active: document.activeElement?.tagName ?? null,
        unavailable: /нет шаблона|не умеет|пока нет|старом окне/i.test(document.querySelector('.task-modal')?.innerText ?? '') && !tpl,
        overflow,
        // a choice option with nothing in it (a figure the window does not draw)
        emptyOptions: [...document.querySelectorAll('.task-modal input[type=radio], .task-modal input[type=checkbox]')].filter((i) => {
          const box = i.closest('label') ?? i.parentElement
          return box && !(box.innerText ?? '').trim() && !box.querySelector('img, svg, canvas, mjx-container')
        }).length,
        pilotError: window.__pilot?.error ?? null,
      }
    })
    Object.assign(res, { templateId: probe.templateId, inputs: probe.inputs, radios: probe.radios, checkboxes: probe.checkboxes, text: probe.text.slice(0, 300) })
    if (probe.pilotError) res.issues.push(`harness: ${probe.pilotError.slice(0, 120)}`)
    if (!shown || !probe.templateId) {
      res.issues.push(probe.unavailable ? 'no template (old window)' : 'nothing on screen')
      res.verdict = res.mapped ? 'broken' : 'not mapped'
      return res
    }
    if (RAW.test(probe.text)) res.issues.push(`raw latex: ${(probe.text.match(RAW) || [''])[0]}`)
    if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(probe.text)) res.issues.push('undefined/NaN on screen')
    if (/Unsupported figure type/.test(probe.text)) res.issues.push('unsupported figure')
    if (probe.text.length < 3) res.issues.push('empty condition')
    if (probe.overflow > 4) res.issues.push(`overflow ${probe.overflow}px`)
    if (!probe.inputs && !probe.radios && !probe.checkboxes) res.issues.push('no place for the answer')
    if (probe.emptyOptions) res.issues.push(`empty choice options: ${probe.emptyOptions}`)
    // adornments of the data on screen
    const ai = job.task.answerInput
    const tr = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? v.rus ?? '' : '')
    const adorn = []
    if (ai && typeof ai === 'object') {
      for (const [k, v] of Object.entries(ai)) {
        if (k === 'before' || k === 'after') adorn.push(tr(v))
        if (k.startsWith('input') && v && typeof v === 'object') adorn.push(tr(v.before), tr(v.after))
      }
    }
    // the window writes some units its own way: «тг» as «₸»
    // and maths letters in italic (𝑥 → x): compare by NFKC
    const flat = probe.text.normalize('NFKC').replace(/\s+/g, '').replace(/₸/g, 'тг').replace(/❋/g, '*')
    for (const a of adorn) {
      const plain = stripLatex(a).normalize('NFKC').replace(/\s+/g, '').replace(/₸/g, 'тг')
      if (plain && !/[\\{}^_$]/.test(plain) && plain.length <= 30 && !flat.includes(plain)) res.issues.push(`adornment not on screen: «${plain}»`)
    }

    // ---- the answer
    if (ref == null) {
      res.verdict = res.issues.length ? 'broken' : 'no reference'
      return res
    }
    const isChoice = probe.radios > 0 || probe.checkboxes > 0
    if (!isChoice && !probe.inputs) {
      res.verdict = 'broken'
      return res
    }
    try {
      if (isChoice) {
        const letters = String(ref).replace(/\s|,|;/g, '').split('')
        if (!letters.every((l) => /^[A-Z]$/.test(l))) throw new Error(`choice reference not letters: ${ref}`)
        for (const l of letters) await page.keyboard.press(l.toLowerCase())
      } else {
        let parts = answerParts(ref)
        // a reference of several fields joined by a single «;» (MultipleTaskAnswer without separator)
        if (parts.length === 1 && probe.inputs > 1 && parts[0].split(';').length === probe.inputs) parts = parts[0].split(';')
        if (parts.length > probe.inputs && probe.inputs === 1) {
          // several values into one field, as the reference writes them
          parts.splice(0, parts.length, parts.join(';'))
        }
        if (parts.length !== probe.inputs) res.issues.push(`reference has ${parts.length} parts, ${probe.inputs} fields`)
        // the keys go to the first field on entry; else click it
        const first = page.locator('.task-modal [data-input]').first()
        if (probe.active !== 'TEXTAREA') await first.click({ timeout: 3000 })
        for (const [pi, part] of parts.entries()) {
          if (pi > 0) {
            await page.locator('.task-modal [data-input]').nth(pi).click({ timeout: 3000 })
            await page.waitForTimeout(80)
          }
          for (const a of keysOf(part)) {
            if (a.type != null) await page.keyboard.type(a.type)
            else if (a.press) await page.keyboard.press(a.press)
            else if (a.frac) {
              await page.locator('.task-modal button[data-calc-key="Fraction"]').first().click({ timeout: 3000 })
              await page.keyboard.type(a.frac[0])
              await page.keyboard.press('ArrowDown')
              await page.keyboard.type(a.frac[1])
              await page.keyboard.press('ArrowRight')
            }
          }
        }
      }
    } catch (e) {
      res.issues.push(`typing: ${String(e.message ?? e).slice(0, 120)}`)
      res.verdict = 'solver cannot type'
      return res
    }
    await page.keyboard.press('Enter')
    let sent = null
    for (let t = 0; t < 25 && sent == null; t++) {
      await page.waitForTimeout(100)
      sent = await page.evaluate(() => window.__pilot.checks[0] ?? null)
    }
    if (sent == null) {
      await page.getByRole('button', { name: 'Проверить' }).click({ timeout: 2000 }).catch(() => {})
      await page.waitForTimeout(500)
      sent = await page.evaluate(() => window.__pilot.checks[0] ?? null)
    }
    res.sent = sent
    if (sent == null) {
      res.issues.push('no check sent')
      res.verdict = 'broken'
      return res
    }
    if (VERIFY === 'collect') {
      // judged afterwards by the backend's own TaskChecker, run locally
      // (tools/pilot/pilot/local-backend/judge.mjs): the fields go with the answer
      res.fields = job.task.fields
      res.verdict = 'sent'
      return res
    }
    if (VERIFY === 'sandbox') {
      const j = await sandboxJudge(job.task, sent)
      res.sandbox = { result: j.result, status: j.status, answerString: j.answerString ?? undefined }
      res.accepted = j.ok
    } else {
      const norm = (x) => stripLatex(String(x).split(' || ')[0]).replace(/\s+/g, '').replace(/\./g, ',').replace(/\\cdot|·|×/g, '*').toLowerCase()
      res.accepted = norm(sent) === norm(ref)
    }
    res.verdict = res.accepted ? (res.issues.length ? 'accepted, issues' : 'accepted') : 'rejected'
    return res
  } finally {
    if (errors.length) res.consoleErrors = errors.slice(0, 5)
    page.off('console', onConsole)
    page.off('pageerror', onPageError)
  }
}

// ---------- the run
const lessonFiles = fs.readdirSync(path.join(CACHE, DIR)).filter((f) => f !== 'refs.json')
const jobs = []
for (const f of lessonFiles) {
  const l = JSON.parse(fs.readFileSync(path.join(CACHE, DIR, f), 'utf8'))
  if (!Array.isArray(l.tasks)) continue // a lesson test failed to give
  if (chapters && !chapters.has(Number(l.chapterId))) continue
  if (lessonsOnly && !lessonsOnly.has(Number(l.lessonId))) continue
  l.tasks.forEach((task, index) => {
    const out = path.join(OUT, `${l.lessonId}-${index}.json`)
    if (!args.force && fs.existsSync(out)) return
    jobs.push({ lessonId: l.lessonId, chapterId: l.chapterId, index, task, out })
  })
}
console.log(`tasks to solve: ${jobs.length}`)
if (VERIFY === 'sandbox' && jobs.length) await sandboxLogin()

const browser = await chromium.launch()
let next = 0
let done = 0
const tally = new Map()
await Promise.all(
  Array.from({ length: Math.min(WORKERS, jobs.length) }, async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ru-RU' })
    const page = await ctx.newPage()
    while (next < jobs.length) {
      const job = jobs[next++]
      let res
      try {
        res = await solveOne(page, job)
      } catch (e) {
        res = { lesson: job.lessonId, index: job.index, type: job.task.type, verdict: 'solver error', issues: [redact(String(e.message ?? e)).slice(0, 200)] }
      }
      fs.writeFileSync(job.out, JSON.stringify(res, null, 1))
      tally.set(res.verdict, (tally.get(res.verdict) ?? 0) + 1)
      if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`, Object.fromEntries(tally))
    }
    await ctx.close()
  }),
)
await browser.close()
console.log('done', Object.fromEntries(tally))
