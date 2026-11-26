/**
 * Proof against the backend itself, not the ported rule: turns locally
 * generated calculateByImage tasks into answer records for the monolith's
 * TaskChecker (ntm-g3 `scripts/pilot/local-backend/check.exs`).
 *
 * In: JSONL from a generator run, one `{ type, seed, answer, task }` per line
 * (`task` as GET /lessons/:id/tasks builds it, `answer` — InvokeTask.answer).
 * Out: JSONL of `{ key, type, fields, answer }`, two records per task:
 *
 * - `ref` — what this window sends after the taps the template allows
 *   (plain: the solver's plan → `{ list: [{ image: '', id }] }`; withCell:
 *   the number as the field types it, a string). Must come back 30.
 * - `miss` — the same minus the last tap (plain) or the number + 1
 *   (withCell). Must come back 20.
 *
 * Tasks the template cannot answer are listed in `<out>.skipped.json`.
 *
 * usage: npx tsx --tsconfig tsconfig.app.json scripts/calculate-by-image-backend-jobs.ts <gen.jsonl> <jobs.jsonl>
 */
import { readFileSync, writeFileSync } from 'node:fs'

import type { ExpectedListAnswer } from '../src/modules/tasks/ui/templates/calculate-by-image/lib/check-calculate-by-image'
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

interface Generated {
  type: string
  seed: number
  error?: string
  answer?: unknown
  task?: {
    type: string
    description: CalculateByImageDescription & { type?: string }
    fields: unknown
  }
}

const [inPath, outPath] = process.argv.slice(2)
const lines = readFileSync(inPath, 'utf8').split('\n').filter(Boolean)

/** Does the field come up after the actions the template allows? */
const fieldComesUp = (d: CalculateByImageDescription): boolean => {
  const model = parseCalculateByImage(d, String)
  const mode = withCellMode(d, model)
  let zone = model.preplaced.length
  let taps = 0
  const limit = Number(d.itemsMaxQuantity) || 0
  for (let step = 0; step <= 25; step += 1) {
    if (isFieldDue(d, taps, zone)) return true
    if (mode === 'count') return false
    if (mode === 'remove') {
      if (zone === 0) return false
      zone -= 1
    } else if (mode === 'transform') {
      if (model.preplaced.length - taps <= 0) return false
    } else {
      if (limit > 0 && taps >= limit) return false
      zone += 1
    }
    taps += 1
  }
  return false
}

const jobs: string[] = []
const skipped: { type: string; seed: number; why: string }[] = []

for (const line of lines) {
  const g = JSON.parse(line) as Generated
  if (g.error || !g.task) {
    skipped.push({ type: g.type, seed: g.seed, why: `генератор: ${g.error}` })
    continue
  }
  const d = g.task.description
  const key = `${g.type}#${g.seed}`
  const push = (kind: string, answer: unknown) =>
    jobs.push(
      JSON.stringify({
        key: `${key}#${kind}`,
        type: g.task!.type,
        fields: g.task!.fields,
        answer,
      }),
    )

  if (d.type === 'calculateByImageWithCell') {
    if (!fieldComesUp(d)) {
      skipped.push({ type: g.type, seed: g.seed, why: 'поле не появляется' })
      continue
    }
    const n = Number(g.answer)
    if (!Number.isFinite(n)) {
      skipped.push({
        type: g.type,
        seed: g.seed,
        why: `эталон не число: ${JSON.stringify(g.answer)}`,
      })
      continue
    }
    push('ref', String(n))
    push('miss', String(n + 1))
    continue
  }

  const expected = g.answer as ExpectedListAnswer
  if (expected && typeof expected === 'object' && '_error' in expected) {
    skipped.push({
      type: g.type,
      seed: g.seed,
      why: `эталон: ${JSON.stringify(expected)}`,
    })
    continue
  }
  const plan = solveCalculateByImage(d, expected)
  if (!plan) {
    skipped.push({ type: g.type, seed: g.seed, why: 'не собрать в шаблоне' })
    continue
  }
  const model = parseCalculateByImage(d, String)
  const preplaced = model.preplaced.map((item) => item.index)
  const wire = (taps: number[]) =>
    toCalculateByImageApiAnswer(JSON.stringify([...preplaced, ...taps]), d)
  push('ref', wire(plan))
  if (plan.length > 0) push('miss', wire(plan.slice(0, -1)))
}

writeFileSync(outPath, jobs.join('\n') + '\n')
writeFileSync(`${outPath}.skipped.json`, JSON.stringify(skipped, null, 1))
console.log(`записей ${jobs.length}, пропущено задач ${skipped.length}`)
