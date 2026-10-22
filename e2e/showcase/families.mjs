// Популярность раскладок задач: задачи уроков 4 класса (e2e/data/grade4-all-from-snapshot.json)
// → тип задачи 4_<глава>_<генератор> → шаблон по привязкам src/modules/tasks/ui/grades/grade-4/chapter-*.ts
// → вариант сторибука (trainer-variants.tsx). Печатает таблицу и пишет e2e/showcase/families.json.
//   node e2e/showcase/families.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../../', import.meta.url).pathname
const gradeDir = join(root, 'src/modules/tasks/ui/grades/grade-4')

// TemplateTypes.X.Y.Z → значение ('text.multi.stack.n2.before') из template-types.ts
const tt = readFileSync(join(root, 'src/modules/tasks/model/template-types.ts'), 'utf8')
const values = {}
{
  const stack = []
  for (const line of tt.split('\n')) {
    const open = line.match(/^\s*(\w+):\s*\{\s*$/)
    const leaf = line.match(/^\s*(\w+):\s*'([^']+)'/)
    if (/^export const TemplateTypes/.test(line)) continue
    if (open) stack.push(open[1])
    else if (leaf) values[['TemplateTypes', ...stack, leaf[1]].join('.')] = leaf[2]
    else if (/^\s*\},?\s*$/.test(line)) stack.pop()
  }
}

// тип задачи → значение шаблона
const typeToTemplate = {}
for (const f of readdirSync(gradeDir)) {
  const chapter = f.match(/chapter-(\d+)\.ts$/)
  if (!chapter) continue
  const src = readFileSync(join(gradeDir, f), 'utf8')
  for (const m of src.matchAll(/\[(TemplateTypes[\w.]+)\]:\s*\[([^\]]*)\]/g)) {
    const value = values[m[1]]
    for (const id of m[2].matchAll(/'([^']+)'/g)) typeToTemplate[`4_${chapter[1]}_${id[1]}`] = value
  }
}

// значение шаблона → ключ варианта сторибука
const variants = [...readFileSync(join(root, 'src/modules/trainer/lib/trainer-variants.tsx'), 'utf8').matchAll(/key: '([^']+)'/g)].map((m) => m[1])
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const byNorm = Object.fromEntries(variants.map((v) => [norm(v), v]))
const toVariant = (value) => {
  if (!value) return null
  let parts = value.split('.')
  while (parts.length) {
    const hit = byNorm[norm(parts.join('.'))]
    if (hit) return hit
    parts = parts.slice(0, -1) // answerCell.plain.center → answerCell.plain
  }
  return null
}

const tasks = JSON.parse(readFileSync(join(root, 'e2e/data/grade4-all-from-snapshot.json'), 'utf8'))
const counts = {}
let unmapped = 0
for (const t of tasks) {
  const type = (t.key.match(/#([\d_]+)@/) || [])[1]
  const variant = toVariant(typeToTemplate[type])
  if (!variant) { unmapped++; continue }
  counts[variant] = (counts[variant] || 0) + 1
}
const total = tasks.length
const rows = Object.entries(counts).map(([variant, n]) => ({ family: variant.split('/')[0], variant, tasks: n, share: n / total })).sort((a, b) => b.tasks - a.tasks)
writeFileSync(join(root, 'e2e/showcase/families.json'), JSON.stringify({ total, unmapped, rows }, null, 2) + '\n')
console.log(`задач 4 класса: ${total}, без шаблона в привязках: ${unmapped}`)
for (const r of rows) console.log(`${r.family.padEnd(16)} ${r.variant.padEnd(36)} ${String(r.tasks).padStart(5)}  ${(r.share * 100).toFixed(1)} %`)
