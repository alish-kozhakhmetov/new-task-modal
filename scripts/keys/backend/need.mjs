// Which hs generators need a sign the released keyboard (2.5.8) lacks, by
// their sampled references; and whether TASK_KEY_SETS gives them a set.
//   node scripts/keys/backend/need.mjs <samples.jsonl> <task-keys.ts> <need.json>
import fs from 'node:fs'

const [samplesFile, keysFile, outFile] = process.argv.slice(2)
const src = fs.readFileSync(keysFile, 'utf8')
const setOf = new Map()
// a set's ids, one per line or (prettier, a short set) on one line
for (const m of src.matchAll(/^ {2}(\w+): \[([^\]]*)\]/gm))
  for (const k of m[2].matchAll(/'([0-9a-z_]+)'/g)) setOf.set(k[1], m[1])

const SIGNS = {
  infty: /\\infty/,
  cup: /\\cup/,
  pi: /\\pi(?![a-z])/,
  sqrt: /\\sqrt/,
  trig: /\\(sin|cos|tan|cot|arcsin|arccos|arctan)(?![a-z])|\\operatorname\{(arc)?c?tg\}|(?<![a-z\\])(arc)?c?tg(?![a-z])/,
  degree: /\\circ/,
  vector: /\\overrightarrow|\\vec(?![a-z])/,
  log: /\\log|\\lg(?![a-z])|\\ln(?![a-z])/,
  empty: /\\varnothing|\\emptyset/,
  brace: /\\\{|\\\}/,
  matrix: /\\begin\{[pbv]?matrix\}/,
  power: /\^\{?(?![23]\}?(?![0-9]))[0-9a-z]/,
  square: /\[|\]/,
}
const by = new Map()
for (const line of fs.readFileSync(samplesFile, 'utf8').split('\n')) {
  if (!line) continue
  const r = JSON.parse(line)
  const k = r.id.replace(/^Task_/, '')
  const g = by.get(k) ?? { id: k, kinds: new Set(), refs: [], errors: 0 }
  if (r.error) g.errors++
  else {
    g.kinds.add(r.kind)
    g.refs.push(...r.refs.map((x) => x ?? ''))
  }
  by.set(k, g)
}
const out = []
for (const g of by.values()) {
  const text = g.refs.join(' ')
  const need = Object.entries(SIGNS).filter(([, re]) => re.test(text)).map(([n]) => n)
  const kinds = [...g.kinds]
  out.push({ id: g.id, grade: Number(g.id.split('_')[0]), kinds, need, set: setOf.get(g.id) ?? null, ref: g.refs[0] ?? null, errors: g.errors })
}
fs.writeFileSync(outFile, JSON.stringify(out))
const needing = out.filter((g) => g.need.length && !g.kinds.every((k) => k === 'MultipleChoice' || k.startsWith('TaskAnswers.CoordinatePlane')))
const noSet = needing.filter((g) => !g.set)
const tally = (rows, f) => rows.reduce((a, r) => { for (const x of [].concat(f(r))) a[x] = (a[x] ?? 0) + 1; return a }, {})
console.log('generators sampled', out.length, '· need a sign', needing.length, '· of them without a set', noSet.length)
console.log('need, all:', tally(needing, (r) => r.need))
console.log('need, without a set:', tally(noSet, (r) => r.need))
console.log('without a set, kinds:', tally(noSet, (r) => r.kinds))
console.log('in a set, never sampled with a sign:', out.filter((g) => g.set && !g.need.length).length)
console.log('set ids not in hs:', [...setOf.keys()].filter((k) => !by.has(k)).join(' '))
