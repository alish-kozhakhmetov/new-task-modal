/**
 * Stream CX: tasks from the LOCAL backend (the monolith's generators compiled
 * by stream G3, ntm-g3/scripts/pilot/local-backend; built the way
 * GET /lessons/:id/tasks builds them) → a corpus for scripts/cx/verify.mjs.
 * Whole payloads, nothing cut, unlike variants.json; the reference is the
 * sandbox's answerString. Each task is routed by the package's classifier.
 *
 *   be.sh ntm-g3/scripts/pilot/local-backend/gen.exs .cx-local/types-g0-4.txt .cx-local/gen-g0-4.jsonl 1
 *   npx tsx scripts/cx/local-corpus.mjs .cx-local/gen-g0-4.jsonl [more.jsonl…] > .cx-local/corpus.json
 */
import fs from 'node:fs'

import { classifyAnswerCellTemplate } from '../../src/modules/tasks/ui/templates/answer-cell/lib/classify-answer-cell-template.ts'
import { classifyComplexTemplate } from '../../src/modules/tasks/ui/templates/complex/lib/classify-complex-template.ts'
import { classifyTextTemplate } from '../../src/modules/tasks/ui/templates/text/lib/classify-text-template.ts'

const CLASSIFY = { complex: classifyComplexTemplate, answerCell: classifyAnswerCellTemplate, text: classifyTextTemplate }
const mapping = JSON.parse(fs.readFileSync(new URL('../../cx-mapping.json', import.meta.url), 'utf8'))
const byGen = new Map(mapping.generators.map((g) => [g.generator, g]))

const out = []
for (const file of process.argv.slice(2)) {
  for (const line of fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
    const row = JSON.parse(line)
    const g = byGen.get(row.type)
    const base = { id: `${row.type}-${row.seed}`, generator: row.type, grade: g?.grade ?? Number(/^Task_(\d+)_/.exec(row.type)?.[1]), inventoryLayout: g?.layout ?? null }
    if (row.error || !row.task) {
      out.push({ ...base, error: row.error ?? 'no task' })
      continue
    }
    const task = { ...row.task, solution: null }
    const fn = CLASSIFY[task.description?.type]
    out.push({ ...base, layout: fn ? fn(task) : null, task, answerString: row.answerString ?? null, refError: row.refError })
  }
}
process.stdout.write(JSON.stringify(out))
console.error(`entries: ${out.length}, errors: ${out.filter((e) => e.error).length}, routed elsewhere than the mapping: ${out.filter((e) => e.layout && e.inventoryLayout && e.layout !== e.inventoryLayout).length}`)
