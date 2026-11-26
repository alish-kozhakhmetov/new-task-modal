/**
 * Stream CX: the verify run's verdicts into cx-mapping.json, and the summary
 * by work-matrix code and grade (scripts/cx/summary.json).
 *
 *   node scripts/cx/merge-verdicts.mjs
 *
 * Per generator `check`:
 *   passed      — its example rendered right in the real window, the
 *                 reference typed with the keyboard was accepted by the port
 *                 of the backend's check, the changed one rejected;
 *   rendered    — rendered right; its answer kind is stream ANS's rule
 *                 (interval, union, fraction string…), not judged here;
 *   issues      — rendered and judged, but something on screen is off
 *                 (see `issues`);
 *   failed      — the example did not render or its reference was rejected;
 *   no example  — no example in the corpus: the layout is the one the
 *                 inventory's classifier gives its answerInput, not seen.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const MAPPING = path.join(ROOT, 'cx-mapping.json')
const mapping = JSON.parse(fs.readFileSync(MAPPING, 'utf8'))
// the local backend's whole tasks judged by its TaskChecker first; the
// 02.08 examples (cut strings, ported check) where the local run has none
const read = (f) => (fs.existsSync(path.join(HERE, f)) ? JSON.parse(fs.readFileSync(path.join(HERE, f), 'utf8')) : { results: [] })
const local = read('verify-results.corpus-all.json')
const verify = read('verify-results.json')
const byGenerator = new Map(verify.results.map((r) => [r.generator, { ...r, source: 'variants.json 02.08' }]))
for (const r of local.results) byGenerator.set(r.generator, { ...r, source: 'local backend' })
verify.at = local.at ?? verify.at

const checkOf = (r) => {
  if (!r) return 'no example'
  if (r.verdict === 'accepted') return 'passed'
  if (r.verdict === 'rendered, answer rule not ours' || r.verdict === 'sent, answer rule not ours')
    return r.issues.length ? 'issues' : 'rendered'
  if (r.verdict === 'accepted, issues') return 'issues'
  return 'failed'
}

for (const g of mapping.generators) {
  const r = byGenerator.get(g.generator)
  g.check = checkOf(r)
  if (r) {
    g.verify = {
      source: r.source,
      judge: r.judge,
      layoutOnScreen: r.templateId ?? null,
      verdict: r.verdict,
      ...(r.issues.length ? { issues: r.issues } : {}),
      ...(r.sent != null ? { sent: r.sent, sentWrong: r.sentWrong } : {}),
      ...(r.shot ? { shot: r.shot } : {}),
    }
  } else delete g.verify
}
mapping._fields.check =
  'итог стенда scripts/cx/verify.mjs: passed — пример в настоящем окне, эталон с клавиатуры принят портом task_checker.ex, изменённый отклонён; rendered — нарисован верно, тип ответа — поток ANS; issues — замечание на экране (см. verify.issues); failed — не нарисован или эталон отклонён; no example — примера в корпусе нет, раскладка по классификатору инвентаризации'
mapping._verifiedAt = verify.at
fs.writeFileSync(MAPPING, `${JSON.stringify(mapping, null, 1)}\n`)

// ---------- summary: code → grade → counts
const summary = {}
for (const g of mapping.generators) {
  const code = `layout:${g.layoutInInventory ?? g.layout}`
  summary[code] ??= { total: 0, byGrade: {}, byCheck: {} }
  const s = summary[code]
  s.total++
  s.byGrade[g.grade] = (s.byGrade[g.grade] ?? 0) + 1
  s.byCheck[g.check] = (s.byCheck[g.check] ?? 0) + 1
}
const totals = { generators: mapping.generators.length, byCheck: {}, byGrade: {} }
for (const g of mapping.generators) {
  totals.byCheck[g.check] = (totals.byCheck[g.check] ?? 0) + 1
  totals.byGrade[g.grade] ??= { total: 0 }
  totals.byGrade[g.grade].total++
  totals.byGrade[g.grade][g.check] = (totals.byGrade[g.grade][g.check] ?? 0) + 1
}
fs.writeFileSync(
  path.join(HERE, 'summary.json'),
  `${JSON.stringify({ at: verify.at, totals, byCode: summary }, null, 1)}\n`,
)
console.log(JSON.stringify(totals, null, 1))
