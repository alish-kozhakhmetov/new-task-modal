/**
 * What grade 4 actually maps each classifier id to (after the fallbacks and
 * the hand fixes the solver accepted 2242 of 2251 with): classifier id of the
 * snapshot task → template id in grade-4/chapter-N.ts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { classify, parseType, type AnyTask } from './lib/classify'

const root = path.resolve(import.meta.dirname, '../..')
const bundles = JSON.parse(fs.readFileSync(path.join(root, 'task_data_grade_4.json'), 'utf8')) as Array<{ tasks?: AnyTask[] }>

const mapOf = new Map<string, string>()
for (let ch = 1; ch <= 12; ch++) {
  const mod = await import(path.join(root, `src/modules/tasks/ui/grades/grade-4/chapter-${ch}.ts`))
  for (const [tpl, ids] of Object.entries(mod.default as Record<string, Array<string | number>>))
    for (const id of ids) mapOf.set(`${ch}_${id}`, tpl)
}
const pairs = new Map<string, Map<string, number>>()
let none = 0
for (const b of bundles) for (const t of b.tasks ?? []) {
  const p = parseType(t.type)
  if (!p) continue
  const mapped = mapOf.get(`${p.chapter}_${p.id}`) ?? '∅'
  if (mapped === '∅') none++
  const c = classify(t) ?? `?${t.description?.type}`
  const m = pairs.get(c) ?? new Map()
  m.set(mapped, (m.get(mapped) ?? 0) + 1)
  pairs.set(c, m)
}
for (const [c, m] of [...pairs.entries()].sort()) console.log(c.padEnd(40), [...m.entries()].map(([k, v]) => `${k}:${v}`).join('  '))
console.log('unmapped tasks', none)
