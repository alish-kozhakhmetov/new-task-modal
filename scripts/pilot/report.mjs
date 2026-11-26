/**
 * Grade pilot: the solver's results by curriculum chapter and by generator.
 *
 *   node scripts/pilot/report.mjs --grade=5 [--chapters=170] [--detail] [--json=out.json]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=')
    return [k, v.length ? v.join('=') : 'true']
  }),
)
const GRADE = Number(args.grade ?? 5)
const CACHE = path.join(ROOT, '.pilot-cache', `grade-${GRADE}`)
const chapters = args.chapters ? new Set(args.chapters.split(',').map(Number)) : null
const titles = fs.existsSync(path.join(ROOT, '.pilot-cache', `grade-${GRADE}-lessons.json`))
  ? Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, '.pilot-cache', `grade-${GRADE}-lessons.json`), 'utf8')).chapters.map((c) => [c.id, c.title]))
  : {}
const mapping = JSON.parse(fs.readFileSync(path.join(CACHE, 'mapping.json'), 'utf8'))
const byType = new Map(mapping.map((m) => [m.type, m]))

const results = fs
  .readdirSync(path.join(CACHE, 'solve'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(CACHE, 'solve', f), 'utf8')))
  .filter((r) => !chapters || chapters.has(Number(r.chapterId)))

const bucket = (r) => {
  if (r.verdict === 'not mapped') return String(byType.get(r.type)?.reason ?? 'not mapped').startsWith('new type') ? 'new type' : 'not mapped'
  return r.verdict
}
const perChapter = new Map()
for (const r of results) {
  const c = Number(r.chapterId)
  const e = perChapter.get(c) ?? { tasks: 0, gens: new Map(), verdicts: new Map() }
  perChapter.set(c, e)
  e.tasks++
  const b = bucket(r)
  e.verdicts.set(b, (e.verdicts.get(b) ?? 0) + 1)
  const g = e.gens.get(r.type) ?? new Set()
  g.add(b)
  e.gens.set(r.type, g)
}
/** a generator is «connected» when every one of its tasks was accepted */
const genState = (set) =>
  set.has('new type') ? 'new type' : set.has('not mapped') ? 'not mapped' : [...set].every((v) => v === 'accepted') ? 'accepted' : [...set].every((v) => v.startsWith('accepted')) ? 'accepted, issues' : 'problem'

const out = []
for (const [c, e] of [...perChapter.entries()].sort((a, b) => a[0] - b[0])) {
  const gs = new Map()
  for (const set of e.gens.values()) gs.set(genState(set), (gs.get(genState(set)) ?? 0) + 1)
  const row = { chapter: c, title: titles[c] ?? '', tasks: e.tasks, generators: e.gens.size, taskVerdicts: Object.fromEntries(e.verdicts), generatorStates: Object.fromEntries(gs) }
  out.push(row)
  console.log(`chapter ${c} ${row.title}: ${e.tasks} tasks, ${e.gens.size} gen`, JSON.stringify(row.taskVerdicts), JSON.stringify(row.generatorStates))
}
if (args.detail) {
  const issues = new Map()
  for (const r of results) {
    if (r.verdict === 'accepted' || r.verdict === 'not mapped') continue
    const k = `${r.verdict} | ${r.mapped ?? '-'} | ${(r.issues ?? []).map((x) => x.replace(/\d+px/, 'Npx').replace(/«.*»/, '«…»')).join('; ')}`
    const e = issues.get(k) ?? []
    e.push(r)
    issues.set(k, e)
  }
  for (const [k, rs] of [...issues.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n${rs.length}× ${k}`)
    for (const r of rs.slice(0, 4))
      console.log(`   ${r.lesson}-${r.index} ${r.type.replace('Elixir.Task_', '')} ref=${JSON.stringify(r.reference)} sent=${JSON.stringify(r.sent)} sb=${JSON.stringify(r.sandbox ?? null)} ${(r.issues ?? []).join('; ').slice(0, 160)}`)
  }
}
if (args.json) fs.writeFileSync(args.json, JSON.stringify(out, null, 1))
