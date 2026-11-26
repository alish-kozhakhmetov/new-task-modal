/**
 * Grade pilot, offline: the fixtures' full examples (variants.json, the monolith
 * run of 02.08) as pseudo-lessons for the harness, one per generator chapter,
 * with the generator's own answer as the reference — for when test.qalan.kz is
 * down. Only generators the mapping put on a template; strings the fixture cut
 * («…[+N chars]») are marked, their render issues are not conclusive.
 *
 *   node scripts/pilot/offline-lessons.mjs --grade=5 --variants=<variants.json>
 *   node scripts/pilot/solve.mjs --grade=5 --dir=offline --verify=local --refs=.pilot-cache/grade-5/offline/refs.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 5)
const CACHE = path.join(ROOT, '.pilot-cache', `grade-${GRADE}`)
const OUT = path.join(CACHE, 'offline')
const mapping = new Map(JSON.parse(fs.readFileSync(path.join(CACHE, 'mapping.json'), 'utf8')).map((m) => [m.type, m]))
const variants = JSON.parse(fs.readFileSync(args.variants, 'utf8'))

/** the generator's answer struct → the string a pupil types (null: no rule here) */
const ref = (a, t) => {
  if (a == null) return null
  if (typeof a === 'number') return String(a)
  if (typeof a === 'string') return a
  if (Array.isArray(a)) return null
  switch (a._struct) {
    case 'MyDecimal': {
      const s = String(Math.abs(a.coef)).padStart(-a.exp + 1, '0')
      const v = a.exp < 0 ? `${s.slice(0, s.length + a.exp)}.${s.slice(s.length + a.exp)}` : s + '0'.repeat(a.exp)
      return (a.sign < 0 ? '-' : '') + v
    }
    case 'MultipleTaskAnswer': {
      const parts = a.answers.map((x) => ref(x, t))
      return parts.every((x) => x != null) ? parts.join(';;') : null
    }
    case 'MultipleChoice':
      return a.correct_variants?.length ? a.correct_variants.join('') : a.correct_answer || null
    default:
      return null
  }
}

fs.mkdirSync(OUT, { recursive: true })
const lessons = new Map()
const refs = {}
let n = 0
for (const v of variants) {
  const m = mapping.get(v.taskType)
  if (!m?.template || m.grade !== GRADE) continue
  if (args.all !== 'true' && m.live) continue // the live lessons already show it
  const id = `v${m.chapter}`
  const l = lessons.get(id) ?? { chapterId: `v${m.chapter}`, lessonId: id, lessonTitle: `variants, chapter ${m.chapter}`, status: 200, tasks: [] }
  lessons.set(id, l)
  const truncated = JSON.stringify(v).includes('…[+')
  const index = l.tasks.length
  l.tasks.push({
    id: `variant-${n++}`, type: v.taskType, position: index, result: 'none', attemptsCount: null, isPrimary: false, hasVideoUrl: false, isPenalty: false,
    title: v.title, difficulty: v.difficulty, description: v.description, fields: v.fields, answerInput: v.answerInput, __truncated: truncated,
  })
  const r = ref(v.answer, v)
  if (r != null) refs[`${id}/${index}`] = r
}
for (const l of lessons.values()) fs.writeFileSync(path.join(OUT, `${l.lessonId}.json`), JSON.stringify(l))
fs.writeFileSync(path.join(OUT, 'refs.json'), JSON.stringify(refs, null, 1))
const tasks = [...lessons.values()].reduce((s, l) => s + l.tasks.length, 0)
console.log(`pseudo-lessons ${lessons.size}, tasks ${tasks}, with a reference ${Object.keys(refs).length}, cut by the fixture ${[...lessons.values()].flatMap((l) => l.tasks).filter((t) => t.__truncated).length}`)
