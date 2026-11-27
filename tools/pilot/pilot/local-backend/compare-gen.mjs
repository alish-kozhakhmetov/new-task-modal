/**
 * Two generations of the same generators with the same seeds (gen.exs on two
 * builds of the backend, e.g. the test branch and origin/master): which tasks
 * came out the same — title, description, fields, answerInput and the
 * reference — and which differ. A task that is the same draws the same in the
 * window, so its typed answer can be judged by the other build's checker; a
 * task that differs has to be drawn and typed again.
 *
 *   node tools/pilot/pilot/local-backend/compare-gen.mjs <a.jsonl> <b.jsonl> <out.json>
 */
import fs from 'node:fs'

const [aFile, bFile, outFile] = process.argv.slice(2)
const read = (f) => new Map(fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [`${r.type}|${r.seed}`, r] }))
const a = read(aFile)
const b = read(bFile)
const strip = (r) => (r.task ? { ...r.task, id: undefined } : null)
const out = { same: [], differ: [], onlyA: [], onlyB: [], errorA: [], errorB: [] }
for (const [k, ra] of a) {
  const rb = b.get(k)
  if (!rb) { out.onlyA.push(k); continue }
  if (ra.error || rb.error) { if (ra.error) out.errorA.push(k); if (rb.error) out.errorB.push(k); continue }
  const same = JSON.stringify(strip(ra)) === JSON.stringify(strip(rb)) && ra.answerString === rb.answerString
  ;(same ? out.same : out.differ).push(k)
}
for (const k of b.keys()) if (!a.has(k)) out.onlyB.push(k)
fs.writeFileSync(outFile, JSON.stringify(out, null, 1))
const gens = (ks) => new Set(ks.map((k) => k.split('|')[0])).size
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, `${v.length} tasks, ${gens(v)} generators`])))
