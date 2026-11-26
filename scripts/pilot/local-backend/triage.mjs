/**
 * After judge.mjs and summary.mjs: every generator that did not pass clean, with
 * the class of the cause and whose it is, from what the solver and the checker
 * recorded (the first matching rule wins; a look at the picture can override it
 * by --override=<file.json> { "5_1_52": { "class": "…", "owner": "…", "why": "…" } }).
 *
 *   node scripts/pilot/local-backend/triage.mjs --grade=5 --cache=<dir> [--override=<file>]
 *
 * Writes <cache>/triage.json; prints the table «class → generators → owner».
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 5)
const CACHE = path.join(ROOT, '.pilot-cache', args.cache && /^[\w.-]+$/.test(args.cache) ? args.cache : `grade-${GRADE}`)
const { generators } = JSON.parse(fs.readFileSync(path.join(CACHE, 'summary.json'), 'utf8'))
const override = args.override ? JSON.parse(fs.readFileSync(args.override, 'utf8')) : {}

/** issue text → class and owner (wave1-common.md: layout → CX, keys → KEYS, figure → FIG, backend → the lead) */
const RULES = [
  [/checker accepts a wrong answer/, 'checker takes a wrong answer too', 'lead (backend fact)'],
  [/^checker: /, 'checker crashes on the answer', 'lead (backend fact)'],
  [/no key for/, 'no key for a sign of the reference', 'KEYS'],
  [/Unsupported figure|empty choice options/, 'figure or option not drawn', 'FIG'],
  [/raw latex/, 'raw LaTeX on screen', 'FIG'],
  [/overflow/, 'answer place pushed out of the window', 'CX'],
  [/adornment not on screen/, 'text around the field not drawn', 'CX'],
  [/reference has \d+ parts, \d+ fields/, 'fields ≠ parts of the answer', 'CX'],
  [/no place for the answer|nothing on screen|no template/, 'nothing to answer in', 'CX'],
  [/no check sent/, 'the window does not send the answer', 'CX'],
  [/undefined\/NaN/, 'undefined/NaN on screen', 'CX'],
]
const classOf = (g) => {
  const key = g.type.replace('Elixir.Task_', '')
  if (override[key]) return override[key]
  const issues = g.samples.flatMap((s) => s.issues ?? [])
  for (const [re, cls, owner] of RULES) if (issues.some((i) => re.test(i))) return { class: cls, owner, why: issues.find((i) => re.test(i)) }
  const v = g.samples.map((s) => s.verdict)
  if (v.includes('rejected')) return { class: 'the checker rejects the typed reference', owner: 'lead (backend fact) / ANS', why: g.samples.filter((s) => s.verdict === 'rejected').map((s) => `sent ${s.sent} ref ${s.reference}`).join(' | ').slice(0, 200) }
  if (v.includes('no reference')) return { class: 'no reference from the backend', owner: 'lead (backend fact)', why: 'answerString missing' }
  if (v.some((x) => /solver/.test(x))) return { class: 'solver error', owner: 'G5V (tool)', why: issues.join('; ').slice(0, 200) }
  return { class: 'other', owner: '?', why: `${v.join(',')} ${issues.join('; ')}`.slice(0, 200) }
}

const rows = generators
  .filter((g) => g.state !== 'pass')
  .map((g) => ({ key: g.type.replace('Elixir.Task_', ''), template: g.template, state: g.state, verdicts: g.samples.map((s) => s.verdict), ...classOf(g) }))
  .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))
fs.writeFileSync(path.join(CACHE, 'triage.json'), JSON.stringify(rows, null, 1))
const table = new Map()
for (const r of rows) {
  const k = `${r.class} | ${r.owner}`
  const e = table.get(k) ?? { n: 0, keys: [] }
  e.n++
  e.keys.push(r.key)
  table.set(k, e)
}
console.log(`not clean: ${rows.length} of ${generators.length}`)
for (const [k, e] of [...table.entries()].sort((a, b) => b[1].n - a[1].n)) console.log(`${String(e.n).padStart(4)}  ${k}  :: ${e.keys.slice(0, 12).join(' ')}${e.keys.length > 12 ? ' …' : ''}`)
