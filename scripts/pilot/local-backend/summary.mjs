/**
 * Per generator and per chapter: a generator passes when every one of its
 * samples was drawn, typed and accepted by the backend's checker (issues
 * listed apart). Writes .pilot-cache/grade-N/summary.json.
 *
 *   node scripts/pilot/local-backend/summary.mjs --grade=3
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 3)
const CACHE = path.join(ROOT, '.pilot-cache', `grade-${GRADE}`)
const results = fs.readdirSync(path.join(CACHE, 'solve')).map((f) => ({ file: f, ...JSON.parse(fs.readFileSync(path.join(CACHE, 'solve', f), 'utf8')) }))
const gens = new Map()
for (const r of results) {
  const g = gens.get(r.type) ?? { type: r.type, template: r.mapped, samples: [] }
  gens.set(r.type, g)
  g.samples.push({ file: r.file, verdict: r.verdict, issues: r.issues ?? [], reference: r.reference, sent: r.sent, local: r.local })
}
const state = (g) => {
  const v = g.samples.map((s) => s.verdict)
  if (v.every((x) => x === 'accepted')) return 'pass'
  if (v.every((x) => x.startsWith('accepted'))) return 'pass, issues'
  return 'fail'
}
const byChapter = new Map()
const rows = []
for (const g of gens.values()) {
  const ch = Number(/^Elixir\.Task_\d+_(\d+)_/.exec(g.type)?.[1])
  const st = state(g)
  rows.push({ ...g, chapter: ch, state: st })
  const e = byChapter.get(ch) ?? { chapter: ch, generators: 0, pass: 0, 'pass, issues': 0, fail: 0, tasks: 0, accepted: 0 }
  e.generators++
  e[st]++
  e.tasks += g.samples.length
  e.accepted += g.samples.filter((s) => s.verdict.startsWith('accepted')).length
  byChapter.set(ch, e)
}
const chapters = [...byChapter.values()].sort((a, b) => a.chapter - b.chapter)
for (const c of chapters) console.log(`гл. ${c.chapter}: генераторов ${c.generators} — прошли ${c.pass}, прошли с замечаниями ${c['pass, issues']}, не прошли ${c.fail}; задач ${c.accepted}/${c.tasks}`)
const tot = chapters.reduce((a, c) => ({ g: a.g + c.generators, p: a.p + c.pass, pi: a.pi + c['pass, issues'], f: a.f + c.fail, t: a.t + c.tasks, a: a.a + c.accepted }), { g: 0, p: 0, pi: 0, f: 0, t: 0, a: 0 })
console.log(`всего: генераторов ${tot.g} — прошли ${tot.p}, с замечаниями ${tot.pi}, не прошли ${tot.f}; задач ${tot.a}/${tot.t}`)
for (const g of rows.filter((x) => x.state !== 'pass').sort((a, b) => a.type.localeCompare(b.type, undefined, { numeric: true })))
  console.log(`  ${g.state.padEnd(12)} ${g.type.replace('Elixir.', '')} ${g.template} :: ${g.samples.map((s) => `${s.verdict}${s.issues.length ? ` [${s.issues.join('; ').slice(0, 110)}]` : ''}`).join(' | ')}`)
fs.writeFileSync(path.join(CACHE, 'summary.json'), JSON.stringify({ chapters, generators: rows }, null, 1))
