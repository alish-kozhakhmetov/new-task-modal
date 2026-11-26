/**
 * Local backend → the pilot's lesson cache, so map-grade.ts and solve.mjs
 * run on it unchanged: the generated tasks of a grade (gen.exs JSONL) become
 * `.pilot-cache/grade-N/lessons/<id>.json` — one «lesson» per generator
 * chapter and sample, at most 20 tasks — and `reference.json` gets the
 * sandbox's `answerString` for each task.
 *
 *   node scripts/pilot/local-backend/to-lessons.mjs --grade=3 --in=<gen.jsonl> [--samples=1]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 3)
const SAMPLES = Number(args.samples ?? 1)
// --cache=<dir>: a cache of its own under .pilot-cache (a local-backend run beside the live lessons)
const CACHE = path.join(ROOT, '.pilot-cache', args.cache && /^[\w.-]+$/.test(args.cache) ? args.cache : `grade-${GRADE}`)
const lessonsDir = path.join(CACHE, 'lessons')
fs.rmSync(lessonsDir, { recursive: true, force: true })
fs.mkdirSync(lessonsDir, { recursive: true })

const rows = fs.readFileSync(args.in, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
const failed = rows.filter((r) => r.error)
const ok = rows.filter((r) => !r.error && r.seed <= SAMPLES)
const byChapter = new Map()
for (const r of ok) {
  const ch = Number(/^Task_\d+_(\d+)_/.exec(r.type)?.[1])
  const k = `${ch}-${r.seed}`
  if (!byChapter.has(k)) byChapter.set(k, [])
  byChapter.get(k).push(r)
}
const refs = {}
let lessons = 0
for (const [k, list] of [...byChapter.entries()].sort()) {
  const [ch, seed] = k.split('-').map(Number)
  for (let i = 0; i * 20 < list.length; i++) {
    const lessonId = GRADE * 100000 + ch * 1000 + seed * 100 + i
    const tasks = list.slice(i * 20, i * 20 + 20).map((r) => r.task)
    fs.writeFileSync(path.join(lessonsDir, `${lessonId}.json`), JSON.stringify({ chapterId: ch, lessonId, lessonTitle: `local ${GRADE}.${ch} sample ${seed} part ${i + 1}`, status: 200, error: null, tasks }))
    for (const r of list.slice(i * 20, i * 20 + 20)) {
      refs[`${lessonId}/${r.task.id}`] = r.answerString != null ? { answer: String(r.answerString), result: null } : { answer: null, error: r.refError ?? 'no reference' }
    }
    lessons++
  }
}
fs.writeFileSync(path.join(CACHE, 'reference.json'), JSON.stringify(refs, null, 1))
fs.writeFileSync(path.join(CACHE, 'gen-failed.json'), JSON.stringify(failed, null, 1))
console.log(`rows ${rows.length}: ok ${rows.length - failed.length}, failed ${failed.length}; lessons ${lessons}, tasks ${ok.length}`)
