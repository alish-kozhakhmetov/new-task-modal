// Verdicts → per generator: typed with its own keys and accepted on every
// sample (and the mutation rejected). By grade and by set.
//   node scripts/keys/backend/tally.mjs <verdicts.jsonl> <need.json> <task-keys.ts> [--list=<out.json>]
import fs from 'node:fs'

const [vFile, needFile, keysFile, ...rest] = process.argv.slice(2)
const listOut = rest.find((a) => a.startsWith('--list='))?.slice(7)
const src = fs.readFileSync(keysFile, 'utf8')
const setOf = new Map()
for (const m of src.matchAll(/^ {2}(\w+): \[\n([\s\S]*?)\n {2}\],/gm))
  for (const k of m[2].matchAll(/'([0-9_]+)'/g)) setOf.set(k[1], m[1])
const need = new Map(JSON.parse(fs.readFileSync(needFile, 'utf8')).map((g) => [g.id, g]))

const gens = new Map()
for (const line of fs.readFileSync(vFile, 'utf8').split('\n')) {
  if (!line) continue
  const r = JSON.parse(line)
  const k = r.id.replace(/^Task_/, '')
  const g = gens.get(k) ?? { id: k, n: 0, ok: 0, nokey: 0, wrongOk: 0, typedN: 0, typedOk: 0, fails: [] }
  g.n++
  if (r.cands.no_key) {
    g.nokey++
    g.fails.push({ ref: r.ref, why: 'no key' })
  } else if (r.ok.keys === true) g.ok++
  else g.fails.push({ ref: r.ref, sent: r.cands.keys, why: String(r.ok.keys) })
  if (r.wrong === true) g.wrongOk++
  if ('typed' in r.ok) {
    g.typedN++
    if (r.ok.typed === true) g.typedOk++
  }
  gens.set(k, g)
}
const rows = [...gens.values()].map((g) => ({ ...g, grade: Number(g.id.split('_')[0]), set: setOf.get(g.id) ?? null, need: need.get(g.id)?.need ?? [], pass: g.n > 0 && g.ok === g.n }))
const by = (f) => rows.reduce((a, r) => { const k = f(r); a[k] ??= { gens: 0, pass: 0 }; a[k].gens++; if (r.pass) a[k].pass++; return a }, {})
console.log('generators', rows.length, 'pass', rows.filter((r) => r.pass).length, '· samples', rows.reduce((s, r) => s + r.n, 0), 'accepted', rows.reduce((s, r) => s + r.ok, 0), '· no key', rows.reduce((s, r) => s + r.nokey, 0))
console.log('mutation accepted (should be 0):', rows.reduce((s, r) => s + r.wrongOk, 0), rows.filter((r) => r.wrongOk).map((r) => r.id).slice(0, 10).join(' '))
console.log('computer keyboard (interval refs): typed', rows.reduce((s, r) => s + r.typedN, 0), 'accepted', rows.reduce((s, r) => s + r.typedOk, 0))
console.log('by grade', JSON.stringify(by((r) => r.grade)))
console.log('by set', JSON.stringify(by((r) => r.set ?? 'none')))
const failsWithSet = rows.filter((r) => r.set && !r.pass)
console.log('in a set but failing:', failsWithSet.length)
for (const r of failsWithSet.slice(0, 40)) console.log('  ', r.id, r.set, r.ok + '/' + r.n, '|', JSON.stringify(r.fails[0]).slice(0, 170))
if (listOut) fs.writeFileSync(listOut, JSON.stringify(rows))
