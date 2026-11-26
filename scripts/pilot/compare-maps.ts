/** The pilot's mapping.json against the chapter maps already in the package. */
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '../..')
const grade = Number(process.argv[2] ?? 4)
const mapping = JSON.parse(fs.readFileSync(path.join(root, `.pilot-cache/grade-${grade}/mapping.json`), 'utf8')) as Array<{ key: string; template: string | null; tasks: number; grade: number; chapter: number; id: string }>
const cur = new Map<string, string>()
const gdir = path.join(root, 'src/modules/tasks/ui/grades')
for (const g of fs.readdirSync(gdir)) for (const f of fs.readdirSync(path.join(gdir, g))) {
  const ch = /chapter-(\d+)\.ts/.exec(f)?.[1]
  const mod = await import(path.join(gdir, g, f))
  for (const [tpl, ids] of Object.entries(mod.default as Record<string, Array<string | number>>))
    for (const id of ids) cur.set(`${g.replace('grade-', '')}_${ch}_${id}`, tpl)
}
const diff = new Map<string, number>()
let same = 0, sameT = 0, missing = 0
for (const m of mapping) {
  const c = cur.get(m.key)
  if (!c) { missing++; continue }
  if (c === m.template) { same++; sameT += m.tasks; continue }
  const k = `${c} (package) ← ${m.template} (pilot)`
  diff.set(k, (diff.get(k) ?? 0) + m.tasks)
}
console.log(`same ${same} gen / ${sameT} tasks; differ ${[...diff.values()].reduce((a, b) => a + b, 0)} tasks; not in package maps ${missing} gen`)
for (const [k, v] of [...diff.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${v}\t${k}`)
