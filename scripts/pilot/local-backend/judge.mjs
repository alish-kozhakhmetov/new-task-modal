/**
 * The answers solve.mjs --verify=collect got from the window, judged by the
 * backend's own TaskChecker run locally (check.exs), plus a mutation: the
 * same task with a wrong answer must be rejected, or the check proves
 * nothing. Writes the verdict back into each solve/<lesson>-<index>.json.
 *
 *   node scripts/pilot/local-backend/judge.mjs --grade=3
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../../..')
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || 'true'] }))
const GRADE = Number(args.grade ?? 3)
const CACHE = path.join(ROOT, '.pilot-cache', `grade-${GRADE}`)
const SOLVE = path.join(CACHE, 'solve')

const files = fs.readdirSync(SOLVE).filter((f) => f.endsWith('.json'))
const jobs = []
const wrongOf = (sent) => {
  const s = String(sent)
  if (/^[A-Z](,[A-Z])*$/.test(s)) return s === 'A' ? 'B' : 'A'
  return s.replace(/\d/, (d) => String((Number(d) + 1) % 10)) !== s ? s.replace(/\d/, (d) => String((Number(d) + 1) % 10)) : `${s}9`
}
for (const f of files) {
  const r = JSON.parse(fs.readFileSync(path.join(SOLVE, f), 'utf8'))
  if (r.sent == null || !r.fields) continue
  jobs.push({ key: `${f}|ok`, type: r.type, fields: r.fields, answer: r.sent })
  jobs.push({ key: `${f}|wrong`, type: r.type, fields: r.fields, answer: wrongOf(r.sent) })
}
const inFile = path.join(CACHE, 'judge-in.jsonl')
const outFile = path.join(CACHE, 'judge-out.jsonl')
fs.writeFileSync(inFile, jobs.map((j) => JSON.stringify(j)).join('\n') + '\n')
execFileSync(path.join(HERE, 'be.sh'), [path.join(HERE, 'check.exs'), inFile, outFile], {
  env: { ...process.env, PATH: `/opt/homebrew/opt/erlang/bin:${process.env.PATH}` },
  stdio: ['ignore', 'ignore', 'inherit'],
  maxBuffer: 1 << 30,
})
const out = new Map(fs.readFileSync(outFile, 'utf8').split('\n').filter(Boolean).map((l) => { const j = JSON.parse(l); return [j.key, j] }))
const tally = {}
for (const f of files) {
  const p = path.join(SOLVE, f)
  const r = JSON.parse(fs.readFileSync(p, 'utf8'))
  if (r.sent == null || !r.fields) continue
  const ok = out.get(`${f}|ok`)
  const wrong = out.get(`${f}|wrong`)
  r.local = { result: ok?.result ?? null, error: ok?.error, wrongResult: wrong?.result ?? null, wrongError: wrong?.error }
  r.accepted = ok?.result === 30
  if (ok?.error) r.issues.push(`checker: ${ok.error}`)
  if (wrong?.result === 30) r.issues.push('checker accepts a wrong answer too')
  r.verdict = r.accepted ? (r.issues.length ? 'accepted, issues' : 'accepted') : 'rejected'
  fs.writeFileSync(p, JSON.stringify(r, null, 1))
  tally[r.verdict] = (tally[r.verdict] ?? 0) + 1
}
console.log('judged', tally)
