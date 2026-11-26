// Per-generator verdict of the calculateByImage proof run:
//   node scripts/calculate-by-image-backend-summary.mjs <gen.jsonl> <jobs.jsonl> <check.jsonl> [out.json]
// A generator passes when on every seed the window's answer came back 30 and
// a wrong answer the window can send came back 20. `raw` (the store string
// without toWireAnswer) must not come back 30 either.
import {
  closeSync,
  openSync,
  readFileSync,
  readSync,
  writeFileSync,
} from 'node:fs'

const [genPath, jobsPath, checkPath, outPath] = process.argv.slice(2)
// read in chunks: a generator run is ~550 MB, over V8's string limit
function* jsonl(path) {
  const fd = openSync(path, 'r')
  const chunk = Buffer.alloc(1 << 22)
  let rest = Buffer.alloc(0)
  try {
    for (;;) {
      const n = readSync(fd, chunk, 0, chunk.length, null)
      if (n === 0) break
      let data = Buffer.concat([rest, chunk.subarray(0, n)])
      let at = data.indexOf(10)
      while (at >= 0) {
        const line = data.subarray(0, at).toString('utf8')
        if (line.trim()) yield JSON.parse(line)
        data = data.subarray(at + 1)
        at = data.indexOf(10)
      }
      rest = Buffer.from(data)
    }
    if (rest.toString('utf8').trim()) yield JSON.parse(rest.toString('utf8'))
  } finally {
    closeSync(fd)
  }
}

const TYPES = new Set(['calculateByImage', 'calculateByImageWithCell'])
const gens = new Map()
for (const g of jsonl(genPath)) {
  if (!TYPES.has(g.dtype)) continue
  const entry = gens.get(g.type) ?? { dtype: g.dtype, seeds: new Map() }
  entry.seeds.set(g.seed, { why: null, ref: null, miss: null, raw: null })
  gens.set(g.type, entry)
}
for (const s of JSON.parse(readFileSync(`${jobsPath}.skipped.json`, 'utf8'))) {
  const seed = gens.get(s.type)?.seeds.get(s.seed)
  if (seed) seed.why = s.why
}
for (const c of jsonl(checkPath)) {
  const [type, seed, kind] = c.key.split('#')
  const slot = gens.get(type)?.seeds.get(Number(seed))
  if (slot) slot[kind] = c.error ? `ошибка чекера: ${c.error}` : c.result
}

const grade = (type) => type.split('_')[1]
const result = { pass: {}, acceptedNoMiss: {}, failed: [] }
for (const [type, { dtype, seeds }] of gens) {
  const all = [...seeds.values()]
  const g = grade(type)
  const refOk = all.every((s) => s.ref === 30)
  const missOk = all.every((s) => s.miss === 20)
  const rawOk = all.every((s) => s.raw === null || s.raw !== 30)
  const bucket =
    refOk && missOk && rawOk ? 'pass' : refOk && rawOk ? 'acceptedNoMiss' : null
  if (bucket) {
    result[bucket][dtype] ??= {}
    result[bucket][dtype][g] = (result[bucket][dtype][g] ?? 0) + 1
    if (bucket === 'pass') continue
  }
  const reasons = [
    ...new Set(
      all.map(
        (s) =>
          s.why ??
          (typeof s.ref === 'string'
            ? s.ref
            : s.ref === 20
              ? 'ответ окна отклонён'
              : null) ??
          (s.miss === 30 ? 'неверный принят' : null) ??
          (s.raw === 30 ? 'строка без toWireAnswer принята' : null) ??
          (s.miss === null ? 'неверный ответ не собран' : 'ok'),
      ),
    ),
  ]
  result.failed.push({ type, dtype, bucket, seeds: all.length, reasons })
}

const total = (obj) => Object.values(obj ?? {}).reduce((a, b) => a + b, 0)
const universe = {}
for (const [type, { dtype }] of gens) {
  universe[dtype] ??= {}
  universe[dtype][grade(type)] = (universe[dtype][grade(type)] ?? 0) + 1
}
for (const dtype of TYPES) {
  console.log(
    `${dtype}: генераторов ${total(universe[dtype])} ${JSON.stringify(universe[dtype])}; ` +
      `проходят ${total(result.pass[dtype])} ${JSON.stringify(result.pass[dtype] ?? {})}; ` +
      `принято без отказа ${total(result.acceptedNoMiss[dtype])} ${JSON.stringify(result.acceptedNoMiss[dtype] ?? {})}`,
  )
}
for (const f of result.failed) {
  console.log(
    `  ${f.type} [${f.dtype}] ${f.bucket ?? 'не проходит'}: ${f.reasons.join(' | ')}`,
  )
}
if (outPath)
  writeFileSync(outPath, JSON.stringify({ universe, ...result }, null, 1))
