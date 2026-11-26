/**
 * Coverage of the calculateByImage templates over every example the backend
 * sweep has (`variants.json` in qalan-assets, contracts/fixtures).
 *
 * plain: can the backend's reference be built by taps in this template, and
 * does the ported backend rule accept what the window would send?
 * withCell: does the field come up after the actions the template allows?
 * Pictures do not matter here: only ids, flags and counts are read.
 *
 * usage: npx tsx --tsconfig tsconfig.app.json scripts/audit-calculate-by-image.ts
 *   <variants.json> <coverage.json> [rows.json]
 * The optional third path gets every form with its verdict and generators.
 */
import { readFileSync, writeFileSync } from 'node:fs'

import {
  isCalculateByImageCorrect,
  type ExpectedListAnswer,
} from '../src/modules/tasks/ui/templates/calculate-by-image/lib/check-calculate-by-image'
import {
  parseCalculateByImage,
  toCalculateByImageApiAnswer,
} from '../src/modules/tasks/ui/templates/calculate-by-image/lib/parse-calculate-by-image'
import { solveCalculateByImage } from '../src/modules/tasks/ui/templates/calculate-by-image/lib/solve-calculate-by-image'
import type { CalculateByImageDescription } from '../src/modules/tasks/ui/templates/calculate-by-image/lib/types.task'
import {
  isFieldDue,
  withCellMode,
} from '../src/modules/tasks/ui/templates/calculate-by-image/lib/with-cell-rules'

interface Variant {
  taskType: string
  sig: number
  descriptionType: string
  description: CalculateByImageDescription
  answer: unknown
}

const [variantsPath, coveragePath, rowsPath] = process.argv.slice(2)
const variants = JSON.parse(readFileSync(variantsPath, 'utf8')) as Variant[]
const coverage = (
  JSON.parse(readFileSync(coveragePath, 'utf8')) as {
    generators: { taskType: string; sig?: number; descriptionType?: string }[]
  }
).generators

const gensBySig = new Map<number, string[]>()
for (const row of coverage) {
  if (row.sig == null) continue
  gensBySig.set(row.sig, [...(gensBySig.get(row.sig) ?? []), row.taskType])
}

const grade = (taskType: string) => taskType.split('_')[1]

const plainVerdict = (v: Variant): string => {
  const expected = v.answer as ExpectedListAnswer
  if (expected && typeof expected === 'object' && '_error' in expected)
    return 'к бэку: генератор падает'
  const plan = solveCalculateByImage(v.description, expected)
  if (!plan) {
    const list = expected?.list
    if (!Array.isArray(list)) return 'к бэку: list не список'
    return 'не собрать в шаблоне'
  }
  const model = parseCalculateByImage(v.description, String)
  const store = JSON.stringify([
    ...model.preplaced.map((item) => item.index),
    ...plan,
  ])
  const wire = toCalculateByImageApiAnswer(store, v.description)
  if (!isCalculateByImageCorrect(expected, wire))
    return 'к бэку: эталон не проходит правило бэка'
  return 'решается'
}

const cellVerdict = (v: Variant): string => {
  const d = v.description
  const model = parseCalculateByImage(d, String)
  const mode = withCellMode(d, model)
  let zone = model.preplaced.length
  let taps = 0
  for (let step = 0; step <= 25; step += 1) {
    if (isFieldDue(d, taps, zone)) return `решается (${mode})`
    if (mode === 'count') break
    if (mode === 'remove') {
      if (zone === 0) break
      zone -= 1
      taps += 1
      continue
    }
    const limit = Number(d.itemsMaxQuantity) || 0
    if (mode === 'transform') {
      const before = model.preplaced.length - taps
      if (before <= 0) break
      taps += 1
      continue
    }
    if (limit > 0 && taps >= limit) break
    zone += 1
    taps += 1
  }
  return `поле не появляется (${mode})`
}

const rows = variants
  .filter((v) =>
    ['calculateByImage', 'calculateByImageWithCell'].includes(
      v.descriptionType,
    ),
  )
  .map((v) => {
    const verdict =
      v.descriptionType === 'calculateByImage'
        ? plainVerdict(v)
        : cellVerdict(v)
    return {
      id: v.taskType.replace('Elixir.Task_', ''),
      type: v.descriptionType,
      verdict,
      generators: gensBySig.get(v.sig) ?? [v.taskType],
    }
  })

const summary = new Map<
  string,
  { forms: number; byGrade: Map<string, number> }
>()
for (const row of rows) {
  const key = `${row.type} · ${row.verdict.replace(/ \(.*\)$/, '')}`
  const entry = summary.get(key) ?? { forms: 0, byGrade: new Map() }
  entry.forms += 1
  for (const g of row.generators) {
    const gr = grade(g)
    entry.byGrade.set(gr, (entry.byGrade.get(gr) ?? 0) + 1)
  }
  summary.set(key, entry)
}

for (const [key, { forms, byGrade }] of [...summary].sort()) {
  const gens = [...byGrade.values()].reduce((a, b) => a + b, 0)
  const by = [...byGrade]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([g, n]) => `${g}: ${n}`)
    .join(', ')
  console.log(`${key}: форм ${forms}, генераторов ${gens} (${by})`)
}
for (const row of rows.filter((r) => !r.verdict.startsWith('решается'))) {
  console.log(`  ${row.id} — ${row.verdict}`)
}
if (rowsPath) writeFileSync(rowsPath, JSON.stringify(rows, null, 1))
