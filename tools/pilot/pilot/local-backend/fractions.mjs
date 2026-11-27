/**
 * Fractions in grades 5–6: does the backend's checker take the same number in
 * another form? For every solved task whose sent answer has a numeric fraction,
 * the first such fraction is rewritten as the same number — reduced, improper ↔
 * mixed, ×2 (not reduced), an integer when it is one — and each form is judged
 * by TaskChecker run locally (check.exs). Nothing in the window changes: this
 * only measures which generators wait for the decision on fractions (the
 * checker compares the form, not the number).
 *
 *   node tools/pilot/pilot/local-backend/fractions.mjs --grade=5 --cache=<dir> --pa=<modules 5–11>
 *
 * Writes <cache>/fractions.json: per generator, the forms tried and taken.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../../../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 5)
const CACHE = path.join(ROOT, '.pilot-cache', args.cache && /^[\w.-]+$/.test(args.cache) ? args.cache : `grade-${GRADE}`)
const SOLVE = path.join(CACHE, 'solve')

const gcd = (a, b) => (b ? gcd(b, a % b) : a)
/** a numeric fraction, maybe with a whole part: `-2\frac{3}{4}`, `\frac{7}{4}` */
const FRACTION = /(-?)(\d*)\\frac\{(\d+)\}\{(\d+)\}/
const mixed = (neg, w, n, d) => `${neg ? '-' : ''}${w ? w : ''}\\frac{${n}}{${d}}`

/** the same number as the first fraction of `sent`, in the forms a pupil may write it */
export function sameNumberForms(sent) {
  const m = FRACTION.exec(sent)
  if (!m) return []
  const [whole, sign, w, n, d] = m
  const W = Number(w || 0)
  const N = Number(n)
  const D = Number(d)
  if (!D) return []
  const neg = sign === '-'
  const top = W * D + N // improper numerator
  const g = gcd(top, D)
  const forms = new Map()
  if (top % D === 0) forms.set('integer', `${neg ? '-' : ''}${top / D}`)
  else {
    const rn = top / g
    const rd = D / g
    forms.set('reduced improper', mixed(neg, 0, rn, rd))
    if (rn > rd) forms.set('reduced mixed', mixed(neg, Math.floor(rn / rd), rn % rd, rd))
  }
  forms.set('improper as written', mixed(neg, 0, top, D))
  if (top > D && top % D) forms.set('mixed as written', mixed(neg, Math.floor(top / D), top % D, D))
  forms.set('times two', mixed(neg, W, N * 2, D * 2))
  const out = []
  const seen = new Set([sent])
  for (const [form, value] of forms) {
    const answer = sent.replace(whole, value)
    if (!seen.has(answer)) out.push({ form, answer })
    seen.add(answer)
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const jobs = []
  const meta = new Map()
  for (const f of fs.readdirSync(SOLVE).filter((x) => x.endsWith('.json'))) {
    const r = JSON.parse(fs.readFileSync(path.join(SOLVE, f), 'utf8'))
    if (!r.accepted || typeof r.sent !== 'string' || !r.fields) continue
    const forms = sameNumberForms(r.sent)
    if (!forms.length) continue
    meta.set(f, { type: r.type, sent: r.sent, forms })
    for (const [i, x] of forms.entries()) jobs.push({ key: `${f}|${i}`, type: r.type, fields: r.fields, answer: x.answer })
  }
  const inFile = path.join(CACHE, 'fractions-in.jsonl')
  const outFile = path.join(CACHE, 'fractions-out.jsonl')
  fs.writeFileSync(inFile, jobs.map((j) => JSON.stringify(j)).join('\n') + '\n')
  execFileSync(path.join(HERE, 'be.sh'), [...(args.pa ? ['-pa', args.pa] : []), path.join(HERE, 'check.exs'), inFile, outFile], {
    env: { ...process.env, PATH: `/opt/homebrew/opt/erlang/bin:${process.env.PATH}` },
    stdio: ['ignore', 'ignore', 'inherit'],
    maxBuffer: 1 << 30,
  })
  const out = new Map(fs.readFileSync(outFile, 'utf8').split('\n').filter(Boolean).map((l) => { const j = JSON.parse(l); return [j.key, j] }))
  const gens = new Map()
  for (const [f, m] of meta) {
    const g = gens.get(m.type) ?? { type: m.type, tasks: 0, samples: [] }
    gens.set(m.type, g)
    g.tasks++
    g.samples.push({
      file: f,
      sent: m.sent,
      forms: m.forms.map((x, i) => ({ ...x, result: out.get(`${f}|${i}`)?.result ?? null, error: out.get(`${f}|${i}`)?.error })),
    })
  }
  const rows = [...gens.values()].map((g) => {
    const all = g.samples.flatMap((s) => s.forms)
    const rejected = [...new Set(all.filter((x) => x.result !== 30).map((x) => x.form))]
    const taken = [...new Set(all.filter((x) => x.result === 30).map((x) => x.form))]
    return { ...g, rejected, taken, formMatters: rejected.length > 0 }
  })
  rows.sort((a, b) => a.type.localeCompare(b.type, undefined, { numeric: true }))
  fs.writeFileSync(path.join(CACHE, 'fractions.json'), JSON.stringify(rows, null, 1))
  const matters = rows.filter((r) => r.formMatters)
  console.log(`generators with a numeric fraction in the accepted answer: ${rows.length}; the same number in another form rejected: ${matters.length}; every form taken: ${rows.length - matters.length}`)
  const byForm = {}
  for (const r of rows) for (const s of r.samples) for (const x of s.forms) { const e = (byForm[x.form] ??= { tried: 0, taken: 0 }); e.tried++; if (x.result === 30) e.taken++ }
  console.log('by form', byForm)
}
