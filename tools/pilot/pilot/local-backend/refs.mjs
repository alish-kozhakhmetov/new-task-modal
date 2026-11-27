/**
 * References for cached live lessons without the sandbox: every task's
 * `answerString` from the backend's own InvokeTask.answer, run locally
 * (check.exs) → `.pilot-cache/grade-N/reference.json`, the file solve.mjs reads.
 *
 *   node tools/pilot/pilot/local-backend/refs.mjs --grade=4
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../../../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 4)
const CACHE = path.join(ROOT, '.pilot-cache', `grade-${GRADE}`)
const jobs = []
for (const f of fs.readdirSync(path.join(CACHE, 'lessons'))) {
  const l = JSON.parse(fs.readFileSync(path.join(CACHE, 'lessons', f), 'utf8'))
  for (const t of l.tasks) if (t.type && t.fields) jobs.push({ key: `${l.lessonId}/${t.id}`, type: t.type, fields: t.fields, answer: '0' })
}
const inFile = path.join(CACHE, 'refs-in.jsonl')
const outFile = path.join(CACHE, 'refs-out.jsonl')
fs.writeFileSync(inFile, jobs.map((j) => JSON.stringify(j)).join('\n') + '\n')
execFileSync(path.join(HERE, 'be.sh'), [path.join(HERE, 'check.exs'), inFile, outFile], { stdio: ['ignore', 'ignore', 'inherit'] })
const refs = {}
for (const l of fs.readFileSync(outFile, 'utf8').split('\n').filter(Boolean)) {
  const j = JSON.parse(l)
  refs[j.key] = j.answerString != null ? { answer: j.answerString, result: j.result } : { answer: null, error: j.error }
}
fs.writeFileSync(path.join(CACHE, 'reference.json'), JSON.stringify(refs, null, 1))
console.log(`references: ${Object.values(refs).filter((r) => r.answer != null).length} of ${jobs.length}`)
